package com.conkiri.global.auth.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import com.conkiri.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Auth {

	@Id
	@Column(name = "auth_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long authId;

	@Column(unique = true)
	private String refreshToken;

	@Column
	private LocalDateTime expiryDate;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@Column(nullable = false, length = 20)
	@ColumnDefault("'KAKAO'")
	private String provider;

	@Column(name = "provider_id", nullable = false)
	private String providerId;

	public void updateToken(String refreshToken, LocalDateTime expiryDate) {
		this.refreshToken = refreshToken;
		this.expiryDate = expiryDate;
	}

}
