/**
 * creator.js - 카드뉴스 생성 기능
 */

document.addEventListener('DOMContentLoaded', () => {
    // 인증 확인
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }
    
    // 사용자 정보 로드
    loadUserInfo();
    
    // 단계 이동 버튼 설정
    setupStepNavigation();
    
    // 파일 업로드 처리
    setupFileUpload();
    
    // 카드 수 슬라이더 설정
    setupCardCountSlider();
    
    // 템플릿 선택 설정
    setupTemplateSelection();
    
    // 생성 버튼 이벤트
    setupGenerationProcess();
    
    // 로그아웃 이벤트 등록
    setupLogout();
});

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
 * 단계 이동 버튼 이벤트 설정
 */
function setupStepNavigation() {
    // 다음 단계 버튼
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextStep = button.dataset.next;
            if (validateCurrentStep(parseInt(nextStep) - 1)) {
                goToStep(nextStep);
            }
        });
    });
    
    // 이전 단계 버튼
    const prevButtons = document.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = button.dataset.prev;
            goToStep(prevStep);
        });
    });
}

/**
 * 현재 단계 유효성 검사
 * @param {number} currentStep - 현재 단계 번호
 * @returns {boolean} - 유효성 여부
 */
function validateCurrentStep(currentStep) {
    switch (currentStep) {
        case 1:
            // 1단계: 프로젝트 정보 검증
            return validateProjectInfo();
        case 2:
            // 2단계: 템플릿 선택 검증
            return validateTemplateSelection();
        case 3:
            // 3단계: AI 옵션 검증
            return validateAIOptions();
        default:
            return true;
    }
}

/**
 * 프로젝트 정보 유효성 검사
 * @returns {boolean} - 유효성 여부
 */
function validateProjectInfo() {
    const title = document.getElementById('project-title').value.trim();
    const topic = document.getElementById('project-topic').value.trim();
    const keywords = document.getElementById('project-keywords').value.trim();
    const content = document.getElementById('project-content').value.trim();
    const category = document.getElementById('project-category').value;
    
    if (!title) {
        showToast('프로젝트 제목을 입력해 주세요.', 'error');
        document.getElementById('project-title').focus();
        return false;
    }
    
    if (!topic) {
        showToast('주제를 입력해 주세요.', 'error');
        document.getElementById('project-topic').focus();
        return false;
    }
    
    if (!keywords) {
        showToast('키워드를 입력해 주세요.', 'error');
        document.getElementById('project-keywords').focus();
        return false;
    }
    
    if (!content) {
        showToast('상세 내용을 입력해 주세요.', 'error');
        document.getElementById('project-content').focus();
        return false;
    }
    
    if (!category) {
        showToast('카테고리를 선택해 주세요.', 'error');
        document.getElementById('project-category').focus();
        return false;
    }
    
    return true;
}

/**
 * 템플릿 선택 유효성 검사
 * @returns {boolean} - 유효성 여부
 */
function validateTemplateSelection() {
    // 템플릿 선택 또는 커스텀 템플릿 선택 확인
    const selectedTemplate = document.querySelector('input[name="template"]:checked');
    const customTemplate = document.getElementById('custom-template-btn').classList.contains('selected');
    
    if (!selectedTemplate && !customTemplate) {
        showToast('템플릿을 선택하거나 커스텀 디자인을 선택해 주세요.', 'error');
        return false;
    }
    
    return true;
}

/**
 * AI 옵션 유효성 검사
 * @returns {boolean} - 유효성 여부
 */
function validateAIOptions() {
    // AI 옵션은 기본값이 설정되어 있으므로 항상 유효함
    return true;
}

/**
 * 특정 단계로 이동
 * @param {string} stepNumber - 이동할 단계 번호
 */
function goToStep(stepNumber) {
    // 현재 활성화된 단계 및 콘텐츠 비활성화
    const currentStep = document.querySelector('.step.active');
    const currentContent = document.querySelector('.step-content.active');
    
    if (currentStep) currentStep.classList.remove('active');
    if (currentContent) currentContent.classList.remove('active');
    
    // 이전 단계 완료 표시
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum < parseInt(stepNumber)) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
    });
    
    // 새 단계 및 콘텐츠 활성화
    const newStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
    const newContent = document.getElementById(`step-${stepNumber}`);
    
    if (newStep) newStep.classList.add('active');
    if (newContent) newContent.classList.add('active');
    
    // 스크롤 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 파일 업로드 처리 설정
 */
function setupFileUpload() {
    const fileInput = document.getElementById('reference-files');
    const fileListElement = document.getElementById('file-list');
    const fileUploadLabel = document.querySelector('.file-upload-label');
    
    if (!fileInput || !fileListElement) return;
    
    // 파일 선택 이벤트
    fileInput.addEventListener('change', () => {
        updateFileList(fileInput.files);
    });
    
    // 드래그 앤 드롭 이벤트
    fileUploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.add('dragover');
    });
    
    fileUploadLabel.addEventListener('dragleave', () => {
        fileUploadLabel.classList.remove('dragover');
    });
    
    fileUploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadLabel.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            updateFileList(e.dataTransfer.files);
        }
    });
}

/**
 * 파일 목록 업데이트
 * @param {FileList} files - 선택된 파일 목록
 */
function updateFileList(files) {
    const fileListElement = document.getElementById('file-list');
    fileListElement.innerHTML = '';
    
    // 최대 5개 파일로 제한
    const maxFiles = 5;
    const filesToShow = Array.from(files).slice(0, maxFiles);
    
    filesToShow.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // 파일 아이콘 선택
        let fileIcon = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
            </svg>
        `;
        
        // 파일 유형에 따른 아이콘
        if (file.type.startsWith('image/')) {
            fileIcon = `
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
                </svg>
            `;
        } else if (file.type === 'application/pdf') {
            fileIcon = `
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"></path>
                </svg>
            `;
        }
        
        // 파일 크기 포맷팅
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-item-name">
                ${fileIcon}
                <span>${file.name}</span>
                <small>${fileSize}</small>
            </div>
            <button type="button" class="file-item-remove" data-index="${index}">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            </button>
        `;
        
        fileListElement.appendChild(fileItem);
        
        // 파일 삭제 버튼 이벤트
        const removeButton = fileItem.querySelector('.file-item-remove');
        removeButton.addEventListener('click', () => {
            fileItem.remove();
        });
    });
    
    // 최대 파일 수 초과 메시지
    if (files.length > maxFiles) {
        const warningElement = document.createElement('div');
        warningElement.className = 'file-warning';
        warningElement.textContent = `최대 ${maxFiles}개의 파일만 첨부할 수 있습니다. ${files.length - maxFiles}개의 파일이 무시되었습니다.`;
        fileListElement.appendChild(warningElement);
    }
}

/**
 * 파일 크기 포맷팅
 * @param {number} bytes - 파일 크기 (바이트)
 * @returns {string} - 포맷된 파일 크기
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 카드 수 슬라이더 설정
 */
function setupCardCountSlider() {
    const slider = document.getElementById('card-count');
    const valueDisplay = document.getElementById('card-count-value');
    
    if (!slider || !valueDisplay) return;
    
    // 초기값 설정
    valueDisplay.textContent = slider.value;
    
    // 슬라이더 값 변경 이벤트
    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
    });
}

/**
 * 템플릿 선택 설정
 */
function setupTemplateSelection() {
    // 템플릿 카테고리 필터링
    const categoryButtons = document.querySelectorAll('.template-category');
    const templateCards = document.querySelectorAll('.template-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성 카테고리 변경
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            // 템플릿 필터링
            templateCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategories = card.dataset.category.split(' ');
                    if (cardCategories.includes(category)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // 템플릿 카드 선택
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            const templateId = card.dataset.template;
            const radioButton = document.getElementById(templateId);
            
            if (radioButton) {
                radioButton.checked = true;
                
                // 모든 카드에서 선택 클래스 제거
                templateCards.forEach(c => c.classList.remove('selected'));
                
                // 현재 카드에 선택 클래스 추가
                card.classList.add('selected');
                
                // 커스텀 템플릿 버튼 선택 해제
                document.getElementById('custom-template-btn').classList.remove('selected');
            }
        });
    });
    
    // 커스텀 템플릿 버튼
    const customTemplateBtn = document.getElementById('custom-template-btn');
    customTemplateBtn.addEventListener('click', () => {
        // 모든 템플릿 라디오 버튼 선택 해제
        const radioButtons = document.querySelectorAll('input[name="template"]');
        radioButtons.forEach(radio => radio.checked = false);
        
        // 모든 카드에서 선택 클래스 제거
        templateCards.forEach(card => card.classList.remove('selected'));
        
        // 커스텀 템플릿 버튼 선택 표시
        customTemplateBtn.classList.add('selected');
    });
}

/**
 * 카드뉴스 생성 프로세스 설정
 */
function setupGenerationProcess() {
    const generateBtn = document.getElementById('generate-btn');
    
    if (!generateBtn) return;
    
    generateBtn.addEventListener('click', () => {
        // 현재 단계 유효성 검사
        if (!validateCurrentStep(3)) {
            return;
        }
        
        // 생성 시작
        startGeneration();
    });
    
    // 재생성 버튼
    const regenerateBtn = document.getElementById('regenerate-btn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            if (confirm('카드뉴스를 재생성하시겠습니까? 현재 생성된 내용은 사라집니다.')) {
                startGeneration();
            }
        });
    }
    
    // 스토리보드 편집기로 이동 버튼
    const continueToStoryboardBtn = document.getElementById('continue-to-storyboard-btn');
    if (continueToStoryboardBtn) {
        continueToStoryboardBtn.addEventListener('click', () => {
            // 프로젝트 데이터 저장
            saveProjectData();
            
            // 스토리보드 페이지로 이동
            window.location.href = 'storyboard.html?id=new';
        });
    }
}

/**
 * 카드뉴스 생성 시작
 */
function startGeneration() {
    // 생성 중 UI 표시
    showGenerationProgress();
    
    // 생성 버튼 비활성화
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = '생성 중...';
    
    // 로딩 진행 시뮬레이션 (실제로는 서버와 통신하여 AI 생성)
    simulateGenerationProgress();
}

/**
 * 생성 진행 UI 표시
 */
function showGenerationProgress() {
    // 진행 상태 초기화
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const generationLog = document.getElementById('generation-log');
    
    if (progressBar) progressBar.style.width = '0%';
    if (progressPercentage) progressPercentage.textContent = '0';
    if (generationLog) {
        generationLog.innerHTML = `
            <div class="log-item">프로젝트 정보 분석 중...</div>
        `;
    }
    
    // 결과 영역 숨기기
    const resultElement = document.getElementById('generation-result');
    if (resultElement) resultElement.style.display = 'none';
}

/**
 * 생성 진행 과정 시뮬레이션
 * 실제 구현에서는 서버와의 통신 및 진행 상황 업데이트로 대체
 */
function simulateGenerationProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const generationLog = document.getElementById('generation-log');
    
    const steps = [
        { progress: 10, message: '주제 및 키워드 분석 완료', delay: 1000 },
        { progress: 20, message: '콘텐츠 구조화 중...', delay: 1500 },
        { progress: 35, message: '카드 구성 및 시퀀스 생성 중...', delay: 2000 },
        { progress: 50, message: '텍스트 콘텐츠 생성 중...', delay: 2500 },
        { progress: 65, message: '이미지 스타일 및 레이아웃 설계 중...', delay: 2000 },
        { progress: 80, message: '시각 요소 생성 중...', delay: 2000 },
        { progress: 90, message: '최종 조정 및 검증 중...', delay: 1500 },
        { progress: 100, message: '카드뉴스 생성 완료!', delay: 1000, success: true }
    ];
    
    let currentStep = 0;
    
    function processStep() {
        if (currentStep >= steps.length) {
            // 모든 단계 완료 후 결과 표시
            finishGeneration();
            return;
        }
        
        const step = steps[currentStep];
        
        // 진행률 업데이트
        if (progressBar) progressBar.style.width = `${step.progress}%`;
        if (progressPercentage) progressPercentage.textContent = step.progress;
        
        // 로그 추가
        if (generationLog) {
            const logItem = document.createElement('div');
            logItem.className = `log-item${step.success ? ' success' : ''}`;
            logItem.textContent = step.message;
            generationLog.appendChild(logItem);
            
            // 로그 맨 아래로 스크롤
            generationLog.scrollTop = generationLog.scrollHeight;
        }
        
        currentStep++;
        
        // 다음 단계 처리
        setTimeout(processStep, step.delay);
    }
    
    // 시작
    setTimeout(processStep, 500);
}

/**
 * 생성 완료 후 결과 표시
 */
function finishGeneration() {
    // 생성 버튼 상태 복원
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = false;
    generateBtn.textContent = 'AI 카드뉴스 생성';
    
    // 결과 영역 표시
    const resultElement = document.getElementById('generation-result');
    if (resultElement) {
        resultElement.style.display = 'block';
        
        // 결과 영역으로 스크롤
        resultElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 미리보기 카드 생성 (실제로는 서버에서 받은 데이터로 생성)
    createPreviewCards();
}

/**
 * 미리보기 카드 생성
 * 실제 구현에서는 서버에서 받은 카드뉴스 데이터로 대체
 */
function createPreviewCards() {
    const previewCarousel = document.querySelector('.preview-carousel');
    const currentCardIndicator = document.getElementById('current-card');
    const totalCardsIndicator = document.getElementById('total-cards');
    
    if (!previewCarousel) return;
    
    // 미리보기 플레이스홀더 제거
    previewCarousel.innerHTML = '';
    
    // 카드 수 가져오기
    const cardCount = parseInt(document.getElementById('card-count').value) || 5;
    
    // 총 카드 수 표시
    if (totalCardsIndicator) totalCardsIndicator.textContent = cardCount;
    
    // 현재 카드 표시 (첫 번째 카드)
    if (currentCardIndicator) currentCardIndicator.textContent = 1;
    
    // 샘플 카드 생성
    for (let i = 0; i < cardCount; i++) {
        const card = document.createElement('div');
        card.className = 'preview-card';
        card.style.display = i === 0 ? 'block' : 'none'; // 첫 번째 카드만 표시
        
        // 이미지 인덱스 (1부터 시작하는 이미지 파일명에 맞춤)
        const imageIndex = (i % 5) + 1; // 5개의 이미지를 순환하여 사용
        
        // 카드 내용 (1:1 비율 및 이미지 포함)
        card.innerHTML = `
            <div class="card-content">
                <img src="assets/images/previews/card${imageIndex}.png" alt="Preview ${i+1}" class="card-image">
                <div class="card-overlay">
                    <h3>카드 ${i + 1}</h3>
                    <p>AI 카드뉴스 미리보기</p>
                </div>
            </div>
        `;
        
        previewCarousel.appendChild(card);
    }
    
    // 이전/다음 카드 버튼 설정
    setupPreviewNavigation(cardCount);
}

/**
 * 미리보기 내비게이션 설정
 * @param {number} cardCount - 총 카드 수
 */
function setupPreviewNavigation(cardCount) {
    const prevButton = document.querySelector('.prev-card');
    const nextButton = document.querySelector('.next-card');
    const currentCardIndicator = document.getElementById('current-card');
    
    let currentCardIndex = 0;
    
    if (prevButton && nextButton) {
        // 이전 카드 버튼
        prevButton.addEventListener('click', () => {
            if (currentCardIndex > 0) {
                showCard(currentCardIndex - 1);
            }
        });
        
        // 다음 카드 버튼
        nextButton.addEventListener('click', () => {
            if (currentCardIndex < cardCount - 1) {
                showCard(currentCardIndex + 1);
            }
        });
    }
    
    /**
     * 특정 카드 표시
     * @param {number} index - 표시할 카드 인덱스
     */
    function showCard(index) {
        // 모든 카드 숨기기
        const cards = document.querySelectorAll('.preview-card');
        cards.forEach(card => card.style.display = 'none');
        
        // 선택한 카드 표시
        if (cards[index]) {
            cards[index].style.display = 'block';
        }
        
        // 현재 카드 인덱스 업데이트
        currentCardIndex = index;
        
        // 카드 번호 표시 업데이트
        if (currentCardIndicator) {
            currentCardIndicator.textContent = index + 1;
        }
    }
}

/**
 * 프로젝트 데이터 저장
 * 실제 구현에서는 서버에 저장하거나 로컬 스토리지에 임시 저장
 */
function saveProjectData() {
    // 프로젝트 정보 수집
    const projectData = {
        title: document.getElementById('project-title').value,
        description: document.getElementById('project-description').value,
        category: document.getElementById('project-category').value,
        priority: document.getElementById('project-priority').value,
        topic: document.getElementById('project-topic').value,
        keywords: document.getElementById('project-keywords').value,
        content: document.getElementById('project-content').value,
        template: document.querySelector('input[name="template"]:checked')?.value || 'custom',
        aiOptions: {
            cardCount: document.getElementById('card-count').value,
            contentStyle: document.getElementById('content-style').value,
            tone: document.getElementById('tone').value,
            imageStyle: document.getElementById('image-style').value,
            colorScheme: document.getElementById('color-scheme').value,
            textAmount: document.querySelector('input[name="text-amount"]:checked')?.value || 'balanced',
            imageRatio: document.querySelector('input[name="image-ratio"]:checked')?.value || 'balanced',
            includeStatistics: document.getElementById('include-statistics').checked,
            includeCta: document.getElementById('include-cta').checked,
            includeSources: document.getElementById('include-sources').checked
        },
        createdAt: new Date().toISOString(),
        status: 'draft'
    };
    
    // 로컬 스토리지에 임시 저장 (실제로는 서버에 저장)
    localStorage.setItem('temp_project_data', JSON.stringify(projectData));
    
    console.log('프로젝트 데이터 저장됨:', projectData);
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
            if (confirm('로그아웃 하시겠습니까? 저장하지 않은 변경사항은 사라집니다.')) {
                logout();
            }
        });
    }
}