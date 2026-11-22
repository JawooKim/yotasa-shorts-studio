import React from 'react';
import { Sparkles, Check, Flame, Box, Heading, EyeOff } from 'lucide-react';
import type { SubtitleStyleId, TitleStyleId, SubtitleStyleOption, TitleStyleOption, SubtitleFontSize } from '../types';

export const SUBTITLE_STYLES: SubtitleStyleOption[] = [
  {
    id: 'mrbeast',
    name: '미스터비스트 & 호르모지',
    tag: '🔥 시청 지속 시간 1위',
    description: '굵은 볼드 폰트 + 톡톡 튀는 팝업 바운스, 핵심 단어 네온 옐로우 하이라이트',
    colors: {
      primary: '#ffffff',
      highlight: '#ffff00',
      border: '#000000',
      bg: '#0f172a',
    },
  },
  {
    id: 'karaoke',
    name: '🎙️ 단어 단위 노래방 가라오케',
    tag: '✨ 틱톡/쇼츠 바이럴 혁신',
    description: '말하는 단어 순서대로 네온 형광 컬러가 실시간으로 채워지는 몰입형 가라오케 자막',
    colors: {
      primary: '#ffffff',
      highlight: '#00ffff',
      border: '#000000',
      bg: '#0f172a',
    },
  },
  {
    id: 'black_box',
    name: '인스타 감성 블랙 박스',
    tag: '🖤 릴스/틱톡 가독성 100%',
    description: '반투명 둥근 블랙 박스로 화려한 영상/사진 배경 위에서도 선명한 가독성 보장',
    colors: {
      primary: '#ffffff',
      highlight: '#38bdf8',
      border: 'transparent',
      bg: '#000000',
    },
  },
  {
    id: 'neon',
    name: '틱톡 힙스터 네온 팝',
    tag: '⚡ Z세대 숏폼 트렌드',
    description: '네온 시안 & 핫핑크 마젠타 발광 효과로 트렌디하고 에너지 넘치는 비주얼',
    colors: {
      primary: '#22d3ee',
      highlight: '#f43f5e',
      border: '#701a75',
      bg: '#180828',
    },
  },
  {
    id: 'news',
    name: '뉴스 & 지식 다큐 정갈형',
    tag: '📰 신뢰도 / 시사·경제',
    description: '[속보/팩트] 느낌의 정갈한 크림 옐로우 자막과 묵직하고 안정적인 하단 배치',
    colors: {
      primary: '#fef08a',
      highlight: '#fb923c',
      border: '#000000',
      bg: '#1c1917',
    },
  },
  {
    id: 'highlighter',
    name: '형광펜 마커 하이라이트',
    tag: '🟨 자기계발 / 도서·꿀팁',
    description: '노란색 형광펜을 칠한 듯한 마커 박스 효과로 핵심 포인트를 친근하게 강조',
    colors: {
      primary: '#000000',
      highlight: '#e11d48',
      border: '#eab308',
      bg: '#fef08a',
    },
  },
  {
    id: 'ssul_talk',
    name: '커뮤니티 썰 & 카톡 말풍선',
    tag: '💬 썰 쇼츠 1위 / 몰입도 최고',
    description: '에펨코리아·디시·네이트판 썰 쇼츠 특유의 말풍선 감성 및 리얼한 가독성',
    colors: {
      primary: '#ffffff',
      highlight: '#38bdf8',
      border: '#0f172a',
      bg: '#0f172a',
    },
  },
  {
    id: 'samul_1min',
    name: '1분미만 & 사물궁이 지식 팝업',
    tag: '💡 1분 지식 원조 / 초강력 시인성',
    description: '선명한 노란색 볼드 폰트 + 딥 블랙 두꺼운 외곽선 스트로크로 가독성 100%',
    colors: {
      primary: '#facc15',
      highlight: '#ffffff',
      border: '#000000',
      bg: '#18181b',
    },
  },
  {
    id: 'vlog_aesthetic',
    name: '감성 브이로그 & 릴스 미니멀',
    tag: '☕ 인스타 릴스 / 힐링 일상',
    description: '차분하고 정갈한 화이트 고딕 폰트 + 부드러운 소프트 음영 + 피치 코랄 하이라이트',
    colors: {
      primary: '#ffffff',
      highlight: '#fb7185',
      border: '#000000',
      bg: '#27272a',
    },
  },
  {
    id: 'mystery_crime',
    name: '충격 미스터리 & 그것이알고싶다',
    tag: '🩸 그알·사건반장 / 공포 실화',
    description: '차가운 메탈릭 화이트 + 핏빛 크림슨 레드 강렬한 하이라이트 + 다크 서스펜스',
    colors: {
      primary: '#f8fafc',
      highlight: '#ef4444',
      border: '#000000',
      bg: '#09090b',
    },
  },
  {
    id: 'ranking_top',
    name: '랭킹 TOP & 황금 백과사전',
    tag: '🏆 랭킹쇼 / 상위 1% 성공',
    description: '럭셔리 골드 옐로우 그라데이션 + 엠보싱 텍스트 + 순위/통계 가독성 극대화',
    colors: {
      primary: '#fef08a',
      highlight: '#f59e0b',
      border: '#000000',
      bg: '#1e1b4b',
    },
  },
];

export const TITLE_STYLES: TitleStyleOption[] = [
  {
    id: 'yellow_tape',
    name: '노란 라벨 테이프 (Yellow Tape)',
    tag: '💡 틱톡/릴스 꿀팁 1위',
    description: '노란색 테이프 박스 위 검은색 볼드 글씨로 시선을 사로잡는 강력한 헤더',
    badge: '⚡ HOT',
  },
  {
    id: 'breaking',
    name: '긴급 속보 뱃지 (Breaking News)',
    tag: '🚨 클릭률 폭발 / 궁금증 유발',
    description: '빨간색 [속보] 알약 뱃지와 함께 시선을 집중시키는 미디어 스타일',
    badge: '🚨 속보',
  },
  {
    id: 'ssul_badge',
    name: '실시간 인기글 썰 뱃지 (BEST)',
    tag: '💬 썰 쇼츠 필수 / 몰입도 1위',
    description: '오렌지색 [실시간 BEST] 알약 뱃지와 함께 시작하는 커뮤니티 썰 스타일',
    badge: '🔥 인기글',
  },
  {
    id: 'caution_hazard',
    name: '위험 경고 테이프 (Caution Tape)',
    tag: '⚠️ 충격 주의 / 절대 금지',
    description: '노랑-검정 스트라이프 위험 경고 테이프 위 굵은 경고 헤더',
    badge: '⚠️ 주의',
  },
  {
    id: 'gold_luxury',
    name: '골드 로열 라벨 (Royal VIP)',
    tag: '👑 재테크 / 상위 1% 성공학',
    description: '황금빛 엠블럼과 딥 네이비 배경의 럭셔리 프리미엄 헤더',
    badge: '👑 VIP',
  },
  {
    id: 'quiz_card',
    name: '질문 퀘스천 카드 (Q&A Card)',
    tag: '❓ 퀴즈 쇼츠 / 호기심 유발',
    description: '보라색 [Q.] 뱃지와 함께 시청자 댓글 참여를 유도하는 퀴즈 헤더',
    badge: '❓ Q&A',
  },
  {
    id: 'dark_pill',
    name: '미니멀 다크 필 (Dark Pill)',
    tag: '🖤 애플 감성 / 모던 브이로그',
    description: '반투명 블랙 캡슐 안에 깔끔한 이모지와 함께 정갈하게 들어가는 헤더',
    badge: '📌 깔끔',
  },
  {
    id: 'none',
    name: '헤더 숨김 (Clean Full-Screen)',
    tag: '❌ 9:16 화면 전체 몰입',
    description: '상단 제목 없이 오직 풀스크린 영상과 중앙 자막에만 시선을 집중',
  },
];

interface SubtitleStyleSelectorProps {
  selectedSubtitleStyle: SubtitleStyleId;
  onSelectSubtitleStyle: (style: SubtitleStyleId) => void;
  selectedFontSize?: SubtitleFontSize;
  onSelectFontSize?: (size: SubtitleFontSize) => void;
  selectedTitleStyle: TitleStyleId;
  onSelectTitleStyle: (style: TitleStyleId) => void;
  enableEmojiStickers?: boolean;
  onToggleEmojiStickers?: (enabled: boolean) => void;
  selectedMotionType?: 'bounce' | 'slide_up' | 'fade' | 'typewriter';
  onSelectMotionType?: (motion: 'bounce' | 'slide_up' | 'fade' | 'typewriter') => void;
  highlightKeywords?: boolean;
  onToggleHighlightKeywords?: (enabled: boolean) => void;
}

export const SubtitleStyleSelector: React.FC<SubtitleStyleSelectorProps> = ({
  selectedSubtitleStyle,
  onSelectSubtitleStyle,
  selectedFontSize = 'medium',
  onSelectFontSize,
  selectedTitleStyle,
  onSelectTitleStyle,
  enableEmojiStickers = true,
  onToggleEmojiStickers,
  selectedMotionType = 'bounce',
  onSelectMotionType,
  highlightKeywords = true,
  onToggleHighlightKeywords,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              3-3. 요즘 대세! 자막 & 상단 제목 스타일 선택
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              미스터비스트 팝업, 인스타 블랙박스, 틱톡 네온 등 알고리즘 맞춤 비주얼 스타일을 원클릭으로 변경합니다.
            </p>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>바이럴 숏폼 트렌드 탑재</span>
        </span>
      </div>

      {/* Part 1: Subtitle Style Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-indigo-600" />
            <span>1) 본문 자막(Subtitle) 비주얼 스타일</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">영상의 분위기에 맞춰 선택하세요</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SUBTITLE_STYLES.map((style) => {
            const isSelected = selectedSubtitleStyle === style.id;
            return (
              <div
                key={style.id}
                onClick={() => onSelectSubtitleStyle(style.id)}
                className={`group relative cursor-pointer rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 text-amber-950 shadow-md ring-2 ring-amber-200'
                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-extrabold text-xs text-slate-900 truncate">{style.name}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Live Preview Box */}
                <div
                  className="rounded-xl p-3 my-2 text-center select-none shadow-inner flex items-center justify-center min-h-[58px]"
                  style={{ backgroundColor: style.colors.bg }}
                >
                  {style.id === 'mrbeast' && (
                    <p className="text-xs font-black tracking-tight" style={{ color: style.colors.primary, textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                      놓치면 후회하는 <span style={{ color: style.colors.highlight, textShadow: '0 0 10px rgba(255,255,0,0.8)' }}>3가지</span> 꿀팁!
                    </p>
                  )}
                  {style.id === 'karaoke' && (
                    <div className="flex items-center gap-1 text-xs font-black tracking-tight">
                      <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-110 transition-transform">지금</span>
                      <span className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">말하는</span>
                      <span className="text-white/80">단어가</span>
                      <span className="text-white/50">강조됩니다!</span>
                    </div>
                  )}
                  {style.id === 'black_box' && (
                    <span className="inline-block bg-black/80 text-white px-2.5 py-1 rounded-lg text-xs font-black tracking-wide border border-white/20">
                      당장 따라 해봐야 할 <span className="text-sky-300 font-black">비밀 비법</span>
                    </span>
                  )}
                  {style.id === 'neon' && (
                    <p className="text-xs font-black tracking-tight" style={{ color: '#22d3ee', textShadow: '0 0 8px #f43f5e, 0 0 15px #f43f5e' }}>
                      ⚡ 모르면 손해 보는 <span style={{ color: '#f43f5e', textShadow: '0 0 10px #22d3ee' }}>초대박</span> 정보!
                    </p>
                  )}
                  {style.id === 'news' && (
                    <p className="text-xs font-black tracking-tight text-amber-200" style={{ textShadow: '1px 1px 3px #000000' }}>
                      99%가 전혀 몰랐던 <span className="text-orange-400">과학적 진실</span>
                    </p>
                  )}
                  {style.id === 'highlighter' && (
                    <span className="inline-block bg-yellow-300 text-slate-950 px-2 py-0.5 rounded font-black text-xs shadow-sm">
                      인생을 180도 바꾸는 <span className="text-rose-600 font-black">핵심 습관</span>
                    </span>
                  )}
                  {style.id === 'ssul_talk' && (
                    <div className="bg-slate-800/90 text-white px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-700 max-w-[95%] truncate">
                      익명: "이거 진짜 <span className="text-sky-300 font-black">실화냐?</span> 대박이네"
                    </div>
                  )}
                  {style.id === 'samul_1min' && (
                    <p
                      className="text-xs font-black tracking-tight text-yellow-300"
                      style={{
                        textShadow:
                          '-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000',
                      }}
                    >
                      왜 우리는 <span className="text-white">매일 피곤</span>할까?
                    </p>
                  )}
                  {style.id === 'vlog_aesthetic' && (
                    <p
                      className="text-xs font-bold tracking-normal text-white"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                      오늘 하루도 <span className="text-rose-300 font-bold">수고했어요</span>
                    </p>
                  )}
                  {style.id === 'mystery_crime' && (
                    <p
                      className="text-xs font-black tracking-tight text-slate-100"
                      style={{ textShadow: '0 0 6px #ef4444' }}
                    >
                      그날 밤 사라진 <span className="text-red-500 font-black">마지막 흔적</span>
                    </p>
                  )}
                  {style.id === 'ranking_top' && (
                    <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent font-black text-xs">
                      👑 압도적 1위 <span className="text-white">성공 비결</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/70 mt-2">
                  <span className="font-extrabold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                    {style.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 1-2: Subtitle Font Size Selector */}
      {onSelectFontSize && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>본문 자막 글씨 크기 선택</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">숏폼 화면 맞춤 가독성 프리셋 (너무 크거나 작지 않은 적정 크기)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'small', label: '보통 (48pt)', desc: '단정하고 차분한 기본 크기' },
              { id: 'medium', label: '크게 (56pt)', desc: '가장 추천하는 쇼츠 표준', badge: '추천' },
              { id: 'large', label: '아주 크게 (66pt)', desc: '시원하고 눈에 띄는 강조형' },
              { id: 'xlarge', label: '초대형 (78pt)', desc: '시선 강탈 초대형 텍스트' },
            ].map((sizeOpt) => {
              const isSelected = selectedFontSize === sizeOpt.id;
              return (
                <button
                  key={sizeOpt.id}
                  type="button"
                  onClick={() => onSelectFontSize(sizeOpt.id as SubtitleFontSize)}
                  className={`relative p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-200 font-black'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700 font-semibold hover:border-slate-300'
                  }`}
                >
                  {sizeOpt.badge && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 text-[9px] font-black bg-amber-500 text-slate-950 rounded-full shadow-xs">
                      {sizeOpt.badge}
                    </span>
                  )}
                  <div className="text-xs">{sizeOpt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{sizeOpt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Part 2: Header Title Style Grid */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Heading className="w-3.5 h-3.5 text-amber-600" />
            <span>2) 상단 후킹 타이틀(Header) 스타일</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">쇼츠 상단에 고정 노출되는 제목 배너</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TITLE_STYLES.map((t) => {
            const isSelected = selectedTitleStyle === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTitleStyle(t.id)}
                className={`group relative cursor-pointer rounded-2xl p-3.5 border transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 text-blue-950 shadow-md ring-2 ring-blue-200'
                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-xs text-slate-900 truncate">{t.name}</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                {/* Title Live Preview */}
                <div className="h-10 rounded-xl bg-slate-900 flex items-center justify-center px-2 my-2 shadow-inner overflow-hidden">
                  {t.id === 'yellow_tape' && (
                    <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[11px] font-black truncate shadow-sm">
                      ⚡ 1분 만에 끝내는 생활 꿀팁
                    </span>
                  )}
                  {t.id === 'breaking' && (
                    <div className="flex items-center gap-1 truncate">
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">속보</span>
                      <span className="text-white text-[11px] font-extrabold truncate">99%가 모르는 진실</span>
                    </div>
                  )}
                  {t.id === 'ssul_badge' && (
                    <div className="flex items-center gap-1 truncate">
                      <span className="bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded">실시간BEST</span>
                      <span className="text-white text-[11px] font-extrabold truncate">익명 커뮤니티 썰</span>
                    </div>
                  )}
                  {t.id === 'caution_hazard' && (
                    <div className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[11px] font-black truncate border-x-2 border-black">
                      ⚠️ [충격주의] 절대 금지
                    </div>
                  )}
                  {t.id === 'gold_luxury' && (
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-200 text-slate-950 px-2 py-0.5 rounded text-[11px] font-black truncate shadow-sm">
                      👑 상위 1% 부자의 비밀
                    </span>
                  )}
                  {t.id === 'quiz_card' && (
                    <div className="flex items-center gap-1 truncate">
                      <span className="bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">Q.</span>
                      <span className="text-white text-[11px] font-bold truncate">당신의 선택은?</span>
                    </div>
                  )}
                  {t.id === 'dark_pill' && (
                    <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/20 truncate">
                      📌 알아두면 쓸모있는 상식
                    </span>
                  )}
                  {t.id === 'none' && (
                    <span className="text-slate-500 text-[10px] flex items-center gap-1 font-medium">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>헤더 숨김 (화면 전체 몰입)</span>
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 line-clamp-1">{t.tag}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 3: Dynamic Emoji & Reaction Sticker Overlay */}
      {onToggleEmojiStickers && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">✨</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">감정/키워드 반응형 다이내믹 이모지 스티커</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  신규 v1.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                대본의 핵심 단어(돈💰, 충격🔥, 경고⚠️, 꿀팁💡 등)에 맞춰 통통 튀는 모션 스티커를 자동 합성합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleEmojiStickers(!enableEmojiStickers)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              enableEmojiStickers ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                enableEmojiStickers ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}

      {/* Part 4: Subtitle Motion Animation */}
      {onSelectMotionType && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎬</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800">트렌디 자막 모션 효과</span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
                    신규
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  발화 타이밍에 맞춰 자막이 화면에 등장하는 시각 애니메이션 방식을 선택합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { id: 'bounce', label: '🎈 바운스 팝업', desc: '통통 튀는 줌 바운스' },
              { id: 'slide_up', label: '⬆️ 슬라이드 업', desc: '부드러운 상향 슬라이드' },
              { id: 'fade', label: '🌫️ 부드러운 페이드', desc: '자연스러운 시네마틱 디졸브' },
              { id: 'typewriter', label: '⌨️ 타자기 타이핑', desc: '스피디한 숏폼 텐션' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMotionType(m.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  (selectedMotionType || 'bounce') === m.id
                    ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">{m.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Part 5: Keyword Highlight Color Toggle */}
      {onToggleHighlightKeywords && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔥</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">핵심 단어 & 숫자 자동 하이라이트 컬러</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                  바이럴 1위
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                숫자, 핵심 어휘(충격, 절대, 비밀, 성공 등)를 네온 옐로우 컬러로 자동 강조하여 시청자 이탈을 방지합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleHighlightKeywords(!highlightKeywords)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              highlightKeywords ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                highlightKeywords ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};
