package com.conkiri.domain.sharing.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.entity.QScrapSharing;
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
	public SharingResponseDTO findSharings(Concert concert, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;

		// 기본조건 : 해당 공연의 나눔 게시글만 조회
		BooleanExpression conditions = sharing.concert.concertId.eq(concert.getConcertId());

		conditions = applyLastSharingId(lastSharingId, conditions, sharing);

		// Query 실행
		List<Sharing> results = jpaQueryFactory
			.selectFrom(sharing)
			.where(conditions)
			.orderBy(sharing.sharingId.desc())
			.limit(pageable.getPageSize() + 1)
			.fetch();

		return createSharingResponseDTO(pageable, results);
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
	public SharingResponseDTO findWroteSharings(User user, Concert concert, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;

		// 기본 조건 : 회원이 작성한 해당 공연의 게시물을 조회
		BooleanExpression conditions = sharing.concert.concertId.eq(concert.getConcertId()).and(sharing.user.userId.eq(user.getUserId()));

		conditions = applyLastSharingId(lastSharingId, conditions, sharing);

		// Query 실행
		List<Sharing> results = jpaQueryFactory
			.selectFrom(sharing)
			.where(conditions)
			.orderBy(sharing.sharingId.desc())
			.limit(pageable.getPageSize() + 1)
			.fetch();

		return createSharingResponseDTO(pageable, results);
	}

	/**
	 * 회원이 스크랩한 해당 공연의 나눔 게시글을 조회하는 쿼리
	 * @param user
	 * @param concert
	 * @param lastSharingId
	 * @param pageable
	 * @return
	 */
	@Override
	public SharingResponseDTO findScrappedSharings(User user, Concert concert, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;
		QScrapSharing scrapSharing = QScrapSharing.scrapSharing;

		// 기본 조건 : 해당 공연의 회원이 스크랩한 나눔 게시물을 조회
		BooleanExpression conditions = sharing.concert.concertId.eq(concert.getConcertId())
			.and(scrapSharing.user.userId.eq(user.getUserId()));

		conditions = applyLastSharingId(lastSharingId, conditions, sharing);

		List<Sharing> results = jpaQueryFactory
			.selectFrom(sharing)
			.join(scrapSharing).on(scrapSharing.sharing.sharingId.eq(sharing.sharingId))
			.where(conditions)
			.orderBy(sharing.sharingId.desc())
			.limit(pageable.getPageSize() + 1)
			.fetch();

		return createSharingResponseDTO(pageable, results);
	}

	/**
	 * 마이페이지에서 회원이 작성한 나눔 게시글 전체를 조회하는 쿼리
	 * @param user
	 * @param lastSharingId
	 * @param pageable
	 * @return
	 */
	@Override
	public SharingResponseDTO findWroteSharingsInMyPage(User user, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;

		BooleanExpression conditions = sharing.user.userId.eq(user.getUserId());

		conditions = applyLastSharingId(lastSharingId, conditions, sharing);

		List<Sharing> results = jpaQueryFactory
			.selectFrom(sharing)
			.where(conditions)
			.orderBy(sharing.sharingId.desc())
			.limit(pageable.getPageSize() + 1)
			.fetch();

		return createSharingResponseDTO(pageable, results);
	}

	/**
	 * 마이페이지에서 회원이 스크랩한 나눔 게시글 전체를 조회하는 쿼리
	 * @param user
	 * @param lastSharingId
	 * @param pageable
	 * @return
	 */
	@Override
	public SharingResponseDTO findScrappedSharingsInMyPage(User user, Long lastSharingId, Pageable pageable) {
		QSharing sharing = QSharing.sharing;
		QScrapSharing scrapSharing = QScrapSharing.scrapSharing;

		BooleanExpression conditions = scrapSharing.user.userId.eq(user.getUserId());

		conditions = applyLastSharingId(lastSharingId, conditions, sharing);

		List<Sharing> results = jpaQueryFactory
			.selectFrom(sharing)
			.join(scrapSharing).on(scrapSharing.sharing.sharingId.eq(sharing.sharingId))
			.where(conditions)
			.orderBy(sharing.sharingId.desc())
			.limit(pageable.getPageSize() + 1)
			.fetch();

		return createSharingResponseDTO(pageable, results);
	}

	// ========================= 내부 메서드 =========================== //

	/**
	 * SharingResponseDTO 생성하는 내부 메서드
	 * @param pageable
	 * @param results
	 * @return
	 */
	private static SharingResponseDTO createSharingResponseDTO(Pageable pageable, List<Sharing> results) {
		boolean hasNext = results.size() > pageable.getPageSize();

		if (hasNext) {
			results.remove(results.size() - 1);
		}

		return SharingResponseDTO.from(results, hasNext);
	}

	/**
	 * 노오프셋 방식 조건 설정 내부메서드
	 * @param lastSharingId
	 * @param conditions
	 * @param sharing
	 * @return
	 */
	private static BooleanExpression applyLastSharingId(Long lastSharingId, BooleanExpression conditions,
		QSharing sharing) {
		if (lastSharingId != 0) {
			conditions = conditions.and(sharing.sharingId.lt(lastSharingId));
		}
		return conditions;
	}
	
}
