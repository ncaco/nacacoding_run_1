package com.backend.common.admin.menu.service;

import com.backend.common.admin.menu.dto.MenuCreateRequest;
import com.backend.common.admin.menu.dto.MenuUpdateRequest;
import com.backend.common.admin.menu.entity.MenuEntity;
import com.backend.common.admin.menu.model.Menu;
import com.backend.common.admin.menu.repository.MenuRepository;
import com.backend.common.admin.site.entity.SiteEntity;
import com.backend.common.admin.site.repository.SiteRepository;
import com.backend.common.admin.userRoleMenu.entity.UserRoleMenuEntity;
import com.backend.common.admin.userRoleMenu.repository.UserRoleMenuRepository;
import com.backend.common.member.memberRoleMenu.entity.MemberRoleMenuEntity;
import com.backend.common.member.memberRoleMenu.repository.MemberRoleMenuRepository;
import com.backend.common.member.memberRole.repository.MemberRoleRepository;
import com.backend.common.user.model.User;
import com.backend.common.user.model.Role;
import com.backend.common.user.service.UserService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MenuService {
	private final MenuRepository menuRepository;
	private final SiteRepository siteRepository;
	private final UserService userService;
	private final UserRoleMenuRepository userRoleMenuRepository;
	private final MemberRoleMenuRepository memberRoleMenuRepository;
	private final MemberRoleRepository memberRoleRepository;

	public MenuService(
		MenuRepository menuRepository, 
		SiteRepository siteRepository,
		UserService userService,
		UserRoleMenuRepository userRoleMenuRepository,
		MemberRoleMenuRepository memberRoleMenuRepository,
		MemberRoleRepository memberRoleRepository
	) {
		this.menuRepository = menuRepository;
		this.siteRepository = siteRepository;
		this.userService = userService;
		this.userRoleMenuRepository = userRoleMenuRepository;
		this.memberRoleMenuRepository = memberRoleMenuRepository;
		this.memberRoleRepository = memberRoleRepository;
	}

	@EventListener(ApplicationReadyEvent.class)
	@Order(100) // SiteService(기본값 0)보다 나중에 실행되도록 설정
	public void init() {
		// 관리자 사이트 메뉴 초기화
		initAdminSiteMenus();
		
		// 통합홈페이지 메뉴 초기화
		initIntegratedHomepageMenus();
	}
	
	/**
	 * 관리자 사이트 메뉴 초기화
	 */
	private void initAdminSiteMenus() {
		// 관리자 사이트 찾기 (contextPath가 'admin'인 사이트)
		Optional<SiteEntity> adminSiteOpt = siteRepository.findByContextPath("admin");
		
		// 사이트가 없으면 생성 (SiteService가 실행되지 않았을 수 있음)
		SiteEntity adminSite;
		if (adminSiteOpt.isEmpty()) {
			// 통합관리시스템 사이트 생성
			adminSite = siteRepository.save(new SiteEntity("C001", "통합관리시스템", "통합 관리 시스템", "admin", "1.0.0"));
		} else {
			adminSite = adminSiteOpt.get();
		}
		
		String adminSiteId = adminSite.getId();
		
		// 이미 메뉴가 있으면 초기화하지 않음
		if (menuRepository.existsBySiteId(adminSiteId)) {
			return;
		}
		
		// 관리자 사이트 메뉴 초기 데이터 생성
		menuRepository.save(new MenuEntity(adminSiteId, "대시보드", "/admin", null, 1, null));
		menuRepository.save(new MenuEntity(adminSiteId, "사이트 관리", "/admin/sites", null, 2, null));
		menuRepository.save(new MenuEntity(adminSiteId, "메뉴 관리", "/admin/menus", null, 3, null));
		menuRepository.save(new MenuEntity(adminSiteId, "관리자 관리", "/admin/admins", null, 4, null));
		menuRepository.save(new MenuEntity(adminSiteId, "사용자 관리", "/admin/users", null, 5, null));
		menuRepository.save(new MenuEntity(adminSiteId, "공통코드 관리", "/admin/cmn-cd", null, 6, null));
		menuRepository.save(new MenuEntity(adminSiteId, "관리자 권한 관리", "/admin/user-roles", null, 7, null));
		menuRepository.save(new MenuEntity(adminSiteId, "사용자 권한 관리", "/admin/member-roles", null, 8, null));
		menuRepository.save(new MenuEntity(adminSiteId, "아이콘 관리", "/admin/icons", null, 9, null));
		menuRepository.save(new MenuEntity(adminSiteId, "파일 관리", "/admin/files", null, 10, null));
		menuRepository.save(new MenuEntity(adminSiteId, "로그 관리", "/admin/logs", null, 11, null));
	}
	
	/**
	 * 통합홈페이지 메뉴 초기화
	 */
	private void initIntegratedHomepageMenus() {
		// 통합홈페이지 사이트 찾기 (contextPath가 ''인 사이트)
		Optional<SiteEntity> integratedHomepageOpt = siteRepository.findByContextPath("");
		
		// 사이트가 없으면 생성 (SiteService가 실행되지 않았을 수 있음)
		SiteEntity integratedHomepage;
		if (integratedHomepageOpt.isEmpty()) {
			// 통합홈페이지 사이트 생성
			integratedHomepage = siteRepository.save(new SiteEntity("C002", "통합홈페이지", "통합 홈페이지", "", "1.0.0"));
		} else {
			integratedHomepage = integratedHomepageOpt.get();
		}
		
		String integratedHomepageId = integratedHomepage.getId();
		
		// 통합홈페이지에 메뉴가 없으면 포털사이트 메뉴를 복사하거나 기본 메뉴 생성
		if (!menuRepository.existsBySiteId(integratedHomepageId)) {
			// 포털사이트 찾기 (siteType이 C002이고 contextPath가 ''인 사이트)
			Optional<SiteEntity> portalSiteOpt = siteRepository.findByContextPath("");
			SiteEntity sourcePortalSite = null;
			
			// contextPath가 'portal'인 사이트가 없으면, siteType이 C002이고 contextPath가 ''이 아닌 첫 번째 사이트를 찾음
			if (portalSiteOpt.isEmpty()) {
				List<SiteEntity> portalSites = siteRepository.findAll().stream()
					.filter(site -> "C002".equals(site.getSiteType()) && !"".equals(site.getContextPath()))
					.collect(Collectors.toList());
				
				if (!portalSites.isEmpty()) {
					sourcePortalSite = portalSites.get(0);
				}
			} else {
				sourcePortalSite = portalSiteOpt.get();
			}
			
			// 포털사이트가 있고 메뉴가 있으면 해당 사이트의 메뉴를 통합홈페이지로 복사
			if (sourcePortalSite != null) {
				String sourcePortalSiteId = sourcePortalSite.getId();
				List<MenuEntity> sourceMenus = menuRepository.findBySiteId(sourcePortalSiteId);
				
				if (!sourceMenus.isEmpty()) {
					// 메뉴를 복사 (부모-자식 관계 유지)
					Map<String, String> oldToNewMenuIdMap = new java.util.HashMap<>();
					
					// 먼저 부모 메뉴들을 복사
					List<MenuEntity> parentMenus = sourceMenus.stream()
						.filter(menu -> menu.getParentId() == null)
						.sorted((a, b) -> (a.getDisplayOrder() != null ? a.getDisplayOrder() : 0) 
							- (b.getDisplayOrder() != null ? b.getDisplayOrder() : 0))
						.collect(Collectors.toList());
					
					for (MenuEntity sourceMenu : parentMenus) {
						MenuEntity newMenu = new MenuEntity(
							integratedHomepageId,
							sourceMenu.getName(),
							sourceMenu.getUrl(),
							sourceMenu.getIcon(),
							sourceMenu.getDisplayOrder(),
							null
						);
						newMenu.setEnabled(sourceMenu.getEnabled());
						MenuEntity saved = menuRepository.save(newMenu);
						oldToNewMenuIdMap.put(sourceMenu.getId(), saved.getId());
					}
					
					// 자식 메뉴들을 복사 (부모 ID 매핑)
					List<MenuEntity> childMenus = sourceMenus.stream()
						.filter(menu -> menu.getParentId() != null)
						.sorted((a, b) -> (a.getDisplayOrder() != null ? a.getDisplayOrder() : 0) 
							- (b.getDisplayOrder() != null ? b.getDisplayOrder() : 0))
						.collect(Collectors.toList());
					
					for (MenuEntity sourceMenu : childMenus) {
						String newParentId = oldToNewMenuIdMap.get(sourceMenu.getParentId());
						if (newParentId != null) {
							MenuEntity newMenu = new MenuEntity(
								integratedHomepageId,
								sourceMenu.getName(),
								sourceMenu.getUrl(),
								sourceMenu.getIcon(),
								sourceMenu.getDisplayOrder(),
								newParentId
							);
							newMenu.setEnabled(sourceMenu.getEnabled());
							menuRepository.save(newMenu);
						}
					}
				} else {
					// 포털사이트는 있지만 메뉴가 없으면 기본 메뉴 생성
					createDefaultHomepageMenus(integratedHomepageId);
				}
			} else {
				// 포털사이트가 없으면 기본 메뉴 생성
				createDefaultHomepageMenus(integratedHomepageId);
			}
		}
	}
	
	/**
	 * 통합홈페이지 기본 메뉴 생성
	 */
	private void createDefaultHomepageMenus(String siteId) {
		// 기본 메뉴 생성
		menuRepository.save(new MenuEntity(siteId, "홈", "/", null, 1, null));
		MenuEntity aboutMenu = menuRepository.save(new MenuEntity(siteId, "소개", "/about", null, 2, null));
		MenuEntity serviceMenu = menuRepository.save(new MenuEntity(siteId, "서비스", "/service", null, 3, null));
		menuRepository.save(new MenuEntity(siteId, "공지사항", "/notice", null, 4, null));
		menuRepository.save(new MenuEntity(siteId, "문의하기", "/contact", null, 5, null));
		
		// 서비스 하위 메뉴
		menuRepository.save(new MenuEntity(siteId, "서비스 소개", "/service/intro", null, 1, serviceMenu.getId()));
		menuRepository.save(new MenuEntity(siteId, "서비스 이용안내", "/service/guide", null, 2, serviceMenu.getId()));
		
		// 소개 하위 메뉴
		menuRepository.save(new MenuEntity(siteId, "회사소개", "/about/company", null, 1, aboutMenu.getId()));
		menuRepository.save(new MenuEntity(siteId, "오시는 길", "/about/location", null, 2, aboutMenu.getId()));
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

	/**
	 * 현재 로그인한 사용자의 권한에 따라 활성화된 메뉴 목록 조회
	 * 읽기 권한이 있는 메뉴만 반환합니다.
	 * 관리자(USER)는 USER_ROLE_MENU 테이블을, 회원(MEMBER)은 MEMBER_ROLE_MENU 테이블을 사용합니다.
	 * username이 null이면 비회원(GUEST) 권한으로 조회합니다.
	 */
	public List<Menu> listEnabledMenusBySiteIdWithPermissions(String siteId, String username) {
		// 활성화된 메뉴 목록 조회
		List<MenuEntity> allMenus = menuRepository.findBySiteIdAndEnabledTrue(siteId);
		
		// username이 null이면 비회원(GUEST) 권한으로 처리
		if (username == null || username.isEmpty()) {
			return listMenusByMemberRole(siteId, "GUEST");
		}
		
		// 현재 사용자 정보 조회
		Optional<User> userOpt = userService.findByUsername(username);
		if (userOpt.isEmpty()) {
			// 사용자를 찾을 수 없으면 비회원(GUEST) 권한으로 처리
			return listMenusByMemberRole(siteId, "GUEST");
		}
		
		User user = userOpt.get();
		String roleId = user.getUserRoleId();
		
		// roleId가 없으면 비회원(GUEST) 권한으로 처리
		if (roleId == null || roleId.isEmpty()) {
			return listMenusByMemberRole(siteId, "GUEST");
		}
		
		// 역할에 따라 다른 권한 테이블 사용
		if (user.getRole() == Role.MEMBER) {
			// 회원(MEMBER)의 경우 MEMBER_ROLE_MENU 테이블 사용
			return listMenusByMemberRoleId(siteId, roleId, allMenus);
		} else {
			// 관리자(USER)의 경우 USER_ROLE_MENU 테이블 사용
			return listMenusByUserRoleId(siteId, roleId, allMenus);
		}
	}
	
	/**
	 * 회원 역할 코드로 메뉴 목록 조회 (비회원 포함)
	 */
	private List<Menu> listMenusByMemberRole(String siteId, String roleCd) {
		// 역할 코드로 역할 ID 찾기
		Optional<String> roleIdOpt = memberRoleRepository.findByRoleCd(roleCd)
			.map(role -> role.getId());
		
		if (roleIdOpt.isEmpty()) {
			// 역할을 찾을 수 없으면 빈 목록 반환
			return List.of();
		}
		
		String roleId = roleIdOpt.get();
		List<MenuEntity> allMenus = menuRepository.findBySiteIdAndEnabledTrue(siteId);
		return listMenusByMemberRoleId(siteId, roleId, allMenus);
	}
	
	/**
	 * 회원 역할 ID로 메뉴 목록 조회
	 */
	private List<Menu> listMenusByMemberRoleId(String siteId, String memberRoleId, List<MenuEntity> allMenus) {
		// 해당 역할의 메뉴 권한 조회 (활성화된 권한만)
		List<MemberRoleMenuEntity> permissions = memberRoleMenuRepository.findByMemberRoleIdAndEnabled(memberRoleId, "Y");
		
		// 권한 맵 생성 (menuId -> MemberRoleMenuEntity)
		Map<String, MemberRoleMenuEntity> permissionMap = permissions.stream()
				.collect(Collectors.toMap(MemberRoleMenuEntity::getMenuId, perm -> perm));
		
		// 읽기 권한이 있는 메뉴만 필터링
		return allMenus.stream()
				.filter(menu -> {
					MemberRoleMenuEntity permission = permissionMap.get(menu.getId());
					// 권한 레코드가 없으면 접근 불가
					if (permission == null) {
						return false;
					}
					// 읽기 권한 또는 전체 권한이 "Y"인 경우만 허용
					return "Y".equals(permission.getPermRead()) || "Y".equals(permission.getPermAll());
				})
				.map(this::toMenu)
				.collect(Collectors.toList());
	}
	
	/**
	 * 관리자 역할 ID로 메뉴 목록 조회
	 */
	private List<Menu> listMenusByUserRoleId(String siteId, String userRoleId, List<MenuEntity> allMenus) {
		// 해당 역할의 메뉴 권한 조회 (활성화된 권한만)
		List<UserRoleMenuEntity> permissions = userRoleMenuRepository.findByUserRoleIdAndEnabled(userRoleId, "Y");
		
		// 권한 맵 생성 (menuId -> UserRoleMenuEntity)
		Map<String, UserRoleMenuEntity> permissionMap = permissions.stream()
				.collect(Collectors.toMap(UserRoleMenuEntity::getMenuId, perm -> perm));
		
		// 읽기 권한이 있는 메뉴만 필터링
		return allMenus.stream()
				.filter(menu -> {
					UserRoleMenuEntity permission = permissionMap.get(menu.getId());
					// 권한 레코드가 없으면 접근 불가
					if (permission == null) {
						return false;
					}
					// 읽기 권한 또는 전체 권한이 "Y"인 경우만 허용
					return "Y".equals(permission.getPermRead()) || "Y".equals(permission.getPermAll());
				})
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
			request.getIcon(),
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
		entity.setIcon(request.getIcon());
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
			entity.getIcon(),
			entity.getDisplayOrder(),
			entity.getParentId(),
			entity.getEnabled()
		);
	}
}

