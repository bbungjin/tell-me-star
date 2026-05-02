/**
 * Worker는 OpenAI 해석만 담당합니다. POST /api/chart-interpret
 */
const BASE = (process.env.REACT_APP_WORKER_API_URL || "").replace(/\/$/, "");

/**
 * @param {{ meta: object, planets: object[], houses: object[], calculation?: object }} chartPayload
 * @returns {Promise<{ aiInterpretation: string }>}
 */
export async function fetchChartInterpretation(chartPayload) {
  const url = `${BASE}/api/chart-interpret`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chartPayload),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `AI 해석 요청 실패 (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  return data;
}
