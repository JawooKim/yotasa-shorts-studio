import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Mic, FileText, Video, Copy, Check, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import type { ProjectStatus } from '../types';

interface RenderProgressProps {
  status: ProjectStatus;
  progressPercent: number;
  statusMessage: string;
  errorDetails?: string;
  onDismiss?: () => void;
}

export const RenderProgress: React.FC<RenderProgressProps> = ({
  status,
  progressPercent,
  statusMessage,
  errorDetails,
  onDismiss,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (status === 'draft') return null;

  const steps = [
    { key: 'generating_script', label: '대본 생성', icon: FileText, percent: 15 },
    { key: 'generating_audio', label: 'AI 음성 & 자막', icon: Mic, percent: 40 },
    { key: 'rendering_video', label: 'FFmpeg 9:16 합성', icon: Video, percent: 80 },
    { key: 'done', label: '완성', icon: CheckCircle2, percent: 100 },
  ];

  const handleCopyError = async () => {
    const errorTextToCopy = [
      '=== [K-Shorts Studio 오류 리포트] ===',
      `시간: ${new Date().toLocaleString()}`,
      `진행 단계: ${statusMessage}`,
      '----------------------------------------',
      errorDetails || statusMessage || '상세 오류 정보가 없습니다.',
      '========================================',
    ].join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(errorTextToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = errorTextToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isError = status === 'error';

  return (
    <div
      className={
        'rounded-2xl p-5 space-y-4 shadow-2xl backdrop-blur-md transition-all duration-200 border ' +
        (isError
          ? 'bg-rose-950/40 border-rose-800/80 shadow-rose-950/40'
          : 'bg-gray-900/90 border-gray-800 shadow-black/40')
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'done' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
          ) : (
            <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
          )}
          <span
            className={
              'font-bold text-sm ' +
              (isError ? 'text-rose-200' : status === 'done' ? 'text-emerald-300' : 'text-gray-100')
            }
          >
            {status === 'done'
              ? '쇼츠 제작 완료!'
              : isError
              ? '영상 제작 중 오류 발생'
              : '쇼츠 비디오 자동 렌더링 중...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isError && (
            <span className="text-xs font-bold text-rose-400">{progressPercent}%</span>
          )}
          {isError && onDismiss && (
            <button
              onClick={onDismiss}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-900/50 hover:bg-rose-800/70 text-rose-300 transition-colors border border-rose-700/50"
            >
              닫기
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (hidden on error) */}
      {!isError ? (
        <div className="w-full bg-gray-800/80 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      ) : null}

      {/* Steps indicator */}
      {!isError && (
        <div className="grid grid-cols-4 gap-2 pt-1">
          {steps.map((step, idx) => {
            const isPassed = progressPercent >= step.percent;
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className={
                  'flex flex-col items-center p-2 rounded-xl border text-center transition-all ' +
                  (isPassed
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    : 'bg-gray-950/40 border-gray-800/60 text-gray-500')
                }
              >
                <Icon className={'w-4 h-4 mb-1 ' + (isPassed ? 'text-rose-400' : 'text-gray-600')} />
                <span className="text-[11px] font-medium leading-tight">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Status or Error Message */}
      <div
        className={
          'text-xs font-medium ' +
          (isError
            ? 'text-rose-300 bg-rose-950/60 border border-rose-800/50 rounded-xl p-3.5 space-y-3'
            : 'text-center text-gray-400')
        }
      >
        {isError ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <p className="font-semibold text-rose-200 text-xs flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  {statusMessage}
                </p>
                <p className="text-[11px] text-rose-300/80 leading-relaxed">
                  아래 복사 버튼을 눌러 오류 코드를 클립보드에 복사한 후 지원팀이나 개발자에게 전달해주세요.
                </p>
              </div>

              {/* Copy Error Button */}
              <button
                onClick={handleCopyError}
                className={
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 ' +
                  (copied
                    ? 'bg-emerald-600 text-white shadow-emerald-900/50'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60 border border-rose-400/30')
                }
                title="오류 코드 및 로그 전체 복사"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>오류코드 복사</span>
                  </>
                )}
              </button>
            </div>

            {/* Expandable Error Details */}
            {errorDetails && (
              <div className="pt-2 border-t border-rose-800/40 mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-300 hover:text-rose-100 transition-colors"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>상세 오류 로그 닫기</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>상세 오류 로그 (에러 코드/스택) 보기</span>
                    </>
                  )}
                </button>

                {showDetails && (
                  <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-rose-900/60 text-[11px] font-mono text-rose-200/90 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed select-all">
                    {errorDetails}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          statusMessage
        )}
      </div>
    </div>
  );
};

