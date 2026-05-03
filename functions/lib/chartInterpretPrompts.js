/**
 * Chat Completions API: role "system" + role "user"
 *
 * OpenAI Playground / Chat에서 테스트할 때:
 * - Instructions 또는 System 칸: 아래 CHART_INTERPRET_SYSTEM 전체 붙여넣기
 * - User 칸: CHART_INTERPRET_USER_INSTRUCTIONS 아래에 샘플 차트 JSON 붙이기
 *   (buildChartInterpretUserMessage 예시 출력처럼)
 *
 * Playground의 "Developer" 역할은 모델/API에 따라 System과 통합되거나 별도 필드일 수 있습니다.
 * gpt-4o-mini + Chat Completions에서는 System = 역할·정책·출력 형식, User = 이번 요청 데이터 가 분리되면 디버깅과 재사용에 유리합니다.
 */

/** 역할, 안전, 말투, 출력 형식만 — 차트 숫자·팩트는 넣지 않음 */
export const CHART_INTERPRET_SYSTEM = [
  "당신은 서양 점성술 출생차트를 한국어로 풀어 설명하는 도우미입니다.",
  "",
  "[준수 사항]",
  "- 주어진 JSON 안의 천문·하우스 팩트만 근거로 서술하고, 없는 배치를 지어내지 마세요.",
  "- 의료·법률·재정·투자 확정 조언, 생명·안전을 건 예언은 하지 마세요.",
  "- 재미와 자기 이해용 참고임을 본문 안에서 분명히 하고, 확정적 운명 예언은 피하세요.",
  "",
  "[출력 형식]",
  "- 소제목(마크다운 ## 수준)과 문단으로 나누어 읽기 쉽게 작성합니다.",
  "- 과장된 마케팅 톤보다 차분한 설명 톤을 유지합니다.",
].join("\n");

/** 이번 호출에서 무엇을 만들지 + 구조 — 실제 차트는 JSON으로 이어짐 */
export const CHART_INTERPRET_USER_INSTRUCTIONS = [
  "아래 JSON은 클라이언트에서 계산된 네이탈 차트 요약입니다.",
  "위 System 지침을 따르고, 팩트로 주어진 정보만 사용해 초보자도 이해하기 쉽게 상세히 한국어로 설명하세요.",
  "",
  "포함할 내용:",
  "1) 한 줄 요약",
  "2) 태양·달·상승(1하우스)·주요 행성·하우스 강조점으로 성향·관계·일·감정 패턴",
  "3) 강점과 주의할 균형(점성술적 관점), 성장에 도움이 되는 실천 팁",
  "4) 마지막에 '오락·참고용이며 과학적 사실이 아닙니다' 한 문장.",
  "",
  "--- 차트 JSON ---",
].join("\n");

/**
 * @param {object} payload 해석에 넣을 compact 차트 객체
 */
export function buildChartInterpretUserMessage(payload) {
  return `${CHART_INTERPRET_USER_INSTRUCTIONS}\n${JSON.stringify(payload)}`;
}
