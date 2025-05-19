package com.conkiri.domain.chatbot.dto.response;

import java.util.List;
import java.util.Map;

// 간소화된 ChatResponseDTO
public record ChatbotResponseDTO(
        String answer,
        boolean hasEvidenceImage,
        String evidenceImageUrl
) {
    public static ChatbotResponseDTO fromPythonResponse(Map<String, Object> pythonResponse) {
        String answer = (String) pythonResponse.get("answer");
        boolean hasEvidenceImage = (boolean) pythonResponse.get("has_evidence_image");
        String evidenceImageUrl = (String) pythonResponse.get("evidence_image_url");

        return new ChatbotResponseDTO(
                answer,
                hasEvidenceImage,
                evidenceImageUrl
        );
    }
}