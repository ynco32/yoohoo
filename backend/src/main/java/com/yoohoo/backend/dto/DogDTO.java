package com.yoohoo.backend.dto;

import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Shelter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
    private LocalDate admissionDate;

    public Dog toEntity(Shelter shelter) {
        Dog dog = new Dog();
        dog.setName(this.name);
        dog.setAge(this.age);
        dog.setWeight(this.weight);
        dog.setGender(this.gender);
        dog.setBreed(this.breed);
        dog.setEnergetic(this.energetic);
        dog.setFamiliarity(this.familiarity);
        dog.setIsVaccination(this.isVaccination);
        dog.setIsNeutered(this.isNeutered);
        dog.setStatus(this.status);
        dog.setAdmissionDate(LocalDate.now());
        dog.setShelter(shelter);
        return dog;
    }

    public static DogDTO fromEntity(Dog dog) {
        return new DogDTO(
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
        );
    }
    
}
