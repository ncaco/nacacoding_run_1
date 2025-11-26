package com.backend.common.admin.userRole.repository;

import com.backend.common.admin.userRole.entity.UserRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRoleEntity, String> {
	Optional<UserRoleEntity> findByRoleCd(String roleCd);
	boolean existsByRoleCd(String roleCd);
	List<UserRoleEntity> findByEnabledTrueOrderByRoleCdAsc();
	List<UserRoleEntity> findAllByOrderByRoleCdAsc();
}

