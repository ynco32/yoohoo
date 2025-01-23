package com.conkiri.domain.view.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.domain.view.dto.response.ArenaResponseDTO;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ViewService {

	private final ArenaRepository arenaRepository;

	public ArenaResponseDTO getArenas() {
		List<Arena> arenas = arenaRepository.findAll();
		return ArenaResponseDTO.from(arenas);
	}
}
