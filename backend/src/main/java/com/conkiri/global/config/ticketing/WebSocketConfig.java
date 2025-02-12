package com.conkiri.global.config.ticketing;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Value("${frontend.url}")
	private String frontendUrl;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {

		config.enableSimpleBroker("/book"); // 서버가 구독한 클라이언트에게로는 book 로 시작
		config.setApplicationDestinationPrefixes("/ws"); // 클라이언트가 서버로 보낼 때 는 ws로 시작
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {

		// 클라이언트는 ws://도메인/ticketing 으로 웹소켓 연결
		registry.addEndpoint("/ticketing-melon").setAllowedOrigins(frontendUrl).withSockJS();
	}
}
