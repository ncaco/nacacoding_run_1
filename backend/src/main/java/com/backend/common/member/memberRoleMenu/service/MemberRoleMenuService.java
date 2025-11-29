package com.backend.common.member.memberRoleMenu.service;

import com.backend.common.admin.menu.entity.MenuEntity;
import com.backend.common.admin.menu.repository.MenuRepository;
import com.backend.common.member.memberRole.entity.MemberRoleEntity;
import com.backend.common.member.memberRole.repository.MemberRoleRepository;
import com.backend.common.member.memberRoleMenu.dto.MenuPermissionResponse;
import com.backend.common.member.memberRoleMenu.dto.MemberRoleMenuRequest;
import com.backend.common.member.memberRoleMenu.entity.MemberRoleMenuEntity;
import com.backend.common.member.memberRoleMenu.repository.MemberRoleMenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberRoleMenuService {
	private final MemberRoleMenuRepository memberRoleMenuRepository;
	private final MemberRoleRepository memberRoleRepository;
	private final MenuRepository menuRepository;

	public MemberRoleMenuService(
		MemberRoleMenuRepository memberRoleMenuRepository,
		MemberRoleRepository memberRoleRepository,
		MenuRepository menuRepository
	) {
		this.memberRoleMenuRepository = memberRoleMenuRepository;
		this.memberRoleRepository = memberRoleRepository;
		this.menuRepository = menuRepository;
	}

	/**
	 * 특정 역할의 메뉴 권한 목록 조회
	 */
	public MenuPermissionResponse getMenuPermissions(String memberRoleId) {
		MemberRoleEntity memberRole = memberRoleRepository.findById(memberRoleId)
			.orElseThrow(() -> new IllegalArgumentException("사용자 역할을 찾을 수 없습니다: " + memberRoleId));

		// 모든 활성화된 메뉴 조회
		List<MenuEntity> allMenus = menuRepository.findAll().stream()
			.filter(menu -> menu.getEnabled() != null && menu.getEnabled())
			.sorted((a, b) -> (a.getDisplayOrder() != null ? a.getDisplayOrder() : 0) 
				- (b.getDisplayOrder() != null ? b.getDisplayOrder() : 0))
			.collect(Collectors.toList());

		// 해당 역할에 부여된 메뉴 권한 맵 (menuId -> MemberRoleMenuEntity)
		Map<String, MemberRoleMenuEntity> permissionMap = memberRoleMenuRepository.findByMemberRoleIdAndEnabledTrue(memberRoleId).stream()
			.collect(Collectors.toMap(MemberRoleMenuEntity::getMenuId, entity -> entity));

		// 메뉴 권한 응답 생성
		List<MenuPermissionResponse.MenuPermissionItem> menuItems = allMenus.stream()
			.map(menu -> {
				MemberRoleMenuEntity permission = permissionMap.get(menu.getId());
				String siteId = menu.getSiteId();
				// siteId가 null이면 로그 출력 (디버깅용)
				if (siteId == null) {
					System.err.println("경고: 메뉴 ID " + menu.getId() + "의 siteId가 null입니다.");
				}
				return new MenuPermissionResponse.MenuPermissionItem(
					menu.getId(),
					siteId != null ? siteId : "",
					menu.getName(),
					menu.getUrl(),
					menu.getParentId(),
					menu.getDisplayOrder(),
					permission != null ? "Y".equals(permission.getPermRead()) : false,
					permission != null ? "Y".equals(permission.getPermCreate()) : false,
					permission != null ? "Y".equals(permission.getPermUpdate()) : false,
					permission != null ? "Y".equals(permission.getPermDelete()) : false,
					permission != null ? "Y".equals(permission.getPermDownload()) : false,
					permission != null ? "Y".equals(permission.getPermAll()) : false
				);
			})
			.collect(Collectors.toList());

		return new MenuPermissionResponse(memberRoleId, memberRole.getRoleNm(), menuItems);
	}

	/**
	 * 특정 역할의 메뉴 권한 저장
	 */
	public void saveMenuPermissions(MemberRoleMenuRequest request) {
		// 역할 존재 확인
		if (!memberRoleRepository.existsById(request.getMemberRoleId())) {
			throw new IllegalArgumentException("사용자 역할을 찾을 수 없습니다: " + request.getMemberRoleId());
		}

		// 기존 권한 삭제
		memberRoleMenuRepository.deleteByMemberRoleId(request.getMemberRoleId());

		// 새로운 권한 저장
		if (request.getMenuPermissions() != null && !request.getMenuPermissions().isEmpty()) {
			for (MemberRoleMenuRequest.MenuPermission menuPerm : request.getMenuPermissions()) {
				// 메뉴 존재 확인
				if (!menuRepository.existsById(menuPerm.getMenuId())) {
					throw new IllegalArgumentException("메뉴를 찾을 수 없습니다: " + menuPerm.getMenuId());
				}

				// 권한이 하나라도 있으면 저장
				boolean hasPermission = (menuPerm.getPermRead() != null && menuPerm.getPermRead()) 
					|| (menuPerm.getPermCreate() != null && menuPerm.getPermCreate())
					|| (menuPerm.getPermUpdate() != null && menuPerm.getPermUpdate())
					|| (menuPerm.getPermDelete() != null && menuPerm.getPermDelete())
					|| (menuPerm.getPermDownload() != null && menuPerm.getPermDownload())
					|| (menuPerm.getPermAll() != null && menuPerm.getPermAll());
				
				if (hasPermission) {
					MemberRoleMenuEntity entity = new MemberRoleMenuEntity(request.getMemberRoleId(), menuPerm.getMenuId());
					entity.setPermRead(menuPerm.getPermRead() != null && menuPerm.getPermRead() ? "Y" : "N");
					entity.setPermCreate(menuPerm.getPermCreate() != null && menuPerm.getPermCreate() ? "Y" : "N");
					entity.setPermUpdate(menuPerm.getPermUpdate() != null && menuPerm.getPermUpdate() ? "Y" : "N");
					entity.setPermDelete(menuPerm.getPermDelete() != null && menuPerm.getPermDelete() ? "Y" : "N");
					entity.setPermDownload(menuPerm.getPermDownload() != null && menuPerm.getPermDownload() ? "Y" : "N");
					entity.setPermAll(menuPerm.getPermAll() != null && menuPerm.getPermAll() ? "Y" : "N");
					entity.setEnabled("Y"); // 명시적으로 활성화 상태 설정
					memberRoleMenuRepository.save(entity);
				}
			}
		}
	}

	/**
	 * 특정 역할이 특정 메뉴에 접근 권한이 있는지 확인
	 */
	public boolean hasPermission(String memberRoleId, String menuId) {
		return memberRoleMenuRepository.existsByMemberRoleIdAndMenuId(memberRoleId, menuId);
	}
}

