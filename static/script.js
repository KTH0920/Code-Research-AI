// HTML 요소들을 변수에 저장 (자주 사용하므로 미리 가져옴)
// document.getElementById(): HTML에서 id로 요소 찾기
const chatMessages = document.getElementById('chat-messages');    // 메시지 표시 영역
const userInput = document.getElementById('user-input');          // 사용자 입력창
const sendBtn = document.getElementById('send-btn');              // 전송 버튼
const loading = document.getElementById('loading');               // 로딩 표시
const modelIndicator = document.getElementById('model-indicator'); // 모델 표시

// 세션 ID 생성 (사용자를 구분하는 고유 번호)
// Date.now(): 현재 시간을 밀리초로 반환 (항상 다른 값이 나옴)
// 예: 'session_1234567890123'
const sessionId = 'session_' + Date.now();


/**
 * 메시지를 서버로 전송하는 함수
 * 사용자가 전송 버튼을 클릭하거나 Enter를 누르면 실행됩니다
 */
async function sendMessage() {
    // .trim(): 앞뒤 공백 제거
    // 예: '  안녕하세요  ' → '안녕하세요'
    const message = userInput.value.trim();
    
    // 메시지가 비어있으면 함수 종료 (빈 메시지 전송 방지)
    if (!message) return;
    
    // 사용자 메시지를 화면에 표시
    addMessage(message, 'user');
    
    // 입력창 비우기 (다음 입력을 위해)
    userInput.value = '';
    
    // UI 비활성화 (중복 전송 방지)
    sendBtn.disabled = true;                    // 전송 버튼 비활성화
    loading.style.display = 'block';            // 로딩 표시 보이기
    
    // try-catch: 에러가 발생할 수 있는 코드를 안전하게 실행
    try {
        // fetch(): 서버에 HTTP 요청 보내기 (Ajax)
        // await: 서버 응답을 기다림 (비동기 처리)
        const response = await fetch('/chat', {
            method: 'POST',              // POST 방식으로 전송
            headers: {
                'Content-Type': 'application/json'  // JSON 형식으로 보냄
            },
            // body: 서버로 보낼 데이터
            // JSON.stringify(): JavaScript 객체 → JSON 문자열 변환
            body: JSON.stringify({
                message: message,        // 사용자 메시지
                session_id: sessionId    // 세션 ID
            })
        });
        
        // 서버 응답을 JSON으로 파싱 (문자열 → JavaScript 객체)
        const data = await response.json();
        
        // 응답이 성공인지 확인
        if (data.success) {
            // AI 응답을 화면에 표시
            addMessage(data.response, 'ai');
            
            // 어떤 모델을 사용했는지 표시
            showModelIndicator(data.model_used);
        } else {
            // 에러 메시지 표시
            addMessage('오류가 발생했습니다: ' + data.error, 'ai');
        }
        
    } catch (error) {
        // 네트워크 에러나 서버 연결 실패 시
        // error.message: 에러 내용
        addMessage('서버 연결 오류: ' + error.message, 'ai');
        console.error('에러 상세:', error);  // 콘솔에 자세한 에러 출력
        
    } finally {
        // finally: 성공이든 실패든 무조건 실행되는 블록
        // UI 다시 활성화
        sendBtn.disabled = false;               // 전송 버튼 활성화
        loading.style.display = 'none';         // 로딩 표시 숨기기
        userInput.focus();                      // 입력창에 포커스 (바로 입력 가능)
    }
}


/**
 * 메시지를 화면에 추가하는 함수
 * @param {string} text - 표시할 메시지 내용
 * @param {string} type - 'user' 또는 'ai' (메시지 타입)
 */
function addMessage(text, type) {
    // 새 div 요소 생성 (메시지 하나를 담을 상자)
    const messageDiv = document.createElement('div');
    
    // 클래스 추가: 'message'와 'user-message' 또는 'ai-message'
    // 예: type이 'user'면 → 'message user-message'
    messageDiv.className = `message ${type}-message`;
    
    // 메시지 내용을 포맷팅해서 HTML로 변환
    const formattedText = formatMessage(text);
    messageDiv.innerHTML = formattedText;
    
    // 메시지를 채팅 영역에 추가
    // appendChild(): 자식 요소로 추가 (맨 아래에 붙음)
    chatMessages.appendChild(messageDiv);
    
    // 스크롤을 맨 아래로 이동 (최신 메시지 보이게)
    // scrollHeight: 전체 내용의 높이
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


/**
 * 메시지 내용을 포맷팅하는 함수
 * 코드 블록, 인라인 코드, 줄바꿈 등을 HTML로 변환
 * @param {string} text - 원본 텍스트
 * @returns {string} - 포맷팅된 HTML 문자열
 */
function formatMessage(text) {
    // 1. 코드 블록 처리: ```코드``` → <pre><code>코드</code></pre>
    // 정규표현식 설명:
    // ```           시작 부분
    // ([\s\S]*?)    모든 문자 (공백, 줄바꿈 포함) - 최소 매칭
    // ```           끝 부분
    // /g            전역 검색 (모든 매칭 찾기)
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 2. 인라인 코드 처리: `코드` → <code>코드</code>
    // [^`]+         백틱(`)이 아닌 문자들
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 3. 줄바꿈 처리: \n → <br>
    // \n            줄바꿈 문자
    // <br>          HTML 줄바꿈 태그
    text = text.replace(/\n/g, '<br>');
    
    // 4. 볼드 처리: **텍스트** → <strong>텍스트</strong>
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    return text;
}


/**
 * 사용된 모델을 화면에 표시하는 함수
 * @param {string} modelName - 모델 이름 ('deepseek-coder' 또는 'gemma2')
 */
function showModelIndicator(modelName) {
    // 모델 이름에 따라 한글로 변환
    let displayName;
    if (modelName === 'deepseek-coder') {
        displayName = '🔧 코딩 전문가';
    } else if (modelName === 'gemma2') {
        displayName = '🔍 리서칭 전문가';
    } else {
        displayName = modelName;  // 알 수 없는 모델이면 그대로 표시
    }
    
    // 모델 표시 영역에 텍스트 설정
    modelIndicator.textContent = `사용된 모델: ${displayName}`;
    modelIndicator.style.display = 'block';  // 표시
    
    // 3초 후 자동으로 숨김
    // setTimeout(): 일정 시간 후 함수 실행
    // 3000 = 3000밀리초 = 3초
    setTimeout(() => {
        modelIndicator.style.display = 'none';
    }, 3000);
}


/**
 * 대화 내역을 초기화하는 함수
 * "대화 초기화" 버튼 클릭 시 실행
 */
async function clearChat() {
    // 사용자에게 확인 물어보기
    // confirm(): 확인/취소 대화상자 표시
    // 확인 누르면 true, 취소 누르면 false 반환
    if (!confirm('대화를 초기화하시겠습니까?')) {
        return;  // 취소 누르면 함수 종료
    }
    
    try {
        // 서버에 초기화 요청 보내기
        await fetch('/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: sessionId
            })
        });
        
        // 화면의 모든 메시지 삭제
        // innerHTML = '': 내부 HTML을 빈 문자열로 (모든 자식 요소 제거)
        chatMessages.innerHTML = '';
        
        // 환영 메시지 표시
        addMessage('안녕하세요! 코딩과 리서칭 관련 질문을 해주세요. 😊', 'ai');
        
    } catch (error) {
        // 에러 발생 시 알림 표시
        alert('초기화 실패: ' + error.message);
    }
}


/**
 * Enter 키 이벤트 처리
 * Shift+Enter: 줄바꿈
 * Enter만: 메시지 전송
 */
// addEventListener(): 이벤트 리스너 등록
// 'keydown': 키보드를 눌렀을 때
userInput.addEventListener('keydown', function(e) {
    // e.key: 눌린 키의 이름
    // e.shiftKey: Shift 키가 눌려있는지 (true/false)
    
    if (e.key === 'Enter' && !e.shiftKey) {
        // Enter만 누르면 (Shift는 안 누른 상태)
        e.preventDefault();  // 기본 동작 막기 (줄바꿈 안 되게)
        sendMessage();       // 메시지 전송
    }
    // Shift+Enter는 기본 동작(줄바꿈)이 그대로 실행됨
});


/**
 * 페이지 로드 완료 시 실행되는 초기화 함수
 */
// window.addEventListener('load', ...): 페이지가 완전히 로드된 후 실행
window.addEventListener('load', () => {
    // 환영 메시지 표시
    addMessage('안녕하세요! 코딩과 리서칭 관련 질문을 해주세요. 😊', 'ai');
    
    // 입력창에 포커스 (바로 입력 가능하게)
    userInput.focus();
    
    // 콘솔에 시작 메시지 출력 (디버깅용)
    console.log('AI 챗봇이 시작되었습니다!');
    console.log('세션 ID:', sessionId);
});


// 페이지를 떠나기 전 경고 (작성 중인 내용 보호)
// 주석 처리됨 - 필요하면 주석 해제하세요

window.addEventListener('beforeunload', function(e) {
    // 대화 내역이 있으면 경고
    if (chatMessages.children.length > 1) {  // 환영 메시지 제외
        e.preventDefault();
        e.returnValue = ''; // 크롬에서 필요
    }
});