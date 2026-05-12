import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth } from './firebase'; 
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { setUserData } from './store/userSlice'; 

// 페이지 및 데이터 임포트
import MainLayout from './pages/MainLayout';
import GameLayout from './pages/GameLayout';
import ResultLayout from './pages/ResultLayout';
import Monument from './pages/Monument';
import ChatPage from './pages/ChatPage'; 
import CollectionPage from './pages/CollectionPage'; 
import BattlePage from './pages/BattlePage'; 
import TimelineMap from './pages/TimelineMap';
import LoginPage from './pages/LoginPage'; 
import DeckPage from './pages/DeckPage'; 
import MiniGameHub from './pages/MiniGameHub'; 
import { MARCH_SCENARIO } from './data/scenarios';
import { getFinalResult } from './data/logic';
import { CHARACTER_DB } from './data/characterDB'; 
import './App.css';

function App() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState('main'); 
  const [gameResult, setGameResult] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [chatTarget, setChatTarget] = useState(null);

  // --- [로그인 및 유저 상태] ---
  const [user, setUser] = useState(null); // Firebase Auth 유저 객체
  const [userNickname, setUserNickname] = useState(""); // 실제 데이터 키로 사용할 닉네임

  // 1. 인증 상태 감시 (세션 유지용)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setUserNickname("");
        setCurrentPage('main');
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. [핵심] 로그인 성공 처리 핸들러 (LoginPage에서 호출됨)
  const handleLoginSuccess = (authUser, userData) => {
    setUser(authUser); // Auth 상태 저장
    setUserNickname(userData.nickname); // 닉네임 저장
    dispatch(setUserData(userData)); // 서버에서 가져온 전체 데이터를 Redux에 저장
    setCurrentPage('main'); // 메인 화면으로 이동
  };

  // --- [이동 및 이벤트 핸들러] ---
  
  const handleStartGame = (month) => {
    setSelectedMonth(month);
    setCurrentPage('game');
  };

  const handleFinishGame = async (scores, history) => {
    const resultId = getFinalResult(selectedMonth, scores);
    const matchedPersona = CHARACTER_DB[selectedMonth].find(c => c.id === resultId) || getFinalResult(selectedMonth, scores);

    setGameResult({ matchedPersona, history });

    // [수정] 닉네임을 키로 사용하여 저장
    if (!userNickname) return;

    const userRef = doc(db, "users", userNickname);
    try {
      await updateDoc(userRef, {
        ownedCharacters: arrayUnion(matchedPersona.id)
      });
      
      const updatedSnap = await getDoc(userRef);
      if (updatedSnap.exists()) {
        dispatch(setUserData(updatedSnap.data()));
      }
    } catch (e) {
      console.error("❌ 서버 저장 실패:", e);
    }
    setCurrentPage('ending');
  };

  const handleGoToTimelineMap = () => {
    setCurrentPage('timelineMap');
  };

  const handleGoToChatFromEnding = () => {
    setChatTarget(gameResult?.matchedPersona);
    setCurrentPage('chat');
  };

  const handleGoToChatFromCollection = (card) => {
    setChatTarget(card);
    setCurrentPage('chat');
  };

  const handleGoToBattle = () => {
    setCurrentPage('battle');
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까? 기록을 유지하려면 같은 성함으로 다시 접속해주세요.")) {
      signOut(auth).then(() => {
        setUser(null);
        setUserNickname("");
        setCurrentPage('main');
      });
    }
  };

  // 3. 조건부 렌더링 (닉네임이 없으면 로그인 페이지로)
  if (!user || !userNickname) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      {/* 상단 닉네임 표시 및 로그아웃 버튼 */}
      <div style={{
        position: 'fixed', top: '10px', right: '10px', zIndex: 1000,
        display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          background: 'rgba(255,255,255,0.8)', 
          padding: '5px 10px', 
          borderRadius: '20px',
          color: '#333'
        }}>
          🇰🇷 {userNickname} 독립군
        </span>
        <button onClick={handleLogout} style={{
          padding: '5px 12px', cursor: 'pointer', background: '#4a3f35', 
          color: 'white', border: 'none', borderRadius: '5px', fontSize: '12px'
        }}>로그아웃</button>
      </div>

      {currentPage === 'main' && (
        <MainLayout 
          onStart={handleStartGame} 
          onGoToMonument={() => setCurrentPage('monument')} 
          onGoToCollection={() => setCurrentPage('collection')} 
          onGoToTimelineMap={handleGoToTimelineMap} 
          onGoToMiniGame={() => setCurrentPage('minigame')}
        />
      )}

      {currentPage === 'game' && (
        <GameLayout scenario={MARCH_SCENARIO} onFinish={handleFinishGame} />
      )}

      {currentPage === 'ending' && (
        <ResultLayout 
          result={gameResult} 
          onRestart={() => setCurrentPage('main')} 
          onGoToMonument={() => setCurrentPage('monument')} 
          onGoToChat={handleGoToChatFromEnding} 
          onGoToCollection={() => setCurrentPage('collection')}
        />
      )}

      {currentPage === 'monument' && (
        <Monument onBack={() => setCurrentPage('main')} />
      )}

      {currentPage === 'collection' && (
        <CollectionPage 
          cards={CHARACTER_DB[selectedMonth] || []} 
          onBack={() => setCurrentPage('main')} 
          onChat={handleGoToChatFromCollection} 
          onBattle={handleGoToBattle} 
          onGoToDeck={() => setCurrentPage('deck')}
        />
      )}

      {currentPage === 'deck' && (
        <DeckPage 
          cards={CHARACTER_DB[selectedMonth] || []} 
          userId={userNickname} // userId 대신 닉네임 전달
          onBack={() => setCurrentPage('collection')} 
        />
      )}

      {currentPage === 'battle' && (
        <BattlePage 
          cards={Object.values(CHARACTER_DB).flat()} 
          onBack={() => setCurrentPage('collection')} 
        />
      )}

      {currentPage === 'minigame' && (
        <MiniGameHub onBack={() => setCurrentPage('main')} />
      )}

      {currentPage === 'timelineMap' && (
        <TimelineMap onBack={() => setCurrentPage('main')} />
      )}

      {currentPage === 'chat' && (
        <ChatPage 
          target={chatTarget} 
          onBack={() => {
            if (chatTarget?.name === gameResult?.matchedPersona?.name) {
              setCurrentPage('ending');
            } else {
              setCurrentPage('collection');
            }
          }} 
        />
      )}
    </div>
  );
}

export default App;