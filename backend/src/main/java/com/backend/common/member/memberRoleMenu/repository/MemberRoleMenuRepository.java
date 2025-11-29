package com.backend.common.member.memberRoleMenu.repository;

import com.backend.common.member.memberRoleMenu.entity.MemberRoleMenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRoleMenuRepository extends JpaRepository<MemberRoleMenuEntity, String> {
	List<MemberRoleMenuEntity> findByMemberRoleId(String memberRoleId);
	List<MemberRoleMenuEntity> findByMemberRoleIdAndEnabled(String memberRoleId, String enabled);
	default List<MemberRoleMenuEntity> findByMemberRoleIdAndEnabledTrue(String memberRoleId) {
		return findByMemberRoleIdAndEnabled(memberRoleId, "Y");
	}
	List<MemberRoleMenuEntity> findByMenuId(String menuId);
	Optional<MemberRoleMenuEntity> findByMemberRoleIdAndMenuId(String memberRoleId, String menuId);
	boolean existsByMemberRoleIdAndMenuId(String memberRoleId, String menuId);
	void deleteByMemberRoleId(String memberRoleId);
}

