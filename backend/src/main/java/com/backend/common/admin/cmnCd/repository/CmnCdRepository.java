package com.backend.common.admin.cmnCd.repository;

import com.backend.common.admin.cmnCd.entity.CmnCdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CmnCdRepository extends JpaRepository<CmnCdEntity, String> {
	Optional<CmnCdEntity> findByCd(String cd);
	List<CmnCdEntity> findByParentCdIsNull();
	List<CmnCdEntity> findByParentCd(String parentCd);
	boolean existsByCd(String cd);
	boolean existsByParentCdAndCd(String parentCd, String cd);
	boolean existsByParentCdIsNullAndCd(String cd);
	List<CmnCdEntity> findAllByOrderByCdAsc();
}

