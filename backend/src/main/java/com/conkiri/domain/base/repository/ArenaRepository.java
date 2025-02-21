package com.conkiri.domain.base.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Arena;

public interface ArenaRepository extends JpaRepository<Arena, Long> {

	Optional<Arena> findArenaByArenaId(Long arenaId);
}
