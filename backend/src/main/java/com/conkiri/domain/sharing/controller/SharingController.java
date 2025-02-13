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
import org.springframework.web.bind.annotation.RequestParam;
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
import com.conkiri.global.auth.token.UserPrincipal;

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
	public Long writeSharing(
		@Valid @RequestPart SharingRequestDTO sharingRequestDTO,
		@RequestPart MultipartFile file,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		System.out.println("요청이 왔을 때 시간 : " + sharingRequestDTO.getStartTime());
		return sharingService.writeSharing(sharingRequestDTO, userPrincipal.getUserId(), file);
	}

	/**
	 * 나눔 게시글 삭제
	 * @param sharingId
	 */
	@DeleteMapping("/{sharingId}")
	public void deleteSharing(
		@PathVariable("sharingId") Long sharingId,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		sharingService.deleteSharing(sharingId, userPrincipal.getUserId());
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
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		sharingService.updateSharing(sharingId, sharingUpdateRequestDTO, file, userPrincipal.getUserId());
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
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		sharingService.updateSharingStatus(sharingId, sharingStatusUpdateRequestDTO.getStatus(), userPrincipal.getUserId());
	}

	/**
	 * 해당 공연의 나눔 게시글 목록 조회
	 * @param concertId
	 * @param lastSharingId
	 * @return
	 */
	@GetMapping("/{concertId}")
	public SharingResponseDTO getSharingList(
		@PathVariable("concertId") Long concertId,
		@RequestParam(value = "last", required = false) Long lastSharingId) {
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
	@GetMapping("/{sharingId}/comment")
	public CommentResponseDTO getSharingCommentList(
		@PathVariable("sharingId") Long sharingId,
		@RequestParam(value = "last", required = false) Long lastCommentId) {
		return sharingService.getSharingCommentList(sharingId, lastCommentId);
	}

	/**
	 * 나눔 게시글 스크랩
	 * @param sharingId
	 * @param userPrincipal
	 */
	@PostMapping("/{sharingId}/scrap")
	@ResponseStatus(HttpStatus.CREATED)
	public void scrapSharing(
		@PathVariable("sharingId") Long sharingId,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		sharingService.scrapSharing(sharingId, userPrincipal.getUserId());
	}

	/**
	 * 나눔 게시글 스크랩 취소
	 * @param sharingId
	 * @param userPrincipal
	 */
	@DeleteMapping("/{sharingId}/scrap")
	public void cancelScrapSharing(
		@PathVariable("sharingId") Long sharingId,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
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
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		sharingService.writeComment(commentRequestDTO, userPrincipal.getUserId());
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
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		sharingService.updateComment(commentId, commentUpdateRequestDTO, userPrincipal.getUserId());
	}

	/**
	 * 댓글 삭제
	 * @param commentId
	 */
	@DeleteMapping("/comment/{commentId}")
	public void deleteComment(
		@PathVariable("commentId") Long commentId,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		sharingService.deleteComment(commentId, userPrincipal.getUserId());
	}

	/**
	 * 회원이 작성한 해당 공연의 나눔 게시글 목록 조회
	 * @param userPrincipal
	 * @param concertId
	 * @param lastSharingId
	 * @return
	 */
	@GetMapping("/wrote/{concertId}")
	public SharingResponseDTO getWroteSharing(
		@PathVariable("concertId") Long concertId,
		@RequestParam(value = "last", required = false) Long lastSharingId,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		return sharingService.getWroteSharingList(userPrincipal.getUserId(), concertId, lastSharingId);
	}

	/**
	 * 회원이 스크랩한 해당 공연의 나눔 게시글 목록 조회
	 * @param userPrincipal
	 * @param concertId
	 * @param lastSharingId
	 * @return
	 */
	@GetMapping("/scrap/{concertId}")
	public SharingResponseDTO getScrappedSharing(
		@PathVariable("concertId") Long concertId,
		@RequestParam(value = "last", required = false) Long lastSharingId,
		@AuthenticationPrincipal UserPrincipal userPrincipal) {
		return sharingService.getScrappedSharingList(userPrincipal.getUserId(), concertId, lastSharingId);
	}

}
