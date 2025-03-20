package com.yoohoo.backend.service;

import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ShelterService {
    
    private final ShelterRepository shelterRepository;

    @Autowired
    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }
    
    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

}
