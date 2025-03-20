package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Shelter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 (AUTO_INCREMENT 같은 기능)
    private Long shelterId;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 30)
    private String address;

    @Column(nullable = false)
    private LocalDate foundationDate;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 30)
    private String email;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(nullable = false, length = 30)
    private String businessNumber;

    @Column(nullable = false)
    private Integer reliability;
}
