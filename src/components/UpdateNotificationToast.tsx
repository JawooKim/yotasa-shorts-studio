import React from 'react';
import { ArrowRight, X, DownloadCloud } from 'lucide-react';
import type { UpdateCheckResult } from '../types';

interface UpdateNotificationToastProps {
  updateInfo: UpdateCheckResult | null;
  onOpenUpdate: () => void;
  onDismiss: () => void;
}

function isVersionNewer(latest?: string, current?: string): boolean {
  if (!latest || !current) return false;
  const cleanLatest = latest.replace(/^v/, '').trim();
  const cleanCurrent = current.replace(/^v/, '').trim();
  if (cleanLatest === cleanCurrent) return false;

  const pLatest = cleanLatest.split('.').map((n) => parseInt(n, 10) || 0);
  const pCurrent = cleanCurrent.split('.').map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(pLatest.length, pCurrent.length); i++) {
    const l = pLatest[i] || 0;
    const c = pCurrent[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}

export const UpdateNotificationToast: React.FC<UpdateNotificationToastProps> = ({
  updateInfo,
  onOpenUpdate,
  onDismiss,
}) => {
  if (!updateInfo || !updateInfo.hasUpdate) return null;
  // Strictly prevent update toast if latestVersion is not newer than currentVersion (and no remote commits)
  if (!isVersionNewer(updateInfo.latestVersion, updateInfo.currentVersion) && !(updateInfo.newCommitCount && updateInfo.newCommitCount > 0)) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[500px] max-w-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl border border-blue-500/40 p-6 overflow-hidden relative backdrop-blur-md">
        {/* Glow accents */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 text-white">
            <DownloadCloud className="w-6 h-6 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="font-extrabold text-base text-white tracking-tight">
                새로운 업데이트 발견!
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-400 border border-blue-400/40 shadow-sm">
                v{updateInfo.latestVersion || '최신'}
              </span>
            </div>

            <p className="text-[13px] text-slate-300 mt-2.5 line-clamp-3 leading-relaxed font-normal">
              {updateInfo.latestCommitMsg || updateInfo.message || '새로운 기능과 성능 개선 사항이 배포되었습니다.'}
            </p>

            <div className="flex items-center gap-3 mt-4 pt-1">
              <button
                onClick={onOpenUpdate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-md shadow-blue-600/30 transition-all active:scale-95"
              >
                <span>지금 업데이트하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                나중에
              </button>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="absolute top-0 right-0 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
