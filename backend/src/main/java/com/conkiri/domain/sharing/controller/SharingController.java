package com.conkiri.domain.sharing.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.conkiri.domain.sharing.dto.request.CommentRequestDTO;
import com.conkiri.domain.sharing.dto.request.CommentUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingStatusUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.request.SharingUpdateRequestDTO;
import com.conkiri.domain.sharing.dto.response.CommentResponseDTO;
import com.conkiri.domain.sharing.dto.response.SharingDetailResponseDTO;
import com.conkiri.domain.sharing.dto.response.SharingResponseDTO;
import com.conkiri.domain.sharing.service.SharingService;
import com.conkiri.global.auth.token.CustomOAuth2User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sharing")
public class SharingController {

	private final SharingService sharingService;

	/**
	 * 나눔 게시글 등록
	 * @param sharingRequestDTO
	 */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public void writeSharing(
		@Valid @RequestPart SharingRequestDTO sharingRequestDTO,
		@RequestPart MultipartFile file,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.writeSharing(sharingRequestDTO, customOAuth2User.getUserId(), file);
	}

	/**
	 * 나눔 게시글 삭제
	 * @param sharingId
	 */
	@DeleteMapping("/{sharingId}")
	public void deleteSharing(
		@PathVariable("sharingId") Long sharingId,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.deleteSharing(sharingId, customOAuth2User.getUserId());
	}

	/**
	 * 나눔 게시글 수정
	 * @param sharingId
	 * @param sharingUpdateRequestDTO
	 */
	@PutMapping("/{sharingId}")
	public void updateSharing(
		@PathVariable("sharingId") Long sharingId,
		@Valid @RequestPart SharingUpdateRequestDTO sharingUpdateRequestDTO,
		@RequestPart MultipartFile file,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.updateSharing(sharingId, sharingUpdateRequestDTO, file, customOAuth2User.getUserId());
	}

	/**
	 * 나눔 게시글 마감 여부 수정
	 * @param sharingId
	 * @param sharingStatusUpdateRequestDTO
	 */
	@PatchMapping("/{sharingId}/status")
	public void updateSharingStatus(
		@PathVariable("sharingId") Long sharingId,
		@Valid @RequestBody SharingStatusUpdateRequestDTO sharingStatusUpdateRequestDTO,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.updateSharingStatus(sharingId, sharingStatusUpdateRequestDTO.getStatus(), customOAuth2User.getUserId());
	}

	/**
	 * 해당 공연의 나눔 게시글 목록 조회
	 * @param concertId
	 * @param lastSharingId
	 * @return
	 */
	@GetMapping("/{concertId}/{lastSharingId}")
	public SharingResponseDTO getSharingList(
		@PathVariable("concertId") Long concertId,
		@PathVariable("lastSharingId") Long lastSharingId
	) {
		return sharingService.getSharingList(concertId, lastSharingId);
	}

	/**
	 * 나눔 게시글 상세 조회
	 * @param sharingId
	 * @return
	 */
	@GetMapping("/detail/{sharingId}")
	public SharingDetailResponseDTO getSharing(@PathVariable("sharingId") Long sharingId) {
		return sharingService.getSharing(sharingId);
	}

	/**
	 * 해당 나눔 게시글의 댓글 목록 조회
	 * @param sharingId
	 * @param lastCommentId
	 * @return
	 */
	@GetMapping("/{sharingId}/comment/{lastCommentId}")
	public CommentResponseDTO getSharingCommentList(
		@PathVariable("sharingId") Long sharingId,
		@PathVariable(value = "lastCommentId", required = false) Long lastCommentId
	) {
		return sharingService.getSharingCommentList(sharingId, lastCommentId);
	}

	/**
	 * 나눔 게시글 스크랩
	 * @param sharingId
	 * @param customOAuth2User
	 */
	@PostMapping("/{sharingId}/scrap/{userId}")
	@ResponseStatus(HttpStatus.CREATED)
	public void scrapSharing(
		@PathVariable("sharingId") Long sharingId,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.scrapSharing(sharingId, customOAuth2User.getUserId());
	}

	/**
	 * 나눔 게시글 스크랩 취소
	 * @param sharingId
	 * @param userPrincipal
	 */
	@DeleteMapping("/{sharingId}/scrap")
	public void cancelScrapSharing(
		@PathVariable("sharingId") Long sharingId,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal
	) {
		sharingService.cancelScrapSharing(sharingId, userPrincipal.getUserId());
	}

	/**
	 * 나눔 게시글에 댓글 등록
	 * @param commentRequestDTO
	 */
	@PostMapping("/comment")
	@ResponseStatus(HttpStatus.CREATED)
	public void writeComment(
		@Valid @RequestBody CommentRequestDTO commentRequestDTO,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.writeComment(commentRequestDTO, customOAuth2User.getUserId());
	}

	/**
	 * 댓글 수정
	 * @param commentId
	 * @param commentUpdateRequestDTO
	 */
	@PutMapping("/comment/{commentId}")
	public void updateComment(
		@PathVariable("commentId") Long commentId,
		@Valid @RequestBody CommentUpdateRequestDTO commentUpdateRequestDTO,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.updateComment(commentId, commentUpdateRequestDTO, customOAuth2User.getUserId());
	}

	/**
	 * 댓글 삭제
	 * @param commentId
	 */
	@DeleteMapping("/comment/{commentId}")
	public void deleteComment(
		@PathVariable("commentId") Long commentId,
		@AuthenticationPrincipal CustomOAuth2User customOAuth2User
	) {
		sharingService.deleteComment(commentId, customOAuth2User.getUserId());
	}

	/**
	 * 회원이 작성한 해당 공연의 나눔 게시글 목록 조회
	 * @param userPrincipal
	 * @param concertId
	 * @param lastSharingId
	 * @return
	 */
	@GetMapping("/wrote/{concertId}/{lastSharingId}")
	public SharingResponseDTO getWroteSharing(
		@PathVariable("concertId") Long concertId,
		@PathVariable("lastSharingId") Long lastSharingId,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal
		) {
		return sharingService.getWroteSharingList(userPrincipal.getUserId(), concertId, lastSharingId);
	}

	/**
	 * 회원이 스크랩한 해당 공연의 나눔 게시글 목록 조회
	 * @param userPrincipal
	 * @param concertId
	 * @param lastSharingId
	 * @return
	 */
	@GetMapping("/scrap/{concertId}/{lastSharingId}")
	public SharingResponseDTO getScrapedSharing(
		@PathVariable("concertId") Long concertId,
		@PathVariable("lastSharingId") Long lastSharingId,
		@AuthenticationPrincipal CustomOAuth2User userPrincipal
		) {
		return sharingService.getScrappedSharingList(userPrincipal.getUserId(), concertId, lastSharingId);
	}

}
