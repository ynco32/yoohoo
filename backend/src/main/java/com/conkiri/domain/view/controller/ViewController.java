package com.conkiri.domain.view.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.view.dto.response.ArenaResponseDTO;
import com.conkiri.domain.view.service.ViewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/view")
public class ViewController {

	private final ViewService viewService;

	@GetMapping("/arenas")
	public ArenaResponseDTO getArenas(){
		return viewService.getArenas();
	}
}
