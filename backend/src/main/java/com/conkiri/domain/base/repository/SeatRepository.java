package com.conkiri.domain.base.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {

	Optional<Seat> findSeatBySectionAndRowLineAndColumnLineAndArena_ArenaId(String section, Long row, Long column, Long arenaId);
}
