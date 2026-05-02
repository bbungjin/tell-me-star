const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const MAX_BODY = 24 * 1024;

/** @param {Request} request @param {{ ALLOWED_ORIGINS?: string }} env */
function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const raw = env?.ALLOWED_ORIGINS ?? "http://localhost:3000,*";
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
  const system =
    "당신은 서양 점성술 출생차트를 한국어로 풀어 설명하는 도우미입니다. 의료·법률·재정 확정 조언은 하지 말고, 재미와 자기 이해를 위한 참고용임을 분명히 하세요. 확정적 예언 금지.";

  const user =
    "아래 JSON은 클라이언트에서 계산된 네이탈 차트 요약입니다. 팩트로 주어진 정보만 사용해 출생차트를 초보자도 이해하기 쉽게 한국어로 설명하세요.\n\n" +
    "형식:\n" +
    "1) 한 줄 요약\n" +
    "2) 태양·달·상승(있으면)·중요 행성 배치 중심으로 성향\n" +
    "3) 성장 포인트나 균형 짓기 팁 (점성술적 관점)\n" +
    "4) 마지막에 '오락·참고용이며 과학적 사실이 아닙니다' 한 문장.\n\n" +
    JSON.stringify(payload);

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
        { role: "system", content: system },
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

export default {
  /** @param {Request} request @param {{ OPENAI_API_KEY?: string, ALLOWED_ORIGINS?: string }} env */
  async fetch(request, env) {
    const headers = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    if (request.method === "GET" && (path === "/" || path === "/api/health")) {
      return json({ ok: true, role: "openai-interpretation-only" }, 200, request, env);
    }

    if (!(request.method === "POST" && path === "/api/chart-interpret")) {
      return json({ error: "Not Found" }, 404, request, env);
    }

    const openaiKey = env.OPENAI_API_KEY;
    if (!openaiKey) {
      return json(
        {
          error: "서버 설정 오류",
          message:
            "OPENAI_API_KEY 가 Worker Secrets 에 없습니다. wrangler secret put OPENAI_API_KEY",
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
  },
};
