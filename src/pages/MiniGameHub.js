import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../firebase';
import { doc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { setUserData, addInvention } from '../store/userSlice';
import { INVENTION_DATA } from '../data/inventionData';
import './MiniGameHub.css';

function MiniGameHub({ onBack }) {
  const dispatch = useDispatch();
  const { userId } = useSelector(state => state.user);
  const [activeGame, setActiveGame] = useState(null);
  const [gameState, setGameState] = useState('ready'); 
  const [wonInvention, setWonInvention] = useState(null);

  const handleWin = async (inventionName) => {
    // 1. 리덕스 상태 즉시 업데이트 (화면 반영용)
    dispatch(addInvention(inventionName));
    
    // 2. 획득 팝업 정보 설정
    setWonInvention(INVENTION_DATA[inventionName]);
    setGameState('success');

    // 3. 서버(Firestore) 저장
    if (userId) {
      try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
          ownedInventions: arrayUnion(inventionName)
        }, { merge: true });
        
        // 서버 데이터와 완전 동기화
        const snap = await getDoc(userRef);
        if (snap.exists()) dispatch(setUserData(snap.data()));
      } catch (e) {
        console.error("저장 실패:", e);
      }
    }
  };

  return (
    <div className="minigame-hub-overlay">
      <div className="hub-window">
        <header className="hub-header">
          <div className="title-badge">SCIENCE LAB</div>
          <h2>조선 과학 기술 연구소</h2>
          <button className="close-x" onClick={onBack}>×</button>
        </header>

        {!activeGame ? (
          <div className="game-selection-grid">
            <div className="mini-game-card" onClick={() => { setActiveGame('water'); setGameState('playing'); }}>
              <div className="card-icon">🌊</div>
              <h4>자격루</h4>
              <p>타이밍 미션</p>
            </div>
            <div className="mini-game-card" onClick={() => { setActiveGame('stars'); setGameState('playing'); }}>
              <div className="card-icon">✨</div>
              <h4>혼천의</h4>
              <p>관측 미션</p>
            </div>
            <div className="mini-game-card" onClick={() => { setActiveGame('rain'); setGameState('playing'); }}>
              <div className="card-icon">🌧️</div>
              <h4>측우기</h4>
              <p>수집 미션</p>
            </div>
          </div>
        ) : (
          <div className="game-arena">
            {activeGame === 'water' && <Jagyeokru onWin={() => handleWin('자격루')} />}
            {activeGame === 'stars' && <Honcheoni onWin={() => handleWin('혼천의')} />}
            {activeGame === 'rain' && <Cheugugi onWin={() => handleWin('측우기')} />}
            
            {gameState === 'success' && wonInvention && (
              <div className="win-modal animate-pop">
                <div className="win-content">
                  <div className="reward-glow"></div>
                  <img className="reward-img" src={process.env.PUBLIC_URL + wonInvention.img} alt={wonInvention.name} />
                  <h1>{wonInvention.name} 획득!</h1>
                  <p>{wonInvention.desc}</p>
                  <button className="confirm-btn" onClick={() => { setActiveGame(null); setGameState('ready'); }}>확인</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 자격루
function Jagyeokru({ onWin }) {
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1);
  const [isLive, setIsLive] = useState(true);
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      setPos(p => { if (p >= 95) setDir(-1); if (p <= 5) setDir(1); return p + (dir * 4); });
    }, 20);
    return () => clearInterval(t);
  }, [pos, dir, isLive]);
  return (
    <div className="game-play">
      <div className="timing-bar-container"><div className="target-center"></div><div className="indicator" style={{left:`${pos}%`}}>🟡</div></div>
      <button className="game-action-btn" onClick={()=>{setIsLive(false); if(pos>=35&&pos<=65) onWin(); else {alert("실패!"); setIsLive(true);}}}>지금이다!</button>
    </div>
  );
}

// 혼천의
function Honcheoni({ onWin }) {
  const [stars, setStars] = useState([{id:1,t:'20%',l:'30%',a:false},{id:2,t:'50%',l:'70%',a:false},{id:3,t:'80%',l:'40%',a:false}]);
  const click = (id) => {
    const next = stars.map(s=>s.id===id?{...s,a:true}:s);
    setStars(next);
    if(next.every(s=>s.a)) onWin();
  };
  return (<div className="star-field">{stars.map(s=><div key={s.id} className={`star-point ${s.a?'active':''}`} style={{top:s.t,left:s.l}} onClick={()=>click(s.id)}>⭐</div>)}</div>);
}

// 측우기
function Cheugugi({ onWin }) {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScore(s => s >= 10 ? 10 : s + 1), 800);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (score === 10) onWin(); }, [score, onWin]);
  return (<div className="game-play"><div className="rain-field"><div className="rain-bucket">🍶</div></div><p>강우량 측정 중: {score}/10</p></div>);
}

export default MiniGameHub;