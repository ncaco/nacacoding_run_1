package com.backend.common.admin.site.service;

import com.backend.common.admin.site.dto.SiteCreateRequest;
import com.backend.common.admin.site.dto.SiteUpdateRequest;
import com.backend.common.admin.site.entity.SiteEntity;
import com.backend.common.admin.site.model.Site;
import com.backend.common.admin.site.model.SiteType;
import com.backend.common.admin.site.repository.SiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SiteService {
	private final SiteRepository siteRepository;

	public SiteService(SiteRepository siteRepository) {
		this.siteRepository = siteRepository;
	}

	public List<Site> listSites() {
		return siteRepository.findAll().stream()
				.map(this::toSite)
				.collect(Collectors.toList());
	}

	public Optional<Site> findById(String id) {
		return siteRepository.findById(id)
				.map(this::toSite);
	}

	public Optional<Site> findBySiteType(SiteType siteType) {
		return siteRepository.findBySiteType(siteType)
				.map(this::toSite);
	}

	public Site createSite(SiteCreateRequest request) {
		if (siteRepository.existsBySiteType(request.getSiteType())) {
			throw new IllegalArgumentException("이미 존재하는 사이트 타입입니다: " + request.getSiteType());
		}
		
		SiteEntity entity = new SiteEntity(
			request.getSiteType(),
			request.getSiteName(),
			request.getDescription(),
			request.getVersion()
		);
		SiteEntity saved = siteRepository.save(entity);
		return toSite(saved);
	}

	public Site updateSite(String id, SiteUpdateRequest request) {
		SiteEntity entity = siteRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("사이트를 찾을 수 없습니다: " + id));
		
		entity.setSiteName(request.getSiteName());
		entity.setDescription(request.getDescription());
		entity.setVersion(request.getVersion());
		if (request.getEnabled() != null) {
			entity.setEnabled(request.getEnabled());
		}
		
		SiteEntity saved = siteRepository.save(entity);
		return toSite(saved);
	}

	public void deleteSite(String id) {
		if (!siteRepository.existsById(id)) {
			throw new IllegalArgumentException("사이트를 찾을 수 없습니다: " + id);
		}
		siteRepository.deleteById(id);
	}

	private Site toSite(SiteEntity entity) {
		return new Site(
			entity.getId(),
			entity.getSiteType(),
			entity.getSiteName(),
			entity.getDescription(),
			entity.getVersion(),
			entity.getEnabled()
		);
	}
}

