package com.yoohoo.backend.service;

import com.yoohoo.backend.entity.Donation;
import com.yoohoo.backend.dto.DonationDTO;

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
    public List<DonationDTO> getDonationsByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Donation> donations = donationRepository.findByUser_UserIdAndDonationDateBetween(userId, startDate, endDate);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<DonationDTO> getDogsByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Donation 객체 저장
    public void saveDonation(Donation donation) {
        donationRepository.save(donation);
    }

    // 특정 강아지에게 후원 들어온 내역 조회
    public List<DonationDTO> getDonationsByDogId(Long dogId) {
        List<Donation> donations = donationRepository.findByDog_DogId(dogId);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 유저가 후원한 단체의 이름 목록 조회
    public List<String> getShelterNamesByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .map(donation -> donation.getShelter().getName()) // Shelter의 이름을 가져옴
                .distinct() // 중복된 이름 제거
                .collect(Collectors.toList());
    }

    // 유저가 후원한 금액 총액 조회회
    public Integer getTotalDonationAmountByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .mapToInt(Donation::getDonationAmount) // Convert donationAmount to int and sum
                .sum(); // Calculate total
    }

    public List<DonationDTO> getDonationsByShelterId(Long shelterId) {
        List<Donation> donations = donationRepository.findByShelter_ShelterId(shelterId);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Integer getTotalDonationAmountByShelterId(Long shelterId) {
        List<Donation> donations = donationRepository.findByShelter_ShelterId(shelterId);
        return donations.stream()
                .mapToInt(Donation::getDonationAmount)
                .sum();
    }
}