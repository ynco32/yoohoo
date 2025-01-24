package com.conkiri.domain.sharing.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.sharing.dto.request.CommentRequestDTO;
import com.conkiri.domain.sharing.dto.request.CommentUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingStatusUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.response.CommentResponseDTO;
import com.conkiri.domain.sharing.dto.response.SharingDetailResponseDTO;
import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.service.SharingService;

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

	@GetMapping("/{concertId}")
	public SharingResponseDTO getSharingList(@PathVariable("concertId") Long concertId) {
		return sharingService.getSharingList(concertId);
	}

	@GetMapping("/detail/{sharingId}")
	public SharingDetailResponseDTO getSharing(@PathVariable("sharingId") Long sharingId) {
		return sharingService.getSharing(sharingId);
	}

	@GetMapping("/{sharingId}/comment")
	public CommentResponseDTO getSharingCommentList(@PathVariable("sharingId") Long sharingId) {
		return sharingService.getSharingCommentList(sharingId);
	}

	@PostMapping("/{sharingId}/scrap/{userId}")
	@ResponseStatus(HttpStatus.CREATED)
	public void scrapSharing(@PathVariable("sharingId") Long sharingId, @PathVariable("userId") Long userId) {
		sharingService.scrapSharing(sharingId, userId);
	}

	@DeleteMapping("/{sharingId}/scrap/{userId}")
	public void cancelScrapSharing(@PathVariable("sharingId") Long sharingId, @PathVariable("userId") Long userId) {
		sharingService.cancelScrapSharing(sharingId, userId);
	}

	@PostMapping("/comment")
	@ResponseStatus(HttpStatus.CREATED)
	public void writeComment(@RequestBody CommentRequestDTO commentRequestDTO) {
		sharingService.writeComment(commentRequestDTO);
	}

	@PutMapping("/comment/{commentId}")
	public void updateComment(@PathVariable("commentId") Long commentId, @RequestBody CommentUpdateRequestDTO commentUpdateRequestDTO) {
		sharingService.updateComment(commentId, commentUpdateRequestDTO);
	}

	@DeleteMapping("/comment/{commentId}")
	public void deleteComment(@PathVariable("commentId") Long commentId) {
		sharingService.deleteComment(commentId);
	}

}
