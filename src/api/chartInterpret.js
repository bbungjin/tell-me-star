/**
 * POST /api/chart-interpret — Pages Functions(OpenAI)
 * - 비움: 같은 출처 `/api/chart-interpret` (Pages 배포 또는 `npm run pages:dev`)
 * - REACT_APP_API_BASE_URL: 프리뷰 URL 등 다른 호스트만 쓸 때 (끝에 슬래시 없음)
 */
const BASE = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/$/, "");

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
