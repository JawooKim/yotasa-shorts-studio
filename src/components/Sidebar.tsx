import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Video,
  Sparkles,
  FolderOpen,
  Share2,
  HelpCircle,
  LogOut,
  User,
  Film,
  Zap,
  Calendar,
  Crown,
  Coins,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'create' | 'video-to-shorts' | 'autopilot' | 'ai-settings' | 'projects' | 'templates' | 'publish' | 'help';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userName: string;
  projectCount: number;
  onLogout: () => void;
  isAdmin?: boolean;
  licenseKey?: string;
  tokens?: number;
  onOpenUpdate?: () => void;
  onOpenCalendarModal?: () => void;
  onOpenRechargeModal?: () => void;
  hasUpdate?: boolean;
  latestVersion?: string;
  currentVersion?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userName,
  projectCount,
  onLogout,
  isAdmin,
  licenseKey,
  tokens,
  onOpenUpdate,
  onOpenCalendarModal,
  onOpenRechargeModal,
  hasUpdate,
  latestVersion,
  currentVersion,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'create', label: '쇼츠 자동 제작', icon: Video },
    { id: 'video-to-shorts', label: '영상 분석 쇼츠', icon: Film, badge: 'NEW' },
    { id: 'autopilot', label: '예약 발행 (Auto-Pilot)', icon: Zap, badge: '무인 자동' },
    { id: 'ai-settings', label: 'AI 및 엔진 설정', icon: Bot },
    { id: 'projects', label: '작성글/영상 관리', icon: FolderOpen, badge: projectCount > 0 ? projectCount : undefined },
    { id: 'templates', label: '템플릿/보이스', icon: Sparkles },
    { id: 'publish', label: '발행 및 SNS/플랫폼 연동', icon: Share2, badge: '4대 SNS' },
    { id: 'help', label: '도움말 및 가이드', icon: HelpCircle },
  ];

  const displayVersion = currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.0');

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none h-screen text-slate-300">
      {/* Top Header Logo */}
      <div>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80 bg-[#0b1120]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-base">
            <Film className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">K-Shorts Studio</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono font-bold">
                v{displayVersion}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">CONTENT STUDIO</span>
          </div>
        </div>

        {/* User Profile Mini Bar & Token Balance */}
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                isAdmin
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'bg-blue-500/20 border border-blue-400/30 text-blue-400'
              }`}>
                {isAdmin ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <span>{userName}</span>
                  {isAdmin && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-black">
                      MASTER
                    </span>
                  )}
                </p>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">
                    {isAdmin ? '관리자 권한' : '일반 크리에이터'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Token Balance Badge */}
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>보유 토큰</span>
            </span>
            {isAdmin ? (
              <span className="font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded text-[10px] border border-amber-500/30 flex items-center gap-1 shadow-sm">
                <Crown className="w-2.5 h-2.5" />
                <span>무제한 (∞)</span>
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] border transition-all ${
                    (tokens ?? 0) < 100
                      ? 'text-rose-300 bg-rose-500/20 border-rose-500/40 animate-pulse font-extrabold'
                      : 'text-blue-300 bg-blue-500/20 border-blue-500/30'
                  }`}
                  title={(tokens ?? 0) < 100 ? '포인트 부족: 쇼츠 제작 시 최소 100P 필요' : `${(tokens ?? 0).toLocaleString()} P 보유`}
                >
                  {(tokens ?? 0).toLocaleString()} P
                  {(tokens ?? 0) < 100 && ' (부족)'}
                </span>
                {onOpenRechargeModal && (
                  <button
                    onClick={onOpenRechargeModal}
                    className="px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-bold transition-all flex items-center gap-0.5"
                    title="토큰 추가 충전"
                  >
                    <span>+충전</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="px-3 space-y-1.5 mt-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {onOpenCalendarModal && (
          <div className="px-3 mt-3">
            <button
              onClick={onOpenCalendarModal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>쇼츠 발행 캘린더</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                NEW
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Status & Actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-2.5 bg-[#0b1120]">
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between font-medium text-slate-300">
            <span>엔진 상태</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              정상 가동
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            FFmpeg 9:16 + Neural TTS
          </div>
        </div>

        {/* Update & Sync Button */}
        {onOpenUpdate && (() => {
          const isRealUpdate = Boolean(
            hasUpdate &&
            latestVersion &&
            displayVersion &&
            latestVersion.replace(/^v/, '').trim() !== displayVersion.replace(/^v/, '').trim()
          );
          return (
            <button
              onClick={onOpenUpdate}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm group ${
                isRealUpdate
                  ? 'text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/50 shadow-md shadow-blue-500/20 animate-pulse'
                  : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className={`w-3.5 h-3.5 ${isRealUpdate ? 'text-yellow-300' : 'text-slate-400 group-hover:text-blue-400'}`} />
                <span>{isRealUpdate ? '새 버전 업데이트' : '최신 버전 사용 중'}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isRealUpdate ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700/60 text-slate-300'
              }`}>
                {isRealUpdate ? `v${latestVersion || 'NEW'}` : `v${displayVersion}`}
              </span>
            </button>
          );
        })()}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>사용자 전환 / 나가기</span>
        </button>
      </div>
    </aside>
  );
};
