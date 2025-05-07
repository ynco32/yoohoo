package com.conkiri.domain.base.entity;

import com.conkiri.global.common.BaseTime;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "CONCERT_DETAIL")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ConcertDetail extends BaseTime {

    @Id
    @Column(name = "concert_detail_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long concertDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concert_id", nullable = false)
    private Concert concert;

    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Builder
    public ConcertDetail(Concert concert, LocalDateTime startTime) {
        this.concert = concert;
        this.startTime = startTime;
    }
}