package com.yoohoo.backend.controller;


import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;


@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final ShelterService shelterService;

    @Autowired
    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }
    
    @GetMapping
    public ResponseEntity<List<Shelter>> getAllShelters() {
        List<Shelter> shelters = shelterService.getAllShelters();
        return new ResponseEntity<>(shelters, HttpStatus.OK);
    }

}
