package com.backend.common.admin.site.repository;

import com.backend.common.admin.site.entity.SiteEntity;
import com.backend.common.admin.site.model.SiteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteRepository extends JpaRepository<SiteEntity, String> {
	Optional<SiteEntity> findBySiteType(SiteType siteType);
	boolean existsBySiteType(SiteType siteType);
}

