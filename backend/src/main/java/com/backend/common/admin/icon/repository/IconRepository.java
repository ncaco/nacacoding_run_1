package com.backend.common.admin.icon.repository;

import com.backend.common.admin.icon.entity.IconEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IconRepository extends JpaRepository<IconEntity, String> {
	Optional<IconEntity> findByIconId(String iconId);
	boolean existsByIconId(String iconId);
	List<IconEntity> findAllByOrderByNameAsc();
	List<IconEntity> findByEnabledTrueOrderByNameAsc();
}

