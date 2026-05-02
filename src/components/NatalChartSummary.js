import React from 'react';
import './NatalChartSummary.css';

/** @param {{ name: string } | null | undefined} planet */
function signKo(planet) {
  if (!planet?.sign) return '—';
  const map = {
    Aries: '양자리',
    Taurus: '황소자리',
    Gemini: '쌍둥이자리',
    Cancer: '게자리',
    Leo: '사자자리',
    Virgo: '처녀자리',
    Libra: '천칭자리',
    Scorpio: '전갈자리',
    Sagittarius: '사수자리',
    Capricorn: '염소자리',
    Aquarius: '물병자리',
    Pisces: '물고기자리',
  };
  return map[planet.sign] ? `${map[planet.sign]} (${planet.sign})` : planet.sign;
}

/**
 * @param {{
 *   chart: {
 *     meta?: object,
 *     planets?: Array<{ name: string, sign?: string, degree?: number|null, house?: number|null, retrograde?: boolean }>,
 *     houses?: Array<{ house: number, sign: string, degree?: number|null }>,
 *     aiInterpretation?: string,
 *   },
 *   calendarSunLabel?: string | null,
 *   onMoreInfo?: () => void,
 *   moreInfoLoading?: boolean,
 *   moreInfoError?: string | null,
 * }} props
 */
function NatalChartSummary({
  chart,
  calendarSunLabel,
  onMoreInfo,
  moreInfoLoading,
  moreInfoError,
}) {
  const planets = Array.isArray(chart?.planets) ? chart.planets : [];
  const houses = Array.isArray(chart?.houses) ? chart.houses : [];
  const meta = chart?.meta || {};

  const sun = planets.find((p) => /sun/i.test(String(p.name)));

  return (
    <section className="natal-chart-summary fade-in">
      <div className="natal-meta-card">
        <h3 className="natal-section-title">출생 정보</h3>
        <ul className="natal-meta-list">
          <li>
            <span className="label">장소</span>
            <span className="value">{meta.locationLabel || '—'}</span>
          </li>
          <li>
            <span className="label">현지 시각</span>
            <span className="value">{meta.birthLocal || '—'}</span>
          </li>
          <li>
            <span className="label">타임존</span>
            <span className="value">{meta.timezone || '—'}</span>
          </li>
          <li>
            <span className="label">좌표(근사)</span>
            <span className="value">
              {meta.latitude != null && meta.longitude != null
                ? `${meta.latitude}, ${meta.longitude}`
                : '—'}
            </span>
          </li>
          {meta.chartEngine ? (
            <li>
              <span className="label">계산 엔진</span>
              <span className="value">{meta.chartEngine}</span>
            </li>
          ) : null}
        </ul>
        {calendarSunLabel && (
          <p className="natal-note">
            생일만으로 보는 달력식 태양별자리는 <strong>{calendarSunLabel}</strong> 입니다.
            실제 출생 시각·장소를 반영한 네이탈 태양은 아래 표의 <strong>태양(Sun)</strong> 행을
            참고하세요.
          </p>
        )}
        {sun?.sign && (
          <p className="natal-highlight">
            네이탈 태양: <strong>{signKo(sun)}</strong>
            {sun.degree != null ? ` (${sun.degree}°)` : ''}
          </p>
        )}
      </div>

      <div className="natal-table-wrap">
        <h3 className="natal-section-title">행성 위치</h3>
        {planets.length === 0 ? (
          <p className="natal-empty">행성 데이터를 계산하지 못했습니다. 입력값을 확인해 주세요.</p>
        ) : (
          <table className="natal-table">
            <thead>
              <tr>
                <th>천체</th>
                <th>별자리</th>
                <th>도수</th>
                <th>하우스</th>
                <th>역행</th>
              </tr>
            </thead>
            <tbody>
              {planets.map((p, idx) => (
                <tr key={`${p.name}-${idx}`}>
                  <td>{p.name}</td>
                  <td>{signKo(p)}</td>
                  <td>{p.degree != null ? `${p.degree}°` : '—'}</td>
                  <td>{p.house != null ? p.house : '—'}</td>
                  <td>{p.retrograde ? '예' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {houses.length > 0 && (
        <div className="natal-table-wrap">
          <h3 className="natal-section-title">하우스 커스프</h3>
          <table className="natal-table natal-table--compact">
            <thead>
              <tr>
                <th>하우스</th>
                <th>별자리</th>
                <th>도수</th>
              </tr>
            </thead>
            <tbody>
              {houses.map((h) => (
                <tr key={h.house}>
                  <td>{h.house}</td>
                  <td>{signKo({ sign: h.sign })}</td>
                  <td>{h.degree != null ? `${h.degree}°` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {chart?.aiInterpretation ? (
        <div className="natal-ai-card">
          <h3 className="natal-section-title">AI 출생차트 해석</h3>
          <p className="natal-disclaimer-top">
            오락·자기 탐색용 참고이며, 의학·법률·재정 등 중대한 결정의 근거로 사용하지 마세요.
          </p>
          <div className="natal-ai-body">{chart.aiInterpretation}</div>
        </div>
      ) : (
        <div className="natal-ai-teaser">
          <p className="natal-ai-teaser-title">더 많은 정보</p>
          <p className="natal-ai-teaser-copy">
            위 차트를 바탕으로 <strong>OpenAI</strong>가 한국어로 성향·균형 등을 풀어 줍니다.
            (Worker에 API 키가 설정된 경우에만 동작합니다.)
          </p>
          <button
            type="button"
            className="natal-more-button"
            onClick={onMoreInfo}
            disabled={moreInfoLoading}
          >
            {moreInfoLoading ? '해석 불러오는 중…' : '더 많은 정보 보기'}
          </button>
          {moreInfoError ? (
            <p className="natal-ai-teaser-warn" role="alert">
              {moreInfoError}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default NatalChartSummary;
