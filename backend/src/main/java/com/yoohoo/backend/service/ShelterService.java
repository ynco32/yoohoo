package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.ShelterDTO;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;

    @Autowired
    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    // 단체 전체 목록 조회 (강아지 수 포함)
    public List<ShelterDTO> getAllSheltersWithDogCount() {
        return shelterRepository.findAllSheltersWithDogCount().stream()
                .map(obj -> {
                    Shelter shelter = (Shelter) obj[0];
                    int dogCount = (int) obj[1];
                    return new ShelterDTO(shelter.getName(), shelter.getContent(), dogCount, shelter.getReliability());
                })
                .collect(Collectors.toList());
    }

    // 특정 단체 상세 조회
    public Shelter getShelterById(Long shelterId) {
        return shelterRepository.findByShelterId(shelterId)
                .orElseThrow(() -> new RuntimeException("Shelter not found with id: " + shelterId));
    }
}
