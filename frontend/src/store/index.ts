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

// 브라우저 세션 기반 transform 설정
const sessionBasedTransform = createTransform(
  // 저장 시 변환 (state -> storage)
  (inboundState: Record<string, any>, key) => {
    console.log(`Transform - ${String(key)} 저장`);

    // 현재 브라우저 세션 ID 저장
    return {
      ...inboundState,
      _timestamp: Date.now(),
    };
  },
  // 불러오기 시 변환 (storage -> state)
  (outboundState: Record<string, any>, key) => {
    console.log(`Transform - ${String(key)} 불러오기`);

    // 브라우저가 닫혔다가 다시 열렸는지 확인 (reset_user_state 플래그 체크)
    const shouldResetState =
      typeof window !== 'undefined' &&
      localStorage.getItem('reset_user_state') === 'true';

    // User 슬라이스이고 상태 초기화가 필요한 경우
    if (String(key) === 'user' && shouldResetState) {
      console.log(
        'Transform - 브라우저 세션 종료 후 재시작: 사용자 상태 초기화'
      );

      // 플래그 초기화 (다른 슬라이스에서도 초기화하지 않도록)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('reset_user_state');
      }

      // 초기 상태 반환
      return {
        data: null,
        isLoggedIn: false,
        loading: false,
        error: null,
      };
    }

    // 세션이 유지되거나 다른 슬라이스인 경우 저장된 상태 유지
    console.log(`Transform - ${String(key)} 상태 유지`);

    // 메타데이터 필드 제거
    const { _timestamp, ...cleanState } = outboundState;
    return cleanState;
  },
  // 특정 슬라이스에만 적용하기 위한 옵션
  { whitelist: ['user'] }
);

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

// 사용자 정보 persist 설정
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['data', 'isLoggedIn'], // 사용자 데이터와 로그인 상태만 유지
  transforms: [sessionBasedTransform], // 브라우저 세션 기반 변환 적용
  debug: process.env.NODE_ENV === 'development', // 개발 환경에서만 디버깅 활성화
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
        // transform에서 추가되는 메타데이터 필드 무시
        ignoredPaths: ['user._timestamp'],
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
