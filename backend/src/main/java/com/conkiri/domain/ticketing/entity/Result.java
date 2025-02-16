package com.conkiri.domain.ticketing.entity;

import java.time.LocalDateTime;

import com.conkiri.domain.ticketing.dto.response.TicketingResultResponseDTO;
import com.conkiri.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Result {

	@Id
	@Column(name = "result_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long ResultId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@Column(name = "section", length = 100)
	private String section;

	@Column(name = "seat", length = 100)
	private String seat;

	@Column(name = "ticket_rank")
	private Long ticketRank;

	@Column(name = "processing_time")
	private Long processingTime;

	@Column(name = "reserve_time")
	private LocalDateTime reserveTime;

	private Result(TicketingResultResponseDTO ticketingResultResponseDTO, User user){
		this.user = user;
		this.reserveTime = ticketingResultResponseDTO.getReserveTime();
		this.section = ticketingResultResponseDTO.getSection();
		this.seat = ticketingResultResponseDTO.getSeat();
		this.ticketRank = ticketingResultResponseDTO.getTicketRank();
		this.processingTime = ticketingResultResponseDTO.getProcessingTime();
	}

	public static Result of(TicketingResultResponseDTO ticketingResultResponseDTO, User user) {
		return new Result(ticketingResultResponseDTO, user);
	}
}
