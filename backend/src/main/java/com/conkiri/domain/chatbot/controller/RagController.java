package com.conkiri.domain.chatbot.controller;

import com.conkiri.global.common.ApiResponse;
import com.conkiri.global.exception.BaseException;
import com.conkiri.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rag")
public class RagController {

    @PostMapping("/process")
    public ApiResponse<String> processRag() {
        try {
            String pythonCommand = System.getProperty("os.name").toLowerCase().contains("windows")
                    ? "C:\\SSAFY\\S12P31B205\\python\\venv\\Scripts\\python.exe"  // 로컬
                    : "python";  // 서버

            String scriptPath = System.getProperty("os.name").toLowerCase().contains("windows")
                    ? "C:\\SSAFY\\S12P31B205\\python\\rag\\auto_rag_processor.py"  // 로컬
                    : "/app/python/rag/auto_rag_processor.py";  // 서버

            ProcessBuilder pb = new ProcessBuilder(pythonCommand, scriptPath);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            Thread.sleep(1000);
            if (!process.isAlive()) {
                int exitCode = process.exitValue();
                log.error("RAG 프로세스 실행 실패 - 종료 코드: {}", exitCode);
                throw new BaseException(ErrorCode.RAG_PROCESS_FAILED);
            }

            log.info("RAG 처리 시작됨");
            return ApiResponse.success("RAG 처리가 시작되었습니다.");

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            log.error("RAG 처리 실행 실패", e);
            throw new BaseException(ErrorCode.RAG_PROCESS_FAILED);
        }
    }
}