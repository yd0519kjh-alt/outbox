import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    ownedCharacters: [],
    ownedInventions: [], // 미니게임으로 얻은 발명품 이름 배열
    currentDeck: [],     // 선택된 5장의 캐릭터 ID
  },
  reducers: {
    // 서버에서 데이터를 한꺼번에 가져와 덮어씌울 때 사용
    setUserData: (state, action) => {
      state.ownedCharacters = action.payload.ownedCharacters || [];
      state.ownedInventions = action.payload.ownedInventions || [];
      state.currentDeck = action.payload.currentDeck || [];
    },
    // [추가] 발명품 하나를 획득했을 때 리덕스만 즉시 업데이트
    addInvention: (state, action) => {
      const newInvention = action.payload;
      // 중복 저장을 방지하기 위해 includes 체크
      if (!state.ownedInventions.includes(newInvention)) {
        state.ownedInventions.push(newInvention);
      }
    },
    // 덱 정보를 업데이트할 때 사용
    updateDeck: (state, action) => {
      state.currentDeck = action.payload;
    }
  },
});

// addInvention을 추가로 export 합니다.
export const { setUserData, addInvention, updateDeck } = userSlice.actions;
export default userSlice.reducer;