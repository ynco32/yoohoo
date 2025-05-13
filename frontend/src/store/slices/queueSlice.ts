import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QueueState {
  queueNumber: number | string;
  waitingTime: number;
  peopleBehind: number | string;
}

const initialState: QueueState = {
  queueNumber: 0,
  waitingTime: 0,
  peopleBehind: 0,
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueueInfo: (
      state,
      action: PayloadAction<{
        queueNumber: number | string;
        waitingTime: number;
        peopleBehind: number | string;
      }>
    ) => {
      state.queueNumber = action.payload.queueNumber;
      state.waitingTime = action.payload.waitingTime;
      state.peopleBehind = action.payload.peopleBehind;
    },
  },
});

export const { setQueueInfo } = queueSlice.actions;
export default queueSlice.reducer;
