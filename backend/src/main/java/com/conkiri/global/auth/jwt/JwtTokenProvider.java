package com.conkiri.global.auth.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

	@Value("${jwt.secret}")
	private String secretKey;

	private final long tokenValidTime = 24 * 60 * 60 * 1000L; // 24시간

	// SecretKey 생성
	private SecretKey getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	// 토큰 생성
	public String createToken(String userId) {
		Date now = new Date();
		return Jwts.builder()
			.subject(userId)                // setSubject() 대신 subject()
			.issuedAt(now)                 // setIssuedAt() 대신 issuedAt()
			.expiration(new Date(now.getTime() + tokenValidTime))  // setExpiration() 대신 expiration()
			.signWith(getSigningKey())      // 변경된 signWith()
			.compact();
	}

	// 토큰에서 회원 정보 추출
	public String getUserId(String token) {
		return extractAllClaims(token).getSubject();
	}

	// Claims 추출
	private Claims extractAllClaims(String token) {
		return Jwts.parser()
			.verifyWith(getSigningKey())    // setSigningKey() 대신 verifyWith()
			.build()
			.parseSignedClaims(token)      // parseClaimsJws() 대신 parseSignedClaims()
			.getPayload();                 // getBody() 대신 getPayload()
	}

	// 토큰 유효성 + 만료일자 확인
	public boolean validateToken(String token) {
		try {
			extractAllClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
