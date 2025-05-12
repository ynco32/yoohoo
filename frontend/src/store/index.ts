import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import queueReducer from './slices/queueSlice';
import errorReducer from './slices/errorSlice';
import ticketingSeatSlice from './slices/ticketingSeatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    queue: queueReducer,
    error: errorReducer,

    // 다른 리듀서들 추가
  },
  // RTK 2.x에서는 미들웨어 설정이 약간 변경됨
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 필요한 경우 직렬화 검사 예외 추가
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
});

// TypeScript 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
