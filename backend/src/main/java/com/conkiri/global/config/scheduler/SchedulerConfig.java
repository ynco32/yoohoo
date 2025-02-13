package com.conkiri.global.config.scheduler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class SchedulerConfig {

	@Bean
	public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
		ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
		scheduler.setPoolSize(20);  // 두 개의 스케줄러를 위해 풀 사이즈 증가
		scheduler.setThreadNamePrefix("Scheduler-");
		scheduler.initialize();
		return scheduler;
	}
}
