package com.conkiri.domain.sharing.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingStatusUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingUpdateRequestDTO;
import com.conkiri.domain.sharing.service.SharingService;

import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sharing")
public class SharingController {

	private final SharingService sharingService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public void writeSharing(@RequestBody SharingRequestDTO sharingRequestDTO) {
		sharingService.writeSharing(sharingRequestDTO, null);
	}

	@DeleteMapping("/{sharingId}")
	public void deleteSharing(@PathVariable("sharingId") Long sharingId) {
		sharingService.deleteSharing(sharingId);
	}

	@PutMapping("/{sharingId}")
	public void updateSharing(@PathVariable("sharingId") Long sharingId, @RequestBody SharingUpdateRequestDTO sharingUpdateRequestDTO) {
		sharingService.updateSharing(sharingId, sharingUpdateRequestDTO);
	}

	@PatchMapping("/{sharingId}/status")
	public void updateSharingStatus(@PathVariable("sharingId") Long sharingId, @RequestBody SharingStatusUpdateRequestDTO sharingStatusUpdateRequestDTO) {
		String status = sharingStatusUpdateRequestDTO.getStatus();
		sharingService.updateSharingStatus(sharingId, status);
	}
}
