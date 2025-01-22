package com.conkiri.domain.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Concert;

public interface ConcertRepository extends JpaRepository<Concert, Long> {
}
