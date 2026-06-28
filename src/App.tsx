/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  Users, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  Download, 
  BookOpen, 
  CheckCircle, 
  HelpCircle,
  Undo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 초등학생들이 좋아할 만한 귀여운 동물/캐릭터 이모지 세트 (20가지)
const STUDENT_EMOJIS = [
  "🐰", "🦊", "🦁", "🐼", "🐨", 
  "🐯", "🐵", "🐹", "🐱", "🐶", 
  "🐸", "🐷", "🐧", "🦖", "🦄", 
  "🐝", "🐙", "🦀", "🐬", "🐣"
];

// 예시로 채워넣을 수 있는 친근한 한국 초등학생 이름 20명
const EXAMPLE_NAMES = [
  "민우", "서연", "도윤", "하은", "지호", 
  "지우", "예준", "수아", "준우", "지원", 
  "우진", "윤아", "건우", "시아", "유준", 
  "다은", "선우", "서현", "민재", "채원"
];

export default function App() {
  // --- 상태 관리 (State) ---
  // 1. 학생 수 (기본값: 15명, 최소 1명 ~ 최대 20명)
  const [studentCount, setStudentCount] = useState<number>(15);
  
  // 2. 학생 이름 목록 (20명 고정 크기 배열, 빈 값은 자동으로 '학생 번호'로 대체)
  const [studentNames, setStudentNames] = useState<string[]>(() => {
    return Array.from({ length: 20 }, (_, i) => `학생 ${i + 1}`);
  });

  // 3. 임시로 입력 중인 학생 이름을 추적하기 위한 상태
  const [tempNames, setTempNames] = useState<string[]>(() => {
    return Array.from({ length: 20 }, (_, i) => `학생 ${i + 1}`);
  });

  // 4. 배정된 자리 목록 (크기 20의 배열. 각 원소는 학생의 인덱스(0~19) 또는 빈자리(null))
  const [assignedSeats, setAssignedSeats] = useState<(number | null)[]>(() => {
    // 초기에는 순서대로 임시 배정해 보여줍니다.
    return Array.from({ length: 20 }, (_, i) => i < 15 ? i : null);
  });

  // 5. 셔플(무작위 섞기) 애니메이션 진행 여부
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  // 6. 학급 이름 (예: "3학년 1반")
  const [className, setClassName] = useState<string>("우리 반");

  // 7. 배움터(이론 설명) 아코디언 열림 상태
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(true);

  // --- 부가 효과 (Effects) ---
  // 학생 수가 변경되면 해당 범위에 맞춰 기본 자리 배치를 갱신합니다.
  useEffect(() => {
    // 셔플 중이 아닐 때만 반응
    if (!isShuffling) {
      const initialSeats = Array.from({ length: 20 }, (_, i) => i < studentCount ? i : null);
      setAssignedSeats(initialSeats);
    }
    
    // 이름 템플릿 맞춤 설정
    setTempNames(prev => {
      const updated = [...prev];
      for (let i = 0; i < 20; i++) {
        // 기존 값이 비었거나 기본값 형태인 경우 갱신해줍니다.
        if (!updated[i] || updated[i].startsWith('학생 ')) {
          updated[i] = `학생 ${i + 1}`;
        }
      }
      return updated;
    });
    setStudentNames(prev => {
      const updated = [...prev];
      for (let i = 0; i < 20; i++) {
        if (!updated[i] || updated[i].startsWith('학생 ')) {
          updated[i] = `학생 ${i + 1}`;
        }
      }
      return updated;
    });
  }, [studentCount]);

  // --- 핵심 비즈니스 로직 (Handlers) ---

  // 특정 학생의 이름을 변경할 때 호출되는 함수
  const handleNameChange = (index: number, newName: string) => {
    setTempNames(prev => {
      const updated = [...prev];
      updated[index] = newName;
      return updated;
    });
    
    setStudentNames(prev => {
      const updated = [...prev];
      updated[index] = newName || `학생 ${index + 1}`;
      return updated;
    });
  };

  // 모든 학생의 이름을 '학생 1, 학생 2...' 기본값으로 초기화하는 함수
  const resetNamesToDefault = () => {
    const defaultNames = Array.from({ length: 20 }, (_, i) => `학생 ${i + 1}`);
    setTempNames(defaultNames);
    setStudentNames(defaultNames);
  };

  // 예시 이름으로 20명 전체를 채워넣어 테스트를 편리하게 해주는 함수
  const fillExampleNames = () => {
    const updated = [...EXAMPLE_NAMES];
    setTempNames(updated);
    setStudentNames(updated);
  };

  // 무작위로 자리를 섞는 핵심 알고리즘 (Fisher-Yates Shuffle 응용)
  const generateRandomSeats = (count: number): (number | null)[] => {
    // 교실에 배치할 20개의 자리판을 만듭니다.
    // 학생 수만큼은 해당 학생의 번호(0 ~ count-1)를 넣고, 나머지는 null(빈자리)을 배치합니다.
    const desks: (number | null)[] = Array.from({ length: 20 }, (_, i) => i < count ? i : null);

    // 배열 무작위 섞기 (피셔-예이츠 알고리즘)
    for (let i = desks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = desks[i];
      desks[i] = desks[j];
      desks[j] = temp;
    }

    return desks;
  };

  // 자리 바꾸기 버튼 클릭 시 애니메이션 효과와 함께 자리를 섞어주는 함수
  const handleAssignSeats = () => {
    if (isShuffling) return;
    setIsShuffling(true);

    let tickCount = 0;
    const maxTicks = 20; // 20번 임시 자리를 섞으며 긴장감을 연출합니다.

    const timer = setInterval(() => {
      setAssignedSeats(generateRandomSeats(studentCount));
      tickCount++;

      // 충분히 자리가 바뀐 연출이 끝나면 정지
      if (tickCount >= maxTicks) {
        clearInterval(timer);
        // 마지막 최종 자리 배치 확정
        setAssignedSeats(generateRandomSeats(studentCount));
        setIsShuffling(false);
      }
    }, 60); // 0.06초 간격으로 빠르게 바뀜
  };

  // --- HTML 단일 파일로 내보내기 (Export) ---
  // 사용자가 단일 index.html 파일 형태로 컴퓨터에 저장해 오프라인으로 더블클릭 실행할 수 있게 지원합니다.
  const handleExportToHTML = () => {
    const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // 단일 HTML 파일 템플릿 생성
    const standaloneHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${className} 신나는 자리 바꾸기 프로그램 🏫</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- 구글 둥근 폰트 Jua, Nanum Gothic, Nanum Pen Script, Noto Sans KR 로드 -->
    <link href="https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Gothic:wght@400;700&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
            min-height: 100vh;
        }
        .font-jua {
            font-family: 'Jua', sans-serif;
        }
        .font-pen {
            font-family: 'Nanum Pen Script', cursive;
        }
        .frosted {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        /* 스크롤바 디자인 */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #bae6fd;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #38bdf8;
        }
    </style>
</head>
<body class="text-slate-800 p-4 md:p-8">

    <div class="max-w-7xl mx-auto">
        <!-- 상단 헤더 (Frosted Glass) -->
        <header class="text-center mb-8 frosted rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            <div class="absolute -top-10 -left-10 w-24 h-24 bg-sky-200/40 rounded-full opacity-50"></div>
            <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200/40 rounded-full opacity-50"></div>
            
            <span class="inline-block px-4 py-1.5 bg-sky-100 text-sky-700 text-sm font-bold rounded-full mb-3">
                🎒 오프라인 실행용 단일 파일 다운로드 버전
            </span>
            <h1 id="mainTitle" class="text-4xl md:text-6xl font-pen text-sky-800 tracking-wide flex items-center justify-center gap-3">
                🏫 <span class="text-sky-600">${className}</span> 자리 바꾸기! ✨
            </h1>
            <p class="text-slate-500 mt-2 text-sm md:text-base font-medium">우리 반 친구들의 자리를 공정하고 재미있게 무작위로 배정해보아요!</p>
        </header>

        <!-- 메인 콘텐츠 영역 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- 왼쪽 패널: 제어 및 명단 입력 -->
            <div class="lg:col-span-4 space-y-6">
                <!-- 학생 수 선택 카드 -->
                <div class="frosted rounded-3xl p-6 shadow-md">
                    <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
                        👥 1단계. 학생 수 선택
                    </h2>
                    <p class="text-xs text-slate-400 mb-4">현재 학급의 학생 수(최대 20명)를 설정하세요.</p>
                    
                    <!-- 숫자 클릭 배지 형태 선택기 -->
                    <div class="grid grid-cols-5 gap-2 mb-4">
                        \${Array.from({length: 20}, (_, i) => {
                            const countNum = i + 1;
                            const isSelected = countNum === ${studentCount};
                            return \`<button onclick="changeStudentCount(\${countNum})" id="btn-count-\${countNum}" class="py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border \${countNum === ${studentCount} ? 'bg-sky-400 text-white border-sky-400 shadow-md scale-105 font-jua' : 'bg-white/40 hover:bg-white/70 text-sky-800 border-sky-100'}" id="count-\${countNum}">\${countNum}</button>\`;
                        }).join('')}
                    </div>
                </div>

                <!-- 학생 이름 수정 카드 -->
                <div class="frosted rounded-3xl p-6 shadow-md">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-bold flex items-center gap-2 text-slate-700">
                            ✏️ 2단계. 이름 입력
                        </h2>
                        <div class="flex gap-1.5">
                            <button onclick="fillExamples()" class="px-2.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl text-xs font-bold transition-all">
                                예시 이름
                            </button>
                            <button onclick="clearNames()" class="px-2.5 py-1.5 bg-slate-100/80 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">
                                초기화
                            </button>
                        </div>
                    </div>
                    <p class="text-xs text-slate-400 mb-4">이름을 입력하지 않으면 '학생 번호'가 기본으로 지정됩니다.</p>
                    
                    <div id="namesContainer" class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                        <!-- 동적으로 입력란이 렌더링됩니다 -->
                    </div>
                </div>
            </div>

            <!-- 오른쪽 패널: 교실 지도 (4x5 그리드) -->
            <div class="lg:col-span-8 space-y-6">
                <!-- 교실 칠판 및 자리 맵 -->
                <div class="frosted rounded-3xl p-6 md:p-8 shadow-lg flex flex-col items-center">
                    
                    <!-- 선생님 책상 디자인 -->
                    <div class="w-48 h-12 bg-orange-300 border-b-4 border-orange-500 rounded-b-3xl flex items-center justify-center text-orange-900 font-bold shadow-md mb-8">
                        👩‍🏫 선생님 책상 (앞)
                    </div>

                    <!-- 4행 5열 자리 그리드 -->
                    <div id="seatMapGrid" class="grid grid-cols-5 gap-3 md:gap-4 w-full">
                        <!-- 동적으로 자리가 배치됩니다 -->
                    </div>

                    <!-- 동작 조작 버튼 모음 -->
                    <div class="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
                        <button onclick="assignSeats()" id="shuffleBtn" class="flex-1 py-4 bg-sky-400 hover:bg-sky-500 text-white font-jua text-xl rounded-2xl shadow-lg border-b-4 border-sky-600 transition-all active:translate-y-0.5 active:border-b-2 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            🎲 두근두근 자리 배정
                        </button>
                        <button onclick="assignSeats()" id="reshuffleBtn" class="flex-1 py-4 bg-white text-sky-600 hover:bg-sky-50/50 border-2 border-sky-200 font-jua text-xl rounded-2xl shadow-lg transition-all active:translate-y-0.5 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            🔄 다시 자리 바꾸기
                        </button>
                    </div>
                </div>
            </div>

        </div>

        <!-- 하단: 배움터 / 원리 설명 (HTML 요구사항 만족) -->
        <footer class="mt-12 frosted rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-md">
            <h3 class="text-lg font-jua text-sky-800 mb-3 flex items-center gap-2">
                🎓 초등 컴퓨터 교실: 이 프로그램의 작동 원리 알아보기!
            </h3>
            <div class="text-sm text-sky-900/80 space-y-3 leading-relaxed">
                <p>
                    <strong>Q1. 새로고침을 하면 왜 입력한 이름이 전부 초기화될까요?</strong><br>
                    컴퓨터의 메모리에는 데이터를 임시로 보관하는 <strong>휘발성 메모리(RAM)</strong>와 영구히 보관하는 <strong>비휘발성 기억장치(SSD, HDD 등)</strong>가 있어요. 
                    이 프로그램은 별도의 데이터베이스나 LocalStorage를 일절 사용하지 않고, 여러분이 브라우저를 켜고 활동하는 동안에만 브라우저가 관리하는 <strong>임시 메모리</strong>에 이름을 저장합니다. 
                    따라서 새로고침을 누르면 컴퓨터가 웹페이지를 완전히 처음부터 다시 다운로드해 시작하므로 기억하고 있던 임시 정보가 깨끗하게 지워지고 초기화되는 것이랍니다!
                </p>
                <p>
                    <strong>Q2. 데이터베이스(Database)가 없는 프로그램은 어떤 특징이 있나요?</strong><br>
                    첫째, <strong>로그인이 필요 없고 개인정보 유출 걱정이 전혀 없어요!</strong> 여러분이 입력한 아이들의 소중한 실명이 인터넷 공간 어딘가의 서버로 절대 전송되지 않고 본인 모니터 화면에만 머물기 때문에 100% 안전합니다.<br>
                    둘째, <strong>오프라인에서도 언제 어디서든 바로 작동해요!</strong> 인터넷 연결이 끊겨도, 산속 캠핑장에서 노트북 전원만 켜면 완벽하게 자리를 배정할 수 있을 정도로 똑똑하고 가볍답니다.<br>
                    셋째, <strong>데이터가 누적되지 않아요.</strong> 매번 실행할 때마다 늘 새롭고 깨끗한 상태에서 시작하므로 찌꺼기 파일이 컴퓨터에 남지 않아 기기가 느려지지 않습니다.
                </p>
                <div class="pt-4 border-t border-sky-200/50 text-center text-xs text-sky-700 font-medium">
                    내보낸 날짜: ${dateStr} | 제작자: 12kong04@gmail.com
                </div>
            </div>
        </footer>
    </div>

    <!-- 실행용 스크립트 -->
    <script>
        // 전역 상태 변수들
        let studentCount = ${studentCount};
        let studentNames = ${JSON.stringify(studentNames)};
        let assignedSeats = \${JSON.stringify(assignedSeats)};
        let isShuffling = false;

        const STUDENT_EMOJIS = ${JSON.stringify(STUDENT_EMOJIS)};
        const EXAMPLE_NAMES = ${JSON.stringify(EXAMPLE_NAMES)};

        // 명단 렌더러 함수
        function renderNamesInputs() {
            const container = document.getElementById('namesContainer');
            container.innerHTML = '';
            
            for (let i = 0; i < studentCount; i++) {
                const nameVal = studentNames[i] || '학생 ' + (i + 1);
                const inputHtml = \`
                    <div class="flex items-center gap-2 p-1.5 bg-white/50 rounded-xl border border-sky-50">
                        <span class="text-xs font-bold text-sky-400 w-5 text-right">\${i+1}</span>
                        <input type="text" 
                               value="\${nameVal}" 
                               oninput="updateStudentName(\${i}, this.value)"
                               class="w-full bg-white/80 px-2 py-1 text-sm font-semibold rounded border border-sky-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
                               placeholder="이름 입력">
                    </div>
                \`;
                container.insertAdjacentHTML('beforeend', inputHtml);
            }
        }

        // 자리 배치도 렌더러 함수
        function renderSeatMap() {
            const grid = document.getElementById('seatMapGrid');
            grid.innerHTML = '';

            for (let i = 0; i < 20; i++) {
                const studentIndex = assignedSeats[i];
                let seatHtml = '';

                if (studentIndex !== null && studentIndex < studentCount) {
                    const name = studentNames[studentIndex] || '학생 ' + (studentIndex + 1);
                    const emoji = STUDENT_EMOJIS[studentIndex % STUDENT_EMOJIS.length];
                    
                    seatHtml = \`
                        <div class="aspect-[4/3.5] bg-white/90 rounded-2xl p-2.5 shadow-md border-2 border-sky-400 flex flex-col justify-between items-center transition-all duration-150 hover:shadow-lg hover:scale-[1.02]">
                            <div class="w-full flex justify-between items-center text-[10px] font-bold text-sky-400">
                                <span>\${i + 1}번 자리</span>
                                <span class="bg-sky-50 px-1 rounded">\${studentIndex + 1}번</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-xl md:text-2xl mb-1 animate-bounce">\${emoji}</span>
                                <span class="text-sm md:text-base font-jua text-sky-950 text-center truncate max-w-full">\${name}</span>
                            </div>
                            <div class="h-1.5 w-8 bg-sky-200 rounded-full"></div>
                        </div>
                    \`;
                } else {
                    // 빈자리 출력
                    seatHtml = \`
                        <div class="aspect-[4/3.5] frosted rounded-2xl p-2.5 border-2 border-dashed border-sky-200 flex flex-col justify-center items-center opacity-60">
                            <span class="text-[10px] font-bold text-sky-300 mb-1">\${i + 1}번 자리</span>
                            <span class="text-xs text-sky-300 font-medium font-jua">🪑 빈자리</span>
                        </div>
                    \`;
                }
                grid.insertAdjacentHTML('beforeend', seatHtml);
            }
        }

        // 학생 수 변경 함수
        function changeStudentCount(count) {
            if (isShuffling) return;
            studentCount = count;
            
            // 학생 수 배지 토글 디자인 갱신
            for(let i=1; i<=20; i++) {
                const btn = document.getElementById('btn-count-' + i);
                if (btn) {
                    if (i === count) {
                        btn.className = "py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border bg-sky-400 text-white border-sky-400 shadow-md scale-105 font-jua";
                    } else {
                        btn.className = "py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border bg-white/40 hover:bg-white/70 text-sky-800 border-sky-100";
                    }
                }
            }

            // 기본 자리 배열 업데이트
            assignedSeats = Array.from({ length: 20 }, (_, i) => i < studentCount ? i : null);
            
            renderNamesInputs();
            renderSeatMap();
        }

        // 실시간 학생 이름 동기화
        function updateStudentName(index, val) {
            studentNames[index] = val || '학생 ' + (index + 1);
            renderSeatMap();
        }

        // 예시 이름으로 채우기
        function fillExamples() {
            if (isShuffling) return;
            for(let i=0; i<20; i++) {
                studentNames[i] = EXAMPLE_NAMES[i];
            }
            renderNamesInputs();
            renderSeatMap();
        }

        // 기본 이름으로 초기화
        function clearNames() {
            if (isShuffling) return;
            for(let i=0; i<20; i++) {
                studentNames[i] = '학생 ' + (i + 1);
            }
            renderNamesInputs();
            renderSeatMap();
        }

        // 자리 배정하기 (무작위 섞기)
        function generateRandomSeatsArray(count) {
            const desks = Array.from({ length: 20 }, (_, i) => i < count ? i : null);
            for (let i = desks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = desks[i];
                desks[i] = desks[j];
                desks[j] = temp;
            }
            return desks;
        }

        function assignSeats() {
            if (isShuffling) return;
            isShuffling = true;
            document.getElementById('shuffleBtn').disabled = true;
            document.getElementById('reshuffleBtn').disabled = true;

            let tickCount = 0;
            const maxTicks = 18;

            const timer = setInterval(() => {
                assignedSeats = generateRandomSeatsArray(studentCount);
                renderSeatMap();
                tickCount++;

                if (tickCount >= maxTicks) {
                    clearInterval(timer);
                    assignedSeats = generateRandomSeatsArray(studentCount);
                    renderSeatMap();
                    isShuffling = false;
                    document.getElementById('shuffleBtn').disabled = false;
                    document.getElementById('reshuffleBtn').disabled = false;
                }
            }, 60);
        }

        // 초기 시작 시 로딩 실행
        renderNamesInputs();
        renderSeatMap();
    </script>
</body>
</html>`;

    const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${className}_자리_바꾸기_프로그램.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="min-h-screen text-slate-800 p-4 md:p-8 font-sans transition-all duration-300"
      style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* --- 헤더 세션 (Frosted Glass) --- */}
        <header className="relative mb-8 frosted rounded-3xl p-6 md:p-8 shadow-lg overflow-hidden border border-white/50">
          {/* 장식용 버블 */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-sky-200/40 rounded-full opacity-55 pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200/40 rounded-full opacity-55 pointer-events-none"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full mb-2">
                🏫 초등 교실 전용 도구
              </span>
              <h1 className="text-4xl md:text-6xl font-pen text-sky-800 tracking-wide flex items-center justify-center md:justify-start gap-2">
                🎒 {className} <span className="text-sky-600">자리 바꾸기!</span> ✨
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
                우리 반 친구들의 자리를 공평하고 재밌게 바꾸는 마술 상자예요!
              </p>
            </div>

            {/* 학급 이름 수정 입력란 */}
            <div className="flex items-center gap-2 bg-white/50 p-2 rounded-2xl border border-sky-100 backdrop-blur-sm">
              <span className="text-xs font-bold text-sky-700 pl-2">학급 이름:</span>
              <input 
                id="classNameInput"
                type="text" 
                value={className}
                onChange={(e) => setClassName(e.target.value || "우리 반")}
                maxLength={10}
                className="bg-white/80 px-3 py-1.5 text-sm font-bold rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 w-28 text-center shadow-inner"
                placeholder="예: 3학년 1반"
              />
            </div>
          </div>
        </header>

        {/* --- 메인 그리드 레이아웃 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= 왼쪽 패널: 학생 정보 및 설정 (4열) ================= */}
          <section className="lg:col-span-4 space-y-6">
            
            {/* 1단계: 학생 수 선택 */}
            <div className="frosted rounded-3xl p-6 shadow-md border border-white/50" id="step-student-count">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-slate-700">
                <span className="bg-sky-100 p-1.5 rounded-xl text-sky-600 text-sm">👥</span>
                1단계. 학생 수 정하기
              </h2>
              <p className="text-xs text-slate-400 mb-4 pl-8">우리 반에 있는 총 친구들의 수를 고르세요 (최대 20명)</p>
              
              {/* 숫자 배지 리스트 */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }, (_, i) => {
                  const num = i + 1;
                  const isSelected = num === studentCount;
                  return (
                    <button
                      key={num}
                      id={`count-badge-${num}`}
                      onClick={() => !isShuffling && setStudentCount(num)}
                      disabled={isShuffling}
                      className={`py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border cursor-pointer ${
                        isSelected 
                          ? 'bg-sky-400 text-white border-sky-400 shadow-md scale-105 font-jua' 
                          : 'bg-white/40 hover:bg-white/70 text-sky-800 border-sky-100'
                      } ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2단계: 학생 이름 입력하기 */}
            <div className="frosted rounded-3xl p-6 shadow-md border border-white/50" id="step-student-names">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
                  <span className="bg-sky-100 p-1.5 rounded-xl text-sky-600 text-sm">✏️</span>
                  2단계. 이름 고치기
                </h2>
                
                {/* 헬퍼 버튼셋 */}
                <div className="flex gap-1.5">
                  <button
                    id="btn-fill-examples"
                    onClick={fillExampleNames}
                    disabled={isShuffling}
                    className="px-2.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl text-xs font-bold transition-all hover:shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    🎨 예시 이름
                  </button>
                  <button
                    id="btn-clear-names"
                    onClick={resetNamesToDefault}
                    disabled={isShuffling}
                    className="px-2.5 py-1.5 bg-slate-100/80 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all hover:shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    🧹 초기화
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4 pl-8">이름칸에 이름을 적어보세요. 언제든지 바꿀 수 있어요!</p>
              
              {/* 스크롤 가능한 이름 입력 리스트 */}
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1 scroll-hide">
                {Array.from({ length: studentCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-1.5 bg-white/50 rounded-xl border border-sky-50">
                    <span className="text-xs font-extrabold text-sky-500 w-5 text-right">{i + 1}</span>
                    <input
                      id={`input-student-${i}`}
                      type="text"
                      value={tempNames[i] || ""}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      disabled={isShuffling}
                      maxLength={8}
                      className="w-full bg-white/80 px-2 py-1 text-xs font-bold rounded-lg border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-700 shadow-sm"
                      placeholder={`학생 ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* ================= 오른쪽 패널: 교실 배치 맵 (8열) ================= */}
          <section className="lg:col-span-8 space-y-6">
            
            <div className="frosted rounded-3xl p-6 md:p-8 shadow-lg border border-white/50 flex flex-col items-center">
              
              {/* 선생님 책상 디자인 */}
              <div className="w-48 h-12 bg-orange-300 border-b-4 border-orange-500 rounded-b-3xl flex items-center justify-center text-orange-950 font-bold shadow-md mb-8">
                👩‍🏫 선생님 책상 (앞)
              </div>

              {/* 4행 5열 자리 지도 영역 */}
              <div className="w-full" id="classroom-layout-grid">
                <div className="grid grid-cols-5 gap-3 md:gap-4 w-full">
                  <AnimatePresence mode="popLayout">
                    {assignedSeats.map((studentIndex, seatIndex) => {
                      const isOccupied = studentIndex !== null && studentIndex < studentCount;
                      
                      return (
                        <motion.div
                          key={seatIndex}
                          id={`seat-card-${seatIndex}`}
                          layout
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                          {isOccupied ? (
                            // 학생이 있는 귀여운 책상 카드
                            <div 
                              className="aspect-[4/3.5] bg-white/90 rounded-2xl p-2.5 shadow-md border-2 border-sky-400 flex flex-col justify-between items-center transition-all duration-200 hover:shadow-lg hover:scale-[1.03] relative overflow-hidden"
                            >
                              {/* 자리 번호 및 학생 순번 표시 */}
                              <div className="w-full flex justify-between items-center text-[9px] md:text-[10px] font-extrabold text-sky-400">
                                <span>{seatIndex + 1}번 자리</span>
                                <span className="bg-sky-50 px-1 py-0.5 rounded-md text-[8px] md:text-[9px]">
                                  {studentIndex! + 1}번 친구
                                </span>
                              </div>
                              
                              {/* 중앙 이모지 & 학생 이름 */}
                              <div className="flex flex-col items-center">
                                <span className={`text-xl md:text-3xl mb-1 ${isShuffling ? 'animate-pulse scale-90' : 'animate-bounce'}`}>
                                  {STUDENT_EMOJIS[studentIndex! % STUDENT_EMOJIS.length]}
                                </span>
                                <span className="text-xs md:text-base font-jua text-sky-950 text-center truncate max-w-full font-bold">
                                  {studentNames[studentIndex!] || `학생 ${studentIndex! + 1}`}
                                </span>
                              </div>

                              {/* 서랍 장식 라인 */}
                              <div className="h-1.5 w-8 bg-sky-200 rounded-full"></div>
                            </div>
                          ) : (
                            // 빈 책상 카드
                            <div 
                              className="aspect-[4/3.5] frosted rounded-2xl p-2.5 border-2 border-dashed border-sky-200 flex flex-col justify-center items-center opacity-60"
                            >
                              <span className="text-[9px] md:text-[10px] font-extrabold text-sky-300 mb-1">{seatIndex + 1}번 자리</span>
                              <span className="text-xs text-sky-300 font-bold font-jua">🪑 빈자리</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* 하단 작동 및 제어 버튼 */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
                
                {/* 최초 자리 배정용 버튼 */}
                <button
                  id="btn-assign-seats"
                  onClick={handleAssignSeats}
                  disabled={isShuffling}
                  className="flex-1 py-4 bg-sky-400 hover:bg-sky-500 text-white font-jua text-xl rounded-2xl shadow-lg border-b-4 border-sky-600 transition-all active:translate-y-0.5 active:border-b-2 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
                  {isShuffling ? '자리를 섞는 중...' : '두근두근 자리 배정'}
                </button>

                {/* 명단 유지 재배정 버튼 */}
                <button
                  id="btn-reshuffle-seats"
                  onClick={handleAssignSeats}
                  disabled={isShuffling}
                  className="flex-1 py-4 bg-white text-sky-600 hover:bg-sky-50/50 border-2 border-sky-200 font-jua text-xl rounded-2xl shadow-lg transition-all active:translate-y-0.5 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
                  다시 자리 바꾸기
                </button>

              </div>

            </div>

          </section>

        </div>

        {/* --- 하단 교실 비밀 배움터 & 단일 파일 내보내기 --- */}
        <section className="mt-12 max-w-4xl mx-auto space-y-6">
          
          {/* 내보내기 홍보 카드 */}
          <div className="frosted rounded-3xl p-6 shadow-lg border border-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2 justify-center md:justify-start">
                <Sparkles className="w-5 h-5 text-amber-500" />
                이 프로그램을 학교 컴퓨터실이나 교실에서 직접 소장해보세요!
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                아래 버튼을 누르면 다운로드되어, 인터넷 없이도 더블클릭만으로 완벽하게 실행되는 <strong>하나의 index.html 파일</strong>이 만들어집니다!
              </p>
            </div>
            
            <button
              id="btn-export-html"
              onClick={handleExportToHTML}
              className="px-5 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              단일 파일로 다운로드 (index.html)
            </button>
          </div>

          {/* 배움터 아코디언 카드 */}
          <div className="frosted rounded-3xl p-6 md:p-8 border border-white/50 shadow-md">
            <button
              id="btn-toggle-info"
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className="w-full flex items-center justify-between font-jua text-sky-800 text-xl cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-sky-600" />
                🎓 초등 컴퓨터 교실: 이 프로그램의 비밀과 작동 원리
              </span>
              <span className="text-sm font-sans bg-sky-100 px-3 py-1 rounded-full text-sky-700">
                {isInfoOpen ? "숨기기 ▲" : "자세히 보기 ▼"}
              </span>
            </button>

            {isInfoOpen && (
              <div className="mt-6 text-sm text-sky-900/80 space-y-4 leading-relaxed border-t border-sky-200/50 pt-6">
                <div>
                  <h4 className="font-extrabold text-sky-900 text-base flex items-center gap-1.5 mb-1.5">
                    ❓ Q1. 웹 브라우저를 '새로고침'하면 왜 이름이 다 지워지고 초기화될까요?
                  </h4>
                  <p className="pl-5">
                    컴퓨터에는 데이터를 보관하는 장치가 크게 두 가지가 있어요. 바로 <strong>휘발성 메모리(RAM)</strong>와 <strong>비휘발성 저장장치(SSD, HDD 등)</strong>랍니다.
                  </p>
                  <p className="pl-5 mt-1">
                    이 '자리 바꾸기 프로그램'은 여러분의 개인정보를 수집하지 않기 위해 정보를 별도의 비휘발성 저장장치에 영구 저장하지 않고, 
                    오직 웹 브라우저가 실행되는 동안에만 존재할 수 있는 <strong>컴퓨터 임시 기억공간(RAM - 실행 메모리)</strong>에만 보존해둡니다.
                  </p>
                  <p className="pl-5 mt-1">
                    따라서 사용자가 '새로고침' 단추를 누르면 웹브라우저는 임시 기억공간을 완전히 비워버리고 서버로부터 첫 코드 상태를 새로 내려받아 구동되므로, 
                    이전에 적어둔 이름과 배정 기록이 깨끗이 날아가고 완전히 초기화되는 것입니다.
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="font-extrabold text-sky-900 text-base flex items-center gap-1.5 mb-1.5">
                    📂 Q2. 데이터베이스(Database)가 없는 프로그램은 어떤 유용한 특징이 있을까요?
                  </h4>
                  <ul className="list-disc pl-10 space-y-1">
                    <li>
                      <strong>철저한 개인정보 보호 ✨ :</strong> 우리 반 친구들의 실명을 입력하더라도 그 데이터가 인터넷 어딘가의 서버나 데이터베이스로 절대 날아가지 않아요. 오직 교실 모니터 화면에만 표시되기 때문에 아이들의 소중한 개인 정보가 유출될 걱정이 100% 없습니다.
                    </li>
                    <li>
                      <strong>오프라인 작동 보장 📶 :</strong> 데이터베이스를 통신하기 위한 네트워크가 없어도 돌아가기 때문에, 학교 인터넷이 불안정하거나 시골 야외 활동 중에 인터넷이 연결되지 않아도 완벽하게 활용할 수 있어요.
                    </li>
                    <li>
                      <strong>가볍고 쾌적한 구동 속도 ⚡ :</strong> 서버나 외부 통신 장치와 자료를 주고받을 때 걸리는 불필요한 대기 시간이 없기 때문에, 버튼을 누르는 순간 0.001초의 지연도 없이 엄청나게 빠르고 부드럽게 작동합니다.
                    </li>
                    <li>
                      <strong>기기 찌꺼기 제로 🧹 :</strong> 장치 내부 하드디스크나 브라우저 쿠키 공간에 어떠한 흔적이나 캐시, 찌꺼기 데이터 파일도 남기지 않아 컴퓨터를 언제나 안전하고 깨끗하게 유지해 줍니다.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

        </section>

      </div>
    </div>
  );
}
