package com.conkiri.domain.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.conkiri.domain.notification.entity.Notification;
import com.conkiri.domain.user.entity.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {


	List<Notification> findByUserOrderByCreatedAtDesc(User user);

	boolean existsByUserAndIsRead(User user, boolean isRead);

	@Modifying
	@Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
	void markAllAsRead(@Param("user") User user);
}