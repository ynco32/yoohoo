package com.conkiri.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
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

	@Column(name = "role", length = 20)
	private String role;

	private User(String email, String userName, String nickname) {
		this.email = email;
		this.userName = userName;
		this.nickname = nickname;
		this.role = "ROLE_USER";
	}

	public static User of(String email, String userName, String nickname) {
		return new User(email, userName, nickname);
	}

	public void updateNickname(String nickname) {
		this.nickname = nickname;
	}

}
