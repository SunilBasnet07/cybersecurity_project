import { createSlice } from '@reduxjs/toolkit';


const lockSlice = createSlice({
  name: 'lock',
  initialState :{
  lockTime: null,
  remainingTime: null,
},
  reducers: {
    setLockTime(state, action) {
      state.lockTime = action.payload;
    },
    clearLockTime(state) {
      state.lockTime = null;
      state.remainingTime = null;
    },
    setRemainingTime(state, action) {
      state.remainingTime = action.payload;
    },
  },
});

export const { setLockTime, clearLockTime, setRemainingTime } = lockSlice.actions;

export default lockSlice.reducer;
