package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Withdrawal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long withrawalId;

    @ManyToOne
    @JoinColumn(name = "shelterId", nullable = false)
    private Shelter shelter;

    @ManyToOne
    @JoinColumn(name = "dogId", nullable = true)
    private Dog dog;

    @ManyToOne
    @JoinColumn(name = "marchantCategoryId", nullable = false)
    private MerchantCategory merchantCategory;

    @Column(nullable = false)
    private Integer transctionType;

    @Column(nullable = false)
    private Long transactionUniqueNo;

    // Getters and Setters
    // ...
}