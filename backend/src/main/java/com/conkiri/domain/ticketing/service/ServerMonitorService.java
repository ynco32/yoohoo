package com.conkiri.domain.ticketing.service;

import java.lang.management.ManagementFactory;

import org.springframework.stereotype.Component;

import com.conkiri.domain.ticketing.dto.ServerMetricsDTO;
import com.sun.management.OperatingSystemMXBean;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ServerMonitorService {

	private static final double HIGH_LOAD_THRESHOLD = 0.8;
	private static final double MEDIUM_LOAD_THRESHOLD = 0.5;

	public ServerMetricsDTO getCurrentServerLoad() {

		OperatingSystemMXBean osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
		double cpuLoad = getCpuLoad(osBean);
		double memoryLoad = getMemoryLoad(osBean);

		ServerMetricsDTO metrics = ServerMetricsDTO.of(cpuLoad, memoryLoad);
		logServerMetrics(metrics);
		return metrics;
	}

	private double getCpuLoad(OperatingSystemMXBean osBean) {
		return osBean.getCpuLoad();
	}

	private double getMemoryLoad(OperatingSystemMXBean osBean) {

		double totalMemory = osBean.getTotalMemorySize();
		double freeMemory = osBean.getFreeMemorySize();
		return (totalMemory - freeMemory) / totalMemory;
	}

	private void logServerMetrics(ServerMetricsDTO metrics) {

		// log.info("Server Load - CPU: {}, Memory: {}, Total: {}",
		// 	String.format("%.2f", metrics.cpuLoad()),
		// 	String.format("%.2f", metrics.memoryLoad()),
		// 	String.format("%.2f", metrics.totalLoad()));
	}

	public int calculateBatchSize(ServerMetricsDTO metrics) {

		if (metrics.totalLoad() > HIGH_LOAD_THRESHOLD) {
			return 1;  // 높은 부하
		}
		if (metrics.totalLoad() > MEDIUM_LOAD_THRESHOLD) {
			return 1; // 중간 부하
		}
		return 2;    // 낮은 부하
	}
}
