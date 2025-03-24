package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.CardRequestDTO;
import com.yoohoo.backend.dto.CardResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/card")
public class CardController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @PostMapping("/withdrawal")
    public ResponseEntity<CardResponseDTO> inquireCreditCardTransactions(@RequestBody ShelterRequest shelterRequest) {
        Long shelterId = shelterRequest.getShelterId();
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/creditCard/inquireCreditCardTransactionList";

        // Redis에서 필요한 값 가져오기
        String userKey = redisTemplate.opsForValue().get("shelterUserKey:" + shelterId);
        String cardNo = redisTemplate.opsForValue().get("shelterCardNo:" + shelterId);
        String cvc = redisTemplate.opsForValue().get("shelterCvc:" + shelterId);

        if (userKey == null || cardNo == null || cvc == null) {
            return ResponseEntity.badRequest().body(null); // 필요한 정보가 없을 경우 null 반환
        }

        // Header 정보 설정
        LocalDateTime now = LocalDateTime.now();
        CardRequestDTO.Header header = new CardRequestDTO.Header();
        header.setApiName("inquireCreditCardTransactionList");
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionCode("00100");
        header.setFintechAppNo("001");
        header.setApiServiceCode("inquireCreditCardTransactionList");
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setApiKey("54cc585638ea49a5b13f7ec7887c7c1b");
        header.setUserKey(userKey);

        // 요청 DTO 설정
        CardRequestDTO requestDTO = new CardRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setCardNo(cardNo);
        requestDTO.setCvc(cvc);
        requestDTO.setStartDate("20250101");
        requestDTO.setEndDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<CardRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        // 외부 API 호출
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<CardResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, CardResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(response.getBody()); // 성공적으로 응답을 반환
            } else {
                return ResponseEntity.badRequest().body(null); // 실패 시 null 반환
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // 예외 발생 시 null 반환
        }
    }

    private String generateUniqueTransactionNo(LocalDateTime now) {
        String transmissionDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String transmissionTime = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        return transmissionDate + transmissionTime + "000001"; // 예시로 고정된 일련번호 사용
    }

    public static class ShelterRequest {
        private Long shelterId;

        public Long getShelterId() {
            return shelterId;
        }

        public void setShelterId(Long shelterId) {
            this.shelterId = shelterId;
        }
    }
}