import React, { useState, useEffect, useRef } from 'react';


// ChatPage.js 또는 DiaryPage.js 상단
const rawKey = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_KEY = rawKey ? rawKey.trim() : "";

function ChatPage(props) {
 
  const target = props.target || props.matchedPersona;
  const onBack = props.onBack;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
     
    const personaName = target?.name || "무명 독립운동가";
    setMessages([{ 
      role: 'ai', 
      text: "오느라 고생했다. 나는 " + personaName + "라고 하네. 궁금한 게 있으면 무엇이든 물어보게나." 
    }]);
  }, [target]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const fetchAIResponse = async (userText) => {
    
    const systemPrompt = target?.prompt || "너는 1919년의 무명 독립운동가야. 아주 결연하고 예의 바른 말투를 사용해줘.";

    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt + " 너는 역사 속 인물이야. 말투를 완벽하게 유지해줘." },
            { role: "user", content: userText }
          ],
          temperature: 0.8
        })
      });

      const data = await response.json();

      if (response.ok) {
        
        const rawText = JSON.stringify(data);
        const koreanMatches = rawText.match(/[가-힣\s!?,.]+/g);
        const aiResult = koreanMatches ? koreanMatches.join("").trim() : "";

        if (aiResult) {
          setMessages(prev => [...prev, { role: 'ai', text: aiResult }]);
        } else {
          setMessages(prev => [...prev, { role: 'ai', text: "미안하네, 다시 한번 말해주겠나?" }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "❌ 통신 오류가 발생했소." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "💻 연결이 끊겼구려." }]);
    }
    setLoading(false);
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const tempInput = input;
    setInput('');
    fetchAIResponse(tempInput);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="chat-back" onClick={onBack}>← 나가기</button>
        <div className="chat-info">
          <span className="info-label">대화 상대:</span>
          <span className="info-name">{target?.name || "무명 독립운동가"}</span>
        </div>
      </header>

      <div className="chat-window" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={"bubble " + m.role}>
            <div className="text">{m.text}</div>
          </div>
        ))}
        {loading && <div className="loading-text">답변을 생성 중...</div>}
      </div>

      <div className="chat-input-box">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={handleSend} disabled={loading}>전송</button>
      </div>
    </div>
  );
}

export default ChatPage;