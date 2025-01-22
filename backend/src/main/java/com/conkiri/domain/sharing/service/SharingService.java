package com.conkiri.domain.sharing.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.base.repository.ConcertRepository;
import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
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

		User user = userRepository.findById(sharingRequestDTO.getUserId())
				.orElseThrow(UserNotFoundException::new);

		Concert concert = concertRepository.findById(sharingRequestDTO.getConcertId())
				.orElseThrow(ConcertNotFoundException::new);

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
	 * 나눔 게시글이 존재하는지 검증하는 내부 메서드
	 * @param sharingId
	 */
	private void validateSharingExistById(Long sharingId) {
		if (!sharingRepository.existsById(sharingId)) {
			throw new SharingNotFoundException();
		}
	}
}
