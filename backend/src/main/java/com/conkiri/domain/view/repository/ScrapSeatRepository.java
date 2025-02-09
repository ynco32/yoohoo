package com.conkiri.domain.view.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.conkiri.domain.base.entity.Arena;
import com.conkiri.domain.base.entity.Seat;
import com.conkiri.domain.base.entity.Section;
import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.user.entity.User;
import com.conkiri.domain.view.entity.ScrapSeat;

public interface ScrapSeatRepository extends JpaRepository<ScrapSeat, Long> {

	boolean existsByUserAndSeatAndStageType(User user, Seat seat, StageType stageType);

	boolean existsByUserAndSeat_SectionAndStageType(User user, Section section, StageType stageType);

	Optional<ScrapSeat> findByUserAndSeatAndStageType(User user, Seat seat, StageType stageType);

	List<ScrapSeat> findByUserAndStageTypeAndSeat_Section(User user, StageType stageType, Section section);

	List<ScrapSeat> findByUserAndStageTypeAndSeat_Section_Arena(User user, StageType stageType, Arena arena);
}
