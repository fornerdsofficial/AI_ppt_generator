/**
 * auth.js - 사용자 인증-related 기능
 */

// 로그인 상태를 localStorage에 저장
const AUTH_KEY = 'ai_cardnews_auth';
const CURRENT_USER_KEY = 'ai_cardnews_user';

// 샘플 사용자 데이터 (실제 구현에서는 서버에서 인증)
const SAMPLE_USERS = [
    { id: 'admin', password: 'admin1234', name: '관리자', role: 'admin' },
    { id: 'designer1', password: 'design1234', name: '디자이너1', role: 'designer' },
    { id: 'editor1', password: 'editor1234', name: '에디터1', role: 'editor' }
];

// 로그인 폼 처리
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        // 중복 검사 제거 - auth-check.js에서만 처리
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 최근 프로젝트 로드
    loadRecentProjects();
    
    // 새 프로젝트 버튼 이벤트
    const createBtn = document.querySelector('.create-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            // 로그인이 필요함을 알림
            alert('새 프로젝트를 시작하려면 먼저 로그인해 주세요.');
        });
    }
});

/**
 * 로그인 처리 함수
 * @param {Event} e - 이벤트 객체
 */
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // 사용자 인증 (실제로는 서버 통신 필요)
    const user = authenticateUser(username, password);
    
    if (user) {
        // 로그인 성공
        saveAuth(user, remember);
        redirectToDashboard();
    } else {
        // 로그인 실패
        showError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
}

/**
 * 사용자 인증 함수 (실제로는 서버에서 처리)
 * @param {string} username - 사용자 아이디
 * @param {string} password - 비밀번호
 * @returns {Object|null} - 인증된 사용자 정보 또는 null
 */
function authenticateUser(username, password) {
    return SAMPLE_USERS.find(
        user => user.id === username && user.password === password
    );
}

/**
 * 인증 정보 저장
 * @param {Object} user - 사용자 정보
 * @param {boolean} remember - 로그인 상태 유지 여부
 */
function saveAuth(user, remember) {
    // 보안을 위해 비밀번호는 저장하지 않음
    const userInfo = {
        id: user.id,
        name: user.name,
        role: user.role
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userInfo));
    
    // 로그인 상태 유지 여부와 관계없이 기본 토큰 생성
    const token = btoa(user.id + ':' + Date.now());
    localStorage.setItem(AUTH_KEY, token);
    
    // remember가 true인 경우 추가 작업을 할 수 있음 (필요시)
}

/**
 * 인증 상태 확인 (개선된 버전)
 * @returns {boolean} - 인증 여부
 */
function checkAuth() {
    const token = localStorage.getItem(AUTH_KEY);
    const userInfoStr = localStorage.getItem(CURRENT_USER_KEY);
    
    // 디버깅을 위한 로그 추가
    console.log('Token:', token);
    console.log('User Info:', userInfoStr);
    
    if (!token || !userInfoStr) {
        console.log('No token or user info found');
        return false;
    }
    
    try {
        // 사용자 정보가 유효한 JSON인지 확인
        const userInfo = JSON.parse(userInfoStr);
        if (!userInfo || !userInfo.id) {
            console.log('Invalid user info');
            return false;
        }
        
        // 토큰 유효성 검사 (간단한 예시)
        // 실제 구현에서는 더 복잡한 토큰 검증 로직 필요
        const decodedToken = atob(token);
        const [userId, timestamp] = decodedToken.split(':');
        
        console.log('Decoded token:', decodedToken);
        console.log('User ID from token:', userId);
        console.log('Current user ID:', userInfo.id);
        
        // 토큰의 사용자 ID가 현재 사용자와 일치하는지 확인
        if (userId !== userInfo.id) {
            console.log('User ID mismatch');
            return false;
        }
        
        // 토큰 만료 확인 (예: 7일)
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7일
        
        console.log('Token age:', tokenAge);
        console.log('Max age:', maxAge);
        
        if (tokenAge > maxAge) {
            // 토큰 만료됨
            console.log('Token expired');
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);
            return false;
        }
        
        console.log('Authentication successful');
        return true;
    } catch (e) {
        // JSON 파싱 오류 등 예외 발생 시
        console.error('Authentication error:', e);
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        return false;
    }
}

/**
 * 로그아웃 처리
 */
function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.replace('index.html'); // replace 사용
}

/**
 * 대시보드로 리다이렉트
 */
function redirectToDashboard() {
    window.location.replace('dashboard.html'); // replace 사용하여 히스토리에 남지 않게 함
}

/**
 * 오류 메시지 표시
 * @param {string} message - 오류 메시지
 */
function showError(message) {
    // 기존 오류 메시지 제거
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // 새 오류 메시지 생성
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'var(--danger-color)';
    errorDiv.style.marginBottom = '1rem';
    errorDiv.textContent = message;
    
    // 폼 위에 오류 메시지 삽입
    const form = document.getElementById('login-form');
    form.insertBefore(errorDiv, form.firstChild);
}

/**
 * 최근 프로젝트 로드 (샘플 데이터)
 */
function loadRecentProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // 샘플 프로젝트 데이터
    const sampleProjects = [
        { id: 1, title: '2025년 건강검진 안내', date: '2025-04-01', thumbnail: 'assets/images/thumbnail/thumbnail1.png' },
        { id: 2, title: '봄맞이 캠페인', date: '2025-03-28', thumbnail: 'assets/images/thumbnail/thumbnail2.png' },
        { id: 3, title: '신규 서비스 출시 안내', date: '2025-03-25', thumbnail: 'assets/images/thumbnail/thumbnail3.png' },
        { id: 4, title: '2025년 상반기 이벤트', date: '2025-03-20', thumbnail: 'assets/images/thumbnail/thumbnail4.png' }
    ];
    
    // 프로젝트 카드 생성
    sampleProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'project-thumbnail';
        // 실제 썸네일이 있으면 이미지 태그로 교체
        if (project.thumbnail) {
            thumbnail.innerHTML = `<img src="${project.thumbnail}" alt="${project.title}">`;
        } else {
            thumbnail.innerHTML = `<span>미리보기 없음</span>`;
        }
        
        const info = document.createElement('div');
        info.className = 'project-info';
        
        const title = document.createElement('h4');
        title.className = 'project-title';
        title.textContent = project.title;
        
        const date = document.createElement('span');
        date.className = 'project-date';
        date.textContent = formatDate(project.date);
        
        info.appendChild(title);
        info.appendChild(date);
        
        card.appendChild(thumbnail);
        card.appendChild(info);
        
        // 카드 클릭 시 로그인 필요 알림
        card.addEventListener('click', () => {
            alert('프로젝트에 접근하려면 먼저 로그인해 주세요.');
        });
        
        projectsGrid.appendChild(card);
    });
}

/**
 * 날짜 포맷팅 함수
 * @param {string} dateString - 날짜 문자열 (YYYY-MM-DD)
 * @returns {string} - 포맷된 날짜 (YYYY.MM.DD)
 */
function formatDate(dateString) {
    return dateString.replace(/-/g, '.');
}