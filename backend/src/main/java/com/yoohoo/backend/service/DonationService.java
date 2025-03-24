package com.yoohoo.backend.service;

import com.yoohoo.backend.entity.Donation;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    public List<Donation> getDonationsByUserId(Long userId) {
        return donationRepository.findByUser_UserId(userId);
    }

    // 날짜 범위에 따른 후원 내역 조회
    public List<Donation> getDonationsByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return donationRepository.findByUser_UserIdAndDonationDateBetween(userId, startDate, endDate);
    }

    public List<Dog> getDogsByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .map(Donation::getDog)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // Donation 객체 저장
    public void saveDonation(Donation donation) {
        donationRepository.save(donation);
    }

    // 특정 강아지에게 후원 들어온 내역 조회
    public List<Donation> getDonationsByDogId(Long dogId) {
        return donationRepository.findByDog_DogId(dogId);
    }

    // 유저가 후원한 단체의 이름 목록 조회
    public List<String> getShelterNamesByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .map(donation -> donation.getShelter().getName()) // Shelter의 이름을 가져옴
                .distinct() // 중복된 이름 제거
                .collect(Collectors.toList());
    }
}