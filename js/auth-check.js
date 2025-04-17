/**
 * auth-check.js - 인증 상태 확인 및 페이지 접근 제어
 */

document.addEventListener('DOMContentLoaded', () => {
    // 현재 페이지 경로 확인
    const currentPath = window.location.pathname;
    
    // 로그인 상태 확인
    const isAuthenticated = checkAuth();
    
    // 로그인 페이지에서의 처리
    if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        if (isAuthenticated) {
            // 이미 로그인된 사용자는 대시보드로 리디렉션
            window.location.replace('dashboard.html'); // replace 사용하여 히스토리에 남지 않게 함
            return; // 추가 실행 방지
        }
    } 
    // 대시보드 등 인증이 필요한 페이지에서의 처리
    else if (currentPath.includes('dashboard.html') || currentPath.includes('editor.html')) {
        if (!isAuthenticated) {
            // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
            window.location.replace('index.html'); // replace 사용하여 히스토리에 남지 않게 함
            return; // 추가 실행 방지
        }
    }
});
