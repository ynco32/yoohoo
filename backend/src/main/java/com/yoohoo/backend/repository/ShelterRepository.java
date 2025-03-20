package com.yoohoo.backend.repository;

import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    // 모든 단체 목록 조회 (강아지 수 포함)
    @Query("SELECT new com.yoohoo.backend.dto.ShelterListDTO(s.name, s.content, COUNT(d), s.reliability) " +
    "FROM Shelter s LEFT JOIN Dog d ON s.shelterId = d.shelter.shelterId " +
    "GROUP BY s.shelterId")
    List<ShelterListDTO> findAllWithDogCount();

    // 특정 shelterId의 상세 정보 조회 (강아지 목록 제외)
    Optional<Shelter> findByShelterId(Long shelterId);
}
