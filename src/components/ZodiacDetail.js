import React from 'react';
import './ZodiacDetail.css';

export const ZODIAC_DATA = {
  Aries: { korName: '양자리', element: '불', quality: '활동', ruler: '화성', traits: '모험심이 강하고, 에너지가 넘치며 용감합니다.', interpretation: '당신은 타고난 리더입니다! 새로운 도전을 두려워하지 않는 용기가 당신의 가장 큰 무기네요.' },
  Taurus: { korName: '황소자리', element: '흙', quality: '고정', ruler: '금성', traits: '인내심이 강하고, 신뢰할 수 있으며 따뜻한 마음을 가졌습니다.', interpretation: '안정감을 중시하는 당신은 주변 사람들에게 든든한 버팀목이 되어주는 존재입니다.' },
  Gemini: { korName: '쌍둥이자리', element: '공기', quality: '변통', ruler: '수성', traits: '적응력이 뛰어나고, 다재다능하며 지적입니다.', interpretation: '호기심 천국! 당신의 빠른 두뇌 회전과 소통 능력은 어디서나 빛이 납니다.' },
  Cancer: { korName: '게자리', element: '물', quality: '활동', ruler: '달', traits: '감수성이 풍부하고, 다정하며 직관력이 좋습니다.', interpretation: '따뜻한 공감 능력을 가진 당신, 소중한 사람들을 지키는 마음이 누구보다 깊군요.' },
  Leo: { korName: '사자자리', element: '불', quality: '고정', ruler: '태양', traits: '관대하고, 창의적이며 열정적입니다.', interpretation: '당신은 존재만으로도 주변을 환하게 밝히는 태양 같은 매력을 가졌습니다!' },
  Virgo: { korName: '처녀자리', element: '흙', quality: '변통', ruler: '수성', traits: '겸손하고, 세심하며 분석적입니다.', interpretation: '꼼꼼하고 체계적인 당신, 작은 부분까지 놓치지 않는 완벽함이 매력 포인트입니다.' },
  Libra: { korName: '천칭자리', element: '공기', quality: '활동', ruler: '금성', traits: '외교적이고, 품격 있으며 이상적입니다.', interpretation: '조화와 균형을 사랑하는 당신, 누구와도 잘 어울리는 평화주의자이시네요.' },
  Scorpio: { korName: '전갈자리', element: '물', quality: '고정', ruler: '명왕성', traits: '결단력 있고, 열정적이며 통찰력이 뛰어납니다.', interpretation: '강렬한 카리스마와 깊은 속마음을 가진 당신, 한번 정한 목표는 끝까지 해내고 마는군요.' },
  Sagittarius: { korName: '사수자리', element: '불', quality: '변통', ruler: '목성', traits: '낙천적이고, 자유를 사랑하며 유쾌합니다.', interpretation: '자유로운 영혼! 넓은 세상을 향한 당신의 긍정적인 에너지는 주변 사람들에게도 즐거움을 줍니다.' },
  Capricorn: { korName: '염소자리', element: '흙', quality: '활동', ruler: '토성', traits: '실용적이고, 신중하며 야망이 있습니다.', interpretation: '성실함의 아이콘! 차근차근 목표를 향해 나아가는 당신의 인내심은 반드시 성공을 불러올 거예요.' },
  Aquarius: { korName: '물병자리', element: '공기', quality: '고정', ruler: '천왕성', traits: '우호적이고, 박애주의적이며 정직합니다.', interpretation: '독창적이고 개성 넘치는 당신! 시대를 앞서가는 생각으로 세상을 놀라게 할 잠재력이 있네요.' },
  Pisces: { korName: '물고기자리', element: '물', quality: '변통', ruler: '해왕성', traits: '상상력이 풍부하고, 감수성이 예민하며 자비롭습니다.', interpretation: '꿈꾸는 예술가! 깊은 공감 능력과 풍부한 감성은 당신만의 특별한 아름다움입니다.' },
};

const ZodiacDetail = ({ sign }) => {
  if (!sign) return null;

  const info = ZODIAC_DATA[sign.name];

  return (
    <div className="zodiac-detail-card fade-in">
      <div className="detail-header">
        <span className="detail-symbol">{sign.symbol}</span>
        <h2>{info.korName} ({sign.name})</h2>
        <p className="detail-dates">{sign.dates}</p>
      </div>
      
      <div className="detail-grid">
        <div className="detail-item">
          <span className="label">원소</span>
          <span className="value">{info.element}</span>
        </div>
        <div className="detail-item">
          <span className="label">성향</span>
          <span className="value">{info.quality}</span>
        </div>
        <div className="detail-item">
          <span className="label">수호행성</span>
          <span className="value">{info.ruler}</span>
        </div>
      </div>

      <div className="detail-traits">
        <h3>주요 특징</h3>
        <p>{info.traits}</p>
      </div>

      <div className="detail-interpretation">
        <h3>복냥이의 해석 🐾</h3>
        <p>{info.interpretation}</p>
      </div>

      <div className="detail-decoration">
        <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};

export default ZodiacDetail;
