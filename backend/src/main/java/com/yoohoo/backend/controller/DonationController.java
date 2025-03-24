package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.TransferRequestDTO;
import com.yoohoo.backend.dto.TransferResponseDTO;
import com.yoohoo.backend.entity.Donation;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.entity.User;
import com.yoohoo.backend.service.DonationService;
import com.yoohoo.backend.service.DogService;
import com.yoohoo.backend.service.ShelterService;
import com.yoohoo.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private DogService dogService;

    @Autowired
    private ShelterService shelterService;

    @Autowired
    private UserService userService;

    @Autowired
    private StringRedisTemplate redisTemplate; // Redis 클라이언트

    @GetMapping
    public ResponseEntity<List<Donation>> getDonations(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
        }

        List<Donation> donations = donationService.getDonationsByUserId(userId);
        return ResponseEntity.ok(donations);
    }

    // 날짜 범위에 따른 후원 내역 조회
    @GetMapping("/filter")
    public ResponseEntity<List<Donation>> getDonationsByDateRange(
            HttpSession session,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
        }

        List<Donation> donations = donationService.getDonationsByUserIdAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/dogs")
    public ResponseEntity<List<Dog>> getDogsByUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
        }

        List<Dog> dogs = donationService.getDogsByUserId(userId);
        return ResponseEntity.ok(dogs);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> handleTransfer(@RequestBody TransferRequestDTO transferRequest, HttpSession session) {
        // Define and initialize apiUrl
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountTransfer";

        // 세션에서 userId 가져오기
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().body("User ID not found in session.");
        }

        // Redis에서 userKey 가져오기
        String userKey = redisTemplate.opsForValue().get("userKey:" + userId);
        if (userKey == null) {
            return ResponseEntity.badRequest().body("User key not found in Redis.");
        }

        // User 객체 가져오기
        User user = userService.findById(userId); // userService를 통해 User 객체를 가져옵니다.
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        // Header 정보 설정
        LocalDateTime now = LocalDateTime.now();
        TransferRequestDTO.Header header = new TransferRequestDTO.Header();
        header.setApiName("updateDemandDepositAccountTransfer");
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setUserKey(userKey); // userKey 설정

        transferRequest.setHeader(header); // Header 설정

        // 추가 필드 설정
        transferRequest.setDepositTransactionSummary("입금");
        transferRequest.setWithdrawalTransactionSummary("출금");
        transferRequest.setCheeringMessage("후원합니다!");
        transferRequest.setDepositorName("유");
        transferRequest.setDonationType(1);
        transferRequest.setDogId(1L);
        transferRequest.setShelterId(1L);

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransferRequestDTO> entity = new HttpEntity<>(transferRequest, headers);

        // 외부 API 호출
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<TransferResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, TransferResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                TransferResponseDTO transferResponse = response.getBody();
                if (transferResponse != null && transferResponse.getHeader() != null && "H0000".equals(transferResponse.getHeader().getResponseCode())) {
                    // Donation 객체 생성 및 설정
                    Donation donation = new Donation();
                    donation.setTransactionUniqueNo(transferResponse.getHeader().getInstitutionTransactionUniqueNo());
                    donation.setDonationAmount(Integer.parseInt(transferRequest.getTransactionBalance()));
                    donation.setWithdrawalAccount(transferRequest.getWithdrawalAccountNo());
                    donation.setDonationDate(LocalDate.now());
                    
                    // 추가 필드 설정
                    donation.setCheeringMessage(transferRequest.getCheeringMessage());
                    donation.setDepositorName(transferRequest.getDepositorName());
                    donation.setDonationType(transferRequest.getDonationType());
                    donation.setUser(user); // user 필드 설정

                    // Dog와 Shelter 객체 설정
                    Dog dog = dogService.findById(transferRequest.getDogId());
                    Shelter shelter = shelterService.findById(transferRequest.getShelterId());
                    donation.setDog(dog);
                    donation.setShelter(shelter);

                    // Donation 저장
                    donationService.saveDonation(donation);
                    
                    return ResponseEntity.ok("Donation recorded successfully.");
                } else {
                    return ResponseEntity.badRequest().body("Invalid response from external API.");
                }
            } else {
                return ResponseEntity.badRequest().body("Failed to process transfer: " + response.getStatusCode());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process transfer: " + e.getMessage());
        }
    }

    // 랜덤 숫자 생성 메서드
    private String generateUniqueTransactionNo(LocalDateTime now) {
        String transmissionDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 8자리
        String transmissionTime = now.format(DateTimeFormatter.ofPattern("HHmmss")); // 6자리
        Random random = new Random();
        
        // 6자리 랜덤 숫자 생성
        String randomNumber = String.format("%06d", random.nextInt(1000000)); // 6자리 랜덤 숫자

        // 20자리 문자열 생성
        return transmissionDate + transmissionTime + randomNumber; // 총 20자리
    }
}