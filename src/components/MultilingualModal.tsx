import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  Globe,
  Sparkles,
  X,
  Copy,
  Check,
  FolderOpen,
  Mic,
  FileText,
  Tag,
  RefreshCw,
} from 'lucide-react';
import type { MultilingualTranslationItem } from '../types';

interface MultilingualModalProps {
  isOpen: boolean;
  onClose: () => void;
  koreanTitle: string;
  koreanScript: string;
  onApplyScriptToEditor: (newTitle: string, newScript: string, voiceId?: string) => void;
  videoPath?: string;
  projectId?: string;
}

export const MultilingualModal: React.FC<MultilingualModalProps> = ({
  isOpen,
  onClose,
  koreanTitle,
  koreanScript,
  onApplyScriptToEditor,
  videoPath,
  projectId,
}) => {
  const [activeLang, setActiveLang] = useState<'en' | 'ja' | 'es'>('en');
  const [translations, setTranslations] = useState<Record<'en' | 'ja' | 'es', MultilingualTranslationItem> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [translateNotice, setTranslateNotice] = useState<string | null>(null);

  const fetchTranslations = async () => {
    if (!koreanScript.trim()) return;
    setIsLoading(true);
    setExportMessage(null);
    setTranslateNotice(null);
    try {
      if (window.electronAPI?.translateScriptMultilingual) {
        const res = await window.electronAPI.translateScriptMultilingual({
          title: koreanTitle,
          script: koreanScript,
        });
        if (res.success && res.translations) {
          setTranslations(res.translations);
          if (res.warning) setTranslateNotice(res.warning);
        } else {
          setTranslateNotice(res.error || '번역에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      }
    } catch (err) {
      console.warn('Multilingual translation error:', err);
      setTranslateNotice('번역에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !translations) {
      fetchTranslations();
    }
  }, [isOpen]);

  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const currentItem = translations ? translations[activeLang] : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyToEditor = () => {
    if (!currentItem) return;
    onApplyScriptToEditor(currentItem.title, currentItem.script, currentItem.recommendedVoiceId);
    onClose();
  };

  const handleExportBundle = async () => {
    if (!translations || !window.electronAPI?.exportMultilingualBundle) return;
    try {
      const res = await window.electronAPI.exportMultilingualBundle({
        projectId: projectId || `global_${Date.now()}`,
        videoPath: videoPath || '',
        originalTitle: koreanTitle,
        translations,
      });
      if (res.success) {
        setExportMessage(res.message || '글로벌 번들이 성공적으로 내보내졌습니다.');
        if (res.outputFolder && window.electronAPI.showInFolder) {
          window.electronAPI.showInFolder(res.outputFolder);
        }
      }
    } catch (err: any) {
      setExportMessage(`내보내기 실패: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>글로벌 3개국어 다국어 쇼츠 원소스 멀티유즈</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200">
                  Global 1타 3피
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                한국어 대본을 미국/일본/스페인 현지 유튜브 쇼츠 알고리즘에 맞게 자동 번역·현지화합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTranslations}
              disabled={isLoading}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              title="다시 번역하기"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 shrink-0">
          <button
            onClick={() => setActiveLang('en')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeLang === 'en'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🇺🇸</span>
            <span>English (영어)</span>
          </button>
          <button
            onClick={() => setActiveLang('ja')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeLang === 'ja'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🇯🇵</span>
            <span>日本語 (일본어)</span>
          </button>
          <button
            onClick={() => setActiveLang('es')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeLang === 'es'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🇪🇸</span>
            <span>Español (스페인어)</span>
          </button>
        </div>

        {/* Translation Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                AI가 현지 쇼츠 호흡에 맞춰 3개 언어로 자연스럽게 번역하고 있습니다...
              </p>
            </div>
          ) : currentItem ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Localized Title */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase">
                    현지화 추천 제목
                  </span>
                  <button
                    onClick={() => handleCopy(currentItem.title, 'title')}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline font-bold"
                  >
                    {copiedKey === 'title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'title' ? '복사됨' : '제목 복사'}</span>
                  </button>
                </div>
                <h4 className="text-sm font-black text-slate-900 leading-snug">
                  {currentItem.title}
                </h4>
              </div>

              {/* Recommended Voice & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="text-xs min-w-0">
                    <span className="text-[10px] text-blue-600 font-bold block">추천 현지 보이스</span>
                    <span className="font-extrabold text-slate-800 truncate block">
                      {currentItem.recommendedVoiceName}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-purple-600 shrink-0" />
                  <div className="text-xs min-w-0">
                    <span className="text-[10px] text-purple-600 font-bold block">현지화 바이럴 태그</span>
                    <span className="font-extrabold text-slate-800 truncate block">
                      {currentItem.tags.join(' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Localized Script */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>번역된 대본 전문 ({currentItem.script.length}자)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(currentItem.script, 'script')}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline font-bold"
                  >
                    {copiedKey === 'script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'script' ? '복사됨' : '대본 복사'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                  {currentItem.script}
                </p>
              </div>

              {translateNotice && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold">
                  {translateNotice}
                </div>
              )}

              {exportMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{exportMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              {translateNotice || '대본을 먼저 입력하거나 AI 대본 생성을 진행해주세요.'}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 shrink-0">
          <button
            type="button"
            onClick={handleExportBundle}
            disabled={!translations}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
          >
            <FolderOpen className="w-4 h-4 text-indigo-600" />
            <span>글로벌 3개국어 번들 폴더로 내보내기</span>
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleApplyToEditor}
              disabled={!currentItem}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>현재 편집창에 {currentItem?.flag || ''} {currentItem?.langName ? currentItem.langName.split('(')[0] : '선택'} 대본 적용</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
