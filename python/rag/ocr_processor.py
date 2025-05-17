import json
import logging

# 로깅 설정
logger = logging.getLogger(__name__)

def parse_paragraphs(raw, paragraph_gap=20):
    """OCR 결과에서 문단을 추출합니다."""
    logger.info("OCR 결과에서 문단 추출 시작")
    
    # 1) raw가 문자열이면 dict로 변환
    data = json.loads(raw) if isinstance(raw, str) else raw
    
    # 2) fields 추출
    img = data.get("images", [None])[0]
    if not img or "fields" not in img:
        raise ValueError("`images[0]['fields']`를 찾을 수 없습니다.")
    fields = img["fields"]
    
    # 3) y 기준 정렬
    fields.sort(key=lambda f: f["boundingPoly"]["vertices"][0]["y"])
    
    # 4) 줄 묶기 (lineBreak 기준)
    lines, cur_line = [], []
    for f in fields:
        text = f["inferText"]
        pt = f["boundingPoly"]["vertices"][0]
        cur_line.append((text, pt))
        if f.get("lineBreak", False):
            lines.append(cur_line)
            cur_line = []
    if cur_line:
        lines.append(cur_line)
    
    # 5) 단락 묶기 (줄 간격 기준)
    paragraphs, cur_para, prev_y = [], [], None
    for line in lines:
        line_y = min(pt["y"] for _, pt in line)
        if prev_y is not None and line_y - prev_y > paragraph_gap:
            paragraphs.append(cur_para)
            cur_para = []
        cur_para.append(line)
        prev_y = line_y
    if cur_para:
        paragraphs.append(cur_para)
    
    # 6) 결과 생성: text + top_y + bottom_y
    result = []
    for para in paragraphs:
        # 문단 텍스트
        texts = [" ".join(w for w, _ in line) for line in para]
        full_text = "\n".join(texts)
        # y 값만 모아서
        all_ys = [pt["y"] for line in para for _, pt in line]
        result.append({
            "text": full_text,
            "top_y": min(all_ys),
            "bottom_y": max(all_ys)
        })
    
    logger.info(f"총 {len(result)}개의 문단을 추출했습니다.")
    return result

def load_ocr_from_file(file_path):
    """파일에서 OCR 결과를 로드합니다."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"OCR 파일 로드 중 오류: {e}")
        raise