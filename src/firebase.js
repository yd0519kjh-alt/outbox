import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // [수정] .env 파일에 작성한 REACT_APP_FIREBASE_API_KEY를 불러옵니다.
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "outbox-367db.firebaseapp.com",
  projectId: "outbox-367db",
  storageBucket: "outbox-367db.firebasestorage.app",
  messagingSenderId: "81507142777",
  appId: "1:81507142777:web:b8d4fb85b09a4f778658a8",
  measurementId: "G-L2VBG24CZ2"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 다른 파일에서 쓸 수 있도록 내보내기
export const db = getFirestore(app);
export const auth = getAuth(app);