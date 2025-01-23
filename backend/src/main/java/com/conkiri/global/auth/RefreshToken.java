package com.conkiri.global.auth;

import java.time.LocalDateTime;

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

@Entity
@Getter
@Builder
@Table(name = "refresh_tokens")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String refreshToken;

	@Column(nullable = false)
	private String userEmail;

	@Column(nullable = false)
	private LocalDateTime expiryDate;

	public void updateToken(String newRefreshToken, LocalDateTime expiryDate) {
		this.refreshToken = newRefreshToken;
		this.expiryDate = expiryDate;
	}
}
