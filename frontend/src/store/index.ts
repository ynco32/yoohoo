// src/store/index.ts
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
import revertSeatReducer from './slices/revertSeatSlice';
import seatSelectionReducer from './slices/seatSelectionSlice';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

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
// 사용자 정보 persist 설정
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['data', 'isLoggedIn'], // 사용자 데이터와 로그인 상태만 유지
};

// persist 적용
const persistedArenaReducer = persistReducer(arenaPersistConfig, arenaReducer);

const persistedMarkerReducer = persistReducer(
  markerPersistConfig,
  markerReducer
);
// 필요한 경우 user reducer에도 persist 적용
// 사용자 정보에도 persist 적용
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // persistedUserReducer 사용
    queue: queueReducer,
    error: errorReducer,
    ticketing: ticketingSeatReducer, // 키 이름 확인 필요
    captcha: captchaReducer,
    arena: persistedArenaReducer,
    section: sectionReducer,
    marker: persistedMarkerReducer,
    revertSeat: revertSeatReducer,
    seatSelection: seatSelectionReducer,
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

// persistor 생성
export const persistor = persistStore(store);

// RootState 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 타입이 지정된 useDispatch와 useSelector 훅
export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
