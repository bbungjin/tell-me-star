import React, { useState } from 'react';
import './App.css';
import BirthForm from './components/BirthForm';
import ZodiacDetail from './components/ZodiacDetail';

const ZODIAC_SIGNS = [
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
];

function App() {
  const [view, setView] = useState('home'); // home, form, result
  const [calculatedSign, setCalculatedSign] = useState(null);

  const calculateZodiac = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return ZODIAC_SIGNS.find(sign => {
      if (sign.startMonth === month && day >= sign.startDay) return true;
      if (sign.endMonth === month && day <= sign.endDay) return true;
      return false;
    });
  };

  const handleCalculate = (formData) => {
    const sign = calculateZodiac(formData.date);
    setCalculatedSign(sign);
    setView('result');
  };

  const goHome = () => {
    setView('home');
    setCalculatedSign(null);
  };

  return (
    <div className="container">
      <div className="App">
        {view === 'home' && (
          <>
            <header className="App-header">
              <h1 className="App-title">사주아이 ✨</h1>
              <p className="App-subtitle">당신의 오늘을 더 밝게, 행운의 길잡이</p>
            </header>

            <section className="hero-banner">
              <div className="banner-text">
                <h2>복냥이에게 물어봐! 🐾</h2>
                <p>오늘 나의 운세는 어떨까?</p>
              </div>
              <div className="mascot-placeholder">🐱</div>
            </section>

            <main className="service-grid">
              <div className="service-card" onClick={() => setView('form')}>
                <div className="service-icon">📖</div>
                <h3>990원 사주</h3>
                <p>가볍게 보는 나의 인생 총운</p>
                <span className="go-button">보러가기 {'>'}</span>
              </div>

              <div className="service-card">
                <div className="service-icon">❤️</div>
                <h3>찰떡 궁합</h3>
                <p>우리 둘의 케미는 몇 점?</p>
                <span className="go-button">보러가기 {'>'}</span>
              </div>

              <div className="service-card">
                <div className="service-icon">💰</div>
                <h3>재물운세</h3>
                <p>언제 물이 들어올까요?</p>
                <span className="go-button">보러가기 {'>'}</span>
              </div>

              <div className="service-card">
                <div className="service-icon">📅</div>
                <h3>택일 서비스</h3>
                <p>중요한 날, 최고의 날로</p>
                <span className="go-button">보러가기 {'>'}</span>
              </div>
            </main>
          </>
        )}

        {view === 'form' && (
          <div className="view-container">
            <button className="back-button" onClick={goHome}>← 돌아가기</button>
            <BirthForm onCalculate={handleCalculate} />
          </div>
        )}

        {view === 'result' && (
          <div className="view-container">
            <button className="back-button" onClick={goHome}>← 다시하기</button>
            <div className="result-header">
              <h2>당신의 별자리 결과</h2>
              <p>입력하신 정보를 바탕으로 분석한 결과입니다.</p>
            </div>
            <ZodiacDetail sign={calculatedSign} />
          </div>
        )}

        <nav className="bottom-nav">
          <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={goHome}>
            <span className="nav-icon">🏠</span>
            <span>홈</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">➕</span>
            <span>사주추가</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">💬</span>
            <span>채팅룸</span>
          </div>
          <div className={`nav-item ${view === 'result' ? 'active' : ''}`}>
            <span className="nav-icon">📦</span>
            <span>보관함</span>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;

