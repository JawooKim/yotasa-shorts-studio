import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, Scissors, Sparkles, CheckCircle2, Clock, AlertCircle, FileVideo, Upload, VolumeX, Volume2, Music } from 'lucide-react';
import type { LongToShortsClip } from '../types';

interface LongToShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClipExtracted?: (videoPath: string) => void;
}

export const LongToShortsModal: React.FC<LongToShortsModalProps> = ({
  isOpen,
  onClose,
  onClipExtracted,
}) => {
  const [videoPath, setVideoPath] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [clips, setClips] = useState<LongToShortsClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<LongToShortsClip | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [removeOriginalAudio, setRemoveOriginalAudio] = useState(true); // 기존 음성 제거 기본 활성화
  const [selectedBgm, setSelectedBgm] = useState('bgm_upbeat');
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ videoPath: string; videoUrl: string } | null>(null);

  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const handleSelectFile = async () => {
    try {
      if (window.electronAPI?.selectSourceVideo) {
        const p = await window.electronAPI.selectSourceVideo();
        if (p) setVideoPath(p);
      } else if (window.electronAPI?.selectLocalVideo) {
        const p = await window.electronAPI.selectLocalVideo();
        if (p) setVideoPath(p);
      }
    } catch {}
  };

  const handleAnalyze = async () => {
    if (!videoPath.trim()) {
      setError('동영상 파일의 전체 경로를 입력해주세요.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setClips([]);
    setSelectedClip(null);
    setSuccessResult(null);

    try {
      const res = await window.electronAPI.analyzeLongVideo({ videoPath: videoPath.trim() });
      if (res.success && res.clips) {
        setTotalDuration(res.totalDuration || null);
        setClips(res.clips);
        if (res.clips.length > 0) {
          setSelectedClip(res.clips[0]);
          setCustomTitle(res.clips[0].title);
        }
      } else {
        setError(res.error || '영상 분석 실패');
      }
    } catch (err: any) {
      setError(err?.message || '영상 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExtract = async () => {
    if (!selectedClip || !videoPath) return;

    setIsExtracting(true);
    setError(null);

    try {
      const res = await window.electronAPI.extractLongToShorts({
        videoPath: videoPath.trim(),
        clip: selectedClip,
        title: customTitle || selectedClip.title,
        removeOriginalAudio,
        bgmTrack: selectedBgm,
        enableSfx: true,
      });

      if (res.success && res.videoPath && res.videoUrl) {
        setSuccessResult({ videoPath: res.videoPath, videoUrl: res.videoUrl });
        if (onClipExtracted) {
          onClipExtracted(res.videoPath);
        }
      } else {
        setError(res.error || '쇼츠 추출 실패');
      }
    } catch (err: any) {
      setError(err?.message || '쇼츠 클립 추출 오류');
    } finally {
      setIsExtracting(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-pink-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 border border-purple-600/20 flex items-center justify-center text-purple-600 shadow-inner">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  롱폼 영상 ➡️ 쇼츠 자동 컷 편집기 (Long-to-Shorts)
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  9:16 스마트 크롭
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                기존 긴 가로 영상(16:9)에서 가장 흥미로운 구간을 찾아 9:16 세로 쇼츠로 자동 변환합니다.
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Video Path Input */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileVideo className="w-3.5 h-3.5 text-purple-600" />
                <span>영상 파일 절대 경로 또는 파일 선택 (MP4, MOV, MKV 등)</span>
              </span>
              <button
                type="button"
                onClick={handleSelectFile}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>내 PC 파일 찾기</span>
              </button>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoPath}
                onChange={(e) => setVideoPath(e.target.value)}
                placeholder="예: C:\Videos\sample.mp4 또는 파일 찾기 버튼 클릭..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              <button
                type="button"
                onClick={handleSelectFile}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>파일 선택</span>
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !videoPath.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1.5 shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>하이라이트 분석</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>9:16 쇼츠 클립 추출 및 비디오 보관함 저장 완료!</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-mono break-all">
                저장 경로: {successResult.videoPath}
              </p>
            </div>
          )}

          {/* Clips Selection */}
          {clips.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800">
                  AI 추천 하이라이트 구간 ({clips.length}개 발견, 원본 전체: {totalDuration ? formatSeconds(totalDuration) : ''})
                </span>
                <span className="text-[10px] text-slate-400">클릭하여 추출할 클립을 선택하세요</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {clips.map((clip, idx) => {
                  const isSelected = selectedClip?.startTime === clip.startTime;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedClip(clip);
                        setCustomTitle(clip.title);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{clip.title}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            예상 몰입도 {clip.score}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {formatSeconds(clip.startTime)} ~ {formatSeconds(clip.endTime)} ({clip.duration}초)
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {clip.highlightSummary}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Title Input for Extracted Short */}
              {selectedClip && (
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-bold text-slate-600">
                    생성될 쇼츠 제목 (보관함 및 유튜브 제목용)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Audio & BGM Option (Core User Request) */}
              {selectedClip && (
                <div className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      {removeOriginalAudio ? <VolumeX className="w-4 h-4 text-pink-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                      <span>기존 음성 제거 (음소거)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setRemoveOriginalAudio(!removeOriginalAudio)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        removeOriginalAudio ? 'bg-pink-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        removeOriginalAudio ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {removeOriginalAudio
                      ? '🔇 원본 영상의 기존 말소리 및 잡음을 완전히 제거하고 선택한 BGM으로 대체합니다.'
                      : '🔊 원본 영상의 소리를 그대로 유지합니다.'}
                  </p>

                  <div className="pt-1">
                    <label className="text-[10px] font-extrabold text-slate-600 block mb-1.5 flex items-center gap-1">
                      <Music className="w-3 h-3 text-purple-600" />
                      <span>쇼츠 BGM 선택</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'bgm_upbeat', label: '⚡ Upbeat' },
                        { id: 'bgm_suspense', label: '🕵️ Suspense' },
                        { id: 'bgm_lofi', label: '☕ Lofi' },
                        { id: 'bgm_epic', label: '👑 Epic' },
                        { id: 'bgm_tech', label: '💻 Tech' },
                        { id: 'none', label: '🚫 BGM 없음' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBgm(b.id)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                            selectedBgm === b.id
                              ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            가로 영상(16:9)의 핵심 피사체를 인식하여 9:16 풀스크린 쇼츠로 리사이징합니다.
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={handleExtract}
              disabled={!selectedClip || isExtracting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-40 flex items-center gap-2"
            >
              {isExtracting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>9:16 쇼츠 추출 중...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-3.5 h-3.5" />
                  <span>9:16 세로 쇼츠로 즉시 추출</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
