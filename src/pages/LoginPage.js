import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// App.js에서 로그인 상태를 변경할 수 있도록 프롭(onLoginSuccess 등)을 받는 것이 좋습니다.
function LoginPage({ onLoginSuccess }) {
  const [nickname, setNickname] = useState('');

  const handleEnterGame = async (e) => {
    e.preventDefault();
    const trimmedName = nickname.trim();
    
    if (!trimmedName) return alert("성함을 입력해주세요!");
    if (trimmedName.length < 2) return alert("성함은 2글자 이상이어야 합니다.");

    try {
      // 1. 파이어베이스 익명 로그인 (보안 및 세션 유지용)
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 2. [핵심 수정] UID 대신 입력받은 '닉네임'을 문서 ID로 사용
      const userRef = doc(db, "users", trimmedName);
      const snap = await getDoc(userRef);

      let userData;

      if (!snap.exists()) {
        // 새 사용자인 경우 초기 데이터 생성
        userData = {
          nickname: trimmedName,
          ownedCharacters: [],
          ownedInventions: [],
          currentDeck: []
        };
        await setDoc(userRef, userData);
        console.log(`${trimmedName}님, 명부에 새로 등록되었습니다.`);
      } else {
        // 기존 사용자인 경우 데이터 불러오기
        userData = snap.data();
        console.log(`${trimmedName}님, 기존 기록을 불러옵니다.`);
      }

      // 3. 부모 컴포넌트(App.js)에 로그인 성공 알림 및 데이터 전달
      // App.js에서 이 정보를 받아 Redux에 넣고 페이지를 전환해야 합니다.
      if (onLoginSuccess) {
        onLoginSuccess(user, userData);
      }

    } catch (error) {
      console.error("접속 에러:", error);
      alert("로그인 중 오류가 발생했습니다. 파이어베이스 설정을 확인해주세요.");
    }
  };

  return (
    <div className="login-container" style={{ 
      textAlign: 'center', 
      marginTop: '100px',
      padding: '40px',
      background: '#f4f1ea', // 전통적인 종이 느낌 배경색
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h2 style={{ color: '#4a3f35', marginBottom: '20px' }}>🇰🇷 독립군 명부 등록</h2>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '30px' }}>
        성함을 입력하시면 이전 기록을 이어서 진행할 수 있습니다.
      </p>
      <form onSubmit={handleEnterGame}>
        <input 
          type="text" 
          placeholder="성함을 입력하세요" 
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ 
            padding: '12px', 
            width: '80%',
            marginBottom: '20px',
            border: '1px solid #d2b48c',
            borderRadius: '5px'
          }}
        />
        <br />
        <button 
          type="submit" 
          style={{ 
            padding: '12px 30px', 
            background: '#4a3f35', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          독립 운동 시작하기
        </button>
      </form>
    </div>
  );
}

export default LoginPage;