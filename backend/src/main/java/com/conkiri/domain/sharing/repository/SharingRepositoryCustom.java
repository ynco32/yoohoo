package com.conkiri.domain.sharing.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.sharing.entity.Sharing;

public interface SharingRepositoryCustom {

	Slice<Sharing> findSharings(Concert concert, Long lastSharingId, Pageable pageable);
}
