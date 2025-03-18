package com.yoohoo.backend.service;

import com.yoohoo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.MediaType;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.yoohoo.backend.dto.KakaoLoginDto;
import com.yoohoo.backend.entity.User;
import com.yoohoo.backend.service.TokenService;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.http.*;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Value("${KAKAO_CLIENT_ID}")
    private String kakaoClientId;

    @Value("${KAKAO_CLIENT_SECRET}")
    private String kakaoClientSecret;

    @Autowired
    private TokenService tokenService;

    public String getAccessTokenFromKakao(String code) {
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", "http://localhost:8080/api/auth/kakao-login");
        params.add("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                request,
                Map.class
            );

            if (response.getBody() != null) {
                String accessToken = (String) response.getBody().get("access_token");
                String refreshToken = (String) response.getBody().get("refresh_token");

                // 사용자 정보 가져오기
                KakaoLoginDto userInfo = getUserInfoFromKakao(accessToken);
                User user = saveUser(userInfo); // 사용자 저장

                // 리프레시 토큰 저장
                tokenService.saveRefreshToken(user.getUserId(), refreshToken);
                logger.info("Refresh token saved for user ID {}: {}", user.getUserId(), refreshToken);

                return accessToken;
            } else {
                logger.error("Failed to retrieve access token: {}", response.getBody());
                throw new RuntimeException("Failed to retrieve access token");
            }
        } catch (Exception e) {
            logger.error("Exception occurred while retrieving access token", e);
            throw new RuntimeException("Exception occurred while retrieving access token", e);
        }
    }

    public KakaoLoginDto getUserInfoFromKakao(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);

        if (response.getBody() != null) {
            KakaoLoginDto userInfo = new KakaoLoginDto();
            userInfo.setKakaoId((Long) response.getBody().get("id"));

            // Check if kakao_account is a Map
            Object kakaoAccountObj = response.getBody().get("kakao_account");
            if (kakaoAccountObj instanceof Map) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoAccountObj;
                userInfo.setEmail((String) kakaoAccount.get("email"));
            } else {
                logger.error("kakao_account is not a Map: {}", kakaoAccountObj);
                throw new RuntimeException("kakao_account is not a Map");
            }

            return userInfo;
        } else {
            logger.error("Failed to retrieve user info: {}", response.getBody());
            throw new RuntimeException("Failed to retrieve user info");
        }
    }

    public User saveUser(KakaoLoginDto userInfo) {
        Optional<User> existingUser = userRepository.findByKakaoId(userInfo.getKakaoId());
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setKakaoId(userInfo.getKakaoId());
        user.setKakaoEmail(userInfo.getEmail());
        user.setIsAdmin(false); // Set default value or modify as needed
        if (user.getIsAdmin()) {
            // Logic to set the shelter reference
        } else {
            user.setShelter(null); // Ensure shelter is null if not admin
        }
        return userRepository.save(user);
    }

    public User saveUserWithToken(KakaoLoginDto userInfo, String accessToken) {
        User user = saveUser(userInfo);
        
        tokenService.saveToken(user.getUserId(), accessToken);
        
        return user;
    }

    public String getUserToken(Long userId) {
        return tokenService.getToken(userId);
    }

    public void unlinkUser(Long userId) {
        tokenService.deleteToken(userId);
    
    }

    public String refreshAccessToken(Long userId) {
        String refreshToken = tokenService.getRefreshToken(userId);
        if (refreshToken == null) {
            throw new RuntimeException("Refresh token not found");
        }

        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "refresh_token");
        params.add("client_id", kakaoClientId);
        params.add("refresh_token", refreshToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                request,
                Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("access_token")) {
                String newAccessToken = (String) response.getBody().get("access_token");
                // 새로운 액세스 토큰 저장
                tokenService.saveToken(userId, newAccessToken);
                return newAccessToken;
            } else {
                logger.error("Failed to refresh access token: {}", response.getBody());
                throw new RuntimeException("Failed to refresh access token");
            }
        } catch (Exception e) {
            logger.error("Exception occurred while refreshing access token", e);
            throw new RuntimeException("Exception occurred while refreshing access token", e);
        }
    }


    public void checkAndRefreshAccessToken(Long userId) {
        // Redis에서 리프레시 토큰을 가져옵니다.
        String refreshToken = tokenService.getRefreshToken(userId);
        if (refreshToken == null) {
            throw new RuntimeException("Refresh token not found");
        }
    
        // 현재 시간과 세션 만료 시간을 비교하여 갱신 여부 결정
        // 예를 들어, 5분 이내에 만료될 경우 갱신
        long currentTime = System.currentTimeMillis();
        long expirationTime = 60 * 60 * 1000; // 세션 만료 시간 (1시간)
    
        if (currentTime >= (expirationTime - 5 * 60 * 1000)) { 
            String newAccessToken = refreshAccessToken(userId);
            logger.info("Access token refreshed for user ID {}: {}", userId, newAccessToken);
        }
    }

    public User updateNickname(Long userId, String newNickname) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setNickname(newNickname);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

}