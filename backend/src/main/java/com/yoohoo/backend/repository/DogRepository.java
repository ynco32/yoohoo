package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.Dog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DogRepository extends JpaRepository<Dog, Long> {
    // 특정 보호소(shelterId)에 속한 모든 강아지 조회
    List<Dog> findByShelter_ShelterId(Long shelterId);
}
