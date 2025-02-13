package com.conkiri.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {

	@Id
	@Column(name = "user_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	@Column(name = "nickname", length = 100)
	private String nickname;

	@Column(name = "email", length = 100)
	private String email;

	@Column(name = "user_name", length = 100)
	private String userName;

	@Column(name = "review_count")
	private Integer reviewCount = 0;

	@Column(name = "level", length = 100)
	private String level = "1";

	@Column(name = "tier", length = 100)
	private String tier;

	@Column(name = "profile_url")
	private String profileUrl;

	public void updateNickname(String nickname) {
		this.nickname = nickname;
	}

	public void incrementReviewCount(int count) {
		this.reviewCount = count + 1;
		updateViewLevel();
	}

	public void decrementReviewCount(int count) {
		this.reviewCount = count - 1;
		updateViewLevel();
	}

	private void updateViewLevel() {
		if (reviewCount >= 30) {
			this.level = "4";
		} else if (reviewCount >= 20) {
			this.level = "3";
		} else if (reviewCount >= 10) {
			this.level = "2";
		} else {
			this.level = "1";
		}
	}
}
