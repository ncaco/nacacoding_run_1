package com.backend.common.admin.menu.service;

import com.backend.common.admin.menu.dto.MenuCreateRequest;
import com.backend.common.admin.menu.dto.MenuUpdateRequest;
import com.backend.common.admin.menu.entity.MenuEntity;
import com.backend.common.admin.menu.model.Menu;
import com.backend.common.admin.menu.repository.MenuRepository;
import com.backend.common.admin.site.repository.SiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MenuService {
	private final MenuRepository menuRepository;
	private final SiteRepository siteRepository;

	public MenuService(MenuRepository menuRepository, SiteRepository siteRepository) {
		this.menuRepository = menuRepository;
		this.siteRepository = siteRepository;
	}

	public List<Menu> listMenus() {
		return menuRepository.findAll().stream()
				.map(this::toMenu)
				.collect(Collectors.toList());
	}

	public List<Menu> listMenusBySiteId(String siteId) {
		return menuRepository.findBySiteId(siteId).stream()
				.map(this::toMenu)
				.collect(Collectors.toList());
	}

	public List<Menu> listEnabledMenusBySiteId(String siteId) {
		return menuRepository.findBySiteIdAndEnabledTrue(siteId).stream()
				.map(this::toMenu)
				.collect(Collectors.toList());
	}

	public Optional<Menu> findById(String id) {
		return menuRepository.findById(id)
				.map(this::toMenu);
	}

	public Menu createMenu(MenuCreateRequest request) {
		// 사이트 존재 확인
		if (!siteRepository.existsById(request.getSiteId())) {
			throw new IllegalArgumentException("사이트를 찾을 수 없습니다: " + request.getSiteId());
		}
		
		// 부모 메뉴 존재 확인 (parentId가 있는 경우)
		if (request.getParentId() != null && !request.getParentId().isEmpty()) {
			if (!menuRepository.existsById(request.getParentId())) {
				throw new IllegalArgumentException("부모 메뉴를 찾을 수 없습니다: " + request.getParentId());
			}
		}
		
		MenuEntity entity = new MenuEntity(
			request.getSiteId(),
			request.getName(),
			request.getUrl(),
			request.getDisplayOrder() != null ? request.getDisplayOrder() : 0,
			request.getParentId()
		);
		MenuEntity saved = menuRepository.save(entity);
		return toMenu(saved);
	}

	public Menu updateMenu(String id, MenuUpdateRequest request) {
		MenuEntity entity = menuRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + id));
		
		entity.setName(request.getName());
		entity.setUrl(request.getUrl());
		if (request.getDisplayOrder() != null) {
			entity.setDisplayOrder(request.getDisplayOrder());
		}
		entity.setParentId(request.getParentId());
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}
		
		MenuEntity saved = menuRepository.save(entity);
		return toMenu(saved);
	}

	public void deleteMenu(String id) {
		// 하위 메뉴가 있는지 확인
		List<MenuEntity> children = menuRepository.findByParentId(id);
		if (!children.isEmpty()) {
			throw new IllegalArgumentException("하위 메뉴가 존재하여 삭제할 수 없습니다. 먼저 하위 메뉴를 삭제해주세요.");
		}
		
		if (!menuRepository.existsById(id)) {
			throw new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + id);
		}
		menuRepository.deleteById(id);
	}

	private Menu toMenu(MenuEntity entity) {
		return new Menu(
			entity.getId(),
			entity.getSiteId(),
			entity.getName(),
			entity.getUrl(),
			entity.getDisplayOrder(),
			entity.getParentId(),
			entity.getEnabled()
		);
	}
}

