import React from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { RefreshCw, CheckCircle2, AlertCircle, Sparkles, X, Terminal, ArrowDownCircle, GitCommit } from 'lucide-react';
import type { UpdateCheckResult } from '../types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUpdating: boolean;
  updateStatus: string;
  updateResult: { success: boolean; message?: string; error?: string } | null;
  updateInfo: UpdateCheckResult | null;
  onStartUpdate: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  isUpdating,
  updateStatus,
  updateResult,
  updateInfo,
  onStartUpdate,
}) => {
  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const hasNewVersion = Boolean(
    updateInfo?.hasUpdate &&
    updateInfo?.latestVersion &&
    updateInfo?.currentVersion &&
    updateInfo.latestVersion.replace(/^v/, '').trim() !== updateInfo.currentVersion.replace(/^v/, '').trim()
  );

  const handleRelaunch = async () => {
    if (window.electronAPI?.relaunchApp) {
      await window.electronAPI.relaunchApp();
    } else if (window.electronAPI?.reloadApp) {
      await window.electronAPI.reloadApp();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900">프로그램 최신 업데이트</h3>
                {updateInfo?.currentVersion && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    현재 v{updateInfo.currentVersion}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Git 소스 동기화 & 프론트엔드/엔진 즉시 재빌드</p>
            </div>
          </div>
          {!isUpdating && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isUpdating && !updateResult && (
            <div className="space-y-3">
              {/* Version & Update Notice Card */}
              {hasNewVersion ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-blue-900 flex items-center gap-1.5 text-sm">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>새 버전(v{updateInfo?.latestVersion || '최신'})이 준비되었습니다!</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                      업데이트 가능
                    </span>
                  </div>

                  {updateInfo?.latestCommitMsg && (
                    <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100 flex items-start gap-2">
                      <GitCommit className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 font-semibold block">최신 커밋 내역:</span>
                        <p className="text-xs text-slate-800 font-bold truncate">{updateInfo.latestCommitMsg}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    아래 [최신 업데이트 반영 시작] 버튼을 누르면 새 코드를 다운받아 화면과 엔진에 즉시 적용합니다.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 font-medium">
                  <div className="font-extrabold flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>현재 최신 버전을 사용 중입니다 (v{updateInfo?.currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.0')})</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    언제든지 코드를 업데이트한 후 이 버튼을 눌러 다시 빌드하고 새로고침할 수 있습니다.
                  </p>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800">
                  {updateInfo?.updateType === 'installer' ? '설치형 앱 자동 업데이트 파이프라인:' : '동기화 파이프라인:'}
                </div>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  {updateInfo?.updateType === 'installer' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
                        <span>최신 윈도우 설치 패키지(Setup.exe) 백그라운드 다운로드</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">2</span>
                        <span>기존 라이센스, 토큰, 프로젝트 및 설정 데이터 100% 자동 보존</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">3</span>
                        <span>설치 프로그램 자동 실행 및 최신 버전 업그레이드 완료</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
                        <span>최신 소스 코드 가져오기 (Git Pull)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                        <span>프론트엔드 화면 재컴파일 (Vite Build)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
                        <span>Electron 엔진 동기화 및 실시간 화면 새로고침</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Updating In-Progress */}
          {isUpdating && (
            <div className="py-6 space-y-4 text-center">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse" />
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">최신 버전으로 업데이트 진행 중...</h4>
                <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center justify-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{updateStatus || '업데이트 파이프라인 실행 중...'}</span>
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                업데이트가 완료되면 프로그램 화면이 자동으로 새로고침됩니다. 잠시만 기다려주세요.
              </p>
            </div>
          )}

          {/* Update Result (Success / Error) */}
          {!isUpdating && updateResult && (
            <div className="space-y-3">
              {updateResult.success ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>업데이트가 성공적으로 완료되었습니다!</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium">
                    {updateResult.message || '최신 변경사항이 즉시 반영되었습니다.'}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>업데이트 중 오류가 발생했습니다</span>
                  </div>
                  <p className="text-xs text-rose-700 font-medium break-all">
                    {updateResult.error || '업데이트 명령 실행 중 에러가 발생했습니다.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
          {!isUpdating && !updateResult && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={handleRelaunch}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all active:scale-95"
                title="프로그램을 재시작하여 메모리에 새 엔진을 로드합니다"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>앱 즉시 재시작</span>
              </button>
              <button
                onClick={onStartUpdate}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <ArrowDownCircle className="w-4 h-4" />
                <span>{hasNewVersion ? '최신 버전으로 업데이트' : '코드 재동기화 및 다시 빌드'}</span>
              </button>
            </>
          )}

          {!isUpdating && updateResult && (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold transition-all"
            >
              완료 및 닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
