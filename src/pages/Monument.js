import React, { useState } from 'react';

function Monument({ onBack }) {
  const [messages, setMessages] = useState([
    { text: "대한독립만세", x: 45, y: 40, style: { color: '#CD2E3A' } },
    { text: "영원히 기억하겠습니다", x: 50, y: 55, style: { color: '#0047A0' } }
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    const newMessage = {
      text: input,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      style: { color: Math.random() > 0.5 ? '#CD2E3A' : '#0047A0' }
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="monument-page full-screen">
      <button className="back-to-main-btn" onClick={onBack}>← 메인으로</button>
      <div className="mosaic-canvas">
        {messages.map((m, i) => (
          <span key={i} className="mosaic-pixel" style={{ left: `${m.x}%`, top: `${m.y}%`, color: m.style.color }}>
            {m.text}
          </span>
        ))}
      </div>
      <form className="monument-form" onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="메시지 입력..." />
        <button type="submit">각인하기</button>
      </form>
    </div>
  );
}

export default Monument;