import React, { useState } from 'react';
import DiaryPage from './DiaryPage';

function ResultLayout({ result, onRestart, onGoToMonument, onGoToChat }) {
 
  const [viewMode, setViewMode] = useState('certificate'); 
  const { matchedPersona, history, scores } = result;

  const isVillain = matchedPersona.type === "villain";

 
  const getTendency = () => {
    const { hero = 0, citizen = 0, villain = 0 } = scores || {};
    if (villain >= 3) return { 
      title: "역사의 경고", badge: "🌑", color: "#333",
      text: "귀하는 혼란의 시대 속에서 개인의 안위를 우선시하는 선택을 하였기에, 후세에 경각심을 일깨울 기록의 대상자로 분류되었습니다." 
    };
    if (hero >= 4) return { 
      title: "불굴의 투사", badge: "🔥", color: "#8b0000",
      text: "귀하는 조국의 독립을 위해 자신의 생명을 아끼지 않는 숭고한 용기를 증명하였기에, 대한민국 임시정부 명예 요원으로 임명합니다." 
    };
    if (hero >= 2 && citizen >= 2) return { 
      title: "지혜로운 선구자", badge: "📜", color: "#2c3e50",
      text: "귀하는 행동과 지혜를 겸비하여 민족이 나아갈 길을 비춘 선구자적 면모를 보였기에, 이 기록을 수여합니다." 
    };
    return { 
      title: "깨어있는 시민", badge: "🇰🇷", color: "#2980b9",
      text: "귀하는 평범한 일상 속에서도 민족의 부름에 용기 있게 응답하며 역사의 물줄기를 바꿨기에, 명예 요원으로 임명합니다." 
    };
  };

  const tendency = getTendency();



  
  if (viewMode === 'certificate') {
    return (
      <div className="card-reveal-layer">
        <div className="certificate-style-card animate-pop">
          <div className="cert-header" style={{ borderBottom: `2px solid ${tendency.color}` }}>
            <div className="badge-icon">{tendency.badge}</div>
            <h2 className="cert-main-title">임 명 장</h2>
          </div>
          <div className="cert-content">
            <p className="cert-id">제 2026-0301-01호</p>
            <h3 className="user-tendency" style={{ color: tendency.color }}>분석 결과: {tendency.title}</h3>
            <div className="cert-body-text">{tendency.text}</div>
          </div>
          <div className="cert-footer-box">
             <p>2026년 3월 1일</p>
             <p className="org-name">대한민국 임시정부 기록국</p>
          </div>
          <button className="next-step-btn" onClick={() => setViewMode('diary')}>나의 행적 복기하기 →</button>
        </div>
      </div>
    );
  }


  if (viewMode === 'diary') {
    return (
      <DiaryPage 
        history={history} 
        onNext={() => setViewMode('match')} 
      />
    );
  }

 
  if (viewMode === 'match') {
    return (
      <div className="match-reveal-layer animate-fade">
        <div className="match-content">
          <h2 className="match-question">당신과 같은 길을 걸었던 인물은...</h2>
          <div className="match-visual animate-pop">
             <img src={process.env.PUBLIC_URL + matchedPersona.img} alt={matchedPersona.name} className="matched-hero-img" />
             <h1 className="matched-hero-name">{matchedPersona.name}</h1>
             <p className="matched-hero-tag">{isVillain ? "역사가 기록한 경고" : "우리 마음속의 등불"}</p>
          </div>
          <button className="next-step-btn" onClick={() => setViewMode('article')}>그분의 기록 자세히 보기 →</button>
        </div>
      </div>
    );
  }

  
  if (viewMode === 'article') {
    return (
      <div className={`result-layout ${isVillain ? 'villain-theme' : 'hero-theme'}`}>
        <div className="newspaper-container animate-fade">
          <header className="newspaper-header">
            <h1>{isVillain ? "號外 (호외)" : "獨立新聞 (독립신문)"}</h1>
          </header>
          <h2 className="article-headline">
            {isVillain ? `[고발] 매국의 길: ${matchedPersona.name}` : `[취재] 독립의 희망: ${matchedPersona.name}`}
          </h2>
          <div className="article-main-text">
            <pre className="article-content-text">{matchedPersona.articleBody}</pre>
          </div>
          <div className="newspaper-footer">
             <button className="video-trigger-btn" onClick={() => setViewMode('video')}>🎬 1인칭 다큐멘터리 시청</button>
          </div>
        </div>
      </div>
    );
  }

 
  if (viewMode === 'video') {
    return (
      <div className="video-reveal-layer animate-fade">
        <div className="video-content-box">
          <div className="video-wrapper">
            <video className="main-video" controls autoPlay>
              <source src={process.env.PUBLIC_URL + matchedPersona.video} type="video/mp4" />
            </video>
          </div>
          <div className="button-group">
            <button className="chat-trigger-btn" onClick={() => onGoToChat(matchedPersona)}>💬 {matchedPersona.name}님과 대화하기</button>
            <button className="final-restart-btn" onClick={onRestart}>메인으로</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultLayout;