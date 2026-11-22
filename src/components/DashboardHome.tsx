import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Key,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Play,
  Share2,
  Bot,
  Zap,
  Layers,
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageCircle,
  Scissors,
  Calendar,
  Film,
} from 'lucide-react';
import type { ShortsProject, AppSettings, YouTubeLiveStats } from '../types';
import type { NavTab } from './Sidebar';

interface DashboardHomeProps {
  userName: string;
  projects: ShortsProject[];
  settings: AppSettings;
  onNavigate: (tab: NavTab) => void;
  onSelectProject: (p: ShortsProject) => void;
  onOpenBatchModal?: () => void;
  onOpenLongToShortsModal?: () => void;
  onOpenCalendarModal?: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  userName,
  projects,
  settings,
  onNavigate,
  onSelectProject,
  onOpenBatchModal,
  onOpenLongToShortsModal,
  onOpenCalendarModal,
}) => {
  const completedProjects = projects.filter((p) => p.status === 'done');
  const hasGeminiKey = Boolean(settings.geminiApiKey);
  const hasMediaKey = Boolean(settings.pexelsApiKey || settings.pixabayApiKey);
  const hasYoutube = Boolean(settings.youtubeRefreshToken && settings.youtubeClientId);

  // Live YouTube Stats State
  const [liveStats, setLiveStats] = useState<YouTubeLiveStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchLiveStats = async () => {
    if (!hasYoutube || !window.electronAPI?.getYoutubeLiveStats) return;
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const res = await window.electronAPI.getYoutubeLiveStats();
      if (res.success && res.data) {
        setLiveStats(res.data);
      } else {
        setStatsError(res.error || '통계를 불러오지 못했습니다.');
      }
    } catch (err: any) {
      setStatsError(err?.message || '실시간 통계 조회 오류');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (hasYoutube) {
      fetchLiveStats();
    }
  }, [hasYoutube]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-7 shadow-lg shadow-blue-500/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>K-Shorts Content Studio Pro</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              안녕하세요, {userName} 님! 👋
            </h1>
            <p className="text-xs md:text-sm text-blue-100 max-w-xl leading-relaxed font-medium">
              아이디어 한 줄로 대본 작성, 고품질 한국어 AI 음성, 9:16 맞춤 자막 및 영상 합성까지 원클릭으로 완성해보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenBatchModal && (
              <button
                onClick={onOpenBatchModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-500/80 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md border border-blue-300/30 transition-all active:scale-[0.98]"
              >
                <Layers className="w-4 h-4 text-white" />
                <span>엑셀 대량 양산</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('video-to-shorts')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 border border-indigo-400/30 transition-all active:scale-[0.98]"
            >
              <Film className="w-4 h-4 text-pink-300" />
              <span>영상 분석 쇼츠</span>
              <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-[9px] font-black uppercase text-white tracking-wider">NEW</span>
            </button>

            {onOpenLongToShortsModal && (
              <button
                onClick={onOpenLongToShortsModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md border border-indigo-300/30 transition-all active:scale-[0.98]"
              >
                <Scissors className="w-4 h-4 text-pink-300" />
                <span>롱폼 컷 편집</span>
              </button>
            )}

            {onOpenCalendarModal && (
              <button
                onClick={onOpenCalendarModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md border border-yellow-300/40 transition-all active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>발행 캘린더</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('autopilot')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-500/80 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md border border-purple-300/30 transition-all active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>AI 예약 발행</span>
            </button>

            <button
              onClick={() => onNavigate('create')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-extrabold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              <Video className="w-4 h-4 text-blue-600" />
              <span>새 쇼츠 제작</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards (Bright White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Projects */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">총 제작 영상</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{projects.length}</span>
            <span className="text-xs font-semibold text-slate-400">개</span>
          </div>
          <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 완료된 영상 {completedProjects.length}개
          </p>
        </div>

        {/* Card 2: AI Script Engine */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">대본 작성 AI 모델</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-slate-900 truncate">
              {hasGeminiKey ? 'Gemini 3.5 Flash' : '기본 내장 AI'}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500">
            {hasGeminiKey ? 'API 키 연동 완료' : '무료 내장 모드로 작동 중'}
          </p>
        </div>

        {/* Card 3: Image / Media Engine */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">비주얼 미디어 엔진</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-slate-900 uppercase">
              {settings.imageEngine || 'Pollinations AI'}
            </span>
          </div>
          <p className="text-[11px] font-bold text-emerald-600">
            {hasMediaKey ? 'Pexels / Pixabay 연동됨' : '무료 고화질 AI 생성'}
          </p>
        </div>

        {/* Card 4: YouTube Automation */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">유튜브 자동 업로드</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-slate-900">
              {settings.youtubeAutoUpload ? '자동 발행 켜짐' : '수동 확인 발행'}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500">
            {hasYoutube ? 'OAuth 계정 연결됨' : '설정에서 키 입력 필요'}
          </p>
        </div>
      </div>

      {/* Live YouTube Real Channel Performance Widget */}
      {hasYoutube && (
        <div className="bg-white border border-red-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              {liveStats?.thumbnailUrl ? (
                <img
                  src={liveStats.thumbnailUrl}
                  alt={liveStats.channelTitle}
                  className="w-10 h-10 rounded-full border-2 border-red-500 shadow-sm object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  YT
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900">
                    {liveStats?.channelTitle || '내 유튜브 채널'}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
                    실시간 YouTube 연동
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {liveStats
                    ? `실제 구독자 ${liveStats.subscriberCount}명 • 총 누적 조회수 ${liveStats.totalViewCount}회 • 쇼츠 ${liveStats.totalVideoCount}개`
                    : '유튜브 채널 실시간 데이터를 동기화하고 있습니다...'}
                </p>
              </div>
            </div>

            <button
              onClick={fetchLiveStats}
              disabled={isLoadingStats}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin text-red-600' : ''}`} />
              <span>{isLoadingStats ? '동기화 중...' : '실시간 새로고침'}</span>
            </button>
          </div>

          {statsError ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
              <span>⚠️ {statsError}</span>
              <button
                onClick={fetchLiveStats}
                className="px-3 py-1 rounded bg-amber-600 text-white font-bold text-[11px]"
              >
                다시 시도
              </button>
            </div>
          ) : liveStats?.recentVideos && liveStats.recentVideos.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span>최근 발행된 유튜브 쇼츠 실시간 반응</span>
                <span className="text-[11px] text-slate-400 font-normal">실제 조회수 및 좋아요</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {liveStats.recentVideos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl border border-slate-200 hover:border-red-400 bg-slate-50/50 hover:bg-white transition-all group flex items-center gap-3 shadow-2xs"
                  >
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-14 h-20 rounded-lg object-cover bg-black shrink-0 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-20 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-1">
                        <span className="flex items-center gap-1 text-slate-900 font-extrabold">
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          {video.viewCount}회
                        </span>
                        <span className="flex items-center gap-1 text-red-600 font-bold">
                          <ThumbsUp className="w-3 h-3" />
                          {video.likeCount}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <MessageCircle className="w-3 h-3" />
                          {video.commentCount}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              {isLoadingStats ? '실제 유튜브 통계를 집계하고 있습니다...' : '채널에 아직 업로드된 쇼츠가 없거나 비공개 상태입니다.'}
            </div>
          )}
        </div>
      )}

      {/* Analytics & Performance Growth Tracker Widget */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-white">제작 현황 & 업로드 가이드</h2>
          </div>
          <span className="text-[11px] text-indigo-300 font-bold bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
            이 PC의 제작 기록 기준
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">완성된 쇼츠</span>
            <div className="text-lg font-black text-white">{completedProjects.length.toLocaleString()}편</div>
            <p className="text-[10px] text-slate-400 font-medium">지금까지 렌더링 완료</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">최근 7일 제작</span>
            <div className="text-lg font-black text-yellow-400">
              {completedProjects.filter((p) => Date.now() - new Date(p.createdAt).getTime() < 7 * 86400000).length}편
            </div>
            <p className="text-[10px] text-slate-400 font-medium">꾸준한 업로드가 노출에 유리합니다</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">권장 업로드 시간</span>
            <div className="text-lg font-black text-white">18:00 ~ 21:00</div>
            <p className="text-[10px] text-indigo-300 font-medium">퇴근 후 시청이 많은 시간대</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold">연동 가능 플랫폼</span>
            <div className="text-lg font-black text-purple-400">4곳</div>
            <p className="text-[10px] text-slate-400 font-medium">유튜브·인스타·틱톡·클립</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Projects & Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Projects Table / Cards */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <FolderOpen className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">최근 제작된 쇼츠 프로젝트</h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              전체 보기 ({projects.length}) ↗
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Video className="w-10 h-10 mx-auto stroke-[1.5] text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">아직 제작된 영상이 없습니다.</p>
              <button
                onClick={() => onNavigate('create')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all"
              >
                첫 쇼츠 만들기 시작
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="group cursor-pointer bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-500 rounded-xl p-4 flex items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-extrabold text-xs text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                      {p.script || p.prompt}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 font-bold">
                        {p.durationSeconds || 30}초
                      </span>
                      <span>•</span>
                      <span
                        className={`font-bold ${
                          p.status === 'done' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {p.status === 'done' ? '제작 완료' : '처리중'}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {p.videoPath && (
                      <span className="p-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white transition-all shadow-sm">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Control & Status */}
        <div className="space-y-4">
          {/* Quick Engine Status Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>AI 파이프라인 상태</span>
              </h2>
              <button
                onClick={() => onNavigate('ai-settings')}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline"
              >
                설정 변경
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
                <span className="text-slate-600">대본 생성 LLM</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  정상 가동
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
                <span className="text-slate-600">한국어 Neural TTS</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  6종 보이스 준비됨
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
                <span className="text-slate-600">FFmpeg 렌더러</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  9:16 세로 지원
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('ai-settings')}
                className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs transition-all shadow-sm"
              >
                <Key className="w-3.5 h-3.5" />
                <span>API 키 등록 및 관리 페이지 이동</span>
              </button>
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 text-xs shadow-sm">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>v1.4.0 신규 파워업 기능</span>
            </h3>
            <ul className="text-slate-600 space-y-2 text-[11px] leading-relaxed list-disc list-inside font-medium">
              <li>
                <b className="text-slate-900">단어 단위 노래방 자막</b>: 말하는 단어 순서대로 네온 형광 컬러가 차오르는 가라오케 효과.
              </li>
              <li>
                <b className="text-slate-900">쇼츠 발행 캘린더 & 분산 예약</b>: 골든타임에 맞춘 원클릭 균등 분배 및 무인 자동 업로드.
              </li>
              <li>
                <b className="text-slate-900">다이내믹 이모지 스티커 오버레이</b>: 핵심 단어(💰, 🔥, ⚠️, 💡) 반응형 모션 스티커 자동 합성.
              </li>
              <li>
                <b className="text-slate-900">GPU 하드웨어 가속 인코딩</b>: NVENC/QSV/AMF 자동 감지 및 초고속 렌더링.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
