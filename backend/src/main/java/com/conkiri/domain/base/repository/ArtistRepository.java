package com.conkiri.domain.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Artist;

public interface ArtistRepository extends JpaRepository<Artist, Long>, ArtistRepositoryCustom {
}