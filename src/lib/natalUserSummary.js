/** 영문 별자리 키 → 한글 짧은 이름 */
const SIGN_KO = {
  Aries: "양자리",
  Taurus: "황소자리",
  Gemini: "쌍둥이자리",
  Cancer: "게자리",
  Leo: "사자자리",
  Virgo: "처녀자리",
  Libra: "천칭자리",
  Scorpio: "전갈자리",
  Sagittarius: "사수자리",
  Capricorn: "염소자리",
  Aquarius: "물병자리",
  Pisces: "물고기자리",
};

/** 태양: 삶의 중심·의지 한 줄 */
const SUN_ESSENCE = {
  Aries: "새로운 시작에 설렘을 느끼고, 망설임보다 먼저 움직이는 편이에요.",
  Taurus: "안정과 감각적인 만족을 중시하고, 한번 정한 건 오래 가져가려 해요.",
  Gemini: "호기심과 대화로 세상을 이해하고, 한 가지만으로는 답답해질 수 있어요.",
  Cancer: "안전한 관계와 정서적 뿌리를 소중히 하고, 은근히 오래 기억하는 편이에요.",
  Leo: "존재감과 창의성을 드러내고, 인정받을 때 더 빛나는 타입이에요.",
  Virgo: "꼼꼼함과 실용으로 하루를 정리하고, ‘조금만 더 나아지면’ 자주 생각해요.",
  Libra: "균형·예의·관계의 흐름을 중시하고, 갈등은 빨리 풀고 싶어해요.",
  Scorpio: "깊이와 집중으로 몰입하고, 겉으로 다 보여 주진 않아도 속은 단단해요.",
  Sagittarius: "의미·자유·배움을 찾아다니고, 장난처럼 말해도 진심은 진지해요.",
  Capricorn: "목표와 책임으로 하루를 쌓아 가고, 느리게 보여도 멀리 보는 편이에요.",
  Aquarius: "나만의 기준과 아이디어가 있고, ‘남들과 똑같다’는 건 심심할 수 있어요.",
  Pisces: "공감과 상상으로 세상을 받아들이고, 경계가 흐려질 때 마음이 피곤해질 수 있어요.",
};

/** 달: 감정·휴식 한 줄 */
const MOON_ESSENCE = {
  Aries: "기분은 빨리 오르고 빨리 가라앉고, 혼자만의 ‘한 방’이 필요할 때가 있어요.",
  Taurus: "익숙한 냄새·맛·공간에서 마음이 풀리고, 변화는 천천히 받아들이려 해요.",
  Gemini: "말로 풀리거나 정보를 나눌 때 안정되고, 머릿속은 늘 여러 탭이 켜져 있어요.",
  Cancer: "위로와 소속감에 민감하고, 상처도 오래 남을 수 있어요.",
  Leo: "인정과 따뜻한 반응에 마음이 채워지고, 은근히 애정 표현을 기대해요.",
  Virgo: "정리·루틴·작은 성취로 마음이 놓이고, 걱정이 먼저 올라올 때도 있어요.",
  Libra: "관계의 분위기에 기분이 실리고, 혼자보다 둘이 편할 때가 많아요.",
  Scorpio: "깊은 신뢰가 있어야 마음이 열리고, 한번 멀어지면 회복에 시간이 걸려요.",
  Sagittarius: "여유·유머·새로운 자극이 있을 때 숨이 트이고, 답답함은 금방 느껴져요.",
  Capricorn: "책임을 다했을 때 안심하고, 속으로는 인정받고 싶은 마음이 커요.",
  Aquarius: "나만의 리듬과 공간이 지켜질 때 편하고, 감정 표현은 말보다 행동일 수 있어요.",
  Pisces: "분위기에 스며들기 쉽고, 혼자만의 몽글몽글한 시간이 꼭 필요해요.",
};

/** 상승: 첫인상·세상을 대하는 방식 */
const RISING_ESSENCE = {
  Aries: "첫인상은 당당하고 직선적이며, ‘이 사람은 자기 페이스가 있다’가 먼저 느껴져요.",
  Taurus: "차분하고 믿음 가는 분위기로 다가오고, 천천히 열리는 타입으로 보여요.",
  Gemini: "가볍고 영리한 인상이라 말문이 잘 트이고, 호기심 많은 사람처럼 보여요.",
  Cancer: "부드럽고 세심해 보이며, 처음부터 ‘편안함’을 주려는 느낌이 있어요.",
  Leo: "눈에 띄고 자신감 있어 보이며, 분위기를 한 번 밝히는 역할로 보여요.",
  Virgo: "정돈되고 신뢰감 있어 보이며, 디테일을 챙기는 사람처럼 느껴져요.",
  Libra: "예의 바르고 균형 잡혀 보이며, 관계의 ‘중재자’처럼 보일 때가 많아요.",
  Scorpio: "말수는 적어도 인상은 강하고, 속을 쉽게 안 보여 주는 분위기예요.",
  Sagittarius: "밝고 솔직해 보이며, ‘여기저기 경험 많겠다’는 인상을 줄 수 있어요.",
  Capricorn: "차분하고 성실해 보이며, 한끗 더 챙기는 사람처럼 느껴져요.",
  Aquarius: "독특하고 거리감이 있어 보이지만, 친해지면 재미있는 사람으로 보여요.",
  Pisces: "부드럽고 감성적으로 다가오며, 상상력 있는 사람처럼 보여요.",
};

/** “와 나 맞는데?” 느낌을 주는 한 줄 (태양 기준, 개인화된 느낌) */
const RESONANCE_BY_SUN = {
  Aries: "‘나도 모르게 먼저 나섰다’는 순간이 꽤 있지 않나요?",
  Taurus: "‘이 정도면 됐지’보다 ‘내 기준엔 아직’이 더 자주 떠오르지 않나요?",
  Gemini: "한 번에 한 가지만 하면 답답하고, 머릿속은 이미 다음 이야기로 넘어가 있지 않나요?",
  Cancer: "겉으론 괜찮다 해도, 마음속엔 오래 남는 장면이 몇 개 있지 않나요?",
  Leo: "인정받을 때 가장 편해지고, 무시당했다고 느끼면 금방 기분이 가라앉지 않나요?",
  Virgo: "‘조금만 더 하면’이 습관이고, 스스로에게는 생각보다 엄격하지 않나요?",
  Libra: "갈등 장면은 피하고 싶은데, 속으로는 공정함을 꽤 따지지 않나요?",
  Scorpio: "한번 마음 준 사람에겐 깊게 가고, 표면적인 관계는 금방 식지 않나요?",
  Sagittarius: "의미 없는 일정은 빨리 지우고 싶고, ‘재밌는 거 없나’를 자주 찾지 않나요?",
  Capricorn: "느리게 보여도 멀리 보는 편이고, 책임진 건 끝까지 끌고 가려 하지 않나요?",
  Aquarius: "‘남들 다 그래?’보다 ‘나는 왜 이럴까’를 더 자주 묻지 않나요?",
  Pisces: "남의 기분이 내 기분처럼 스며들 때가 있고, 혼자만의 시간이 꼭 필요하지 않나요?",
};

const DEFAULT_SIGN = "Aries";

function pickSign(sign) {
  if (sign && SIGN_KO[sign]) return sign;
  return DEFAULT_SIGN;
}

/**
 * @param {{ planets: object[], houses: object[] }} chart
 * @returns {{ coreBullets: string[], resonanceLine: string, conversionHint: string, labels: { risingKo: string, sunKo: string, moonKo: string } } | null}
 */
export function buildNatalUserReadout(chart) {
  const planets = chart?.planets;
  const houses = chart?.houses;
  if (!Array.isArray(planets) || planets.length === 0) return null;

  const sun = planets.find((p) => /^sun$/i.test(String(p.name)));
  const moon = planets.find((p) => /^moon$/i.test(String(p.name)));
  const house1 = Array.isArray(houses) ? houses.find((h) => h.house === 1) : null;
  const risingSign = pickSign(house1?.sign);
  const sunSign = pickSign(sun?.sign);
  const moonSign = pickSign(moon?.sign);

  const risingKo = SIGN_KO[risingSign];
  const sunKo = SIGN_KO[sunSign];
  const moonKo = SIGN_KO[moonSign];

  const coreBullets = [
    `기본 성향 · 태양: ${SUN_ESSENCE[sunSign]}`,
    `감정·휴식 · 달: ${MOON_ESSENCE[moonSign]}`,
    `첫인상·관계 톤 · 상승: ${RISING_ESSENCE[risingSign]}`,
  ];

  const resonanceLine = RESONANCE_BY_SUN[sunSign];

  const conversionHint =
    "지금 보신 건 출생차트의 큰 줄기예요. 연애 리듬·재물 타이밍·올해 흐름처럼 더 촘촘히 맞춰 보면 ‘아, 이거 나 맞는데?’ 하는 순간이 늘어날 수 있어요. 아래에서 해석을 이어 가 보세요.";

  return {
    coreBullets,
    resonanceLine,
    conversionHint,
    labels: { risingKo, sunKo, moonKo },
  };
}
