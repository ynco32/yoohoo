package com.conkiri.domain.sharing.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.entity.Sharing;
import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.user.repository.UserRepository;
import com.conkiri.global.exception.concert.ConcertNotFoundException;
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
		validateSharingExistById(sharingId);
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
	public SharingResponseDTO getSharingList(Long concertId) {

		Concert concert = findConcertByIdOrElseThrow(concertId);

		List<Sharing> sharings = sharingRepository.findByConcert(concert);
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
	private void validateSharingExistById(Long sharingId) {
		if (!sharingRepository.existsById(sharingId)) {
			throw new SharingNotFoundException();
		}
	}
}

