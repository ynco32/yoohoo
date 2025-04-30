package com.conkiri.domain.base.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.dto.response.ArenaResponseDTO;
import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.repository.ArenaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArenaService {

	private final ArenaRepository arenaRepository;

	public ArenaResponseDTO getArenas() {
		List<Arena> arenas = arenaRepository.findAll();
		return ArenaResponseDTO.from(arenas);
	}
}
