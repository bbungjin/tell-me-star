import React, { useMemo } from 'react';
import { buildNatalUserReadout } from '../lib/natalUserSummary';
import './NatalPersonalitySnapshot.css';

/**
 * @param {{ planets: object[], houses: object[] }} chartSlice
 */
function NatalPersonalitySnapshot({ planets, houses }) {
  const readout = useMemo(
    () => buildNatalUserReadout({ planets, houses }),
    [planets, houses],
  );

  if (!readout) return null;

  const { labels, coreBullets, resonanceLine, conversionHint } = readout;

  return (
    <div className="natal-personality-snapshot">
      <h3 className="natal-personality-snapshot__title">당신은 어떤 사람일까요?</h3>
      <p className="natal-personality-snapshot__identity">
        <strong>{labels.risingKo}</strong>로 세상에 첫발을 내딛고,{' '}
        <strong>{labels.sunKo}</strong> 태양으로 &lsquo;나&rsquo;의 방향을 잡으며,{' '}
        <strong>{labels.moonKo}</strong> 달의 리듬으로 마음을 돌보는 타입이에요.
      </p>
      <ul className="natal-personality-snapshot__bullets">
        {coreBullets.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      <p className="natal-personality-snapshot__resonance">{resonanceLine}</p>
      <p className="natal-personality-snapshot__conversion">{conversionHint}</p>
      <p className="natal-personality-snapshot__fine">
        오락·자기 이해용 표현이며, 과학적 성격 진단이 아닙니다.
      </p>
    </div>
  );
}

export default NatalPersonalitySnapshot;
