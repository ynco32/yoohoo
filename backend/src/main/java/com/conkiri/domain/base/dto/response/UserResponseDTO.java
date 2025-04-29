package com.conkiri.domain.base.dto.response;

import com.conkiri.domain.user.entity.User;

public record UserResponseDTO(
	Long userId,
	String nickname,
	String email,
	String userName,
	String level,
	int residForNextLevel
) {
	private static int calcResidForNextLevel(User user) {
		int level = Integer.parseInt(user.getLevel());
		if (level >= 1 && level <= 3) { return (10 * level - user.getReviewCount()); }
		return 0;
	}

	public static UserResponseDTO from(User user) {
		return new UserResponseDTO(
			user.getUserId(),
			user.getNickname(),
			user.getEmail(),
			user.getUserName(),
			user.getLevel(),
			calcResidForNextLevel(user)
		);
	}
}