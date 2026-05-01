import React, { useState } from 'react';
import './ZodiacWheel.css';

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' },
];

const ZodiacWheel = ({ onSignSelect }) => {
  const [hoveredSign, setHoveredSign] = useState(null);

  return (
    <div className="zodiac-container">
      <div className="zodiac-wheel-wrapper">
        <div className="zodiac-wheel">
          {ZODIAC_SIGNS.map((sign, index) => {
            const angle = (index * 360) / 12;
            return (
              <div
                key={sign.name}
                className={`zodiac-item ${hoveredSign === sign.name ? 'active' : ''}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)`,
                }}
                onMouseEnter={() => setHoveredSign(sign.name)}
                onMouseLeave={() => setHoveredSign(null)}
                onClick={() => onSignSelect(sign)}
              >
                <span className="zodiac-symbol">{sign.symbol}</span>
              </div>
            );
          })}
          <div className="wheel-center">
            {hoveredSign ? (
              <div className="sign-info fade-in">
                <h3>{hoveredSign}</h3>
                <p>{ZODIAC_SIGNS.find(s => s.name === hoveredSign).dates}</p>
              </div>
            ) : (
              <div className="wheel-prompt fade-in">
                <p>Choose your</p>
                <h3>Zodiac</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZodiacWheel;
