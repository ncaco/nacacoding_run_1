package com.backend.common.admin.site.repository;

import com.backend.common.admin.site.entity.SiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteRepository extends JpaRepository<SiteEntity, String> {
	Optional<SiteEntity> findBySiteType(String siteType);
	boolean existsBySiteType(String siteType);
	Optional<SiteEntity> findByContextPath(String contextPath);
	boolean existsByContextPath(String contextPath);
}

