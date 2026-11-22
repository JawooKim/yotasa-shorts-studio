import React, { useState, useEffect } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, MessageSquare, Copy, Check, RefreshCw } from 'lucide-react';
import type { PinnedCommentSuggestion } from '../types';

interface PinnedCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  script: string;
  onSelectComment?: (commentText: string) => void;
}

export const PinnedCommentModal: React.FC<PinnedCommentModalProps> = ({
  isOpen,
  onClose,
  topic,
  script,
  onSelectComment,
}) => {
  const [suggestions, setSuggestions] = useState<PinnedCommentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const fetchSuggestions = async () => {
    if (!window.electronAPI) return;
    setIsLoading(true);
    try {
      const res = await window.electronAPI.generatePinnedComments({ topic, script });
      if (res.success && res.suggestions) {
        setSuggestions(res.suggestions);
      }
    } catch (err) {
      console.error('[Pinned Comment Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen, topic]);

  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApply = (text: string) => {
    if (onSelectComment) {
      onSelectComment(text);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 via-white to-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shadow-inner">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  AI 시청자 투표 & 고정 댓글 최적화기
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  알고리즘 가중치 극대화
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                쇼츠 시청 후 댓글 작성률을 3배 이상 유도하여 탐색 피드 노출을 촉진합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700">
              알고리즘 추천 고정 댓글 3종 세트
            </span>
            <button
              onClick={fetchSuggestions}
              disabled={isLoading}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>새로운 질문 생성</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-2 border-rose-500/20 border-t-rose-600 rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-bold animate-pulse">
                대본 내용을 분석하여 바이럴 유도 질문을 도출 중입니다...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s, idx) => {
                const isCopied = copiedIdx === idx;
                const typeBadge =
                  s.type === 'balance_game'
                    ? { name: '🔥 밸런스 게임 투표형', color: 'bg-amber-100 text-amber-800 border-amber-200' }
                    : s.type === 'opinion_vote'
                    ? { name: '💬 시청자 경험 공유형', color: 'bg-blue-100 text-blue-800 border-blue-200' }
                    : { name: '📌 3초 핵심 요약 & 퀴즈형', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${typeBadge.color}`}>
                        {typeBadge.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(s.fullCommentText, idx)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1 transition-all"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                          <span>{isCopied ? '복사됨!' : '댓글 복사'}</span>
                        </button>
                        {onSelectComment && (
                          <button
                            onClick={() => handleApply(s.fullCommentText)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold shadow-sm transition-all"
                          >
                            적용하기
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {s.question}
                    </p>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 font-mono whitespace-pre-line leading-relaxed select-text">
                      {s.fullCommentText}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            유튜브 업로드 시 첫 댓글로 등록하고 핀(Pin)으로 상단 고정하면 시청자 참여율이 극대화됩니다.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
