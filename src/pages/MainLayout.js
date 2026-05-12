import React from 'react';
import './MainLayout.css';

// 1. props에 onGoToMiniGame을 추가했습니다.
function MainLayout({ onStart, onGoToMonument, onGoToCollection, onGoToTimelineMap, onGoToMiniGame }) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="main-layout animate-fade">
      <header className="hero-section">
        <h1 className="main-title">역사 달력</h1>
        <p className="main-subtitle">역사의 달력을 클릭해 그날의 주인공이 되어보세요.</p>
        <button className="monument-link-btn" onClick={onGoToMonument}>
          🇰🇷 디지털 태극기 기념비 방문하기 →
        </button>
      </header>

      <div className="calendar-grid">
        {months.map(m => (
          <div 
            key={m} 
            className={`month-item ${m === 3 ? 'active' : 'locked'}`}
            onClick={() => m === 3 && onStart(m)}
          >
            <span className="month-num">{m}월</span>
            <p>{m === 3 ? "진입 가능" : "잠금"}</p>
          </div>
        ))}
      </div>

      {/* --- 하단 왼쪽 내비게이션 (기록 및 지도) --- */}
      <div className="bottom-left-nav">
        <button className="collection-nav-btn" onClick={onGoToCollection}>
          <span className="icon">📜</span>
          인물도감 보기
        </button>
        
        <button className="map-nav-btn" onClick={onGoToTimelineMap}>
          <span className="icon">🗺️</span>
          역사 지도 보기
        </button>
      </div>

      {/* --- 하단 오른쪽 내비게이션 (과학 연구소 - 미니게임) --- */}
      <div className="bottom-right-nav">
        <button className="research-nav-btn" onClick={onGoToMiniGame}>
          <span className="icon">🔭</span>
          과학 연구소 (발명품)
        </button>
      </div>
    </div>
  );
}

export default MainLayout;