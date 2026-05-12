// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // 우리가 만든 슬라이스

export const store = configureStore({
  reducer: {
    // 이 이름이 useSelector(state => state.user)와 일치해야 합니다!
    user: userReducer, 
  },
});