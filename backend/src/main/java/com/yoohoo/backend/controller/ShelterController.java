package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.DogDTO;
import com.yoohoo.backend.dto.ShelterDetailDTO;
import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.service.ShelterService;
import com.yoohoo.backend.service.DogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/shelter")
public class ShelterController {

    private final ShelterService shelterService;
    private final DogService dogService;

    @Autowired
    public ShelterController(ShelterService shelterService, DogService dogService) {
        this.shelterService = shelterService;
        this.dogService = dogService;
    }

    @GetMapping
    public List<ShelterListDTO> getAllSheltersWithDogCount(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort) {
    
        List<ShelterListDTO> shelters = shelterService.getAllSheltersWithDogCount();
    
        // 1. 검색 필터링 (단체명에 키워드 포함)
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            shelters = shelters.stream()
                    .filter(shelter -> shelter.getName().toLowerCase().contains(lowerSearch))
                    .collect(Collectors.toList());
        }
    
        // 2. 정렬
        if ("reliability".equalsIgnoreCase(sort)) {
            shelters.sort((s1, s2) -> Double.compare(s2.getReliability(), s1.getReliability())); // 내림차순
        } else if ("dogcount".equalsIgnoreCase(sort)) {
            shelters.sort((s1, s2) -> Long.compare(s2.getDogCount(), s1.getDogCount())); // 내림차순
        }
    
        return shelters;
    }

    // 특정 shelterId로 단체 상세 조회 (강아지 목록 제외)
    @GetMapping("/{shelterId}")
    public ShelterDetailDTO getShelterById(@PathVariable Long shelterId) {
        return shelterService.getShelterById(shelterId);
    }

    // 특정 shelterId에 속한 강아지 목록 조회 + 이름 검색 필터링
    @GetMapping("/{shelterId}/dogs")
    public List<DogDTO> getDogsByShelterId(
            @PathVariable Long shelterId,
            @RequestParam(required = false) String search) {

        List<DogDTO> dogs = dogService.getDogsByShelterId(shelterId);

        // search 파라미터가 있는 경우 이름 기준 필터링
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            dogs = dogs.stream()
                    .filter(dog -> dog.getName().toLowerCase().contains(lowerSearch))
                    .collect(Collectors.toList());
        }

        return dogs;
    }
}