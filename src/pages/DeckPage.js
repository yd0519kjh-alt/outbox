import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDeck } from '../store/userSlice';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { COLLECTION_IMAGES } from '../data/collectionData'; // [중요] 이미지 매핑 데이터 임포트
import './DeckPage.css';

function DeckPage({ cards, onBack, userId }) {
  const dispatch = useDispatch();
  
  // 리덕스에서 내 인물들과 현재 저장된 덱을 가져옵니다.
  const { ownedCharacters, currentDeck = [] } = useSelector(state => state.user);
  
  // 사용자가 현재 선택 중인 임시 덱 상태 (최대 5명)
  const [tempDeck, setTempDeck] = useState(currentDeck);

  // [로직] 내가 획득한 카드들만 필터링해서 보여줍니다.
  const myCards = cards.filter(card => ownedCharacters.includes(card.id));

  // [로직] 카드 선택/해제 토글
  const toggleSelect = (id) => {
    if (tempDeck.includes(id)) {
      // 이미 선택했다면 제거
      setTempDeck(tempDeck.filter(cardId => cardId !== id));
    } else {
      // 5명까지만 선택 가능
      if (tempDeck.length >= 5) {
        return alert("부대는 최대 5명까지만 편성할 수 있습니다!");
      }
      setTempDeck([...tempDeck, id]);
    }
  };

  // [로직] 서버 및 리덕스에 저장
  const handleSaveDeck = async () => {
    if (tempDeck.length === 0) {
      return alert("최소 1명 이상의 인물을 선택해야 합니다.");
    }

    try {
      // 1. 리덕스 상태 업데이트
      dispatch(updateDeck(tempDeck));

      // 2. 파이어베이스 서버 업데이트
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        currentDeck: tempDeck
      });

      alert("부대 편성이 완료되었습니다! 이제 전투에 나설 수 있습니다.");
      onBack(); // 도감으로 돌아가기
    } catch (e) {
      console.error("덱 저장 실패:", e);
      alert("저장 중에 문제가 생겼습니다.");
    }
  };

  return (
    <div className="deck-page-container">
      <header className="deck-header">
        <button className="close-btn" onClick={onBack}>✕</button>
        <div className="deck-title-area">
          <h2>부대 편성 (Deck Build)</h2>
          <p className="deck-count">선택된 인원: <span>{tempDeck.length}</span> / 5</p>
        </div>
        <button className="save-deck-btn" onClick={handleSaveDeck}>편성 완료</button>
      </header>

      <div className="deck-main-content">
        {/* 현재 선택된 덱 상단 바 */}
        <div className="selected-deck-bar">
          {tempDeck.map(id => {
            const card = cards.find(c => c.id === id);
            // [수정] COLLECTION_IMAGES에서 이미지 경로를 가져옵니다.
            const imgSet = COLLECTION_IMAGES[id] || {};
            return (
              <div key={id} className="mini-card" onClick={() => toggleSelect(id)}>
                {imgSet.main ? (
                  <img src={process.env.PUBLIC_URL + imgSet.main} alt={id} />
                ) : (
                  <div className="no-img-placeholder">👤</div>
                )}
                <span className="remove-badge">−</span>
              </div>
            );
          })}
          {[...Array(5 - tempDeck.length)].map((_, i) => (
            <div key={i} className="mini-card empty">?</div>
          ))}
        </div>

        <hr className="deck-divider" />

        {/* 선택 가능한 내 인물 리스트 */}
        <div className="my-cards-grid">
          {myCards.length === 0 ? (
            <div className="no-cards">
              <p>아직 획득한 인물 카드가 없습니다.</p>
              <p className="sub">역사 탐험을 통해 카드를 먼저 수집해 보세요!</p>
            </div>
          ) : (
            myCards.map(card => {
              // [수정] COLLECTION_IMAGES에서 이미지 경로를 가져옵니다.
              const imgSet = COLLECTION_IMAGES[card.id] || {};
              return (
                <div 
                  key={card.id} 
                  className={`select-card-item ${tempDeck.includes(card.id) ? 'is-selected' : ''}`}
                  onClick={() => toggleSelect(card.id)}
                >
                  <div className="card-img-wrapper">
                    {imgSet.main ? (
                      <img src={process.env.PUBLIC_URL + imgSet.main} alt={card.name} />
                    ) : (
                      <div className="no-img-placeholder">👤</div>
                    )}
                    {tempDeck.includes(card.id) && <div className="check-overlay">✔</div>}
                  </div>
                  <div className="card-info">
                    <p className="name">{card.name}</p>
                    <p className="atk">ATK: {card.stats.attack * 20}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default DeckPage;