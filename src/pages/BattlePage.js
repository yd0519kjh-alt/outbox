import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { COLLECTION_IMAGES } from '../data/collectionData';
import { INVENTION_DATA } from '../data/inventionData'; // [추가]
import './BattlePage.css';

function BattlePage({ cards, onBack }) {
  const { currentDeck = [], ownedInventions = [], nickname } = useSelector(state => state.user);
  
  // [상태] 기본 배틀 정보
  const [playerLP, setPlayerLP] = useState(4000);
  const [enemyLP, setEnemyLP] = useState(4000);
  const [round, setRound] = useState(0);
  const [battleLog, setBattleLog] = useState("부대를 정비하고 필살기를 준비하세요!");
  const [isGameOver, setIsGameOver] = useState(false);

  // [상태] 발명품 필살기 시스템
  const [equippedInvention, setEquippedInvention] = useState(null); // 장착된 발명품 이름
  const [isSpecialUsed, setIsSpecialUsed] = useState(false); // 필살기 사용 여부

  const playerDeck = currentDeck.map(id => cards.find(c => c.id === id)).filter(Boolean);
  const enemyDeck = [
    { name: "일본군 보병", atk: 1200, def: 800, img: "/assets/images/enemies/soldier.png" },
    { name: "헌병대 장교", atk: 1800, def: 1200, img: "/assets/images/enemies/police.png" },
    { name: "최종 총독부군", atk: 3500, def: 2500, img: "/assets/images/enemies/boss.png" }
  ];

  // [로직] 일반 공격
  const handleAttack = () => {
    if (isGameOver || playerDeck.length === 0) return;
    const pCard = playerDeck[round % playerDeck.length];
    const eCard = enemyDeck[round % enemyDeck.length];
    const pAtk = pCard.stats.attack * 25;
    const damage = Math.max(0, pAtk - eCard.def);

    if (damage > 0) {
      setEnemyLP(prev => Math.max(0, prev - damage));
      setBattleLog(`${pCard.name}의 돌격! ${eCard.name}에게 ${damage} 데미지!`);
    } else {
      setPlayerLP(prev => Math.max(0, prev - 500));
      setBattleLog(`공격이 막혔습니다! 500의 반동 피해를 입었습니다.`);
    }
    setRound(prev => prev + 1);
  };

  // [로직] 발명품 필살기 공격 (전투 중 1회)
  const useSpecialSkill = () => {
    if (!equippedInvention || isSpecialUsed || isGameOver) return;
    
    const invData = INVENTION_DATA[equippedInvention];
    setEnemyLP(prev => Math.max(0, prev - invData.power));
    setBattleLog(`🔥필살기 [${invData.name}] 발동! 적에게 ${invData.power}의 고정 데미지!!`);
    setIsSpecialUsed(true);
  };

  useEffect(() => {
    if (enemyLP <= 0) { setBattleLog("대한 독립 만세! 승리하셨습니다!"); setIsGameOver(true); }
    else if (playerLP <= 0) { setBattleLog("전력이 부족합니다... 재정비가 필요합니다."); setIsGameOver(true); }
  }, [enemyLP, playerLP]);

  return (
    <div className="battle-arena-container">
      {/* 상단: 적군 상태 */}
      <div className="arena-side enemy-field">
        <div className="status-box">
          <p className="unit-name">{enemyDeck[round % enemyDeck.length].name}</p>
          <div className="lp-bar-bg"><div className="lp-bar-fill enemy" style={{width: `${(enemyLP/4000)*100}%`}}></div></div>
          <p className="lp-text">ENEMY LP: {enemyLP}</p>
        </div>
      </div>

      {/* 중앙: 로그 및 발명품 장착 선택창 */}
      <div className="battle-center-ui">
        {!equippedInvention && !isGameOver ? (
          <div className="invention-selector">
            <p className="select-msg">전투에 사용할 발명품을 장착하세요</p>
            <div className="inv-button-grid">
              {ownedInventions.length > 0 ? (
                ownedInventions.map(name => (
                  <button key={name} className="inv-select-btn" onClick={() => setEquippedInvention(name)}>
                    {name}
                  </button>
                ))
              ) : <p className="no-inv-msg">보유 중인 발명품이 없습니다.</p>}
            </div>
          </div>
        ) : (
          <div className="log-window"><p className="log-text">{battleLog}</p></div>
        )}
      </div>

      {/* 하단: 내 부대 및 발명품 버튼 */}
      <div className="arena-side player-field">
        <div className="battle-card player-card animate-up" key={round}>
          <img src={process.env.PUBLIC_URL + (COLLECTION_IMAGES[playerDeck[round % playerDeck.length]?.id]?.main || "")} alt="hero" />
          <div className="card-stats">ATK {playerDeck[round % playerDeck.length]?.stats.attack * 25}</div>
        </div>
        <div className="status-box">
          <p className="unit-name">{playerDeck[round % playerDeck.length]?.name}</p>
          <div className="lp-bar-bg"><div className="lp-bar-fill player" style={{width: `${(playerLP/4000)*100}%`}}></div></div>
          <p className="lp-text">{nickname} LP: {playerLP}</p>
        </div>
      </div>

      {/* 하단 버튼 컨트롤 */}
      <div className="battle-controls">
        {isGameOver ? (
          <button className="battle-btn finish" onClick={onBack}>기지로 돌아가기</button>
        ) : (
          <>
            <button className="battle-btn attack" onClick={handleAttack}>일반 공격</button>
            <button 
              className={`battle-btn special-skill ${(!equippedInvention || isSpecialUsed) ? 'disabled' : ''}`} 
              onClick={useSpecialSkill}
              disabled={!equippedInvention || isSpecialUsed}
            >
              {isSpecialUsed ? "발명품 재충전 중" : equippedInvention ? `${equippedInvention} 발동!` : "미장착"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BattlePage;