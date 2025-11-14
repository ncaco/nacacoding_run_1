package com.backend.common.admin.menu.repository;

import com.backend.common.admin.menu.entity.MenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, String> {
	List<MenuEntity> findBySiteId(String siteId);
	List<MenuEntity> findBySiteIdAndEnabledTrue(String siteId);
	List<MenuEntity> findBySiteIdAndParentIdIsNull(String siteId);
	List<MenuEntity> findByParentId(String parentId);
	boolean existsBySiteId(String siteId);
}

