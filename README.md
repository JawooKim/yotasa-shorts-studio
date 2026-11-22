# K-Shorts Studio

주제 한 줄로 세로형(9:16) 쇼츠 영상을 만드는 Windows 데스크톱 프로그램입니다. 대본 작성, 한국어 음성, 장면 이미지, 자막, 배경음악 합성까지 한 화면에서 처리합니다.

## 주요 기능

- **AI 대본**: Gemini 또는 OpenAI 키로 후킹 대본과 장면 분할을 만듭니다. 키가 없으면 내장 규칙으로 대본을 만듭니다.
- **한국어 음성(TTS)**: Edge-TTS(무료)를 기본으로 쓰고, ElevenLabs 키가 있으면 그 음성도 쓸 수 있습니다.
- **장면 이미지·영상**: 무료 이미지 생성, Pexels/Pixabay 무료 영상(키 필요)을 장면마다 붙입니다.
- **자막·제목**: libass(ASS) 자막 스타일, 키워드 강조, 상단 제목, 3초 후킹 문구.
- **배경음악·효과음**: 직접 합성한 로열티 프리 음원(`scripts/generate-bgm.js`, `scripts/generate-sfx.js`)과 음성 구간 자동 볼륨 조절.
- **롱폼 → 쇼츠**: 긴 영상에서 구간을 골라 9:16 클립으로 자릅니다.
- **대량 생성·자동 제작**: 여러 주제를 한 번에 만들거나, 정해진 시간에 자동으로 만들고 YouTube에 올립니다.

## 개발 실행

필요: Node.js 20 이상, Windows 10/11 64비트 (영상 합성은 `ffmpeg-static`이 들어 있어 따로 설치하지 않아도 됩니다)

```bash
npm install
npm run build   # 화면(Vite) + 메인 프로세스(Electron) 빌드
npm start       # 실행
```

- 개발 서버로 실행: `npm run dev`
- 시험: `node scripts/test-features-runtime.js`
- Edge-TTS는 처음 쓸 때 사용자 폴더에 자동 설치됩니다(Python이 없으면 임베디드 Python도 함께 설치).

## 설치 프로그램 빌드

```bash
npm run dist:win   # release/ 에 NSIS 설치 파일과 .sha256 생성
```

`dist:win`은 항상 **구매자 판**(`KSHORTS_EDITION=buyer`)으로 빌드합니다. 구매자 판에는 관리자 로그인 코드가 들어가지 않습니다.

## 라이선스 키와 관리자 판

- 일반 로그인은 라이선스 서버에서 키를 확인하고 제작할 때마다 토큰을 차감합니다. 서버 응답은 Ed25519 서명으로 검증합니다. 서버 주소·서버 코드·서명 개인키는 이 저장소에 없고, 서버 주소는 빌드할 때 `admin.local.json`의 `licenseServer` 또는 환경 변수 `KSHORTS_LICENSE_SERVER`에서 넣습니다.
- 관리자 로그인은 소스에 검증값을 두지 않습니다. 빌드할 때 저장소에 올리지 않는 `admin.local.json`(`{"adminKeyFnv": <숫자>, "licenseServer": "https://…"}`) 또는 환경 변수 `KSHORTS_ADMIN_FNV`에서 읽고, 값이 없으면 관리자 로그인이 꺼집니다.

## 데이터와 키 저장

- 프로젝트·설정은 사용자 데이터 폴더(Electron `userData`) 아래 `kshorts-data`에 저장됩니다.
- API 키·토큰·시크릿과 라이선스 키는 OS 보안 저장소(Windows DPAPI, Electron `safeStorage`)로 암호화해 저장합니다.

## 라이선스

[MIT](LICENSE)
