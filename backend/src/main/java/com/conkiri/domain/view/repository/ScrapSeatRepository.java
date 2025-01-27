package com.conkiri.domain.view.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.view.entity.ScrapSeat;

public interface ScrapSeatRepository extends JpaRepository<ScrapSeat, Long> {
	boolean existsByUserAndSeat(User user, Seat seat);
	Optional<ScrapSeat> findByUserAndSeat(User user, Seat seat);
}
