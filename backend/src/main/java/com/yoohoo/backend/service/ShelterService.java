package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.ShelterDetailDTO;
import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;

    @Autowired
    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    // 단체 전체 목록 조회 (강아지 수 포함)
    public List<ShelterListDTO> getAllSheltersWithDogCount() {
        return shelterRepository.findAllWithDogCount();
    }


    // 특정 단체 상세 조회 (강아지 목록 제외)
    public ShelterDetailDTO getShelterById(Long shelterId) {
        Shelter shelter = shelterRepository.findByShelterId(shelterId)
                .orElseThrow(() -> new RuntimeException("Shelter not found with id: " + shelterId));

        return new ShelterDetailDTO(
                shelter.getShelterId(),
                shelter.getName(),
                shelter.getAddress(),
                shelter.getFoundationDate(),
                shelter.getContent(),
                shelter.getEmail(),
                shelter.getPhone(),
                shelter.getBusinessNumber(),
                shelter.getReliability()
        );
    }
}
