package com.conkiri.global.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.user.entity.User;
import com.conkiri.global.auth.entity.Auth;

public interface AuthRepository extends JpaRepository<Auth, String> {

	void deleteByUserEmail(String userEmail);

	Optional<Auth> findByUser(User user);
}
