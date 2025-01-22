package com.conkiri.domain.sharing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.sharing.entity.Sharing;

public interface SharingRepository extends JpaRepository<Sharing, Long> {

}
