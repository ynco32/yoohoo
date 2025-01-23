package com.conkiri.global.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
	Optional<RefreshToken> findByUserEmail(String userEmail);
	void deleteByUserEmail(String userEmail);
}
