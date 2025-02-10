package com.conkiri.domain.congestion.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.congestion.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
	List<Location> findByArena(Arena arena);
}
