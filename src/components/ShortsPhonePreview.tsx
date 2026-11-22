import React, { useState, useEffect } from 'react';
import {
  Flame,
  ThumbsUp,
  MessageSquare,
  Share2,
  Disc3,
  Play,
  Pause,
  Sparkles,
  Heading,
  CheckCircle2,
} from 'lucide-react';
import type { SubtitleStyleId, TitleStyleId, SubtitleFontSize } from '../types';

interface ShortsPhonePreviewProps {
  titleStyleId: TitleStyleId;
  headerTitleText?: string;
  enableHookIntro: boolean;
  hookTitleText?: string;
  hookSubtitleText?: string;
  subtitleStyleId: SubtitleStyleId;
  subtitleFontSize?: SubtitleFontSize;
  templateId?: string;
  sampleScriptText?: string;
  channelName?: string;
  activeVideoUrl?: string;
}

const TEMPLATE_BG_GRADIENTS: Record<string, { bg: string; orb1: string; orb2: string; tag: string }> = {
  basic: { bg: 'from-slate-950 via-slate-900 to-indigo-950', orb1: 'bg-purple-600/25', orb2: 'bg-blue-500/20', tag: '🎬 실사 시네마틱' },
  k_documentary: { bg: 'from-zinc-950 via-stone-900 to-amber-950', orb1: 'bg-amber-600/25', orb2: 'bg-orange-700/20', tag: '🇰🇷 한국 방송 다큐' },
  k_webtoon: { bg: 'from-purple-950 via-slate-900 to-pink-950', orb1: 'bg-pink-500/30', orb2: 'bg-purple-500/25', tag: '🎨 K-웹툰 만화' },
  cozy_korea: { bg: 'from-amber-950/80 via-stone-900 to-orange-950/90', orb1: 'bg-amber-400/25', orb2: 'bg-orange-400/20', tag: '☕ 성수 감성 힐링' },
  luxury_lifestyle: { bg: 'from-yellow-950 via-slate-950 to-emerald-950', orb1: 'bg-yellow-500/25', orb2: 'bg-emerald-500/20', tag: '💰 슈퍼리치 성공' },
  motion_graphic: { bg: 'from-blue-950 via-slate-900 to-cyan-950', orb1: 'bg-cyan-500/25', orb2: 'bg-yellow-400/20', tag: '💡 1분 지식 그래픽' },
  '3d': { bg: 'from-sky-950 via-slate-900 to-violet-950', orb1: 'bg-sky-400/30', orb2: 'bg-violet-400/25', tag: '🧸 3D 픽사 애니' },
  anime: { bg: 'from-indigo-950 via-slate-900 to-rose-950', orb1: 'bg-rose-400/30', orb2: 'bg-sky-400/25', tag: '🌸 재패니메이션' },
  mystery_horror: { bg: 'from-black via-zinc-950 to-red-950', orb1: 'bg-red-600/30', orb2: 'bg-zinc-800/40', tag: '👻 미스터리 괴담' },
  claymation: { bg: 'from-teal-950 via-stone-900 to-orange-950', orb1: 'bg-teal-400/25', orb2: 'bg-orange-300/25', tag: '🧁 클레이 스톱모션' },
  cyberpunk: { bg: 'from-fuchsia-950 via-slate-950 to-cyan-950', orb1: 'bg-cyan-400/35', orb2: 'bg-fuchsia-500/35', tag: '⚡ 사이버펑크 SF' },
  noir: { bg: 'from-black via-zinc-950 to-neutral-900', orb1: 'bg-white/10', orb2: 'bg-zinc-700/20', tag: '🕶️ 시네마틱 누아르' },
  retrogaming: { bg: 'from-purple-950 via-slate-950 to-blue-950', orb1: 'bg-fuchsia-400/30', orb2: 'bg-emerald-400/25', tag: '👾 16비트 레트로 픽셀' },
};

const SUBTITLE_SIZE_CLASSES: Record<SubtitleFontSize, { text: string; boxText: string; scale: string }> = {
  small: { text: 'text-xs', boxText: 'text-[10px]', scale: 'scale-90' },
  medium: { text: 'text-sm sm:text-base', boxText: 'text-xs sm:text-sm', scale: 'scale-100' },
  large: { text: 'text-base sm:text-lg', boxText: 'text-sm sm:text-base', scale: 'scale-110' },
  xlarge: { text: 'text-lg sm:text-xl', boxText: 'text-base sm:text-lg', scale: 'scale-125' },
};

export const ShortsPhonePreview: React.FC<ShortsPhonePreviewProps> = ({
  titleStyleId,
  headerTitleText,
  enableHookIntro,
  hookTitleText = '⚡ 놓치면 손해 3초 꿀팁 ⚡',
  hookSubtitleText = '끝까지 보면 인생이 바뀝니다',
  subtitleStyleId,
  subtitleFontSize = 'medium',
  templateId = 'basic',
  sampleScriptText,
  channelName = '내_쇼츠_채널',
  activeVideoUrl,
}) => {
  // Preview mode: 'hook' (0~2.5s), 'subtitle' (2.5s+), or 'auto' (plays loop simulation)
  const [viewMode, setViewMode] = useState<'hook' | 'subtitle'>('hook');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [simulatedTime, setSimulatedTime] = useState<number>(1.2); // seconds

  // Auto-play timeline loop simulation: 0s ~ 5.5s
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setSimulatedTime((prev) => {
        const next = (prev + 0.2) % 5.5;
        // 0 to 2.4s is Hook Intro banner phase (if enabled)
        if (enableHookIntro) {
          if (next < 2.4) {
            setViewMode('hook');
          } else {
            setViewMode('subtitle');
          }
        } else {
          setViewMode('subtitle');
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isAutoPlaying, enableHookIntro]);

  // If hook intro is disabled, switch to subtitle mode
  useEffect(() => {
    if (!enableHookIntro && viewMode === 'hook') {
      setViewMode('subtitle');
    }
  }, [enableHookIntro, viewMode]);

  const displayHeader = (headerTitleText || '1분 만에 끝내는 핵심 실전 꿀팁').trim();
  const cleanHeader = displayHeader.replace(/^[💡⚡🚨📌\s]+/, '') || '1분 만에 끝내는 핵심 실전 꿀팁';

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] mx-auto select-none">
      {/* Simulation Controller Toolbar */}
      <div className="w-full mb-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-sm text-xs">
        <div className="flex items-center justify-between gap-1 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-purple-400 font-extrabold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>9:16 모바일 실시간 뷰</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              isAutoPlaying
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-2.5 h-2.5 fill-current" />
                <span>재생 중 ({simulatedTime.toFixed(1)}s)</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>시뮬레이션 재생</span>
              </>
            )}
          </button>
        </div>

        {/* Segmented Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl">
          <button
            type="button"
            disabled={!enableHookIntro}
            onClick={() => {
              setIsAutoPlaying(false);
              setViewMode('hook');
              setSimulatedTime(1.0);
            }}
            className={`py-1 px-2 rounded-lg text-[10px] font-extrabold transition-all flex items-center justify-center gap-1 ${
              !enableHookIntro
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : viewMode === 'hook'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>0~3초 후킹 배너</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAutoPlaying(false);
              setViewMode('subtitle');
              setSimulatedTime(3.2);
            }}
            className={`py-1 px-2 rounded-lg text-[10px] font-extrabold transition-all flex items-center justify-center gap-1 ${
              viewMode === 'subtitle'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heading className="w-3 h-3" />
            <span>3초~ 본문 자막</span>
          </button>
        </div>
      </div>

      {/* Realistic Smartphone Mockup Device Frame */}
      <div className="relative w-full aspect-[9/16] max-w-[310px] rounded-[36px] bg-slate-950 border-[6px] border-slate-900 shadow-2xl shadow-purple-950/30 overflow-hidden ring-1 ring-slate-800/80 flex flex-col justify-between">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-slate-900 rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
        </div>

        {/* Mobile Status Bar */}
        <div className="relative z-30 pt-2 px-5 flex items-center justify-between text-[9px] font-semibold text-white/70">
          <span>09:41</span>
          <div className="flex items-center gap-1 text-[9px]">
            <span>5G</span>
            <div className="w-4 h-2 border border-white/60 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Simulated Background Video (Real Video Clip or Ambient Animated Gradient) */}
        {(() => {
          if (activeVideoUrl) {
            return (
              <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                <video
                  src={activeVideoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
                <div className="absolute bottom-2 left-3 z-10">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600/80 text-white border border-white/20 backdrop-blur-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                    무료 비디오 라이브
                  </span>
                </div>
              </div>
            );
          }

          const currentTheme = TEMPLATE_BG_GRADIENTS[templateId] || TEMPLATE_BG_GRADIENTS.basic;
          return (
            <div className={`absolute inset-0 z-0 overflow-hidden bg-gradient-to-b ${currentTheme.bg} transition-colors duration-500`}>
              {/* Subtle Ambient Motion Orbs */}
              <div className={`absolute -top-16 -left-16 w-52 h-52 rounded-full ${currentTheme.orb1} blur-3xl animate-pulse`} />
              <div className={`absolute top-1/2 -right-20 w-52 h-52 rounded-full ${currentTheme.orb2} blur-3xl animate-pulse delay-700`} />
              <div className="absolute -bottom-10 left-1/4 w-44 h-44 rounded-full bg-white/10 blur-2xl" />

              {/* Video Grid Lines Simulation for Depth */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Template Style Watermark Badge in bottom corner */}
              <div className="absolute bottom-2 left-3 z-10">
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-black/40 text-white/70 border border-white/10 backdrop-blur-xs">
                  {currentTheme.tag}
                </span>
              </div>

              {/* Top & Bottom Video Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* LAYER 1: Top Fixed Header Title Style (Always Visible)   */}
        {/* ======================================================== */}
        <div className="relative z-20 pt-4 px-3 flex justify-center text-center">
          {titleStyleId === 'yellow_tape' && (
            <div className="inline-flex items-center gap-1 bg-yellow-400 text-slate-950 px-2.5 py-1 rounded shadow-md border-b-2 border-yellow-500 max-w-[92%] animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[11px] font-black tracking-tight truncate">
                ⚡ {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'breaking' && (
            <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-red-500/60 text-white px-2.5 py-0.5 rounded-full shadow-lg max-w-[92%] animate-in fade-in zoom-in-95 duration-200">
              <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full animate-pulse shrink-0">
                속보
              </span>
              <span className="text-[10px] font-extrabold truncate text-white">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'ssul_badge' && (
            <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-orange-500/60 text-white px-2.5 py-0.5 rounded-full shadow-lg max-w-[92%] animate-in fade-in zoom-in-95 duration-200">
              <span className="bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full animate-pulse shrink-0">
                실시간BEST
              </span>
              <span className="text-[10px] font-extrabold truncate text-white">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'caution_hazard' && (
            <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-3 py-0.5 rounded shadow-md border-x-4 border-black max-w-[92%] animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[10px] font-black tracking-tight truncate">
                ⚠️ [충격주의] {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'gold_luxury' && (
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-lg border border-yellow-300 max-w-[92%] animate-in fade-in zoom-in-95 duration-200">
              <span className="text-xs">👑</span>
              <span className="text-[10px] font-black truncate text-slate-950">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'quiz_card' && (
            <div className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-purple-500/60 text-white px-2.5 py-0.5 rounded-full shadow-lg max-w-[92%] animate-in fade-in zoom-in-95 duration-200">
              <span className="bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shrink-0">
                Q.
              </span>
              <span className="text-[10px] font-extrabold truncate text-white">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'dark_pill' && (
            <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/20 text-white px-2.5 py-0.5 rounded-full shadow-md max-w-[92%] animate-in fade-in zoom-in-95 duration-200">
              <span className="text-xs">📌</span>
              <span className="text-[10px] font-bold truncate text-slate-100">
                {cleanHeader}
              </span>
            </div>
          )}

          {titleStyleId === 'none' && (
            <div className="h-2" />
          )}
        </div>

        {/* ======================================================== */}
        {/* LAYER 2: First 3s Hook Intro Banner (Center Popup)      */}
        {/* ======================================================== */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-3 pointer-events-none">
          {enableHookIntro && viewMode === 'hook' && (
            <div className="w-full bg-slate-950/90 backdrop-blur-md border-2 border-amber-400/90 rounded-2xl p-3 text-center shadow-2xl shadow-amber-500/30 transform transition-all duration-300 animate-in zoom-in-95">
              <div className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[8px] font-black tracking-wider uppercase mb-1">
                🔥 0~3초 집중 이탈 방지
              </div>
              <div className="text-yellow-300 font-black text-[13px] tracking-tight leading-snug drop-shadow-[0_2px_10px_rgba(250,204,21,0.9)] animate-bounce">
                {hookTitleText || '⚡ 놓치면 손해 3초 꿀팁 ⚡'}
              </div>
              <div className="text-slate-100 font-bold text-[10px] mt-1 leading-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                {hookSubtitleText || '끝까지 보면 인생이 바뀝니다'}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* LAYER 3: Subtitle Visual Style (Lower Center Area)       */}
        {/* ======================================================== */}
        <div className="relative z-20 px-3 pb-3">
          {/* Subtitle Display */}
          <div className="min-h-[50px] flex items-center justify-center text-center px-2 mb-2">
            {viewMode === 'subtitle' && (() => {
              const currentSize = SUBTITLE_SIZE_CLASSES[subtitleFontSize] || SUBTITLE_SIZE_CLASSES.medium;
              return (
                <div className={`w-full transition-transform duration-300 transform ${currentSize.scale} origin-bottom animate-in fade-in zoom-in-95 duration-200`}>
                  {/* 1. MrBeast & Hormozi Style */}
                  {subtitleStyleId === 'mrbeast' && (
                  <p
                    className="text-white font-black text-xs sm:text-sm tracking-tight leading-tight select-none"
                    style={{
                      textShadow:
                        '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 6px rgba(0,0,0,0.9)',
                    }}
                  >
                    놓치면 후회하는{' '}
                    <span
                      className="text-yellow-300 font-black"
                      style={{
                        textShadow:
                          '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 12px rgba(255,255,0,0.9)',
                      }}
                    >
                      3가지
                    </span>{' '}
                    실전 꿀팁!
                  </p>
                )}

                {/* 2. Black Box Minimalist Style */}
                {subtitleStyleId === 'black_box' && (
                  <span className="inline-block bg-black/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl border border-white/20 text-[11px] font-black tracking-wide shadow-xl">
                    당장 따라 해봐야 할{' '}
                    <span className="text-sky-300 font-black">비밀 비법</span>
                  </span>
                )}

                {/* 3. Neon Cyber Glow Style */}
                {subtitleStyleId === 'neon' && (
                  <p
                    className="text-cyan-300 font-black text-xs tracking-tight select-none"
                    style={{
                      textShadow:
                        '0 0 5px #22d3ee, 0 0 10px #f43f5e, 0 0 20px #f43f5e',
                    }}
                  >
                    ⚡ 모르면 손해 보는{' '}
                    <span
                      className="text-rose-400 font-black"
                      style={{
                        textShadow:
                          '0 0 5px #f43f5e, 0 0 12px #22d3ee, 0 0 20px #22d3ee',
                      }}
                    >
                      초대박
                    </span>{' '}
                    정보!
                  </p>
                )}

                {/* 4. News & Documentary Clean Style */}
                {subtitleStyleId === 'news' && (
                  <p
                    className="text-amber-100 font-black text-xs tracking-tight"
                    style={{
                      textShadow: '1px 1px 3px #000000, 0 2px 4px #000000',
                    }}
                  >
                    99%가 전혀 몰랐던{' '}
                    <span className="text-orange-400 font-black">과학적 진실</span>
                  </p>
                )}

                {/* 5. Highlighter Marker Style */}
                {subtitleStyleId === 'highlighter' && (
                  <span className="inline-block bg-yellow-300 text-slate-950 px-2.5 py-0.5 rounded font-black text-[11px] shadow-lg">
                    인생을 180도 바꾸는{' '}
                    <span className="text-rose-600 font-black">핵심 습관</span>
                  </span>
                )}

                {/* 6. Ssul Community Talk Bubble Style */}
                {subtitleStyleId === 'ssul_talk' && (
                  <div className="inline-block bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl border border-slate-700 text-[11px] font-bold shadow-xl max-w-[95%]">
                    💬 익명: "이거 진짜 <span className="text-sky-300 font-black">실화냐?</span> 대박이네"
                  </div>
                )}

                {/* 7. Samul 1Min Knowledge Popup Style */}
                {subtitleStyleId === 'samul_1min' && (
                  <p
                    className="text-yellow-300 font-black text-xs sm:text-sm tracking-tight leading-tight select-none"
                    style={{
                      textShadow:
                        '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 6px rgba(0,0,0,0.9)',
                    }}
                  >
                    왜 우리는 <span className="text-white font-black">매일 피곤</span>할까?
                  </p>
                )}

                {/* 8. Vlog Aesthetic Minimal Style */}
                {subtitleStyleId === 'vlog_aesthetic' && (
                  <p
                    className="text-white font-bold text-[11px] sm:text-xs tracking-normal select-none"
                    style={{
                      textShadow: '0 1px 4px rgba(0,0,0,0.85)',
                    }}
                  >
                    오늘 하루도 <span className="text-rose-300 font-bold">정말 수고했어요</span>
                  </p>
                )}

                {/* 9. Mystery & Crime Thriller Style */}
                {subtitleStyleId === 'mystery_crime' && (
                  <p
                    className="text-slate-100 font-black text-xs sm:text-sm tracking-tight select-none"
                    style={{
                      textShadow: '0 0 8px #ef4444, 0 0 16px rgba(239,68,68,0.7)',
                    }}
                  >
                    그날 밤 사라진 <span className="text-red-500 font-black">마지막 흔적</span>
                  </p>
                )}

                {/* 10. Ranking Top & Gold Encyclopedia Style */}
                {subtitleStyleId === 'ranking_top' && (
                  <span
                    className="inline-block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent font-black text-xs sm:text-sm tracking-tight"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
                    }}
                  >
                    👑 압도적 1위 <span className="text-white font-black">인생 성공 비결</span>
                  </span>
                )}
                </div>
              );
            })()}
          </div>

          {/* YouTube Shorts Channel Profile & Audio Bar */}
          <div className="flex items-end justify-between">
            {/* Left Channel Profile */}
            <div className="space-y-1 text-left max-w-[70%]">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-amber-400 flex items-center justify-center text-white text-[9px] font-black shadow-xs">
                  AI
                </div>
                <span className="text-[10px] font-bold text-white truncate drop-shadow-sm">
                  @{channelName}
                </span>
                <span className="text-[8px] font-extrabold bg-red-600 text-white px-1.5 py-0.2 rounded-full">
                  구독
                </span>
              </div>
              <p className="text-[9px] text-white/80 font-medium line-clamp-1">
                {displayHeader}
              </p>
              <div className="flex items-center gap-1 text-[8px] text-white/70">
                <Disc3 className="w-2.5 h-2.5 animate-spin text-white/80" />
                <span className="truncate">🎵 K-Shorts AI 오디오 덕킹 BGM</span>
              </div>
            </div>

            {/* Right YouTube Shorts Action Buttons */}
            <div className="flex flex-col items-center gap-2.5 text-white">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <ThumbsUp className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-[8px] font-bold mt-0.5">14.8만</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-[8px] font-bold mt-0.5">1,842</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-bold mt-0.5">공유</span>
              </div>
            </div>
          </div>

          {/* Red Shorts Progress Bar */}
          <div className="w-full h-0.5 bg-white/30 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-200"
              style={{ width: `${(simulatedTime / 5.5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Synchronized Notice Badge */}
      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-slate-500">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>실제 영상 렌더링에 100% 동일하게 반영됩니다</span>
      </div>
    </div>
  );
};
