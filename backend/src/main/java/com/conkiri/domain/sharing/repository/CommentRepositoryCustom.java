package com.conkiri.domain.sharing.repository;

import org.springframework.data.domain.Pageable;

import com.conkiri.domain.sharing.dto.response.CommentResponseDTO;
import com.conkiri.domain.sharing.entity.Sharing;

public interface CommentRepositoryCustom {

	CommentResponseDTO findComments(Sharing sharing, Long lastCommentId, Pageable pageable);
}
