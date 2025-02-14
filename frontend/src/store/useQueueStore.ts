import { create } from 'zustand';

interface QueueStore {
  queueNumber: number | string;
  waitingTime: number;
  peopleBehind: number | string;
  setQueueInfo: (
    queueNumber: number | string,
    waitingTime: number,
    peopleBehind: string | number
  ) => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
  queueNumber: 0,
  waitingTime: 0,
  peopleBehind: 0,

  setQueueInfo: (queueNumber, waitingTime, peopleBehind) =>
    set({ queueNumber, waitingTime, peopleBehind }),
}));
