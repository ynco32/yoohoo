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

    // 단체 목록 조회 (강아지 수 포함)
    @GetMapping
    public List<ShelterListDTO> getAllSheltersWithDogCount() {
        return shelterService.getAllSheltersWithDogCount();
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