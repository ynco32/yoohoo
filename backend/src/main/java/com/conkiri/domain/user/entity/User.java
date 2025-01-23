package com.conkiri.domain.user.entity;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Entity
@Getter
@Table
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

	@Column(name = "level", length = 100)
	private String level;

	@Column(name = "tier", length = 100)
	private String tier;

	@Column(nullable = false, length = 20)
	@ColumnDefault("'KAKAO'")
	private String provider;

	@Column(name = "provider_id", nullable = false)
	private String providerId;

	@Column(name = "profile_url")
	private String profileUrl;

	public void updateNickname(String nickname) {
		this.nickname = nickname;
	}
}
