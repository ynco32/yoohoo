package com.conkiri.domain.sharing.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.sharing.entity.Comment;
import com.conkiri.domain.sharing.entity.Sharing;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findCommentsBySharing(Sharing sharing);

}
