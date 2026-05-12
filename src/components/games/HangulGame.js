import React, { useState, useEffect } from 'react';
import './HangulGame.css';

const TARGET_WORD = ['ㄷ', 'ㅗ', 'ㄱ', 'ㄹ', 'ㅣ', 'ㅂ']; // '독립'

function HangulGame({ onSuccess, onExit }) {
  const [blocks, setBlocks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // 게임 시작 시 블록 섞기
  useEffect(() => {
    const shuffleBlocks = () => {
      const extra = ['ㄴ', 'ㅏ', 'ㄹ', 'ㅁ']; // 방해 요소
      const combined = [...TARGET_WORD, ...extra].sort(() => Math.random() - 0.5);
      setBlocks(combined);
    };
    shuffleBlocks();
  }, []);

  const handleBlockClick = (char) => {
    if (isFinished) return;
    
    const newSelected = [...selected, char];
    setSelected(newSelected);

    // 글자 수가 정답과 같아지면 체크
    if (newSelected.length === TARGET_WORD.length) {
      if (JSON.stringify(newSelected) === JSON.stringify(TARGET_WORD)) {
        setIsFinished(true);
        // [보상 지급] 3초 뒤 성공 알림 및 발명품 데이터 전송
        setTimeout(() => {
          onSuccess({
            id: 'independent_news',
            name: '독립신문',
            category: '언어/논리',
            effectDesc: '장착 시 지력 +20% 증가'
          });
        }, 1000);
      } else {
        // 틀렸을 경우 0.5초 뒤 초기화
        setTimeout(() => setSelected([]), 500);
      }
    }
  };

  return (
    <div className="hangul-game-overlay">
      <div className="game-paper">
        <button className="close-btn" onClick={onExit}>×</button>
        <div className="game-header">
          <span className="stat-type">지력 ↑</span>
          <h3>한글 단어 완성 퍼즐</h3>
          <p>훈민정음의 원리로 <strong>'독립'</strong>을 완성하세요.</p>
        </div>

        <div className="answer-slots">
          {TARGET_WORD.map((_, i) => (
            <div key={i} className={`slot ${selected[i] ? 'active' : ''}`}>
              {selected[i] || ''}
            </div>
          ))}
        </div>

        <div className="block-pool">
          {blocks.map((char, i) => (
            <button 
              key={i} 
              className="char-block" 
              onClick={() => handleBlockClick(char)}
              disabled={isFinished}
            >
              {char}
            </button>
          ))}
        </div>

        {isFinished && (
          <div className="success-overlay animate-pop">
            <h2>🎉 임무 완수!</h2>
            <p>보상으로 <strong>'독립신문'</strong> 카드를 획득했습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HangulGame;