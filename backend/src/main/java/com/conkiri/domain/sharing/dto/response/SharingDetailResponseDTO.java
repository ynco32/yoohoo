package com.conkiri.domain.sharing.dto.response;

import com.conkiri.domain.sharing.entity.Sharing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharingDetailResponseDTO {

	private Long sharingId;
	private String title;
	private String content;
	private String photoUrl;
	private String status;
	private String startTime;
	private String writer;
	private Long writerId;
	private Double latitude;
	private Double longitude;

	public static SharingDetailResponseDTO from(Sharing sharing) {
		return SharingDetailResponseDTO.builder()
			.sharingId(sharing.getSharingId())
			.title(sharing.getTitle())
			.content(sharing.getContent())
			.photoUrl(sharing.getPhotoUrl())
			.status(sharing.getStatus().name())
			.startTime(sharing.getStartTime().toString())
			.writer(sharing.getUser().getNickname())
			.writerId(sharing.getUser().getUserId())
			.latitude(sharing.getLatitude())
			.longitude(sharing.getLongitude())
			.build();
	}
}