package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    // 모든 단체 목록 조회 (강아지 수 포함)
    @Query("SELECT s FROM Shelter s LEFT JOIN FETCH s.dogs")
    List<Shelter> findAllWithDogs();

    // 특정 shelterId의 상세 정보 조회
    Optional<Shelter> findByShelterId(Long shelterId);

    @Query("SELECT s, SIZE(s.dogs) FROM Shelter s")
    List<Object[]> findAllSheltersWithDogCount();
}
