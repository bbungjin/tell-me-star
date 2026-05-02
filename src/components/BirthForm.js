import React, { useState, useEffect } from 'react';
import './BirthForm.css';

// Placeholder for actual Korean province and city data.
// This will be populated after fetching from search results.
const KOREA_LOCATIONS = {
  "경기도": ["수원시", "고양시", "용인시", "성남시", "화성시", "부천시", "남양주시", "안산시", "안양시", "시흥시", "파주시", "평택시", "김포시", "광주시", "이천시", "양주시", "군포시", "오산시", "하남시", "양평군", "여주시", "동두천시", "안성시", "과천시", "의정부시", "포천시", "연천군", "가평군", "구리시", "의왕시"],
  "강원특별자치도": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  "충청북도": ["청주시", "충주시", "제천시", "보은군", "증평군", "진천군", "괴산군", "음성군", "단양군", "영동군", "옥천군", "정성군"],
  "충청남도": ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  "전라북도": ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  "전라남도": ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  "경상북도": ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "군위군", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "봉화군", "울진군", "울릉군"],
  "경상남도": ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "고성군", "남해군", "하동군", "창녕군", "고성군", "남해군", "하동군", "창녕군", "고성군", "남해군", "하동군", "함안군", "합천군", "거창군", "함양군", "산청군", "의령군"],
  "제주특별자치도": ["제주시", "서귀포시"],
  // Special Cities (Metropolitan Cities) - these are usually top-level, not under a province
  "서울특별시": ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
  "부산광역시": ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "연제구", "부산진구", "동래구", "연제구", "강서구", "북구", "해운대구", "사하구", "금정구", "사상구", "기장군"],
  "대구광역시": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  "인천광역시": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  "광주광역시": ["동구", "서구", "남구", "북구", "광산구"],
  "대전광역시": ["동구", "중구", "서구", "유성구", "대덕구"],
  "울산광역시": ["중구", "남구", "동구", "북구", "울주군"],
  "세종특별자치시": ["세종시"]
};

// Convert province names to an array for easier iteration
const PROVINCES = Object.keys(KOREA_LOCATIONS);

const BirthForm = ({ onCalculate, loading, errorMessage }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    province: '', // New state for selected province
    city: ''      // New state for selected city
  });

  const [cities, setCities] = useState([]); // State to hold cities for the selected province

  useEffect(() => {
    // When province changes, update the cities list
    if (formData.province && KOREA_LOCATIONS[formData.province]) {
      setCities(KOREA_LOCATIONS[formData.province]);
      setFormData(prev => ({ ...prev, city: '', location: '' })); // Reset city and combined location if province changes
    } else {
      setCities([]); // Clear cities if no province is selected
      setFormData(prev => ({ ...prev, city: '', location: '' }));
    }
  }, [formData.province]);

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData(prev => ({ ...prev, province: selectedProvince, city: '', location: '' }));
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData((prev) => ({
      ...prev,
      city: selectedCity,
      location: `${prev.province ? `${prev.province} ` : ''}${selectedCity}`.trim(),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // The 'location' is now formed by province + city
    onCalculate(formData);
  };

  return (
    <section className="birth-form-section">
      <h2 className="form-title">출생차트 정보 입력</h2>
      <p className="form-subtitle">생년월일·시간·태어난 곳을 입력하면 행성 위치와 AI 해석을 보여드려요</p>

      {errorMessage ? (
        <div className="birth-form-error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <form className="birth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>생년월일</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label>태어난 시간</label>
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Province Dropdown */}
        <div className="input-group">
          <label>도/광역시</label>
          <select 
            name="province" 
            value={formData.province} 
            onChange={handleProvinceChange} 
            required
          >
            <option value="">-- 도/광역시 선택 --</option>
            {PROVINCES.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div className="input-group">
          <label>시/군/구</label>
          <select 
            name="city" 
            value={formData.city} 
            onChange={handleCityChange} 
            required
            disabled={!formData.province} // Disable city selection until a province is chosen
          >
            <option value="">-- 시/군/구 선택 --</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Hidden input for combined location for submission, if needed by onCalculate */}
        {/* <input type="hidden" name="location" value={formData.location} /> */}

        <button type="submit" className="celestial-button" disabled={loading}>
          {loading ? '차트 계산 중…' : '출생차트 보기'}
        </button>
      </form>
    </section>
  );
};

export default BirthForm;
