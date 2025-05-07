package com.conkiri.domain.base.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.conkiri.domain.base.entity.Artist;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    
    Optional<Artist> findByArtistName(String artistName);
}