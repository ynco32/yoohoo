package com.conkiri.domain.base.entity;

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
public class Layout {

	@Id
	@Column(name = "layout_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long layoutId;

	@Column(name = "layout_name", length = 100)
	private String layoutName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "arena_id", nullable = false)
	private Arena arena;
}
