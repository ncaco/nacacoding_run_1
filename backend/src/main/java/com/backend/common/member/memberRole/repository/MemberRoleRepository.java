package com.backend.common.member.memberRole.repository;

import com.backend.common.member.memberRole.entity.MemberRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRoleRepository extends JpaRepository<MemberRoleEntity, String> {
	Optional<MemberRoleEntity> findByRoleCd(String roleCd);
	boolean existsByRoleCd(String roleCd);
	List<MemberRoleEntity> findByEnabledTrueOrderByRoleCdAsc();
	List<MemberRoleEntity> findAllByOrderByRoleCdAsc();
}

