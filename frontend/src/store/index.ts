import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import queueReducer from './slices/queueSlice';
import errorReducer from './slices/errorSlice';
import ticketingSeatReducer from './slices/ticketingSeatSlice';
import captchaReducer from './slices/captchaSlice';
import arenaReducer from './slices/arenaSlice';
import sectionReducer from './slices/sectionSlice';
import markerReducer from './slices/markerSlice';

// persist 설정
const arenaPersistConfig = {
  key: 'arena',
  storage,
  whitelist: ['currentArena'], // 경기장 정보만 지속
};

// 마커 persist 설정
const markerPersistConfig = {
  key: 'marker',
  storage,
  whitelist: ['markers', 'currentArenaId'], // 마커 데이터와 현재 경기장 ID만 지속
};

// 다른 persist 설정이 필요한 경우
const userPersistConfig = {
  key: 'user',
  storage,
  // 필요에 따라 whitelist 설정
};

// persist 적용
const persistedArenaReducer = persistReducer(arenaPersistConfig, arenaReducer);
const persistedMarkerReducer = persistReducer(
  markerPersistConfig,
  markerReducer
);
// 필요한 경우 user reducer에도 persist 적용
// const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: userReducer, // 또는 persistedUserReducer
    queue: queueReducer,
    error: errorReducer,
    ticketingSeat: ticketingSeatReducer,
    captcha: captchaReducer,
    arena: persistedArenaReducer,
    section: sectionReducer,
    marker: persistedMarkerReducer,
    // 다른 리듀서들 추가
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist 액션들을 제외
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: [],
      },
    }),
});

export const persistor = persistStore(store);

// TypeScript 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
