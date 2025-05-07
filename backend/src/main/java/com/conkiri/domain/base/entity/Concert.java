package com.conkiri.domain.base.entity;

import java.time.LocalDateTime;

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
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Concert {

	@Id
	@Column(name = "concert_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long concertId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "artist_id", nullable = false)
	private Artist artist;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "arena_id", nullable = false)
	private Arena arena;

	@Column(name = "concert_name", length = 100)
	private String concertName;

	@Column(name = "advanced_reservation")
	private LocalDateTime advancedReservation;

	@Column(name = "reservation")
	private LocalDateTime reservation;

	@Enumerated(EnumType.STRING)
	@Column(name = "ticketing_platform", length = 20)
	private Platform ticketingPlatform;

	@Column(name = "photo_url", length = 200)
	private String photoUrl;

	//생성자
	@Builder
	public Concert(Artist artist, Arena arena, String concertName, LocalDateTime advancedReservation,
    LocalDateTime reservation, Platform ticketingPlatform, String photoUrl) {
    	this.artist = artist;
   		this.arena = arena;
    	this.concertName = concertName;
    	this.advancedReservation = advancedReservation;
    	this.reservation = reservation;
    	this.ticketingPlatform = ticketingPlatform;
    	this.photoUrl = photoUrl;
}
}
