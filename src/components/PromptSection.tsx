import React, { useState } from 'react';
import { Wand2, Lightbulb, RotateCw, Flame, TrendingUp, X } from 'lucide-react';

interface PromptSectionProps {
  prompt: string;
  setPrompt: (v: string) => void;
  onGenerateScript: () => void;
  isGeneratingScript: boolean;
  loopMode?: boolean;
  setLoopMode?: (v: boolean) => void;
}

interface TopicCategory {
  id: string;
  name: string;
  icon: string;
  topics: string[];
}

const CATEGORIZED_TOPICS: TopicCategory[] = [
  {
    id: 'shocking',
    name: '🤯 충격 반전 & 미스터리',
    icon: '🤯',
    topics: [
      '스위스에서 밤 10시 이후 변기 물 내리면 벌금 무는 이유',
      '싱가포르에서 껌 씹다 걸리면 벌금 1억 나오는 진짜 이유',
      '풀리지 않는 전 세계 3대 미스터리 실종 사건의 진실',
      '심해 11,000m 마리아나 해구에서 발견된 충격적인 괴생물',
      '수심 1만 미터에서 포착된 정체불명의 괴성 블룹(Bloop)의 실체',
      '센과 치히로의 행방불명 속에 숨겨진 충격적인 어두운 복선',
      '완전 범죄로 끝날 뻔했던 3대 미제 사건의 기적 같은 진실',
      '30초 만에 다이아몬드 100억 원어치 털고 사라진 범인의 수법',
      '탈옥 불가능한 알카트라즈를 숟가락으로 뚫고 사라진 죄수들',
      '피라미드 내부 깊숙한 곳에서 발견된 믿기 힘든 고대 미스터리',
      '지구상에서 가장 외로운 52헤르츠 고래의 슬픈 진실',
      '우주 비행사들이 우주선 안에서 빵과 탄산을 절대 먹지 못하는 이유',
      '블랙홀 안으로 들어가면 인간의 몸에 일어나는 기이한 일',
      '페이스북 AI 2대가 인간 모르게 자신들만의 언어로 대화한 사건',
      '인간이 느낄 수 있는 가장 오싹한 공포: 불쾌한 골짜기의 실체',
    ],
  },
  {
    id: 'mind_body',
    name: '🧠 뇌과학 & 심리/관계',
    icon: '🧠',
    topics: [
      '자기 전 이불킥하게 만드는 흑역사가 떠오르는 뇌과학적 이유',
      '사람이 사망하기 직전 뇌에서 일어나는 마지막 30초의 진실',
      '시한부 환자들이 생의 마지막 날 가장 후회하는 단 1가지',
      '거짓말하는 사람들의 무의식적인 3가지 신체 신호',
      '나를 만만하게 보는 사람을 단숨에 제압하는 침묵의 대화법',
      '인간관계에서 반드시 손절해야 할 위험한 나르시시스트 특징',
      '말 한마디로 상대방을 내 편으로 만드는 미러링 심리학',
      '스트레스 받을 때 뇌를 3초 만에 진정시키는 생리적 한숨 호흡법',
      '거절 못 하는 착한 아이 증후군 극복하는 당당한 거절의 기술',
      '말싸움할 때 절대 감정적으로 흥분하지 않는 심리 트릭',
      '왜 우리는 방에 들어오자마자 하려던 일을 까먹을까? 문간 효과',
      '가위에 눌렸을 때 귀신을 보게 되는 뇌의 충격적인 착각',
      '소시오패스가 직장에서 사람들을 가스라이팅할 때 쓰는 수법',
      '단톡방에서 넵만 치는 사람들의 소름 돋는 무의식 심리',
      '자존감을 순식간에 높여주는 3가지 뇌과학적 트릭',
    ],
  },
  {
    id: 'money_biz',
    name: '💰 부자 & 천재 마케팅',
    icon: '💰',
    topics: [
      '애플이 아이폰 충전기를 빼버리고도 8조 원을 더 번 천재적 수법',
      '다이아몬드가 사실은 전혀 희귀하지 않은 돌멩이라는 충격 진실',
      '스타벅스가 컵에 손님 이름을 일부러 틀리게 적는 고도의 마케팅',
      '코카콜라가 원래 초록색이던 산타를 빨간 옷으로 세뇌시킨 비화',
      '로또 1등 당첨자 90%가 5년 안에 파산하는 소름 돋는 이유',
      '자수성가 백만장자들이 기상 후 1시간 동안 절대 하지 않는 것',
      '나도 모르게 통장을 거덜 내는 위험한 일상 소비 습관',
      '워런 버핏이 강조한 부자가 되는 단 하나의 불변 원칙',
      '일론 머스크가 매일 사용하는 시간 관리 타임박싱 테크닉',
      '평범한 직장인이 월 1000만원 부수입 만드는 현실적인 파이프라인',
      '가난한 사람과 부자의 결정적인 일상 소비 패턴 차이',
      '2030년 안에 지구상에서 가장 먼저 사라질 직업 1위의 반전',
      '식당에서 메뉴판 가장 비싼 메뉴를 맨 위에 배치하는 앵커링 효과',
      '마트 시식 코너의 음식을 먹으면 왜 지갑이 열릴까? 상호성의 법칙',
    ],
  },
  {
    id: 'history_world',
    name: '📜 역사 & 세계 기이한 법률',
    icon: '📜',
    topics: [
      '로마 황제가 적국과 전쟁 대신 바닷가 조개껍질을 줍게 한 이유',
      '조선 왕실에서 실제로 사용했던 기상천외한 건강 비법',
      '빌 게이츠보다 10배 부자였던 역사상 최고의 금수저 만사 무사',
      '단 1발의 총알로 제1차 세계대전을 촉발시킨 어이없는 우연',
      '역사상 가장 치열했던 전쟁이 38분 만에 끝난 황당한 이유',
      '조선시대 왕들의 실제 하루 일과와 충격적으로 짧았던 수명',
      '한국 역사상 가장 위대한 천재 과학자 장영실의 비밀 발명품',
      '프랑스 기차역 플랫폼에서 키스하면 법적으로 체포되는 이유',
      '이탈리아에서 카푸치노를 오전 11시 이후에 주문하면 생기는 일',
      '타이타닉 침몰 당시 1등실 재벌들이 구명보트를 거부한 이유',
      '다크나이트 조커 히스 레저의 소름 돋는 즉흥 애드리브의 비밀',
      '전 세계에서 오직 1곳만 존재하는 죽음이 금지된 도시의 비밀',
    ],
  },
  {
    id: 'life_tech',
    name: '💡 생활 & 스마트 치트키',
    icon: '💡',
    topics: [
      '스마트폰 배터리 수명 2배 늘려주는 필수 설정 3가지',
      '알아두면 평생 돈 아끼는 비행기표 최저가 시크릿 예매 타이밍',
      '컴퓨터 속도 3배 빨라지게 만드는 숨겨진 윈도우 단축키',
      '구글 검색할 때 원하는 결과 1초 만에 찾는 특급 명령어',
      '카카오톡 숨겨진 기능으로 사생활 100% 철통 보호하는 법',
      '퇴근 시간을 1시간 앞당겨주는 일잘러 엑셀 필수 단축키',
      '1분 만에 목과 어깨 뻐근함 날려버리는 기적의 스트레칭',
      '기상 직후 미온수 한 잔이 보약인 과학적인 진짜 이유',
      '먹는 순서만 바꿨는데 살이 쑥 빠지는 거꾸로 식사법',
      '강아지가 당신에게 엉덩이를 들이미는 소름 돋는 심리',
      '고양이가 집사를 사랑할 때만 보여주는 비밀 행동 3가지',
      '차량 사이드미러 빗물에 시야 가릴 때 치약 바르면 생기는 일',
      '포맷 없이 버벅이는 PC 1초 만에 쌩쌩하게 되살리는 비법',
    ],
  },
];

const ALL_TOPIC_POOL = CATEGORIZED_TOPICS.flatMap((c) => c.topics);

export const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  setPrompt,
  onGenerateScript,
  isGeneratingScript,
  loopMode = false,
  setLoopMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shuffledDeck, setShuffledDeck] = useState<string[]>(() => {
    return [...ALL_TOPIC_POOL].sort(() => 0.5 - Math.random());
  });
  const [deckIndex, setDeckIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [trendingList, setTrendingList] = useState<{ topic: string; category: string; viewEstimate: string }[]>([]);

  // Filter deck by category
  const activePool = React.useMemo(() => {
    if (selectedCategory === 'all') return ALL_TOPIC_POOL;
    const cat = CATEGORIZED_TOPICS.find((c) => c.id === selectedCategory);
    return cat ? cat.topics : ALL_TOPIC_POOL;
  }, [selectedCategory]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setDeckIndex(0);
    const pool = catId === 'all'
      ? ALL_TOPIC_POOL
      : (CATEGORIZED_TOPICS.find((c) => c.id === catId)?.topics || ALL_TOPIC_POOL);
    setShuffledDeck([...pool].sort(() => 0.5 - Math.random()));
  };

  const handleToggleTrending = async () => {
    if (!showTrending && trendingList.length === 0) {
      if (window.electronAPI?.fetchTrendingKeywords) {
        try {
          const list = await window.electronAPI.fetchTrendingKeywords();
          setTrendingList(list);
        } catch {}
      }
    }
    setShowTrending((prev) => !prev);
  };

  const currentExamples = React.useMemo(() => {
    const count = 4;
    const pool = shuffledDeck.length > 0 ? shuffledDeck : activePool;
    const start = deckIndex % pool.length;
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(pool[(start + i) % pool.length]);
    }
    return result;
  }, [deckIndex, shuffledDeck, activePool]);

  const handleRefreshExamples = () => {
    setIsRotating(true);
    setDeckIndex((prev) => {
      const next = prev + 4;
      if (next >= shuffledDeck.length) {
        setShuffledDeck([...activePool].sort(() => 0.5 - Math.random()));
        return 0;
      }
      return next;
    });
    setTimeout(() => setIsRotating(false), 400);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">1. 쇼츠 주제 / 아이디어</h2>
            <p className="text-[11px] text-slate-500 font-medium">카테고리별 참신한 주제를 탐색하거나 직접 입력하세요</p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleToggleTrending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xs transition-all active:scale-95"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{showTrending ? '트렌드 닫기' : '🔥 실시간 바이럴 급상승 키워드'}</span>
        </button>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🌟 전체 ({ALL_TOPIC_POOL.length})
        </button>
        {CATEGORIZED_TOPICS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Trending Topics Drawer */}
      {showTrending && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-200 shadow-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span>유튜브 & SNS 알고리즘 급상승 추천 키워드</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTrending(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {trendingList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setPrompt(item.topic);
                  setShowTrending(false);
                }}
                className="p-3 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-200/80 cursor-pointer transition-all hover:border-orange-400 shadow-xs group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold">
                    {item.category}
                  </span>
                  <span className="text-orange-600 font-extrabold flex items-center gap-0.5">
                    <Flame className="w-3 h-3" /> 조회수 예상 {item.viewEstimate}
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-800 group-hover:text-orange-900 leading-snug">
                  {item.topic}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 스위스에서 밤 10시 이후 변기 물 내리면 벌금인 이유"
          rows={2}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-100 resize-none transition-all font-medium"
        />
      </div>

      {/* Quick Example Chips with Refresh Button (No Text Truncation) */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 mr-0.5">
          <span className="text-[11px] text-slate-500 font-bold">추천 주제:</span>
          <button
            onClick={handleRefreshExamples}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
            title="다른 추천 주제 보기 (새로고침)"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin text-rose-600' : ''}`} />
          </button>
        </div>
        {currentExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setPrompt(ex)}
            className="text-[11px] bg-slate-100 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-all text-left font-medium active:scale-95 shadow-xs whitespace-normal"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none" title="마지막 문장이 첫 문장으로 자연스럽게 이어져 반복 시청을 유도합니다">
          <input
            type="checkbox"
            checked={loopMode}
            onChange={(e) => setLoopMode?.(e.target.checked)}
            className="w-4 h-4 accent-rose-600 cursor-pointer"
          />
          <span className="text-xs font-extrabold text-slate-700">🔁 무한 루프 모드</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">끝 → 처음으로 자연스럽게 이어지는 대본</span>
        </label>
        <button
          onClick={onGenerateScript}
          disabled={!prompt.trim() || isGeneratingScript}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isGeneratingScript ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>3초 후킹 대본 작성 중...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI 대본 즉시 생성</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
