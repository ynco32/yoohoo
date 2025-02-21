package com.conkiri.domain.user.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.conkiri.domain.user.dto.request.NicknameRequestDTO;
import com.conkiri.domain.user.service.UserService;
import com.conkiri.global.auth.token.UserPrincipal;
import com.conkiri.global.exception.dto.ExceptionMessage;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/login")
public class UserController {

	private final UserService userService;

	@PostMapping("/nickname")
	public void setNickname(
		@Valid @RequestBody NicknameRequestDTO request,
		@AuthenticationPrincipal UserPrincipal user) {
		userService.updateNickname(user.getEmail(), request.getNickname());
	}

	@Validated
	@GetMapping("/nickname/check")
	public boolean checkNicknameDuplicate(
		@NotBlank(message = ExceptionMessage.NICKNAME_NOT_EMPTY)
		@Size(min = 2, max = 10, message = ExceptionMessage.ERROR_NICKNAME_LENGTH)
		@Pattern(regexp = "^[가-힣a-zA-Z0-9]{2,10}$", message = ExceptionMessage.ERROR_NICKNAME_FORMAT)
		@RequestParam String nickname) {
		return userService.checkNicknameExists(nickname);
	}
}
