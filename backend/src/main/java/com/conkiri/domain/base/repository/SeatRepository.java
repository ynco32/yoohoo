package com.conkiri.domain.base.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.entity.Section;

public interface SeatRepository extends JpaRepository<Seat, Long> {
	List<Seat> findBySection(Section section);
	Optional<Seat> findByRowLineAndColumnLineAndSection(Integer rowLine, Integer columnLine, Section section);
}
