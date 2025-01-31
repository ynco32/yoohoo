package com.conkiri.domain.base.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import com.conkiri.domain.base.dto.response.ConcertResponseDTO;
import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.entity.QConcert;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

@Repository
public class ConcertRepositoryCustomImpl implements ConcertRepositoryCustom {

	private final JPAQueryFactory jpaQueryFactory;

	public ConcertRepositoryCustomImpl(EntityManager entityManager) {
		this.jpaQueryFactory = new JPAQueryFactory(entityManager);
	}

	@Override
	public ConcertResponseDTO findConcerts(LocalDateTime now, String concertSearch, Long lastConcertId, Pageable pageable) {
		QConcert concert = QConcert.concert;

		BooleanExpression conditions = concert.startTime.after(now); // 기본 조건: 시작 시간이 now이후
		
		if (concertSearch != null && !concertSearch.isEmpty()) {
			conditions = conditions.and(concert.concertName.containsIgnoreCase(concertSearch)); // 검색어 조건
		}

		if (lastConcertId != null) {
			conditions = conditions.and(concert.concertId.gt(lastConcertId)); // No-Offset조건
		}

		// Query 실행
		List<Concert> results = jpaQueryFactory
			.selectFrom(concert)
			.where(conditions)
			.orderBy(concert.startTime.asc())
			.limit(pageable.getPageSize() + 1)
			.fetch();

		boolean hasNext = results.size() > pageable.getPageSize();
		if (hasNext) {
			results.remove(results.size() - 1); // 초과된 한 개 제거
		}

		return ConcertResponseDTO.from(results, hasNext);

	}
}
