package com.backend.common.admin.icon.service;

import com.backend.common.admin.icon.dto.IconCreateRequest;
import com.backend.common.admin.icon.dto.IconUpdateRequest;
import com.backend.common.admin.icon.entity.IconEntity;
import com.backend.common.admin.icon.model.Icon;
import com.backend.common.admin.icon.repository.IconRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class IconService {
	private final IconRepository iconRepository;

	public IconService(IconRepository iconRepository) {
		this.iconRepository = iconRepository;
	}

	public List<Icon> listIcons() {
		return iconRepository.findAllByOrderByNameAsc().stream()
				.map(this::toIcon)
				.collect(Collectors.toList());
	}

	public List<Icon> listEnabledIcons() {
		return iconRepository.findByEnabledTrueOrderByNameAsc().stream()
				.map(this::toIcon)
				.collect(Collectors.toList());
	}

	public Optional<Icon> findById(String id) {
		return iconRepository.findById(id)
				.map(this::toIcon);
	}

	public Optional<Icon> findByIconId(String iconId) {
		return iconRepository.findByIconId(iconId)
				.map(this::toIcon);
	}

	public Icon createIcon(IconCreateRequest request) {
		// iconId 중복 확인
		if (iconRepository.existsByIconId(request.getIconId())) {
			throw new IllegalArgumentException("이미 존재하는 아이콘 ID입니다: " + request.getIconId());
		}

		IconEntity entity = new IconEntity(
			request.getIconId(),
			request.getName(),
			request.getSvgCode()
		);

		IconEntity saved = iconRepository.save(entity);
		return toIcon(saved);
	}

	public Icon updateIcon(String id, IconUpdateRequest request) {
		IconEntity entity = iconRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("아이콘을 찾을 수 없습니다: " + id));

		entity.setName(request.getName());
		entity.setSvgCode(request.getSvgCode());
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}

		IconEntity saved = iconRepository.save(entity);
		return toIcon(saved);
	}

	public void deleteIcon(String id) {
		if (!iconRepository.existsById(id)) {
			throw new IllegalArgumentException("아이콘을 찾을 수 없습니다: " + id);
		}
		iconRepository.deleteById(id);
	}

	private Icon toIcon(IconEntity entity) {
		return new Icon(
			entity.getId(),
			entity.getIconId(),
			entity.getName(),
			entity.getSvgCode(),
			entity.getEnabled()
		);
	}
}

