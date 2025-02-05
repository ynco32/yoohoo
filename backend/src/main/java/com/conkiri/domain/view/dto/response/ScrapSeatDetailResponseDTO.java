package com.conkiri.domain.view.dto.response;

import com.conkiri.domain.base.entity.StageType;
import com.conkiri.domain.view.entity.ScrapSeat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScrapSeatDetailResponseDTO {

	private Long seatId;
	private Long rowLine;
	private Long columnLine;
	private StageType stageType;

	public static ScrapSeatDetailResponseDTO from(ScrapSeat scrapSeat) {
		return ScrapSeatDetailResponseDTO.builder()
			.seatId(scrapSeat.getSeat().getSeatId())
			.rowLine(scrapSeat.getSeat().getRowLine())
			.columnLine(scrapSeat.getSeat().getColumnLine())
			.stageType(scrapSeat.getStageType())
			.build();
	}
}
