package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.DogDTO;
import com.yoohoo.backend.dto.DogIdNameDTO;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Donation;
import com.yoohoo.backend.repository.DogRepository;
import com.yoohoo.backend.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DogService {

    private final DogRepository dogRepository;
    private final S3Service s3Service;
    private final DonationRepository donationRepository;


    @Autowired
    public DogService(DogRepository dogRepository, DonationRepository donationRepository, S3Service s3Service) {
        this.dogRepository = dogRepository;
        this.donationRepository = donationRepository;
        this.s3Service = s3Service;
    }

    // 특정 shelterId에 속한 강아지 목록 조회
    public List<DogDTO> getDogsByShelterId(Long shelterId) {
        List<Dog> dogs = dogRepository.findByShelter_ShelterId(shelterId);
    
        return dogs.stream()
        .map(dog -> {
            String imageUrl = s3Service.getFileUrlByEntityTypeAndEntityId(1, dog.getDogId());
            return DogDTO.fromEntity(dog, Optional.ofNullable(imageUrl));
        })
        .collect(Collectors.toList());
    }

    // 강아지 ID로 강아지 조회
    public Dog findById(Long dogId) {
        Optional<Dog> dog = dogRepository.findById(dogId);
        return dog.orElse(null); // 강아지가 없으면 null 반환
    // ✅ 특정 shelterId의 강아지 ID + 이름만 조회 (dog.status = 0)
    }
    
    public List<DogIdNameDTO> getDogIdAndNamesByShelterId(Long shelterId) {
        return dogRepository.findDogIdAndNamesByShelterIdAndStatus(shelterId, 0)
                .stream()
                .map(dog -> new DogIdNameDTO(dog.getDogId(), dog.getName()))
                .collect(Collectors.toList());
    }

    public Dog saveDog(Dog dog) {
        return dogRepository.save(dog);
    }

    // 사용자가 후원한 총 금액 계산
    public Integer getTotalDonationAmountByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .mapToInt(Donation::getDonationAmount) // donationAmount를 int로 변환하여 합산
                .sum(); // 총합 계산
    }
    
}
