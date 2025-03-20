package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class DogDTO {
    private Long dogId;
    private String name;
    private Integer age;
    private Integer weight;
    private Integer gender;
    private String breed;
    private Integer energetic;
    private Integer familiarity;
    private Boolean isVaccination;
    private Boolean isNeutered;
    private Integer status;
    private Date admissionDate;
}