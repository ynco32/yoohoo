package com.conkiri.domain.sharing.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.sharing.entity.QSharing;
import com.conkiri.domain.sharing.entity.Sharing;
import com.conkiri.domain.user.entity.User;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;

@Repository
public class SharingRepositoryCustomImpl implements SharingRepositoryCustom {

	private final JPAQueryFactory jpaQueryFactory;

	public SharingRepositoryCustomImpl(EntityManager entityManager) {
		this.jpaQueryFactory = new JPAQueryFactory(entityManager);
	}

	/**
	 * 해당 공연의 나눔 게시글을 조회하는 쿼리
	 * @param concert
	 * @param lastSharingId
	 * @param pageable
	 * @return
	 */
	@Override
	public Slice<Sharing> findSharings(Concert concert, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;

		// 기본조건 : 해당 공연의 나눔 게시글만 조회
		BooleanExpression conditions = sharing.concert.concertId.eq(concert.getConcertId());

		// 첫 조회가 아닐 때
		return getSharingNoOffset(lastSharingId, pageable, conditions, sharing);
	}

	/**
	 * 회원이 등록한 해당 공연의 나눔 게시글을 조회하는 쿼리
	 * @param concert
	 * @param user
	 * @param lastSharingId
	 * @param pageable
	 * @return
	 */
	@Override
	public Slice<Sharing> findWroteSharings(User user, Concert concert, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;

		// 기본 조건 : 회원이 작성한 해당 공연의 게시물을 조회
		BooleanExpression conditions = sharing.concert.concertId.eq(concert.getConcertId()).and(sharing.user.userId.eq(user.getUserId()));

		// 첫 조회가 아닐 때
		return getSharingNoOffset(lastSharingId, pageable, conditions, sharing);

	}

	// ========================= 내부 메서드 =========================== //

	/**
	 * No-Offset방식으로 나눔 게시글 조회하는 내부메서드
	 * @param lastSharingId
	 * @param pageable
	 * @param conditions
	 * @param sharing
	 * @return
	 */
	private SliceImpl<Sharing> getSharingNoOffset(Long lastSharingId, Pageable pageable, BooleanExpression conditions,
		QSharing sharing) {
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
