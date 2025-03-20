package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShelterDTO {
    private String name;
    private String content;
    private int dogCount;
    private int reliability;
}
