package com.conkiri.domain.base.dto.response;

import com.conkiri.domain.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

	private Long userId;
	private String nickname;
	private String email;
	private String userName;
	private String level;
	private String tier;
	private String profileUrl;
	private int residForNextLevel;

	private static int calcResidForNextLevel(User user) {
		int level = Integer.parseInt(user.getLevel());
		if (level >= 1 && level <= 3) { return (10 * level - user.getReviewCount()); }
		return 0;
	}

	public static UserResponseDTO from(User user) {
		return UserResponseDTO.builder()
			.userId(user.getUserId())
			.nickname(user.getNickname())
			.email(user.getEmail())
			.userName(user.getUserName())
			.level(user.getLevel())
			.tier(user.getTier())
			.profileUrl(user.getProfileUrl())
			.residForNextLevel(calcResidForNextLevel(user))
			.build();
	}
}
