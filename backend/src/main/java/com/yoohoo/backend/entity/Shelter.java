package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

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

    // Shelter와 Dog의 관계 추가
    @OneToMany(mappedBy = "shelter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dog> dogs;

    // 강아지 수를 반환하는 메서드 추가
    public int getDogCount() {
        return dogs != null ? dogs.size() : 0;
    }
}
