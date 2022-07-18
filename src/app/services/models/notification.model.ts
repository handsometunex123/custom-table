export interface NotificationModel {
  type: type;
  message: string;
  duration: number;
}

// notification type
export type type = 'error' | 'warning' | 'success' | 'info'