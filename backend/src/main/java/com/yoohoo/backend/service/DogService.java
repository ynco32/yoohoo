package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.DogDTO;
import com.yoohoo.backend.dto.DogIdNameDTO;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.repository.DogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DogService {

    private final DogRepository dogRepository;

    @Autowired
    public DogService(DogRepository dogRepository) {
        this.dogRepository = dogRepository;
    }

    // 특정 shelterId에 속한 강아지 목록 조회
    public List<DogDTO> getDogsByShelterId(Long shelterId) {
        List<Dog> dogs = dogRepository.findByShelter_ShelterId(shelterId);

        return dogs.stream()
                .map(dog -> new DogDTO(
                        dog.getDogId(),
                        dog.getName(),
                        dog.getAge(),
                        dog.getWeight(),
                        dog.getGender(),
                        dog.getBreed(),
                        dog.getEnergetic(),
                        dog.getFamiliarity(),
                        dog.getIsVaccination(),
                        dog.getIsNeutered(),
                        dog.getStatus(),
                        dog.getAdmissionDate()
                ))
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
}
