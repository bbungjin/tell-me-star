# tell-me-star

React(CRA)에서 **출생차트(행성·하우스)** 를 `circular-natal-horoscope-js`로 계산하고, **AI 해석**은 Cloudflare **Pages Functions**(`functions/api/chart-interpret.js`)에서 OpenAI를 호출합니다.

## 동작 요약

1. 사용자가 생년월일·시간·출생지를 제출하면 **브라우저에서** 네이탈 차트가 계산됩니다.
2. **「더 많은 정보 보기」** 는 `POST /api/chart-interpret` 로 차트 JSON을 보내 한국어 해석을 받습니다.
3. Secrets는 **`OPENAI_API_KEY`** 만 필요합니다. (점성술 외부 API 없음)

## OPENAI_API_KEY 넣는 위치 (개발 vs 배포)

| 환경 | 어디에 입력 | 비고 |
|------|-------------|------|
| **로컬 개발** (`npm run pages:dev`) | 프로젝트 **루트**에 파일 **`.dev.vars`** 생성 | 예: [``.dev.vars.example`](.dev.vars.example) 복사 후 키 입력. **Git에 올리지 마세요** (`.gitignore`에 포함됨). |
| **Cloudflare Pages (프로덕션·프리뷰)** | Dashboard → 해당 프로젝트 → **Settings** → **Environment variables** | 변수 이름 **`OPENAI_API_KEY`**, 값에 OpenAI 시크릿 키. Production / Preview 각각 넣을 수 있음. |

**브라우저(React)에는 키를 넣지 않습니다.** CRA용 `.env`의 `REACT_APP_*`에는 OpenAI 키가 필요 없습니다. 프론트는 배포 후 **같은 도메인**의 `/api/chart-interpret`만 호출하고, Pages Function이 서버에서 `OPENAI_API_KEY`를 읽습니다.

선택: **`ALLOWED_ORIGINS`** 를 Pages 환경 변수로 두면 CORS 허용 도메인을 제한할 수 있습니다. 비우면 Functions 코드 기본값은 `*` 입니다.

## 프롬프트 (Playground 테스트)

`functions/lib/chartInterpretPrompts.js` 상단 주석 참고.

- **System**(역할·안전·출력 형식): `CHART_INTERPRET_SYSTEM`
- **User**(이번 작업 + 차트 JSON): `buildChartInterpretUserMessage` 와 동일하게 구성

## 로컬 개발

### React만 (API 없이 UI)

```bash
npm install
npm start
```

이 상태에서는 「더 많은 정보 보기」가 같은 호스트에 `/api` 가 없으면 실패합니다. API까지 함께 보려면 아래를 사용하세요.

### Pages Functions + 빌드 앱

루트에 `.dev.vars` 에 `OPENAI_API_KEY` 를 넣습니다 ([`.dev.vars.example`](.dev.vars.example)).

```bash
npm run pages:dev
```

터미널에 출력되는 주소(예: `http://127.0.0.1:8788`)로 접속합니다.

선택: CRA만 `localhost:3000`으로 돌리고 API만 원격 Pages 프리뷰를 쓰려면 `.env` 에  
`REACT_APP_API_BASE_URL=https://<프로젝트>.pages.dev` 를 넣습니다.

## 배포 (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `build`
- 환경 변수: **`OPENAI_API_KEY`**
- 선택: **`ALLOWED_ORIGINS`** (쉼표 구분 오리진, 미설정 시 `*`)

프로덕션에서는 같은 Pages 도메인으로 배포하면 **`REACT_APP_API_BASE_URL` 비우기**.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 스크립트: `npm start`, `npm test`, `npm run build`.
