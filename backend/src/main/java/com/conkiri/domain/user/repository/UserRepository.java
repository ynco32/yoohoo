package com.conkiri.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
