package com.conkiri.domain.sharing.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.sharing.dto.request.CommentRequestDTO;
import com.conkiri.domain.sharing.dto.request.CommentUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.response.CommentResponseDTO;
import com.conkiri.domain.sharing.dto.response.SharingDetailResponseDTO;
import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.entity.Comment;
import com.conkiri.domain.sharing.entity.ScrapSharing;
import com.conkiri.domain.sharing.entity.Sharing;
import com.conkiri.domain.sharing.repository.CommentRepository;
import com.conkiri.domain.sharing.repository.ScrapSharingRepository;
import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.global.exception.concert.ConcertNotFoundException;
import com.conkiri.global.exception.sharing.AlreadyExistScrapSharingException;
import com.conkiri.global.exception.sharing.CommentNotFoundException;
import com.conkiri.global.exception.sharing.ScrapSharingNotFoundException;
import com.conkiri.global.exception.sharing.SharingNotFoundException;
import com.conkiri.global.exception.user.UserNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SharingService {

	private final SharingRepository sharingRepository;
	private final UserRepository userRepository;
	private final ConcertRepository concertRepository;
	private final CommentRepository commentRepository;
	private final ScrapSharingRepository scrapSharingRepository;

	/**
	 * 나눔 게시글 작성
	 * @param sharingRequestDTO
	 * @param photoUrl
	 */
	public void writeSharing(SharingRequestDTO sharingRequestDTO, String photoUrl) {

		User user = findUserByIdOrElseThrow(sharingRequestDTO.getUserId());

		Concert concert = findConcertByIdOrElseThrow(sharingRequestDTO.getConcertId());

		Sharing sharing = Sharing.of(sharingRequestDTO, photoUrl, concert, user);
		sharingRepository.save(sharing);
	}

	/**
	 * 나눔 게시글 삭제
	 * @param sharingId
	 */
	public void deleteSharing(Long sharingId) {
		validateSharingExistByIdOrElseThrow(sharingId);
		sharingRepository.deleteById(sharingId);
	}

	/**
	 * 나눔 게시글 수정
	 * @param sharingId
	 * @param sharingUpdateRequestDTO
	 */
	public void updateSharing(Long sharingId, SharingUpdateRequestDTO sharingUpdateRequestDTO) {
		Sharing sharing = findSharingByIdOrElseThrow(sharingId);

		sharing.update(sharingUpdateRequestDTO, null);
	}

	/**
	 * 나눔 게시글 마감 여부 변경
	 * @param sharingId
	 * @param status
	 */
	public void updateSharingStatus(Long sharingId, String status) {
		Sharing sharing = findSharingByIdOrElseThrow(sharingId);

		sharing.updateStatus(status);
	}

	/**
	 * 해당 공연 나눔 게시글 리스트 조회
	 * @param concertId
	 * @return
	 */
	public SharingResponseDTO getSharingList(Long concertId, Long lastSharingId) {
		Pageable pageable = Pageable.ofSize(10);

		Concert concert = findConcertByIdOrElseThrow(concertId);

		Slice<Sharing> sharings = sharingRepository.findSharings(concert, lastSharingId, pageable);
		return SharingResponseDTO.from(sharings);
	}

	/**
	 * 나눔 게시글 상세 조회
	 * @param sharingId
	 * @return
	 */
	public SharingDetailResponseDTO getSharing(Long sharingId) {
		Sharing sharing = findSharingByIdOrElseThrow(sharingId);
		return SharingDetailResponseDTO.from(sharing);
	}

	/**
	 * 해당 나눔 게시글의 댓글 리스트 조회
	 * @param sharingId
	 * @return
	 */
	public CommentResponseDTO getSharingCommentList(Long sharingId, Long lastCommentId) {
		Pageable pageable = Pageable.ofSize(10);

		Sharing sharing = findSharingByIdOrElseThrow(sharingId);

		Slice<Comment> comments = commentRepository.findComments(sharing, lastCommentId, pageable);

		return CommentResponseDTO.from(comments);
	}

	/**
	 * 나눔 게시글 스크랩
	 * @param sharingId
	 * @param userId
	 */
	public void scrapSharing(Long sharingId, Long userId) {
		Sharing sharing = findSharingByIdOrElseThrow(sharingId);
		User user = findUserByIdOrElseThrow(userId);

		validateScrapSharingExistOrElseThrow(sharing, user);

		ScrapSharing scrapSharing = ScrapSharing.of(sharing, user);

		scrapSharingRepository.save(scrapSharing);
	}

	/**
	 * 나눔 게시글 스크랩 취소
	 * @param sharingId
	 * @param userId
	 */
	public void cancelScrapSharing(Long sharingId, Long userId) {
		Sharing sharing = findSharingByIdOrElseThrow(sharingId);
		User user = findUserByIdOrElseThrow(userId);

		ScrapSharing scrapSharing = findScrapSharingBySharingAndUser(sharing, user);

		scrapSharingRepository.delete(scrapSharing);
	}

	/**
	 * 댓글 작성
	 * @param commentRequestDTO
	 */
	public void writeComment(CommentRequestDTO commentRequestDTO) {
		Sharing sharing = findSharingByIdOrElseThrow(commentRequestDTO.getSharingId());
		User user = findUserByIdOrElseThrow(commentRequestDTO.getUserId());

		Comment comment = Comment.of(commentRequestDTO, sharing, user);
		commentRepository.save(comment);

	}

	/**
	 * 댓글 수정
	 * @param commentId
	 * @param commentUpdateRequestDTO
	 */
	public void updateComment(Long commentId, CommentUpdateRequestDTO commentUpdateRequestDTO) {
		Comment comment = findCommentByIdOrElseThrow(commentId);

		comment.update(commentUpdateRequestDTO);
	}

	/**
	 * 댓글 삭제
	 * @param commentId
	 */
	public void deleteComment(Long commentId) {
		Comment comment = findCommentByIdOrElseThrow(commentId);

		commentRepository.delete(comment);
	}

	/**
	 * 회원이 등록한 해당 공연의 나눔 게시글 조회
	 * @param concertId
	 * @param userId
	 * @param lastSharingId
	 * @return
	 */
	public SharingResponseDTO getWroteSharingList(Long userId, Long concertId, Long lastSharingId) {
		Pageable pageable = Pageable.ofSize(10);

		User user = findUserByIdOrElseThrow(userId);
		Concert concert = findConcertByIdOrElseThrow(concertId);

		Slice<Sharing> sharings = sharingRepository.findWroteSharings(user, concert, lastSharingId, pageable);
		return SharingResponseDTO.from(sharings);
	}

	// ===============================================내부 메서드===================================================== //

	/**
	 * 유저를 조회하는 내부 메서드
	 * @param userId
	 */
	private User findUserByIdOrElseThrow(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(UserNotFoundException::new);
	}

	/**
	 * 공연을 조회하는 내부 메서드
	 * @param concertId
	 */
	private Concert findConcertByIdOrElseThrow(Long concertId) {
		return concertRepository.findById(concertId)
			.orElseThrow(ConcertNotFoundException::new);
	}

	/**
	 * 나눔 게시글 조회하는 내부 메서드
	 * @param sharingId
	 * @return
	 */
	private Sharing findSharingByIdOrElseThrow(Long sharingId) {
		return sharingRepository.findById(sharingId)
			.orElseThrow(SharingNotFoundException::new);
	}

	/**
	 * 나눔 게시글이 존재하는지 검증하는 내부 메서드
	 * @param sharingId
	 */
	private void validateSharingExistByIdOrElseThrow(Long sharingId) {
		if (!sharingRepository.existsById(sharingId)) {
			throw new SharingNotFoundException();
		}
	}

	/**
	 * 스크랩이 존재하는지 검증하는 내부 메서드
	 * @param sharing
	 * @param user
	 */
	private void validateScrapSharingExistOrElseThrow(Sharing sharing, User user) {
		if (scrapSharingRepository.existsBySharingAndUser(sharing, user)) {
			throw new AlreadyExistScrapSharingException();
		}
	}

	/**
	 * 나눔 게시글 스크랩을 조회하는 내부 메서드
	 * @param sharing
	 * @param user
	 * @return
	 */
	private ScrapSharing findScrapSharingBySharingAndUser(Sharing sharing, User user) {
		return scrapSharingRepository.findBySharingAndUser(sharing, user)
			.orElseThrow(ScrapSharingNotFoundException::new);
	}

	/**
	 * 댓글을 조회하는 내부 메서드
	 * @param commentId
	 * @return
	 */
	private Comment findCommentByIdOrElseThrow(Long commentId) {
		return commentRepository.findById(commentId)
			.orElseThrow(CommentNotFoundException::new);
	}
}

