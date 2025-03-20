package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.ShelterDetailDTO;
import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelter")
public class ShelterController {

    private final ShelterService shelterService;

    @Autowired
    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
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
}
