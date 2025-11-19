# 🤖 Code & Research AI

한국어 기반 AI 챗봇 - 코딩과 리서칭을 한 번에!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.0+-green.svg)

## 📌 프로젝트 소개

**Code & Research AI**는 예산 0원으로 개발한 한국어 특화 AI 챗봇입니다.

사용자의 질문을 자동으로 분석하여 코딩 질문에는 코딩 전문 AI를, 일반 질문에는 리서칭 전문 AI를 배치하여 최적의 답변을 제공합니다.

### ✨ 주요 기능

- 🔧 **코딩 전문가 모드**: `qwen2.5-coder` 모델을 활용한 코드 작성 및 디버깅
- 🔍 **리서칭 전문가 모드**: `gemma2` 모델을 활용한 지식 탐색 및 설명
- 🎯 **자동 모델 선택**: 질문 내용을 분석하여 적절한 AI 모델 자동 선택
- 💬 **대화 기억**: 세션별 대화 내역 관리
- 🎨 **직관적인 UI**: 전체 화면 반응형 디자인
- 💰 **완전 무료**: 오픈소스 모델만 사용하여 비용 0원

---

## 🚀 시작하기

### 필수 요구사항

- Python 3.8 이상
- Ollama
- 인터넷 연결 (모델 다운로드 시)

### 설치 방법

#### 1. 저장소 클론
```bash
git clone https://github.com/your-username/Code-Research-AI.git
cd Code-Research-AI
```

#### 2. Ollama 설치

**Windows:**
```bash
# https://ollama.com 에서 다운로드 및 설치
```

**Mac:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### 3. AI 모델 다운로드
```bash
# 코딩 전문 모델 (약 4GB)
ollama pull qwen2.5-coder:7b

# 리서칭 전문 모델 (약 5GB)
ollama pull gemma2
```

#### 4. Python 패키지 설치
```bash
pip install flask ollama
```

#### 5. 애플리케이션 실행
```bash
python app.py
```

브라우저에서 `http://localhost:5000` 접속!

---

## 📁 프로젝트 구조
```
Code-Research-AI/
├── app.py                 # Flask 백엔드 서버
├── templates/
│   └── index.html         # 메인 HTML 페이지
├── static/
│   ├── style.css          # 스타일시트
│   └── script.js          # JavaScript 로직
└── README.md              # 프로젝트 문서
```

---

## 🎯 사용 방법

### 코딩 질문 예시
```
"파이썬으로 피보나치 수열 코드 짜줘"
"React에서 useState 사용법 알려줘"
"이 에러 해결 방법: TypeError..."
```

→ **qwen2.5-coder** 모델이 한국어로 코드와 설명 제공

### 리서칭 질문 예시
```
"인공지능의 역사에 대해 알려줘"
"블록체인 기술이란?"
"양자컴퓨터의 원리 설명해줘"
```

→ **gemma2** 모델이 체계적으로 설명

---

## 🛠️ 기술 스택

### Backend
- **Flask 3.0+**: 웹 서버 프레임워크
- **Ollama**: 로컬 LLM 실행 환경

### Frontend
- **HTML5**: 페이지 구조
- **CSS3**: 스타일링 (그라디언트, 애니메이션)
- **Vanilla JavaScript**: 동적 기능 구현

### AI Models
- **qwen2.5-coder:7b**: 코딩 특화 모델 (한국어 우수)
- **gemma2**: 범용 LLM (한국어 우수)

---

## 🎨 주요 기능 상세

### 1. 자동 모델 선택

키워드 기반으로 질문 분석:
- 코딩 관련 키워드 감지 → `qwen2.5-coder` 사용
- 일반 질문 → `gemma2` 사용
```python
coding_keywords = ['코드', '파이썬', 'python', '함수', '에러', '버그', ...]

if any(keyword in message for keyword in coding_keywords):
    return 'qwen2.5-coder:7b'
else:
    return 'gemma2'
```

### 2. 시스템 프롬프트 최적화

각 모델에 맞는 역할 정의로 성능 극대화:
- 코딩 모델: "전문 프로그래머" 역할
- 리서칭 모델: "전문 연구원" 역할

### 3. 세션별 대화 관리

사용자별 대화 내역 저장:
```python
conversations = {
    'session_id': [
        {'role': 'system', 'content': '...'},
        {'role': 'user', 'content': '...'},
        {'role': 'assistant', 'content': '...'}
    ]
}
```

---

## 📊 성능 비교

| 모델 | 한국어 | 코딩 | 속도 | 메모리 |
|------|--------|------|------|--------|
| qwen2.5-coder:7b | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 중간 | 4GB |
| gemma2 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 빠름 | 5GB |
| deepseek-coder | ⭐⭐ | ⭐⭐⭐⭐⭐ | 중간 | 4GB |

---

## 🐛 트러블슈팅

### Ollama 연결 오류
```bash
# Ollama가 실행 중인지 확인
ollama list

# 모델이 다운로드되었는지 확인
ollama list
```

### 모델이 한국어로 답변하지 않을 때
- 브라우저에서 "대화 초기화" 버튼 클릭
- 새로운 세션에서 다시 질문

### 포트 충돌
```python
# app.py에서 포트 변경
app.run(debug=True, port=5001)  # 5000 → 5001
```

---

## 🔮 향후 계획

- [ ] 코드 복사 버튼
- [ ] 다크모드
- [ ] 파일 업로드 (코드 분석)
- [ ] 대화 내역 저장 (데이터베이스)
- [ ] 웹 배포 (Render/Vercel)
- [ ] 사용자 계정 시스템
- [ ] RAG (문서 기반 답변)

---

## 🤝 기여하기

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

## 👤 개발자

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들을 활용했습니다:

- [Ollama](https://ollama.com) - 로컬 LLM 실행 환경
- [Qwen2.5-Coder](https://github.com/QwenLM/Qwen2.5-Coder) - 코딩 특화 모델
- [Gemma](https://ai.google.dev/gemma) - Google의 오픈 LLM
- [Flask](https://flask.palletsprojects.com/) - 웹 프레임워크

---

## 📸 스크린샷

### 메인 화면
![Main Screen](screenshots/main.png)

### 코딩 답변 예시
![Coding Example](screenshots/coding.png)

### 리서칭 답변 예시
![Research Example](screenshots/research.png)

---

## ⚡ 빠른 시작 (요약)
```bash
# 1. 클론
git clone https://github.com/your-username/Code-Research-AI.git
cd Code-Research-AI

# 2. 모델 다운로드
ollama pull qwen2.5-coder:7b
ollama pull gemma2

# 3. 패키지 설치
pip install flask ollama

# 4. 실행
python app.py

# 5. 브라우저에서 localhost:5000 접속!
```

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**