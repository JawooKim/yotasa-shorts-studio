import React from 'react';
import { Type, Check, ShieldCheck } from 'lucide-react';
import type { FontOption } from '../types';

export const FONTS: FontOption[] = [
  {
    id: 'Pretendard',
    name: '프리탠다드 (Pretendard)',
    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
    tag: '기본 권장 / 가독성 1위',
    description: '모바일 쇼츠 자막의 표준, 어떤 배경에서도 가장 깔끔하고 선명한 전달력',
    license: 'SIL Open Font License (상업용 무료)',
  },
  {
    id: 'GmarketSansBold',
    name: 'G마켓 산스 볼드 (Gmarket Sans)',
    fontFamily: 'GmarketSansBold, sans-serif',
    tag: '강렬한 후킹 / 타이틀',
    description: '굵고 직관적인 자막체, 첫 3초 시선 집중 및 핵심 키워드 강조에 탁월',
    license: 'OFL / 상업용 100% 무료',
  },
  {
    id: 'Black Han Sans',
    name: '블랙한스 (Black Han Sans)',
    fontFamily: '"Black Han Sans", sans-serif',
    tag: '극강 임팩트 / 묵직함',
    description: '충격적인 사실, 랭킹, 뉴스, 경고형 쇼츠에 최적화된 묵직한 고딕',
    license: 'SIL Open Font License (상업용 무료)',
  },
  {
    id: 'Do Hyeon',
    name: '도현체 (Do Hyeon)',
    fontFamily: '"Do Hyeon", sans-serif',
    tag: '유튜브 썰 / 친근함',
    description: '작약하고 친근한 유튜브 썰풀이, 일상 꿀팁, 재미있는 토픽에 인기',
    license: 'SIL Open Font License (상업용 무료)',
  },
  {
    id: 'Noto Sans KR',
    name: '노토 산스 블랙 (Noto Sans KR)',
    fontFamily: '"Noto Sans KR", sans-serif',
    tag: '신뢰 / 다큐 뉴스',
    description: '구글/어도비 공동 개발, 왜곡 없이 정갈하고 신뢰감 높은 글로벌 표준',
    license: 'SIL Open Font License (상업용 무료)',
  },
];

interface FontSelectorProps {
  selectedFontId: string;
  onSelectFont: (id: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontId,
  onSelectFont,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">3-2. 쇼츠 자막 폰트 선택 (상업용 무료 100%)</h2>
            <p className="text-xs text-slate-500 font-normal">유튜브 수익 창출 및 상업적 사용에 저작권 위험이 전혀 없는 검증된 폰트만 제공합니다.</p>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>상업용 무료 안심 라이선스</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {FONTS.map((f) => {
          const isSelected = (selectedFontId || 'Pretendard').toLowerCase() === f.id.toLowerCase();
          return (
            <div
              key={f.id}
              onClick={() => onSelectFont(f.id)}
              className={`group relative cursor-pointer rounded-2xl p-4 border transition-all ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-md ring-2 ring-indigo-100'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-black text-sm text-slate-900 truncate" style={{ fontFamily: f.fontFamily }}>
                  {f.name}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all text-xs font-bold ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Font Live Preview Text */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 my-2 shadow-inner">
                <p className="text-sm font-bold text-slate-900 truncate" style={{ fontFamily: f.fontFamily }}>
                  💡 1분 만에 바뀌는 하루 10분 습관!
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 mt-2">
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                  {f.tag}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  {f.license.split('(')[0].trim()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
