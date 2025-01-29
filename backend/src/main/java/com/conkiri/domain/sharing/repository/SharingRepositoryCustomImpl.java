package com.conkiri.domain.sharing.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.sharing.entity.QSharing;
import com.conkiri.domain.sharing.entity.Sharing;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

@Repository
public class SharingRepositoryCustomImpl implements SharingRepositoryCustom {

	private final JPAQueryFactory jpaQueryFactory;

	public SharingRepositoryCustomImpl(EntityManager entityManager) {
		this.jpaQueryFactory = new JPAQueryFactory(entityManager);
	}

	@Override
	public Slice<Sharing> findSharings(Concert concert, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;

		// 기본조건 : 해당 공연의 나눔 게시글만 조회
		BooleanExpression conditions = sharing.concert.concertId.eq(concert.getConcertId());

		// 첫 조회가 아닐 때
		if (lastSharingId != 0) {
			conditions = conditions.and(sharing.sharingId.lt(lastSharingId));
		}

		// Query 실행
		List<Sharing> results = jpaQueryFactory
			.selectFrom(sharing)
			.where(conditions)
			.orderBy(sharing.sharingId.desc())
			.limit(pageable.getPageSize() + 1)
			.fetch();

		// Slice 생성
		boolean hasNext = results.size() > pageable.getPageSize();

		if (hasNext) {
			results.remove(results.size() - 1);
		}

		return new SliceImpl<>(results, pageable, hasNext);
	}
}
