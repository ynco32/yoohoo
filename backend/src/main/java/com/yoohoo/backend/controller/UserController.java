package com.yoohoo.backend.controller;

import com.yoohoo.backend.service.UserService;
import com.yoohoo.backend.dto.KakaoLoginDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;
import jakarta.servlet.http.HttpSession;
import com.yoohoo.backend.entity.User;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/kakao-login")
    public RedirectView kakaoLogin(@RequestParam("code") String code, HttpSession session) {
        try {
            // 카카오 API로 액세스 토큰 요청
            String accessToken = userService.getAccessTokenFromKakao(code);
            logger.info("Access token received: {}", accessToken);
            
            // 액세스 토큰으로 사용자 정보 요청
            KakaoLoginDto userInfo = userService.getUserInfoFromKakao(accessToken);
            logger.info("User info retrieved: {}", userInfo);
            
            // 사용자 정보 저장 및 토큰 Redis에 저장
            User user = userService.saveUserWithToken(userInfo, accessToken);
            logger.info("User saved: {}", user);
            
            // 세션에 사용자 ID 저장 (인증 목적)
            session.setAttribute("userId", user.getUserId());
            logger.info("User ID stored in session: {}", user.getUserId());
            
            return new RedirectView("/home");
        } catch (Exception e) {
            logger.error("Error during Kakao login", e);
            return new RedirectView("/error");
        }
    }

    @PostMapping("/kakao-logout")
    public RedirectView unlink(HttpSession session) {
        try {
            // 세션에서 사용자 ID 가져오기
            Long userId = (Long) session.getAttribute("userId");
            
            if (userId == null) {
                logger.error("User not logged in");
                return new RedirectView("/error");
            }
            
            // Redis에서 토큰 가져오기
            String accessToken = userService.getUserToken(userId);
            
            if (accessToken == null) {
                logger.error("Access token not found for user: {}", userId);
                return new RedirectView("/error");
            }
            
            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // 카카오 API 호출 (연결 끊기)
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> unlinkResponse = restTemplate.exchange(
                    "https://kapi.kakao.com/v1/user/unlink",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // 카카오 연결 해제 성공 확인
            if (!unlinkResponse.getStatusCode().is2xxSuccessful()) {
                logger.error("Failed to unlink with Kakao: {}", unlinkResponse.getBody());
                return new RedirectView("/error");
            }

            // 토큰 삭제 및 사용자 정보 업데이트
            userService.unlinkUser(userId);
            
            // 세션 정보 삭제
            session.invalidate();
            
            // 연결 끊기 성공 시 메인 페이지로 리디렉션
            return new RedirectView("/");
        } catch (Exception e) {
            logger.error("Error during unlink", e);
            return new RedirectView("/error");
        }
    }
}