package com.backend.common.admin.site.service;

import com.backend.common.admin.site.dto.SiteCreateRequest;
import com.backend.common.admin.site.dto.SiteUpdateRequest;
import com.backend.common.admin.site.entity.SiteEntity;
import com.backend.common.admin.site.model.Site;
import com.backend.common.admin.site.repository.SiteRepository;
import com.backend.core.constants.Constants;
import com.backend.core.exception.DuplicateResourceException;
import com.backend.core.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SiteService {
	private static final Logger logger = LoggerFactory.getLogger(SiteService.class);
	private final SiteRepository siteRepository;

	public SiteService(SiteRepository siteRepository) {
		this.siteRepository = siteRepository;
	}

	@EventListener(ApplicationReadyEvent.class)
	@Transactional
	public void init() {
		logger.info("초기 사이트 데이터 생성 시작");
		// 통합관리시스템 (admin)
		if (!siteRepository.existsByContextPath(Constants.CONTEXT_PATH_ADMIN)) {
			siteRepository.save(new SiteEntity(
				Constants.SITE_TYPE_ADMIN, 
				"통합관리시스템", 
				"통합 관리 시스템", 
				Constants.CONTEXT_PATH_ADMIN, 
				Constants.DEFAULT_VERSION
			));
			logger.info("통합관리시스템 사이트 생성 완료");
		}

		// 통합홈페이지 (root)
		if (!siteRepository.existsByContextPath(Constants.CONTEXT_PATH_ROOT)) {
			siteRepository.save(new SiteEntity(
				Constants.SITE_TYPE_PORTAL, 
				"통합홈페이지", 
				"통합 홈페이지", 
				Constants.CONTEXT_PATH_ROOT, 
				Constants.DEFAULT_VERSION
			));
			logger.info("통합홈페이지 사이트 생성 완료");
		}
		logger.info("초기 사이트 데이터 생성 완료");
	}

	@Transactional(readOnly = true)
	public List<Site> listSites() {
		logger.debug("사이트 목록 조회");
		return siteRepository.findAll().stream()
				.map(this::toSite)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public Optional<Site> findById(String id) {
		return siteRepository.findById(id)
				.map(this::toSite);
	}

	@Transactional(readOnly = true)
	public Optional<Site> findBySiteType(String siteType) {
		return siteRepository.findBySiteType(siteType)
				.map(this::toSite);
	}

	@Transactional(readOnly = true)
	public Optional<Site> findByContextPath(String contextPath) {
		return siteRepository.findByContextPath(contextPath)
				.map(this::toSite);
	}

	@Transactional
	public Site createSite(SiteCreateRequest request) {
		if (siteRepository.existsByContextPath(request.getContextPath())) {
			logger.warn("중복된 Context Path 시도: {}", request.getContextPath());
			throw new DuplicateResourceException("Context Path", request.getContextPath());
		}
		
		logger.info("새 사이트 생성: siteName={}, contextPath={}", request.getSiteName(), request.getContextPath());
		SiteEntity entity = new SiteEntity(
			request.getSiteType(),
			request.getSiteName(),
			request.getDescription(),
			request.getContextPath(),
			request.getVersion()
		);
		SiteEntity saved = siteRepository.save(entity);
		logger.info("사이트 생성 완료: id={}, siteName={}", saved.getId(), request.getSiteName());
		return toSite(saved);
	}

	@Transactional
	public Site updateSite(String id, SiteUpdateRequest request) {
		logger.info("사이트 정보 수정: id={}", id);
		SiteEntity entity = siteRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("사이트", id));
		
		// Context Path가 변경되는 경우 중복 체크
		if (!entity.getContextPath().equals(request.getContextPath())) {
			if (siteRepository.existsByContextPath(request.getContextPath())) {
				logger.warn("중복된 Context Path 시도: {}", request.getContextPath());
				throw new DuplicateResourceException("Context Path", request.getContextPath());
			}
		}
		
		entity.setSiteName(request.getSiteName());
		entity.setDescription(request.getDescription());
		entity.setContextPath(request.getContextPath());
		entity.setVersion(request.getVersion());
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}
		
		SiteEntity saved = siteRepository.save(entity);
		logger.info("사이트 정보 수정 완료: id={}", id);
		return toSite(saved);
	}

	@Transactional
	public void deleteSite(String id) {
		logger.info("사이트 삭제: id={}", id);
		if (!siteRepository.existsById(id)) {
			throw new ResourceNotFoundException("사이트", id);
		}
		siteRepository.deleteById(id);
		logger.info("사이트 삭제 완료: id={}", id);
	}

	private Site toSite(SiteEntity entity) {
		return new Site(
			entity.getId(),
			entity.getSiteType(),
			entity.getSiteName(),
			entity.getDescription(),
			entity.getContextPath(),
			entity.getVersion(),
			entity.getEnabled()
		);
	}
}

