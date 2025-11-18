# Flask 라이브러리에서 필요한 기능들을 가져옵니다
# Flask: 웹 서버를 만드는 기본 도구
# render_template: HTML 파일을 브라우저에 보여주는 기능
# request: 사용자가 보낸 데이터(메시지)를 받는 기능
# jsonify: Python 데이터를 JSON 형식으로 변환해서 보내는 기능
from flask import Flask, render_template, request, jsonify

# ollama: AI 모델을 실행하는 라이브러리
import ollama

# Flask 앱(애플리케이션)을 만듭니다
# __name__: 현재 파일의 이름을 의미 (Flask가 파일 위치를 알 수 있게 해줌)
app = Flask(__name__)

# 사용자별 대화 내용을 저장할 딕셔너리(사전)
# 구조: {'session1': [메시지1, 메시지2], 'session2': [메시지3, 메시지4]}
# 각 사용자(세션)마다 대화 내역을 따로 저장합니다
conversations = {}


# 사용자 메시지를 분석해서 어떤 AI 모델을 사용할지 결정하는 함수
def choose_model(user_message):
    """
    메시지 내용을 보고 코딩 질문인지 일반 질문인지 판단합니다
    
    매개변수:
        user_message: 사용자가 입력한 메시지 (문자열)
    
    반환값:
        'deepseek-coder' 또는 'gemma2' (문자열)
    """
    # 코딩 관련 키워드들을 리스트로 정의
    # 이 단어들이 메시지에 있으면 코딩 질문으로 판단
    coding_keywords = [
        '코드', '코딩', '프로그래밍', '파이썬', 'python', 
        '함수', '변수', '클래스', '에러', '오류', '버그', 
        'javascript', 'js', 'html', 'css', 'react', 
        'java', 'c++', 'sql', '알고리즘', '디버깅'
    ]
    
    # 메시지를 소문자로 변환 (대소문자 구분 없이 검색하기 위해)
    message_lower = user_message.lower()
    
    # any(): 리스트 안의 조건 중 하나라도 True면 True 반환
    # keyword in message_lower: 키워드가 메시지에 포함되어 있는지 확인
    if any(keyword in message_lower for keyword in coding_keywords):
        return 'deepseek-coder'  # 코딩 전문가 모델 선택
    else:
        return 'gemma2'  # 리서칭/범용 모델 선택


# 웹사이트의 메인 페이지 (홈페이지)
# @app.route('/'): 사용자가 "http://localhost:5000/"로 접속하면 이 함수 실행
@app.route('/')
def home():
    """
    메인 페이지를 보여주는 함수
    templates 폴더의 index.html 파일을 렌더링(표시)합니다
    """
    return render_template('index.html')


# 채팅 메시지를 처리하는 API 엔드포인트
# methods=['POST']: POST 방식으로 데이터를 받겠다는 의미 (데이터 전송용)
@app.route('/chat', methods=['POST'])
def chat():
    """
    사용자의 채팅 메시지를 받아서 AI에게 전달하고 응답을 돌려주는 함수
    """
    # request.json: 사용자가 보낸 JSON 데이터를 받습니다
    data = request.json
    
    # JSON에서 'message' 키의 값을 가져옵니다 (사용자가 입력한 메시지)
    user_message = data.get('message')
    
    # JSON에서 'session_id' 키의 값을 가져옵니다
    # 없으면 기본값으로 'default' 사용
    # session_id: 여러 사용자를 구분하는 고유 번호 (쿠키처럼)
    session_id = data.get('session_id', 'default')
    
    # 사용자 메시지를 분석해서 어떤 모델을 사용할지 결정
    selected_model = choose_model(user_message)
    
    # 이 세션의 대화 내역이 없으면 빈 리스트로 초기화
    # 처음 대화하는 사용자면 새로운 대화 공간을 만들어줍니다
    if session_id not in conversations:
        conversations[session_id] = []
    
    # 사용자 메시지를 대화 내역에 추가
    conversations[session_id].append({
        'role': 'user',           # 역할: 사용자
        'content': user_message    # 내용: 사용자가 입력한 메시지
    })
    
    # try-except: 에러가 발생할 수 있는 코드를 안전하게 실행
    try:
        # ollama.chat(): AI 모델에게 질문하고 답변 받기
        response = ollama.chat(
            model=selected_model,                    # 선택된 AI 모델 사용
            messages=conversations[session_id]       # 지금까지의 대화 내역 전체를 전달
        )
        
        # AI의 답변 텍스트만 추출
        # response는 딕셔너리 형태로 오는데, 그 안의 message -> content를 가져옴
        ai_message = response['message']['content']
        
        # AI 답변도 대화 내역에 추가 (다음 대화를 위해 기억해야 함)
        conversations[session_id].append({
            'role': 'assistant',      # 역할: AI 어시스턴트
            'content': ai_message     # 내용: AI가 생성한 답변
        })
        
        # 성공! 결과를 JSON 형태로 반환
        return jsonify({
            'success': True,              # 성공 여부
            'response': ai_message,       # AI의 답변
            'model_used': selected_model  # 어떤 모델을 사용했는지 (참고용)
        })
        
    # 에러가 발생하면 이 블록이 실행됩니다
    except Exception as e:
        # Exception: 모든 종류의 에러를 잡음
        # e: 에러 정보를 담고 있는 변수
        print(f"에러 발생: {e}")  # 콘솔에 에러 출력 (디버깅용)
        
        # 에러 메시지를 사용자에게 전달
        return jsonify({
            'success': False,          # 실패
            'error': str(e)            # 에러 내용을 문자열로 변환
        }), 500  # 500: HTTP 상태 코드 (서버 내부 에러)


# 대화 내역을 초기화하는 API 엔드포인트
@app.route('/clear', methods=['POST'])
def clear_history():
    """
    특정 세션의 대화 내역을 삭제하는 함수
    사용자가 "대화 초기화" 버튼을 누르면 실행됩니다
    """
    data = request.json
    session_id = data.get('session_id', 'default')
    
    # 해당 세션의 대화 내역이 있으면 빈 리스트로 초기화
    if session_id in conversations:
        conversations[session_id] = []
    
    # 성공 응답 반환
    return jsonify({'success': True})


# 프로그램이 직접 실행될 때만 아래 코드 실행
# 다른 파일에서 import 할 때는 실행되지 않음
if __name__ == '__main__':
    # Flask 웹 서버 시작!
    app.run(
        debug=True,   # 디버그 모드: 코드 수정하면 자동으로 서버 재시작
        port=5000     # 포트 번호: http://localhost:5000 으로 접속 가능
    )