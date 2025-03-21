package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.DogDTO;
import com.yoohoo.backend.dto.DogIdNameDTO;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.service.DogService;
import com.yoohoo.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dogs")
public class DogController {

    private final DogService dogService;
    private final UserService userService;  // 로그인한 사용자의 shelterId를 얻기 위해 필요

    @Autowired
    public DogController(DogService dogService, UserService userService) {
        this.dogService = dogService;
        this.userService = userService;
    }


    @GetMapping("/names")
    public List<DogIdNameDTO> getDogsByUserShelter(@RequestHeader("User-Id") Long userId) {
        Long shelterId = userService.getShelterIdByUserId(userId);
        if (shelterId == null) {
            throw new RuntimeException("(❗권한제한) 등록된 단체가 없습니다.");
        }
        return dogService.getDogIdAndNamesByShelterId(shelterId);
    }

    @PostMapping("/register")
    public DogDTO registerDog(@RequestBody DogDTO dogDTO, @RequestHeader("User-Id") Long userId) {
        Long shelterId = userService.getShelterIdByUserId(userId);
        if (shelterId == null) {
            throw new RuntimeException("(❗권한제한) 등록된 단체가 없습니다.");
        }

        Dog dog = new Dog();
        dog.setName(dogDTO.getName());
        dog.setAge(dogDTO.getAge());
        dog.setWeight(dogDTO.getWeight());
        dog.setGender(dogDTO.getGender());
        dog.setBreed(dogDTO.getBreed());
        dog.setEnergetic(dogDTO.getEnergetic());
        dog.setFamiliarity(dogDTO.getFamiliarity());
        dog.setIsVaccination(dogDTO.getIsVaccination());
        dog.setIsNeutered(dogDTO.getIsNeutered());
        dog.setStatus(dogDTO.getStatus());
        dog.setAdmissionDate(LocalDate.now());  // 현재 날짜 자동 설정

        Shelter shelter = new Shelter();
        shelter.setShelterId(shelterId);
        dog.setShelter(shelter);

        Dog savedDog = dogService.saveDog(dog);
        return new DogDTO(
                savedDog.getDogId(),
                savedDog.getName(),
                savedDog.getAge(),
                savedDog.getWeight(),
                savedDog.getGender(),
                savedDog.getBreed(),
                savedDog.getEnergetic(),
                savedDog.getFamiliarity(),
                savedDog.getIsVaccination(),
                savedDog.getIsNeutered(),
                savedDog.getStatus(),
                savedDog.getAdmissionDate()
        );
    }
}
