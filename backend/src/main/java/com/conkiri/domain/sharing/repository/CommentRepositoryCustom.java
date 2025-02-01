package com.conkiri.domain.sharing.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import com.conkiri.domain.sharing.entity.Comment;
import com.conkiri.domain.sharing.entity.Sharing;

public interface CommentRepositoryCustom {

	Slice<Comment> findComments(Sharing sharing, Long lastCommentId, Pageable pageable);
}
