package com.conkiri.domain.view.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Section;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.domain.base.repository.SectionRepository;
import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.dto.response.SectionResponseDTO;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ViewService {

	private final ArenaRepository arenaRepository;
	private final SectionRepository sectionRepository;

	public ArenaResponseDTO getArenas() {
		List<Arena> arenas = arenaRepository.findAll();
		return ArenaResponseDTO.from(arenas);
	}

	public SectionResponseDTO getSectionsByStageType(Long arenaId, Integer stageType) {
		List<Section> sections = sectionRepository.findByArena_ArenaId(arenaId);
		return SectionResponseDTO.from(sections, stageType);
	}
}
