package com.conkiri.global.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.conkiri.global.auth.dto.TokenDTO;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final SecretKey key;
	private final long accessTokenExpiration;
	private final long refreshTokenExpiration;

	public JwtUtil(
		@Value("${jwt.secret}") String secret,
		@Value("${jwt.access-token-expiration}") long accessTokenExpiration,
		@Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration
	) {
		byte[] keyBytes = Decoders.BASE64.decode(secret);
		this.key = Keys.hmacShaKeyFor(keyBytes);
		this.accessTokenExpiration = accessTokenExpiration;
		this.refreshTokenExpiration = refreshTokenExpiration;
	}

	public TokenDTO generateTokens(String email) {
		String accessToken = generateToken(email, accessTokenExpiration);
		String refreshToken = generateToken(email, refreshTokenExpiration);
		return new TokenDTO(accessToken, refreshToken, accessTokenExpiration);
	}

	private String generateToken(String email, long expiration) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + expiration);

		return Jwts.builder()
			.subject(email)
			.issuedAt(now)
			.expiration(expiryDate)
			.signWith(key)
			.compact();
	}

	public String getEmailFromToken(String token) {
		return Jwts.parser()
			.verifyWith(key)
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.getSubject();
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser()
			.verifyWith(key)    // setSigningKey() 대신 verifyWith()
			.build()
			.parseSignedClaims(token)      // parseClaimsJws() 대신 parseSignedClaims()
			.getPayload();                 // getBody() 대신 getPayload()
	}

	public boolean validateToken(String token) {
		try {
			extractAllClaims(token);
			return true;
		} catch (SecurityException | MalformedJwtException |
				 UnsupportedJwtException | IllegalArgumentException e) {
			return false;
			//throw new CustomException(ErrorCode.INVALID_TOKEN);
		} catch (ExpiredJwtException e) {
			return false;
			//throw new CustomException(ErrorCode.EXPIRED_TOKEN);
		}
	}

}