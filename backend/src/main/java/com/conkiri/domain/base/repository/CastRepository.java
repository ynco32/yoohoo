package com.conkiri.domain.base.repository;

import com.conkiri.domain.base.entity.Cast;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CastRepository extends JpaRepository<Cast, Long> {
    List<Cast> findByConcertConcertId(Long concertId);
}
