/**
 * dashboard.js - 대시보드 페이지 기능
 */

document.addEventListener('DOMContentLoaded', () => {
    // 로그인 상태 확인
    if (!checkAuth()) {
        // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = 'index.html';
        return;
    }
    
    // 사용자 정보 표시 및 대시보드 초기화 코드
    initializeDashboard();
});

// 대시보드 초기화 함수
function initializeDashboard() {
    // 현재 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem('ai_cardnews_user'));
    
    // 사용자 이름 표시
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && userInfo) {
        userNameElement.textContent = userInfo.name;
    }
    
    // 로그아웃 버튼 이벤트 연결
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // 대시보드의 다른 초기화 코드...
}

/**
 * 사용자 정보 로드 및 표시
 */
function loadUserInfo() {
    const userInfoStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!userInfoStr) return;
    
    const userInfo = JSON.parse(userInfoStr);
    
    // 사용자 이름 표시
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && userInfo.name) {
        userNameElement.textContent = userInfo.name;
    }
    
    // 사용자 이니셜 표시
    const userInitialElement = document.getElementById('user-initial');
    if (userInitialElement && userInfo.name) {
        userInitialElement.textContent = userInfo.name.charAt(0).toUpperCase();
    }
}

/**
 * 프로젝트 데이터 로드 (샘플 데이터)
 */
function loadProjects() {
    // 실제 구현에서는 서버에서 프로젝트 데이터를 가져옴
    const sampleProjects = [
        {
            id: 1,
            title: '2025년 건강검진 안내',
            status: 'completed',
            date: '2025-04-01',
            thumbnail: 'assets/images/thumbnail/thumbnail1.png'
        },
        {
            id: 2,
            title: '봄맞이 캠페인',
            status: 'in-progress',
            date: '2025-03-28',
            thumbnail: 'assets/images/thumbnail/thumbnail2.png'
        },
        {
            id: 3,
            title: '신규 서비스 출시 안내',
            status: 'review',
            date: '2025-03-25',
            thumbnail: 'assets/images/thumbnail/thumbnail3.png'
        },
        {
            id: 4,
            title: '2025년 상반기 이벤트',
            status: 'in-progress',
            date: '2025-03-20',
            thumbnail: 'assets/images/thumbnail/thumbnail4.png'
        },
        {
            id: 5,
            title: '모바일 앱 업데이트 공지',
            status: 'completed',
            date: '2025-03-15',
            thumbnail: 'assets/images/thumbnail/thumbnail5.png'
        },
        {
            id: 6,
            title: '서비스 개선 안내',
            status: 'completed',
            date: '2025-03-10',
            thumbnail: 'assets/images/thumbnail/thumbnail6.png'
        },
        {
            id: 7,
            title: '월간 뉴스레터',
            status: 'review',
            date: '2025-03-05',
            thumbnail: 'assets/images/thumbnail/thumbnail7.png'
        },
        {
            id: 8,
            title: '회사 연혁 소개',
            status: 'completed',
            date: '2025-03-01',
            thumbnail: 'assets/images/thumbnail/thumbnail8.png'
        },
        {
            id: 9,
            title: '신규 브랜드 론칭',
            status: 'draft',
            date: '2025-02-25',
            thumbnail: 'assets/images/thumbnail/thumbnail9.png'
        }
    ];
    
    // 프로젝트 카운트 요약 업데이트
    updateProjectCounts(sampleProjects);
    
    // 프로젝트 목록 표시
    renderProjects(sampleProjects);
}

/**
 * 프로젝트 요약 카운트 업데이트
 * @param {Array} projects - 프로젝트 목록
 */
function updateProjectCounts(projects) {
    // 전체 프로젝트 수
    document.getElementById('total-projects').textContent = projects.length;
    
    // 완료된 프로젝트 수
    const completed = projects.filter(project => project.status === 'completed').length;
    document.getElementById('completed-projects').textContent = completed;
    
    // 검토 중인 프로젝트 수
    const pending = projects.filter(project => project.status === 'review').length;
    document.getElementById('pending-projects').textContent = pending;
    
    // 초안 프로젝트 수
    const draft = projects.filter(project => project.status === 'draft').length;
    document.getElementById('draft-projects').textContent = draft;
}

/**
 * 프로젝트 목록 렌더링
 * @param {Array} projects - 프로젝트 목록
 * @param {string} filter - 필터 (전체, 진행 중, 검토 중, 완료, 초안)
 */
function renderProjects(projects, filter = 'all') {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    
    // 필터 적용
    let filteredProjects = projects;
    if (filter !== 'all') {
        filteredProjects = projects.filter(project => project.status === filter);
    }
    
    // 프로젝트가 없는 경우
    if (filteredProjects.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '조건에 맞는 프로젝트가 없습니다.';
        projectsGrid.appendChild(emptyMessage);
        return;
    }
    
    // 프로젝트 카드 생성
    filteredProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = project.id;
        
        // 상태에 따른 클래스 정의
        const statusClass = `status-${project.status}`;
        const statusText = getStatusText(project.status);
        
        card.innerHTML = `
            <div class="project-thumbnail">
                ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title}">` : ''}
                <div class="project-status ${statusClass}">${statusText}</div>
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-meta">
                    <div class="project-date">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM5 5v1h14V5H5z"></path>
                        </svg>
                        <span>${formatDate(project.date)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // 프로젝트 카드 클릭 이벤트
        card.addEventListener('click', () => {
            // 프로젝트 상태에 따라 다른 페이지로 이동
            let targetPage;
            switch (project.status) {
                case 'draft':
                case 'in-progress':
                    targetPage = 'create.html';
                    break;
                case 'review':
                    targetPage = 'validator.html';
                    break;
                case 'completed':
                    targetPage = 'export.html';
                    break;
                default:
                    targetPage = 'storyboard.html';
            }
            
            window.location.href = `${targetPage}?id=${project.id}`;
        });
        
        projectsGrid.appendChild(card);
    });
}

/**
 * 상태 코드를 한글 텍스트로 변환
 * @param {string} status - 상태 코드
 * @returns {string} - 상태 텍스트
 */
function getStatusText(status) {
    switch (status) {
        case 'in-progress':
            return '진행 중';
        case 'review':
            return '검토 중';
        case 'completed':
            return '완료';
        case 'draft':
            return '초안';
        default:
            return '기타';
    }
}

/**
 * 필터 탭 이벤트 설정
 */
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 활성 탭 변경
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 필터 적용
            const filter = tab.dataset.filter;
            const projects = getSampleProjects(); // 실제로는 저장된 데이터나 서버에서 가져옴
            renderProjects(projects, filter);
        });
    });
}

/**
 * 샘플 프로젝트 데이터 반환 (임시 함수)
 * 실제 구현에서는 저장된 데이터 또는 서버에서 가져온 데이터 사용
 */
function getSampleProjects() {
    return [
        {
            id: 1,
            title: '2025년 건강검진 안내',
            status: 'completed',
            date: '2025-04-01',
            thumbnail: 'assets/images/thumbnail/thumbnail1.png'
        },
        {
            id: 2,
            title: '봄맞이 캠페인',
            status: 'in-progress',
            date: '2025-03-28',
            thumbnail: 'assets/images/thumbnail/thumbnail2.png'
        },
        {
            id: 3,
            title: '신규 서비스 출시 안내',
            status: 'review',
            date: '2025-03-25',
            thumbnail: 'assets/images/thumbnail/thumbnail3.png'
        },
        {
            id: 4,
            title: '2025년 상반기 이벤트',
            status: 'in-progress',
            date: '2025-03-20',
            thumbnail: 'assets/images/thumbnail/thumbnail4.png'
        },
        {
            id: 5,
            title: '모바일 앱 업데이트 공지',
            status: 'completed',
            date: '2025-03-15',
            thumbnail: 'assets/images/thumbnail/thumbnail5.png'
        },
        {
            id: 6,
            title: '서비스 개선 안내',
            status: 'completed',
            date: '2025-03-10',
            thumbnail: 'assets/images/thumbnail/thumbnail6.png'
        },
        {
            id: 7,
            title: '월간 뉴스레터',
            status: 'review',
            date: '2025-03-05',
            thumbnail: 'assets/images/thumbnail/thumbnail7.png'
        },
        {
            id: 8,
            title: '회사 연혁 소개',
            status: 'completed',
            date: '2025-03-01',
            thumbnail: 'assets/images/thumbnail/thumbnail8.png'
        },
        {
            id: 9,
            title: '신규 브랜드 론칭',
            status: 'draft',
            date: '2025-02-25',
            thumbnail: 'assets/images/thumbnail/thumbnail9.png'
        }
    ];
}

/**
 * 검색 기능 설정
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    // 검색 버튼 클릭
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // 엔터 키 입력
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

/**
 * 검색 실행
 * @param {string} query - 검색어
 */
function performSearch(query) {
    query = query.trim().toLowerCase();
    
    if (!query) {
        // 검색어가 없으면 전체 프로젝트 표시
        loadProjects();
        return;
    }
    
    // 프로젝트 필터링 (제목 기준)
    const projects = getSampleProjects();
    const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(query)
    );
    
    // 검색 결과 렌더링
    renderProjects(filteredProjects);
    
    // 현재 활성화된 필터 탭 비활성화
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('.filter-tab[data-filter="all"]').classList.add('active');
}

/**
 * 로그아웃 이벤트 설정
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 로그아웃 확인
            if (confirm('로그아웃 하시겠습니까?')) {
                logout();
            }
        });
    }
}