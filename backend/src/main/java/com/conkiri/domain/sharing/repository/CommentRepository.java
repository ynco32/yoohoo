package com.conkiri.domain.sharing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.sharing.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long>, CommentRepositoryCustom {
}
