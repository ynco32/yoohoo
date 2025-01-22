package com.conkiri.domain.sharing.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.service.SharingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SharingController {

	private final SharingService sharingService;

	@PostMapping("/api/v1/sharing")
	@ResponseStatus(HttpStatus.CREATED)
	public void writeSharing(@RequestBody SharingRequestDTO sharingRequestDTO) {
		sharingService.writeSharing(sharingRequestDTO, null);
	}
}
