import React, { useMemo } from 'react';
import './NatalChartWheel.css';

const ZODIAC = [
  { en: 'Aries', sym: '♈' },
  { en: 'Taurus', sym: '♉' },
  { en: 'Gemini', sym: '♊' },
  { en: 'Cancer', sym: '♋' },
  { en: 'Leo', sym: '♌' },
  { en: 'Virgo', sym: '♍' },
  { en: 'Libra', sym: '♎' },
  { en: 'Scorpio', sym: '♏' },
  { en: 'Sagittarius', sym: '♐' },
  { en: 'Capricorn', sym: '♑' },
  { en: 'Aquarius', sym: '♒' },
  { en: 'Pisces', sym: '♓' },
];

const ZODIAC_COLORS = ['#ffe4e6', '#fef3c7', '#d1fae5', '#dbeafe'];

const GLYPH = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  Chiron: '⚷',
  'North Node': '☊',
  'South Node': '☋',
  Lilith: '⚸',
};

/**
 * 황경 경도(도) → SVG용 각: 상승(ASC)이 왼쪽(9시)에 오도록
 * @param {number} eclipticLon
 * @param {number} ascLon
 */
function lonToAngleRad(eclipticLon, ascLon) {
  const rel = (eclipticLon - ascLon + 360) % 360;
  return Math.PI - (rel * Math.PI) / 180;
}

function polar(cx, cy, r, angleRad) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy - r * Math.sin(angleRad),
  };
}

/**
 * @param {{ asc: number, mc: number, dsc: number, ic: number } | undefined} angles
 * @param {Array<{ eclipticLongitude: number, name: string, retrograde?: boolean }>} planets
 * @param {Array<{ house: number, eclipticLongitude: number }>} houses
 */
function NatalChartWheel({ angles, planets, houses }) {
  const asc = angles?.asc;

  const layout = useMemo(() => {
    if (asc == null || !Array.isArray(houses) || houses.length < 12) {
      return null;
    }

    const CX = 200;
    const CY = 200;
    const R_OUT = 196;
    const R_ZIN = 170;
    const R_HOUT = 162;
    const R_HIN = 78;
    const R_PLAN = 120;
    const R_LAB = 183;
    const R_AXIS_IN = 28;

    const zodiacWedges = [];
    for (let k = 0; k < 12; k++) {
      const L0 = k * 30;
      const L1 = (k + 1) * 30;
      const a0 = lonToAngleRad(L0, asc);
      const a1 = lonToAngleRad(L1, asc);
      const p0o = polar(CX, CY, R_OUT, a0);
      const p1o = polar(CX, CY, R_OUT, a1);
      const p1i = polar(CX, CY, R_ZIN, a1);
      const p0i = polar(CX, CY, R_ZIN, a0);
      const large = 0;
      const sweepO = 1;
      const sweepI = 0;
      const d = [
        `M ${p0o.x} ${p0o.y}`,
        `A ${R_OUT} ${R_OUT} 0 ${large} ${sweepO} ${p1o.x} ${p1o.y}`,
        `L ${p1i.x} ${p1i.y}`,
        `A ${R_ZIN} ${R_ZIN} 0 ${large} ${sweepI} ${p0i.x} ${p0i.y}`,
        'Z',
      ].join(' ');
      const Lm = k * 30 + 15;
      const am = lonToAngleRad(Lm, asc);
      const pm = polar(CX, CY, R_LAB, am);
      zodiacWedges.push({ d, fill: ZODIAC_COLORS[k % 4], key: k, label: ZODIAC[k].sym, lx: pm.x, ly: pm.y });
    }

    const houseLines = [...houses]
      .filter((h) => h.eclipticLongitude != null)
      .sort((a, b) => a.house - b.house)
      .map((h) => {
        const a = lonToAngleRad(h.eclipticLongitude, asc);
        const p0 = polar(CX, CY, R_HIN, a);
        const p1 = polar(CX, CY, R_HOUT, a);
        return { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, key: h.house };
      });

    const majorAxes = [
      { lon: angles.asc, label: 'ASC', strong: true },
      { lon: angles.dsc, label: 'DSC', strong: true },
      { lon: angles.mc, label: 'MC', strong: true },
      { lon: angles.ic, label: 'IC', strong: true },
    ].map((ax) => {
      const a = lonToAngleRad(ax.lon, asc);
      const p0 = polar(CX, CY, R_AXIS_IN, a);
      const p1 = polar(CX, CY, R_OUT + 2, a);
      const pl = polar(CX, CY, R_OUT + 18, a);
      return { ...ax, x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, lx: pl.x, ly: pl.y };
    });

    const planetDots = [];
    const bodies = (planets || []).filter((p) => p.eclipticLongitude != null);
    for (let idx = 0; idx < bodies.length; idx++) {
      const p = bodies[idx];
      let lon = p.eclipticLongitude;
      let jitter = 0;
      for (let j = 0; j < idx; j++) {
        const prev = bodies[j].eclipticLongitude;
        if (Math.abs((lon - prev + 360) % 360) < 4) jitter += 1;
      }
      lon = (lon + jitter * 1.2) % 360;
      const a = lonToAngleRad(lon, asc);
      const pt = polar(CX, CY, R_PLAN, a);
      const glyph = GLYPH[p.name] || p.name.slice(0, 2);
      planetDots.push({
        key: `${p.name}-${idx}`,
        cx: pt.x,
        cy: pt.y,
        glyph,
        retro: p.retrograde,
        displayLon: lon,
      });
    }

    const aspectPairs = [];
    const orb = 6;
    const aspectAngles = [
      { deg: 0, stroke: '#94a3b8', w: 1.2 },
      { deg: 60, stroke: '#22c55e', w: 1.3 },
      { deg: 90, stroke: '#ef4444', w: 1.5 },
      { deg: 120, stroke: '#22c55e', w: 1.3 },
      { deg: 180, stroke: '#ef4444', w: 1.6 },
    ];
    for (let i = 0; i < planetDots.length; i++) {
      for (let j = i + 1; j < planetDots.length; j++) {
        const a1 = planetDots[i].displayLon;
        const a2 = planetDots[j].displayLon;
        let diff = Math.abs(a1 - a2) % 360;
        if (diff > 180) diff = 360 - diff;
        for (const asp of aspectAngles) {
          if (Math.abs(diff - asp.deg) <= orb) {
            aspectPairs.push({
              key: `${i}-${j}-${asp.deg}`,
              x1: planetDots[i].cx,
              y1: planetDots[i].cy,
              x2: planetDots[j].cx,
              y2: planetDots[j].cy,
              stroke: asp.stroke,
              strokeWidth: asp.w,
              opacity: asp.deg === 0 ? 0.2 : 0.45,
            });
            break;
          }
        }
      }
    }

    return {
      CX,
      CY,
      zodiacWedges,
      houseLines,
      majorAxes,
      planetDots,
      aspectPairs,
    };
  }, [angles, asc, houses, planets]);

  if (!layout) {
    return (
      <p className="natal-wheel-fallback">차트 휠을 그리기 위한 상승·하우스 데이터가 없습니다.</p>
    );
  }

  const { zodiacWedges, houseLines, majorAxes, planetDots, aspectPairs } = layout;

  return (
    <div className="natal-chart-wheel">
      <svg
        className="natal-chart-wheel__svg"
        viewBox="0 0 400 400"
        role="img"
        aria-label="출생 네이탈 차트 휠. ASC는 왼쪽."
      >
        <rect x="0" y="0" width="400" height="400" fill="#fafafa" rx="8" />
        {zodiacWedges.map((w) => (
          <g key={w.key}>
            <path d={w.d} fill={w.fill} stroke="#e2e8f0" strokeWidth="0.5" />
            <text
              x={w.lx}
              y={w.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="natal-chart-wheel__zodiac-glyph"
            >
              {w.label}
            </text>
          </g>
        ))}

        {houseLines.map((h) => (
          <line
            key={h.key}
            x1={h.x1}
            y1={h.y1}
            x2={h.x2}
            y2={h.y2}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        ))}

        {majorAxes.map((ax) => (
          <g key={ax.label}>
            <line
              x1={ax.x1}
              y1={ax.y1}
              x2={ax.x2}
              y2={ax.y2}
              stroke="#1e293b"
              strokeWidth={ax.strong ? 2.4 : 2}
            />
            <text
              x={ax.lx}
              y={ax.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="natal-chart-wheel__axis-label"
            >
              {ax.label}
            </text>
          </g>
        ))}

        {aspectPairs.map((a) => (
          <line
            key={a.key}
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke={a.stroke}
            strokeWidth={a.strokeWidth}
            opacity={a.opacity}
          />
        ))}

        {planetDots.map((p) => (
          <g key={p.key}>
            <circle cx={p.cx} cy={p.cy} r={11} fill="#fff" stroke="#f97316" strokeWidth="1.5" />
            <text
              x={p.cx}
              y={p.cy}
              textAnchor="middle"
              dominantBaseline="central"
              className="natal-chart-wheel__planet-glyph"
            >
              {p.retro ? `${p.glyph} R` : p.glyph}
            </text>
          </g>
        ))}
      </svg>
      <p className="natal-chart-wheel__hint">ASC·DSC 수평선, MC·IC 수직에 가깝게 표시됩니다. 행성 간 선은 주요 배각(±6°) 근사입니다.</p>
    </div>
  );
}

export default NatalChartWheel;
