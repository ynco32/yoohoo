package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationeId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "shelterId", nullable = false)
    private Shelter shelter;

    @Column(nullable = false)
    private Date donationDate;

    @Column(nullable = false)
    private String withdrawalAccount;

    @Column(nullable = false)
    private Integer donationType;

    @Column
    private Date regularDonationDate;

    @ManyToOne
    @JoinColumn(name = "dogId", nullable = true)
    private Dog dog;

    @Column(nullable = false)
    private String depositorName;

    @Column(columnDefinition = "TEXT")
    private String cheeringMessage;

    @Column(nullable = false)
    private Integer donationAmount;

    @Column(nullable = false)
    private Long transactionUniqueNo;

    // Getters and Setters
    // ...
}