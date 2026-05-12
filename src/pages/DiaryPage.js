import React, { useState, useEffect } from 'react';


const rawKey = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_KEY = rawKey ? rawKey.trim() : "";

function DiaryPage({ history, onNext }) {
  const [diary, setDiary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    if (!diary) {
      fetchDiaryResponse();
    }
  }, []);

  const fetchDiaryResponse = async () => {
    if (!history || history.length === 0) {
      setDiary("기록할 행적이 존재하지 않습니다.");
      return;
    }

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
            { 
              role: "system", 
              content: "너는 1919년 무명 독립운동가야. 사용자의 행적을 바탕으로 감동적인 1인칭 일기를 20줄 이상 작성하라. 말투는 '~하였다' 체를 유지하라." 
            },
            { role: "user", content: "나의 행적 기록: " + history.join(', ') }
          ],
          temperature: 0.8
        })
      });

      const data = await response.json();

      if (response.ok) {
  
        const rawText = JSON.stringify(data);

     
        const koreanMatches = rawText.match(/[가-힣\s!?,.]+/g);
        const diaryResult = koreanMatches ? koreanMatches.join("").trim() : "";

        if (diaryResult) {
          setDiary(diaryResult);
        } else {
          setDiary("기록 복원 실패: 한글 데이터를 찾을 수 없습니다.");
        }
      } else {
        setDiary("❌ 에러 발생: " + data.error.message);
      }
    } catch (error) {
      setDiary("💻 연결 실패: 서버 상태를 확인하십시오.");
    }
    setLoading(false);
  };

  return (
    <div className="diary-full-page animate-fade">
      <div className="diary-paper">
        <header className="diary-header">1919년 삼월의 기록</header>
        
        <div className="diary-scroll-content">
          {loading ? (
            <div className="loading-text">역사의 조각을 맞추는 중...</div>
          ) : (
            <pre className="diary-text">{diary}</pre>
          )}
        </div>

        {!loading && (
          <button className="next-step-btn-dark" onClick={onNext}>
            독립신문 확인하기 →
          </button>
        )}
      </div>
    </div>
  );
}

export default DiaryPage;