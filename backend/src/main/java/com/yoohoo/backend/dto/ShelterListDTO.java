package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShelterListDTO {
    private String name;
    private String content;
    private Long dogCount;  // Integer → Long 변경
    private Integer reliability;
}
