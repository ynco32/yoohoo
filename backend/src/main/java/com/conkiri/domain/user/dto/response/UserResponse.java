package com.conkiri.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {

	private Long userId;
	private String email;
	private String nickname;
	private String userName;
	private String profileImageUrl;
}
