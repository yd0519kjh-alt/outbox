import { createSlice } from '@reduxjs/toolkit';

const inventionSlice = createSlice({
  name: 'inventions',
  initialState: {
    ownedItems: [], // 처음엔 텅 빈 주머니입니다.
  },
  reducers: {
    // 미니게임 승리 시 아이템을 주머니에 넣는 기능
    addItem: (state, action) => {
      // 이미 가지고 있는지 확인하고 없으면 넣습니다.
      const exists = state.ownedItems.find(item => item.id === action.payload.id);
      if (!exists) {
        state.ownedItems.push(action.payload);
      }
    },
  },
});

export const { addItem } = inventionSlice.actions;
export default inventionSlice.reducer;