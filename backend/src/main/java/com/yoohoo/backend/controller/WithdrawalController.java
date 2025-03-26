package com.yoohoo.backend.controller;

import com.yoohoo.backend.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/withdrawal")
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @PutMapping("/{withdrawalId}/dogId")
    public ResponseEntity<Map<String, String>> updateDogId(
            @PathVariable Long withdrawalId,
            @RequestBody DogIdRequest request) {
        Optional<String> dogName = withdrawalService.updateDogId(withdrawalId, request.getNewDogId());
        Map<String, String> response = new HashMap<>();
        if (dogName.isPresent()) {
            response.put("name", dogName.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Withdrawal not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllWithdrawals() {
        List<Map<String, Object>> withdrawals = withdrawalService.getAllWithdrawals();
        return ResponseEntity.ok(withdrawals);
    }

    public static class DogIdRequest {
        private Long newDogId;

        public Long getNewDogId() {
            return newDogId;
        }

        public void setNewDogId(Long newDogId) {
            this.newDogId = newDogId;
        }
    }
}