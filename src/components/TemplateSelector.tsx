import React from 'react';
import { LayoutGrid, Check, Video, Sparkles } from 'lucide-react';
import type { TemplateOption } from '../types';
import { PORTAL_KO } from '../constants/portal';

export const TEMPLATES: TemplateOption[] = [
  { id: 'basic', name: '기본 모던 실사 (Basic)', tag: '🎬 고화질 실사/시네마틱' },
  { id: 'k_documentary', name: '한국 방송 다큐 실사 (K-Docu)', tag: '🇰🇷 지식채널/EBS/시사' },
  { id: 'k_webtoon', name: 'K-웹툰 & 만화 화풍 (K-Webtoon)', tag: ('🎨 ' + PORTAL_KO + '·카카오 웹툰') },
  { id: 'cozy_korea', name: '성수·홍대 감성 일상 (K-Daily)', tag: '☕ 힐링 카페/감성 브이로그' },
  { id: 'luxury_lifestyle', name: '성공 & 슈퍼리치 (Money & Lux)', tag: '💰 재테크/동기부여/슈퍼카' },
  { id: 'motion_graphic', name: '1분 지식 인포그래픽 (Infographic)', tag: '💡 1분미만/사물궁이 2D' },
  { id: '3d', name: '3D 픽사 애니메이션 (3D Pixar)', tag: '🧸 디즈니/입체 3D' },
  { id: 'anime', name: '감성 재패니메이션 (Anime)', tag: '🌸 신카이 마코토 감성' },
  { id: 'mystery_horror', name: '미스터리 & 심령 괴담 (Mystery)', tag: '👻 공포/그알/서스펜스' },
  { id: 'claymation', name: '아기자기 클레이 점토 (Clay Toy)', tag: '🧁 귀여운 스톱모션 점토' },
  { id: 'cyberpunk', name: '사이버펑크 네온 (Cyberpunk)', tag: '⚡ 네온/SF 미래 테크' },
  { id: 'noir', name: '시네마틱 누아르 (Neo-Noir)', tag: '🕶️ 흑백/고대비 드라마틱' },
  { id: 'retrogaming', name: '레트로 픽셀 도트 (Pixel Game)', tag: '👾 16비트 아케이드 감성' },
];

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
  onOpenSettings?: () => void;
  currentEngine?: string;
  enableStockVideo?: boolean;
  onToggleStockVideo?: (val: boolean) => void;
  hasPexelsKey?: boolean;
  transitionType?: 'cut' | 'fade' | 'zoom';
  onChangeTransitionType?: (val: 'cut' | 'fade' | 'zoom') => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onOpenSettings,
  currentEngine = 'pollinations',
  enableStockVideo = false,
  onToggleStockVideo,
  hasPexelsKey = false,
  transitionType = 'fade',
  onChangeTransitionType,
}) => {
  const engineLabels: Record<string, string> = {
    pollinations: 'Pollinations AI (무료)',
    openai: 'OpenAI DALL-E 3',
    fal: 'Fal.ai (Flux Pro)',
    stability: 'Stability AI (SD3)',
    pexels: 'Pexels 고화질 사진',
    pixabay: 'Pixabay 무료 미디어',
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">4. 비디오 비주얼 미디어 & 화풍 설정</h2>
            <p className="text-[11px] text-slate-500 font-medium">
              AI 생성 이미지 또는 Pexels/Pixabay 무료 비디오 클립을 쇼츠 배경으로 활용합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Visual Source Mode Switch */}
          {onToggleStockVideo && (
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleStockVideo(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  !enableStockVideo
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>AI 이미지 생성</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleStockVideo(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  enableStockVideo
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>무료 비디오 우선</span>
              </button>
            </div>
          )}

          <span className="text-[11px] px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold">
            엔진: {engineLabels[currentEngine] || currentEngine}
          </span>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-[11px] text-blue-600 hover:text-blue-700 underline font-bold hover:bg-blue-50 px-2 py-1 rounded transition-all"
            >
              API 키 설정
            </button>
          )}
        </div>
      </div>

      {/* Guide Banner for Stock Video Mode */}
      {enableStockVideo && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold">비디오 모드 ON</span>
            <span className="font-semibold text-[11px]">
              {hasPexelsKey
                ? '🎬 Pexels 고화질 9:16 실사 세로 영상이 대본 주제에 맞추어 자동 매칭됩니다.'
                : '💡 Pexels API 키가 등록되지 않았습니다. 기본 카탈로그 영상으로 매칭되며, [API 키 설정]에서 Pexels 무료 키 입력 시 수천만 개의 영상이 자동 매칭됩니다.'}
            </span>
          </div>
          {onOpenSettings && !hasPexelsKey && (
            <button
              onClick={onOpenSettings}
              className="text-[11px] font-bold text-emerald-700 underline hover:text-emerald-800 shrink-0 ml-2"
            >
              키 등록하기 ↗
            </button>
          )}
        </div>
      )}

      {/* Transition Effect Selector */}
      {onChangeTransitionType && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">🎬 씬 전환 효과:</span>
            <span className="text-slate-500 text-[11px]">씬과 씬 사이 화면 전환 애니메이션</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'fade', label: '🌸 부드러운 페이드 (추천)', desc: '디졸브 페이드' },
              { id: 'zoom', label: '🚀 다이내믹 줌', desc: '가속 줌 모션' },
              { id: 'cut', label: '⚡ 기본 컷', desc: '다이렉트 컷' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeTransitionType(t.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  transitionType === t.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 max-h-[300px] overflow-y-auto pr-1">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`group relative cursor-pointer rounded-2xl p-4 border transition-all ${
                isSelected
                  ? 'bg-amber-50/80 border-amber-500 text-amber-900 shadow-md ring-2 ring-amber-100'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-extrabold text-xs text-slate-900 truncate">{tmpl.name}</span>
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
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                {tmpl.tag}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
