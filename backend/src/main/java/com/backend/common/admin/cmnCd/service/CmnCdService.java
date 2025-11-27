package com.backend.common.admin.cmnCd.service;

import com.backend.common.admin.cmnCd.dto.CmnCdCreateRequest;
import com.backend.common.admin.cmnCd.dto.CmnCdUpdateRequest;
import com.backend.common.admin.cmnCd.entity.CmnCdEntity;
import com.backend.common.admin.cmnCd.model.CmnCd;
import com.backend.common.admin.cmnCd.repository.CmnCdRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CmnCdService {
	private final CmnCdRepository cmnCdRepository;

	public CmnCdService(CmnCdRepository cmnCdRepository) {
		this.cmnCdRepository = cmnCdRepository;
	}

	@EventListener(ApplicationReadyEvent.class)
	public void init() {
		// P001: 사이트구분코드
		if (!cmnCdRepository.existsByParentCdIsNullAndCd("P001")) {
			CmnCdEntity p001 = new CmnCdEntity("P001", "사이트구분코드", "사이트 구분을 나타내는 코드", null);
			cmnCdRepository.save(p001);
			
			// P001의 하위코드
			if (!cmnCdRepository.existsByParentCdAndCd("P001", "C001")) {
				cmnCdRepository.save(new CmnCdEntity("C001", "관리자", "관리자 사이트", "P001"));
			}
			if (!cmnCdRepository.existsByParentCdAndCd("P001", "C002")) {
				cmnCdRepository.save(new CmnCdEntity("C002", "사용자", "사용자 사이트", "P001"));
			}
		}

		// P002: 권한역할코드
		if (!cmnCdRepository.existsByParentCdIsNullAndCd("P002")) {
			CmnCdEntity p002 = new CmnCdEntity("P002", "권한역할코드", "사용자 권한 역할을 나타내는 코드", null);
			cmnCdRepository.save(p002);
			
			// P002의 하위코드
			if (!cmnCdRepository.existsByParentCdAndCd("P002", "C001")) {
				cmnCdRepository.save(new CmnCdEntity("C001", "ADMIN", "최고 관리자 권한", "P002"));
			}
			if (!cmnCdRepository.existsByParentCdAndCd("P002", "C002")) {
				cmnCdRepository.save(new CmnCdEntity("C002", "MANAGER", "관리자 권한", "P002"));
			}
			if (!cmnCdRepository.existsByParentCdAndCd("P002", "C003")) {
				cmnCdRepository.save(new CmnCdEntity("C003", "OPERATOR", "운영자 권한", "P002"));
			}
		}
	}

	/**
	 * 트리 형태로 공통코드 목록 조회
	 */
	public List<CmnCd> listCmnCds() {
		List<CmnCdEntity> allEntities = cmnCdRepository.findAllByOrderByCdAsc();
		List<CmnCd> allCodes = allEntities.stream()
				.map(this::toCmnCd)
				.collect(Collectors.toList());

		// 부모 코드들만 필터링 (P로 시작하는 코드)
		List<CmnCd> parentCodes = allCodes.stream()
				.filter(code -> code.getParentCd() == null || code.getParentCd().isEmpty())
				.collect(Collectors.toList());

		// 각 부모 코드에 자식 코드들 추가
		for (CmnCd parent : parentCodes) {
			List<CmnCd> children = allCodes.stream()
					.filter(code -> parent.getCd().equals(code.getParentCd()))
					.collect(Collectors.toList());
			parent.setChildren(children);
		}

		return parentCodes;
	}

	/**
	 * 평면 형태로 공통코드 목록 조회
	 */
	public List<CmnCd> listCmnCdsFlat() {
		return cmnCdRepository.findAllByOrderByCdAsc().stream()
				.map(this::toCmnCd)
				.collect(Collectors.toList());
	}

	public Optional<CmnCd> findById(String id) {
		return cmnCdRepository.findById(id)
				.map(this::toCmnCd);
	}

	public Optional<CmnCd> findByCd(String cd) {
		return cmnCdRepository.findByCd(cd)
				.map(this::toCmnCd);
	}

	public CmnCd createCmnCd(CmnCdCreateRequest request) {
		// 코드 중복 확인: 상위코드와 하위코드 조합이 유니크해야 함
		if (request.getParentCd() == null || request.getParentCd().isEmpty()) {
			// 상위코드인 경우: parentCd가 null이고 cd가 유니크해야 함
			if (cmnCdRepository.existsByParentCdIsNullAndCd(request.getCd())) {
				throw new IllegalArgumentException("이미 존재하는 상위코드입니다: " + request.getCd());
			}
		} else {
			// 하위코드인 경우: (parentCd, cd) 조합이 유니크해야 함
			if (cmnCdRepository.existsByParentCdAndCd(request.getParentCd(), request.getCd())) {
				throw new IllegalArgumentException("이미 존재하는 하위코드입니다: " + request.getCd() + " (상위코드: " + request.getParentCd() + ")");
			}
		}

		// 코드 형식 검증
		if (!request.getCd().matches("^[PC]\\d{3}$")) {
			throw new IllegalArgumentException("코드는 P001~P999 또는 C001~C999 형식이어야 합니다.");
		}

		// 부모 코드 검증
		if (request.getParentCd() != null && !request.getParentCd().isEmpty()) {
			// 자식 코드는 C로 시작해야 함
			if (!request.getCd().startsWith("C")) {
				throw new IllegalArgumentException("자식 코드는 C001~C999 형식이어야 합니다.");
			}
			// 부모 코드는 P로 시작해야 함
			if (!request.getParentCd().startsWith("P")) {
				throw new IllegalArgumentException("부모 코드는 P001~P999 형식이어야 합니다.");
			}
			// 부모 코드 존재 확인 (상위코드만 확인)
			if (!cmnCdRepository.existsByParentCdIsNullAndCd(request.getParentCd())) {
				throw new IllegalArgumentException("부모 코드를 찾을 수 없습니다: " + request.getParentCd());
			}
		} else {
			// 부모 코드가 없으면 P로 시작해야 함
			if (!request.getCd().startsWith("P")) {
				throw new IllegalArgumentException("부모 코드는 P001~P999 형식이어야 합니다.");
			}
		}

		CmnCdEntity entity = new CmnCdEntity(
			request.getCd(),
			request.getName(),
			request.getDescription(),
			request.getParentCd()
		);
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}

		CmnCdEntity saved = cmnCdRepository.save(entity);
		return toCmnCd(saved);
	}

	public CmnCd updateCmnCd(String id, CmnCdUpdateRequest request) {
		CmnCdEntity entity = cmnCdRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("공통코드를 찾을 수 없습니다: " + id));

		entity.setName(request.getName());
		entity.setDescription(request.getDescription());
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}

		CmnCdEntity saved = cmnCdRepository.save(entity);
		return toCmnCd(saved);
	}

	public void deleteCmnCd(String id) {
		CmnCdEntity entity = cmnCdRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("공통코드를 찾을 수 없습니다: " + id));

		// 하위 코드가 있는지 확인
		List<CmnCdEntity> children = cmnCdRepository.findByParentCd(entity.getCd());
		if (!children.isEmpty()) {
			throw new IllegalArgumentException("하위 코드가 존재하여 삭제할 수 없습니다. 먼저 하위 코드를 삭제해주세요.");
		}

		cmnCdRepository.deleteById(id);
	}

	private CmnCd toCmnCd(CmnCdEntity entity) {
		return new CmnCd(
			entity.getId(),
			entity.getCd(),
			entity.getName(),
			entity.getDescription(),
			entity.getEnabled(),
			entity.getParentCd()
		);
	}
}

