# 🏭 쇼츠 자동 공장: 작업 폴더 규칙

`shorts/<작업이름>/job.json`을 `master`에 올리면 GitHub Actions(`.github/workflows/shorts-factory.yml`)가 9:16 쇼츠를 만듭니다. 완성본은 **Releases**에 쇼츠 한 편마다 하나씩 올라갑니다(mp4, 썸네일, 대본, `youtube.txt`).

```
shorts/
  2026-11-22-morning-habit/   ← 작업 이름: 영문 소문자·숫자·하이픈만 씁니다
    job.json                  ← 필수
    01.jpg                    ← 선택: 장면에 넣을 내 사진이나 영상
    02.mp4
```

- 이름이 `_`로 시작하는 폴더(예: `_example`)는 만들지 않습니다. 견본이나 보관용으로 씁니다.
- 작업 폴더 안의 파일을 고쳐서 다시 올리면 그 쇼츠를 새로 만듭니다.
- 사진은 png, jpg, webp, bmp를 쓸 수 있고, 영상은 mp4, mov, m4v, webm, mkv를 쓸 수 있습니다. 세로든 가로든 1080×1920에 맞게 가운데를 잘라 씁니다.

## job.json

```json
{
  "title": "아침 10분이 하루를 바꾼다",
  "topic": "아침 습관",
  "voice": "ko-KR-SunHiNeural",
  "style": "cozy_korea",
  "bgm": "bgm_lofi",
  "hook": { "title": "아침 10분의 기적", "subtitle": "끝까지 보면 내일이 달라집니다" },
  "scenes": [
    { "text": "아침 10분이 하루를 바꿉니다.", "visualPrompt": "sunrise over a cozy Seoul apartment window, warm light" },
    { "text": "첫째, 일어나자마자 물 한 잔을 마십니다.", "image": "01.jpg" },
    { "text": "둘째, 오늘 할 일 세 가지를 적습니다.", "image": "https://example.com/notebook.jpg" },
    { "text": "셋째, 5분만 몸을 쭉 펴 줍니다.", "video": "02.mp4" },
    { "text": "내일 아침, 딱 10분만 먼저 시작해 보세요." }
  ],
  "youtube": {
    "title": "아침 10분 루틴 3가지 #shorts",
    "description": "하루를 바꾸는 아침 10분 습관 3가지",
    "tags": ["아침루틴", "습관", "shorts"],
    "pinnedComment": "여러분의 아침 루틴은 무엇인가요?"
  }
}
```

| 항목 | 필수 | 설명 |
|---|---|---|
| `title` | ✔ | 영상 상단 제목 띠에 들어가는 제목입니다. |
| `topic` | | 주제 한 줄입니다. `script`와 `scenes`가 모두 없으면 이 주제로 대본을 자동으로 씁니다(Gemini·OpenAI 키가 있으면 AI로, 없으면 내장 규칙으로). |
| `script` | | 나레이션 대본 전체입니다. 비워 두면 `scenes[].text`를 이어 붙여 씁니다. |
| `scenes` | | 장면 목록입니다(3~8개 권장). 한 장면에 한 문장을 씁니다. |
| `scenes[].text` | | 그 장면에서 읽을 문장입니다. |
| `scenes[].image` | | 작업 폴더 안의 사진 파일 이름이나 `https://` 주소입니다. 없으면 AI가 이미지를 만듭니다. |
| `scenes[].video` | | 작업 폴더 안의 영상 파일 이름이나 `https://` 주소입니다. |
| `scenes[].visualPrompt` | | AI 이미지용 **영어** 묘사입니다. 사진을 넣은 장면에는 쓰지 않습니다. |
| `voice` | | 목소리입니다. `ko-KR-SunHiNeural`(선희, 기본 여성), `ko-KR-InJoonNeural`(인준, 남성), `jimin`(감성 여성), `yujin`(발랄한 여성), `bongjin`(중저음 남성), `hyunsu`(트렌디한 청년). |
| `voiceSpeed` | | 말하는 속도입니다. `1.0`이 기본이고 `0.8`~`1.3` 사이로 정합니다. |
| `style` | | 화풍입니다. `basic`, `k_documentary`, `k_webtoon`, `cozy_korea`, `luxury_lifestyle`, `motion_graphic`, `3d`, `anime`, `mystery_horror`, `claymation`, `cyberpunk`, `noir`, `retrogaming` 중에서 고릅니다. |
| `bgm` | | 배경음악입니다. `auto`(기본), `bgm_upbeat`, `bgm_lofi`, `bgm_suspense`, `bgm_epic`, `bgm_tech`, `none` 중에서 고릅니다. |
| `bgmVolume` | | 배경음악 크기입니다. 0~1 사이 값을 씁니다. |
| `sfx` | | 효과음을 씁니다. 기본값은 `true`입니다. |
| `hook.title` / `hook.subtitle` | | 첫 3초에 띄우는 후킹 문구입니다. 넣으면 후킹 인트로가 켜집니다. |
| `subtitleStyle` | | 자막 스타일입니다. `mrbeast`, `karaoke`, `black_box`, `neon`, `news`, `highlighter`, `ssul_talk`, `samul_1min`, `vlog_aesthetic`, `mystery_crime`, `ranking_top` 중에서 고릅니다. |
| `subtitleSize` | | 자막 크기입니다. `small`, `medium`, `large`, `xlarge` 중에서 고릅니다. |
| `titleStyle` | | 제목 띠 모양입니다. `yellow_tape`, `breaking`, `dark_pill`, `ssul_badge`, `caution_hazard`, `gold_luxury`, `quiz_card`, `none` 중에서 고릅니다. |
| `font` | | 자막 폰트입니다. `pretendard`가 기본이고, 공장에서는 Pretendard와 Noto Sans CJK가 설치되어 있습니다. |
| `transition` | | 장면 전환 방식입니다. `fade`(기본), `zoom`, `cut` 중에서 고릅니다. |
| `karaoke` | | 단어 단위 노래방 자막을 켭니다. |
| `stockVideo` | | 사진이 없는 장면에 Pexels·Pixabay 무료 영상을 찾아 넣습니다. API 키가 필요합니다. |
| `loopMode` | | 마지막 문장이 첫 문장으로 이어지도록 대본을 다듬습니다(무한 루프 쇼츠). |
| `youtube` | | 업로드할 때 쓸 제목, 설명, 태그, 고정 댓글입니다. Release 설명과 `youtube.txt`에 그대로 들어갑니다. |
| `advanced` | | 앱의 `RenderShortsRequest` 필드를 직접 넘길 때 씁니다(고급 설정). |

## API 키 (선택)

키가 없어도 무료 엔진(Edge-TTS 음성, 무료 FLUX 이미지)으로 영상이 나옵니다. 품질을 높이려면 저장소의 **Settings → Secrets and variables → Actions**에 아래 키를 넣습니다.

| Secret 이름 | 쓰이는 곳 |
|---|---|
| `GEMINI_API_KEY` 또는 `OPENAI_API_KEY` | 대본 자동 작성, 장면별 영어 이미지 묘사 |
| `ELEVENLABS_API_KEY` | 감정 표현 음성. `voice`를 `elevenlabs_...`로 지정할 때 씁니다. |
| `PEXELS_API_KEY`, `PIXABAY_API_KEY` | 무료 스톡 영상과 사진 |
| `FAL_API_KEY`, `STABILITY_API_KEY` | 유료 이미지 생성 |

이미지 엔진을 바꾸려면 **Variables**에 `IMAGE_ENGINE`을 만들고 `pollinations`, `gemini`, `openai`, `fal`, `stability`, `pexels`, `pixabay` 중 하나를 넣습니다.
