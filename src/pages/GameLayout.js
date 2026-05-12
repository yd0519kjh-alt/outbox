import React, { useState, useEffect } from 'react';

function GameLayout({ scenario, onFinish }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [scores, setScores] = useState({ hero: 0, villain: 0 });
  const [history, setHistory] = useState([]);
  const [showTip, setShowTip] = useState(false);
  const [currentImg, setCurrentImg] = useState(scenario.steps.defaultImg);

  const currentStep = scenario.steps[stepIdx];

  useEffect(() => {
    setCurrentImg(scenario.steps[stepIdx].defaultImg);
  }, [stepIdx, scenario.steps]);

  const handleChoice = (choice) => {
    setCurrentImg(choice.actionImg);
    setScores((prev) => ({
      ...prev,
      [choice.type]: prev[choice.type] + (choice.weight || 0)
    }));
    setHistory((prev) => [...prev, choice.text]);
    setShowTip(true);
  };

  const handleNext = () => {
    setShowTip(false);
    if (stepIdx === scenario.steps.length - 1) {
      onFinish(scores, history);
    } else {
      setStepIdx(stepIdx + 1);
    }
  };

  return (
    <div className="game-layout" style={{ backgroundImage: `url("${process.env.PUBLIC_URL + currentImg}")` }}>
      <div className="game-overlay">
        {!showTip ? (
          <div className="interaction-area">
            <div className="step-indicator">Step {stepIdx + 1} / 5</div>
            <div className="story-box"><p>{currentStep.context}</p></div>
            <div className="choice-group">
              {currentStep.choices.map((c, i) => (
                <button key={i} className="choice-btn" onClick={() => handleChoice(c)}>{c.text}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="tip-area">
            <div className="tip-box">
              <h3>📜 역사 돋보기</h3>
              <p>{currentStep.historyTip}</p>
              <button className="next-btn" onClick={handleNext}>
                {stepIdx === scenario.steps.length - 1 ? "나의 운명 확인하기" : "다음 장면으로"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameLayout;