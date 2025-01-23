package com.conkiri.domain.sharing.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.sharing.entity.ScrapSharing;
import com.conkiri.domain.sharing.entity.Sharing;
import com.conkiri.domain.user.entity.User;

public interface ScrapSharingRepository extends JpaRepository<ScrapSharing, Long> {
	Optional<ScrapSharing> findBySharingAndUser(Sharing sharing, User user);

	boolean existsBySharingAndUser(Sharing sharing, User user);
}
