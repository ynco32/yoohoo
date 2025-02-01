package com.conkiri.domain.sharing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.sharing.entity.Sharing;

public interface SharingRepository extends JpaRepository<Sharing, Long> {

	List<Sharing> findByConcert(Concert concert);
}