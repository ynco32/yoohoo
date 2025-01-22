package com.conkiri.domain.sharing.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.entity.Sharing;
import com.conkiri.domain.sharing.repository.SharingRepository;
import com.conkiri.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SharingService {

	private final SharingRepository sharingRepository;

	@Transactional
	public void writeSharing(SharingRequestDTO sharingRequestDTO, String photoUrl) {

		/*
		질문사항
		DTO에서 받아온 concertId, userId를 이용해서 User 객체를 가져와야 하는데,
		1. 서비스에서 User 객체를 가져오는 것이 적절한지,
		2. 그러면 Entity에서 구현한 정적 팩토리 메서드에는 어떤 처리를 해주어야 하는지,
		3. 지금은 UserRepository가 구현되어 있지 않아서 find메서드를 사용할 수 없는 것이 맞는지
		 */

		Sharing sharing = Sharing.of(sharingRequestDTO, photoUrl);
		sharingRepository.save(sharing);
	}
}
