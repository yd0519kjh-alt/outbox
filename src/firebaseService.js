// src/firebaseService.js
import { db } from "./firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

// 아이템을 저장하는 함수 (유저 아이디, 저장할 아이템 객체)
export const saveItemToCloud = async (userId, item) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ownedInventions: arrayUnion(item) // 기존 목록에 중복 없이 추가
    }, { merge: true });
    
    console.log("☁️ 서버 저장 성공!");
  } catch (error) {
    console.error("❌ 서버 저장 실패:", error);
  }
};