package com.conkiri.domain.sharing.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import com.conkiri.domain.base.entity.Concert;
import com.conkiri.domain.user.entity.User;
import com.conkiri.global.domain.BaseTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Entity
@Getter
@Table
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sharing extends BaseTime {

	@Id
	@Column(name = "sharing_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long sharingId;

	@Column(name = "latitude")
	private Double latitude;

	@Column(name = "longitude")
	private Double longitude;

	@Column(name = "title", length = 100)
	private String title;

	@Column(name = "content", length = 500)
	private String content;

	@Column(name = "photo_url", length = 250)
	private String photoUrl;

	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	@ColumnDefault("'BEFORE'")
	private Status status;

	@Column(name = "start_time")
	private LocalDateTime startTime;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "concert_id")
	private Concert concert;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;
}
