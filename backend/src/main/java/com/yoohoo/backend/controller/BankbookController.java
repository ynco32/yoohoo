package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.BankbookRequestDTO;
import com.yoohoo.backend.dto.BankbookResponseDTO;
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
@RequestMapping("/api/bankbook")
public class BankbookController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @PostMapping("/withdrawal")
    public ResponseEntity<BankbookResponseDTO> inquireTransactionHistory(@RequestBody ShelterRequest shelterRequest) {
        Long shelterId = shelterRequest.getShelterId();
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList";

        // Redis에서 필요한 값 가져오기
        String userKey = redisTemplate.opsForValue().get("shelterUserKey:" + shelterId);
        String accountNo = redisTemplate.opsForValue().get("shelterAccountNo:" + shelterId); // 예시로 추가
        if (userKey == null || accountNo == null) {
            return ResponseEntity.badRequest().body(null); // 필요한 정보가 없을 경우 null 반환
        }

        // Header 정보 설정
        LocalDateTime now = LocalDateTime.now();
        BankbookRequestDTO.Header header = new BankbookRequestDTO.Header();
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setUserKey(userKey);

        // 요청 DTO 설정
        BankbookRequestDTO requestDTO = new BankbookRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setAccountNo(accountNo);
        requestDTO.setStartDate("20250301");
        requestDTO.setEndDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        requestDTO.setTransactionType("A");
        requestDTO.setOrderByType("ASC");

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<BankbookRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        // 외부 API 호출
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<BankbookResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, BankbookResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                BankbookResponseDTO originalResponse = response.getBody();
                if (originalResponse != null && originalResponse.getRec() != null) {
                    // "인건비"인 거래만 필터링
                    List<BankbookResponseDTO.Transaction> filteredList = originalResponse.getRec().getList().stream()
                            .filter(transaction -> "인건비".equals(transaction.getTransactionSummary()))
                            .collect(Collectors.toList());

                    // 필터링된 응답 생성
                    BankbookResponseDTO filteredResponse = new BankbookResponseDTO();
                    filteredResponse.setHeader(originalResponse.getHeader());
                    BankbookResponseDTO.Rec rec = new BankbookResponseDTO.Rec();
                    rec.setTotalCount(String.valueOf(filteredList.size()));
                    rec.setList(filteredList);
                    filteredResponse.setRec(rec);

                    return ResponseEntity.ok(filteredResponse); // 필터링된 응답 반환
                } else {
                    return ResponseEntity.ok(new BankbookResponseDTO()); // 빈 응답 반환
                }
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