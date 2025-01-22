package com.conkiri.domain.sharing.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.service.SharingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class SharingController {

	private final SharingService sharingService;

	@PostMapping("/sharing")
	@ResponseStatus(HttpStatus.CREATED)
	public void writeSharing(@RequestBody SharingRequestDTO sharingRequestDTO) {
		sharingService.writeSharing(sharingRequestDTO, null);
	}
}
