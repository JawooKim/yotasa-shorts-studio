export interface SfxTrack {
  id: string;
  name: string;
  description: string;
  filename: string;
  tag: string;
  icon: string;
}

export const SFX_TRACKS: SfxTrack[] = [
  {
    id: 'sfx_whoosh',
    name: '화면 전환 스윕 (Whoosh)',
    description: '씬(Scene)이 전환될 때 역동적인 속도감 부여',
    filename: 'sfx_whoosh.mp3',
    tag: '씬 전환',
    icon: '💨',
  },
  {
    id: 'sfx_pop',
    name: '키워드 바운스 팝 (Pop)',
    description: '단어 자막이나 시각 요소가 팝업될 때 통통 튀는 효과음',
    filename: 'sfx_pop.mp3',
    tag: '자막 강조',
    icon: '🫧',
  },
  {
    id: 'sfx_ding',
    name: '핵심 꿀팁 차임 (Ding)',
    description: '솔루션, 꿀팁, 정답이 제시될 때 시선 집중',
    filename: 'sfx_ding.mp3',
    tag: '핵심 포인트',
    icon: '🔔',
  },
  {
    id: 'sfx_boom',
    name: '임팩트 서브 붐 (Boom)',
    description: '0초 인트로 3초 후킹 및 충격/반전 포인트 타격',
    filename: 'sfx_boom.mp3',
    tag: '인트로 후킹',
    icon: '💥',
  },
  {
    id: 'sfx_glitch',
    name: '디지털 글리치 (Glitch)',
    description: '주의, 경고, 논란의 반전 전개 시 긴장감 고조',
    filename: 'sfx_glitch.mp3',
    tag: '경고/반전',
    icon: '⚡',
  },
];
