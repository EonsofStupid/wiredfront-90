import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import type { Notification, NotificationType } from './types';

// Base atoms for notification state
export const notificationsAtom = atom<Notification[]>([]);

// Derived atoms for computed values
export const unreadCountAtom = atom((get) =>
  get(notificationsAtom).filter(n => !n.isRead).length
);

// Action atoms
export const addNotificationAtom = atom(
  null,
  (get, set, notification: {
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
  }) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date(),
      isRead: false
    };

    set(notificationsAtom, [...get(notificationsAtom), newNotification]);

    // Auto-remove after duration if specified
    if (notification.duration) {
      setTimeout(() => {
        set(notificationsAtom,
          get(notificationsAtom).filter(n => n.id !== newNotification.id)
        );
      }, notification.duration);
    }
  }
);

export const removeNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    set(notificationsAtom,
      get(notificationsAtom).filter(n => n.id !== id)
    );
  }
);

export const markAsReadAtom = atom(
  null,
  (get, set, id: string) => {
    set(notificationsAtom,
      get(notificationsAtom).map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  }
);

export const markAllAsReadAtom = atom(
  null,
  (get, set) => {
    set(notificationsAtom,
      get(notificationsAtom).map(n => ({ ...n, isRead: true }))
    );
  }
);

export const clearAllNotificationsAtom = atom(
  null,
  (get, set) => {
    set(notificationsAtom, []);
  }
);
