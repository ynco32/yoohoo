package com.conkiri.domain.sharing.repository;

import org.springframework.data.domain.Pageable;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.user.entity.User;

public interface SharingRepositoryCustom {

	SharingResponseDTO findSharings(Concert concert, Long lastSharingId, Pageable pageable);

	SharingResponseDTO findWroteSharings(User user, Concert concert, Long lastSharingId, Pageable pageable);

	SharingResponseDTO findScrappedSharings(User user, Concert concert, Long lastSharingId, Pageable pageable);

	SharingResponseDTO findWroteSharingsInMyPage(User user, Long lastSharingId, Pageable pageable);

	SharingResponseDTO findScrappedSharingsInMyPage(User user, Long lastSharingId, Pageable pageable);
}
