/**
 * Cloudflare Pages Function — POST /api/chart-interpret
 * Secrets: OPENAI_API_KEY (Pages 대시보드 → 환경 변수)
 * 선택: ALLOWED_ORIGINS (쉼표 구분, 예: https://myapp.pages.dev,http://localhost:3000 또는 *)
 *
 * 프롬프트 분리: ../lib/chartInterpretPrompts.js (Playground 테스트 방법 주석 참고)
 */

import {
  CHART_INTERPRET_SYSTEM,
  buildChartInterpretUserMessage,
} from "../lib/chartInterpretPrompts.js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MAX_BODY = 24 * 1024;

/** @param {Request} request @param {{ ALLOWED_ORIGINS?: string }} env */
function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const raw = env?.ALLOWED_ORIGINS ?? "*";
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let allow = "*";
  if (!list.includes("*")) {
    allow = list.find((o) => o === origin) || list[0] || "";
  }

  return {
    "Access-Control-Allow-Origin": allow || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request, env) },
  });
}

/**
 * @param {string} openaiKey
 * @param {object} payload
 */
async function fetchOpenAIInterpretation(openaiKey, payload) {
  const user = buildChartInterpretUserMessage(payload);

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.65,
      messages: [
        { role: "system", content: CHART_INTERPRET_SYSTEM },
        { role: "user", content: user },
      ],
    }),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("OpenAI 응답 파싱 실패");
  }

  if (!res.ok) {
    const msg =
      (data?.error && data.error.message) ||
      text.slice(0, 400) ||
      `OpenAI 오류 ${res.status}`;
    throw new Error(msg);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("OpenAI 응답에 텍스트가 없습니다.");
  }
  return content.trim();
}

/** @param {{ request: Request, env: Record<string, string> }} context */
export async function onRequestOptions({ request, env }) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}

/** @param {{ request: Request, env: Record<string, string> }} context */
export async function onRequestPost({ request, env }) {
  const openaiKey = env.OPENAI_API_KEY;
  if (!openaiKey) {
    return json(
      {
        error: "서버 설정 오류",
        message:
          "OPENAI_API_KEY 가 설정되지 않았습니다. Cloudflare Pages → Settings → Environment variables 에 추가하세요.",
      },
      503,
      request,
      env,
    );
  }

  let rawText = "";
  try {
    rawText = await request.text();
  } catch {
    return json({ error: "본문을 읽을 수 없습니다." }, 400, request, env);
  }

  if (rawText.length > MAX_BODY) {
    return json({ error: "요청 본문이 너무 큽니다." }, 413, request, env);
  }

  let body;
  try {
    body = JSON.parse(rawText || "{}");
  } catch {
    return json({ error: "JSON 형식이 올바르지 않습니다." }, 400, request, env);
  }

  if (
    !body.meta ||
    typeof body.meta !== "object" ||
    !Array.isArray(body.planets) ||
    !Array.isArray(body.houses)
  ) {
    return json(
      {
        error: "유효하지 않은 차트 데이터입니다.",
        message: "meta, planets[], houses[] 필드가 필요합니다.",
      },
      400,
      request,
      env,
    );
  }

  const compactPayload = {
    meta: body.meta,
    planets: body.planets,
    houses: body.houses,
    ...(body.calculation && typeof body.calculation === "object"
      ? { calculation: body.calculation }
      : {}),
  };

  try {
    const aiInterpretation = await fetchOpenAIInterpretation(openaiKey, compactPayload);
    return json({ aiInterpretation }, 200, request, env);
  } catch (e) {
    return json(
      {
        error: "OpenAI 오류",
        message: e instanceof Error ? e.message : String(e),
      },
      502,
      request,
      env,
    );
  }
}
