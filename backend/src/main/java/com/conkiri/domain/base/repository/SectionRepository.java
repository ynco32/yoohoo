package com.conkiri.domain.base.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Section;

public interface SectionRepository extends JpaRepository<Section, Long> {

	List<Section> findByArena(Arena arena);
}
