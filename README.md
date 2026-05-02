# tell-me-star

React(CRA)에서 **출생차트(행성·하우스)** 를 `circular-natal-horoscope-js`로 계산하고, **AI 해석만** Cloudflare Worker(OpenAI)로 요청합니다.

## 동작 요약

1. 사용자가 생년월일·시간·출생지를 입력하고 제출하면 **브라우저에서** 네이탈 차트가 계산되어 표시됩니다.
2. **「더 많은 정보 보기」** 를 누르면 Worker의 `POST /api/chart-interpret` 가 차트 JSON을 받아 OpenAI로 한국어 해석을 생성합니다.
3. Worker에는 **`OPENAI_API_KEY`** 만 필요합니다. (점성술 외부 API 없음)

## 로컬 개발

### Worker (AI 해석만)

```bash
cd worker
npm install
# 선택: cp .dev.vars.example .dev.vars 후 OPENAI_API_KEY=
npm run dev
```

### React 앱

```bash
npm install
npm start
```

[`package.json`](package.json)의 `"proxy": "http://127.0.0.1:8787"` 로 개발 시 `/api/chart-interpret` 요청이 Worker로 전달됩니다.

프로덕션 Pages 빌드 시 **`REACT_APP_WORKER_API_URL`** 에 배포한 Worker URL을 넣으세요. ([`.env.example`](.env.example))

### Worker Secrets (배포)

```bash
cd worker
npx wrangler secret put OPENAI_API_KEY
```

## Worker CORS

[`worker/wrangler.toml`](worker/wrangler.toml)의 `ALLOWED_ORIGINS`에 Pages 도메인과 로컬 오리진을 설정하세요.

## 배포 체크리스트

- Worker: `cd worker && npm run deploy`
- Worker Secrets: `OPENAI_API_KEY`
- Pages: `npm run build` → output `build`
- Pages 환경변수: `REACT_APP_WORKER_API_URL`

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 스크립트: `npm start`, `npm test`, `npm run build`.
