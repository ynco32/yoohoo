// src/types/websocket.ts
export interface WaitingTimeResponse {
  position: number;
  estimatedWaitingSeconds: number;
  usersAfter: number;
}

export interface NotificationResponse {
  success: boolean;
}
