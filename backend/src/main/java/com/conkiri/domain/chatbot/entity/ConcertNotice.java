package com.conkiri.domain.chatbot.entity;

import com.conkiri.domain.base.entity.Concert;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CONCERT_NOTICE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ConcertNotice {
    @Id
    @Column(name = "concert_notice_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long concertNoticeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concert_id", nullable = false)
    private Concert concert;

    @Column(name = "original_url")
    private String originalUrl;

    @Column(name = "notice_text", columnDefinition = "TEXT")
    private String noticeText;

    @Column(name = "notice_image_url", columnDefinition = "TEXT")
    private String noticeImageUrl; // s3 주소

    @Builder
    public ConcertNotice(Concert concert, String originalUrl, String noticeText, String noticeImageUrl) {
        this.concert = concert;
        this.originalUrl = originalUrl;
        this.noticeText = noticeText;
        this.noticeImageUrl = noticeImageUrl;
    }

}
