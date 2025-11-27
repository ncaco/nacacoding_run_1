package com.backend.common.admin.userRoleMenu.repository;

import com.backend.common.admin.userRoleMenu.entity.UserRoleMenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleMenuRepository extends JpaRepository<UserRoleMenuEntity, String> {
	List<UserRoleMenuEntity> findByUserRoleId(String userRoleId);
	List<UserRoleMenuEntity> findByUserRoleIdAndEnabled(String userRoleId, String enabled);
	default List<UserRoleMenuEntity> findByUserRoleIdAndEnabledTrue(String userRoleId) {
		return findByUserRoleIdAndEnabled(userRoleId, "Y");
	}
	List<UserRoleMenuEntity> findByMenuId(String menuId);
	Optional<UserRoleMenuEntity> findByUserRoleIdAndMenuId(String userRoleId, String menuId);
	boolean existsByUserRoleIdAndMenuId(String userRoleId, String menuId);
	void deleteByUserRoleId(String userRoleId);
}

