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
  createTransform,
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

// 사용자 세션 기반 transform 설정
const sessionBasedTransform = createTransform(
  // 저장 시 변환 (state -> storage)
  (inboundState: Record<string, any>, key) => {
    // 현재 세션 ID 가져오기
    let currentSessionId = '';
    if (typeof window !== 'undefined') {
      currentSessionId = localStorage.getItem('sessionId') || '';
      // 세션 ID가 없으면 새로 생성하고 저장
      if (!currentSessionId) {
        currentSessionId = Date.now().toString();
        localStorage.setItem('sessionId', currentSessionId);
      }
    }

    // 현재 시간과 세션 ID 저장
    return {
      ...inboundState,
      _sessionTimestamp: Date.now(),
      _sessionId: currentSessionId,
    };
  },
  // 불러오기 시 변환 (storage -> state)
  (outboundState: Record<string, any>, key) => {
    // 저장된 세션 ID
    const savedSessionId = outboundState?._sessionId;

    // 세션 ID가 없으면 그대로 반환
    if (!savedSessionId) {
      return outboundState;
    }

    // 현재 세션 ID 가져오기
    let currentSessionId = '';
    if (typeof window !== 'undefined') {
      currentSessionId = localStorage.getItem('sessionId') || '';

      // 세션 ID가 없으면 새로 생성
      if (!currentSessionId) {
        currentSessionId = Date.now().toString();
        localStorage.setItem('sessionId', currentSessionId);
      }
    }

    // 브라우저 세션이 변경된 경우 사용자 상태 초기화
    if (savedSessionId !== currentSessionId) {
      // 사용자 슬라이스의 초기 상태
      return {
        data: null,
        isLoggedIn: false,
        loading: false,
        error: null,
      };
    }

    // 세션이 동일하면 저장된 상태 반환 (세션 관련 필드 제외)
    const { _sessionTimestamp, _sessionId, ...rest } = outboundState;
    return rest;
  }
);

// 사용자 정보 persist 설정
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['data', 'isLoggedIn'], // 사용자 데이터와 로그인 상태만 유지
  transforms: [sessionBasedTransform], // 세션 기반 변환 적용
};

// persist 적용
const persistedArenaReducer = persistReducer(arenaPersistConfig, arenaReducer);
const persistedMarkerReducer = persistReducer(
  markerPersistConfig,
  markerReducer
);
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
