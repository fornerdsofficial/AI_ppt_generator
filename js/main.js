/**
 * main.js - 공통 기능 및 유틸리티
 */

// 전역 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * 애플리케이션 초기화
 */
function initApp() {
    // 페이지 공통 요소 초기화
    setupThemeToggle();
    
    // 나중에 추가될 공통 기능들을 위한 자리
}

/**
 * 다크모드/라이트모드 토글 설정 (향후 구현)
 */
function setupThemeToggle() {
    // 향후 다크모드/라이트모드 전환 기능 구현
}

/**
 * 토스트 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 메시지 유형 (success, error, warning, info)
 * @param {number} duration - 표시 지속 시간 (ms)
 */
function showToast(message, type = 'info', duration = 3000) {
    // 기존 토스트 제거
    const existingToast = document.getElementById('toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 토스트 스타일 설정
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = 'var(--border-radius)';
    toast.style.backgroundColor = getToastColor(type);
    toast.style.color = '#fff';
    toast.style.boxShadow = 'var(--shadow-md)';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in-out';
    
    // 문서에 토스트 추가
    document.body.appendChild(toast);
    
    // 토스트 표시
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 지정된 시간 후 토스트 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

/**
 * 토스트 유형에 따른 배경색 반환
 * @param {string} type - 토스트 유형
 * @returns {string} - 배경색 값
 */
function getToastColor(type) {
    switch (type) {
        case 'success':
            return 'var(--success-color)';
        case 'error':
            return 'var(--danger-color)';
        case 'warning':
            return 'var(--warning-color)';
        case 'info':
        default:
            return 'var(--info-color)';
    }
}

/**
 * URL 파라미터 추출
 * @param {string} name - 파라미터 이름
 * @returns {string|null} - 파라미터 값
 */
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 페이지 로딩 표시
 * @param {boolean} show - 표시 여부
 */
function showLoading(show = true) {
    let loader = document.getElementById('page-loader');
    
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.className = 'page-loader';
            
            // 로더 스타일 설정
            loader.style.position = 'fixed';
            loader.style.top = '0';
            loader.style.left = '0';
            loader.style.width = '100%';
            loader.style.height = '100%';
            loader.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            loader.style.display = 'flex';
            loader.style.alignItems = 'center';
            loader.style.justifyContent = 'center';
            loader.style.zIndex = '9999';
            
            // 로딩 스피너 추가
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            spinner.style.width = '50px';
            spinner.style.height = '50px';
            spinner.style.border = '5px solid var(--gray-lighter)';
            spinner.style.borderTopColor = 'var(--primary-color)';
            spinner.style.borderRadius = '50%';
            spinner.style.animation = 'spin 1s linear infinite';
            
            // 애니메이션 정의
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            loader.appendChild(spinner);
            document.body.appendChild(loader);
        } else {
            loader.style.display = 'flex';
        }
    } else if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * 확인 대화상자 표시
 * @param {string} message - 표시할 메시지
 * @returns {Promise<boolean>} - 사용자 확인 여부
 */
function showConfirm(message) {
    return new Promise((resolve) => {
        // 기본 confirm 사용 (실제 구현에서는 커스텀 모달로 대체)
        const result = confirm(message);
        resolve(result);
    });
}