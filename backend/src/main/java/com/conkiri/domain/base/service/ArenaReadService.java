package com.conkiri.domain.base.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.repository.ArenaRepository;
import com.conkiri.global.exception.view.ArenaNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArenaReadService {

	private final ArenaRepository arenaRepository;

	public Arena findArenaByAreaIdOrElseThrow(Long arenaId) {
		return arenaRepository.findArenaByArenaId(arenaId)
			.orElseThrow(ArenaNotFoundException::new);
	}
}
