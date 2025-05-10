package com.conkiri.domain.base.entity;

import com.conkiri.domain.base.entity.Artist;
import com.conkiri.domain.base.entity.Concert;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CAST")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cast {
    @Id
    @Column(name = "cast_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long castId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concert_id", nullable = false)
    private Concert concert;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @Builder
    public Cast(Concert concert, Artist artist) {
        this.concert = concert;
        this.artist = artist;
    }

}

