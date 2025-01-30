package com.conkiri.domain.sharing.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.sharing.entity.Sharing;
import com.conkiri.domain.user.entity.User;

public interface SharingRepositoryCustom {

	Slice<Sharing> findSharings(Concert concert, Long lastSharingId, Pageable pageable);

	Slice<Sharing> findWroteSharings(User user, Concert concert, Long lastSharingId, Pageable pageable);
}
