/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NotificationDetails {
  id: number
  title: string
  message: string
  url: string
  createdAt: Date
  updatedAt: Date
}

interface Notification {
  id: string
  notificationId: number
  status: boolean
  updatedAt: Date
  createdAt: Date
  userId: number
  notificationDetails: NotificationDetails
}

interface NotifyState {
  total: number
  notifications: Notification[]
}

const initialState: NotifyState = {
  total: 0,
  notifications: []
}

export const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
      // state.total += 1
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      state.total += 1
    },
    updateNotification: (state, action: PayloadAction<{ id: number, changes: Partial<NotificationDetails> }>) => {
      const { id, changes } = action.payload
      const notification = state.notifications.find(n => n.id === id.toString())
      if (notification != null) {
        Object.assign(notification.notificationDetails, changes)
      }
    },
    updateStatus: (state, action: PayloadAction<{ id: string, status: boolean }>) => {
      const { id, status } = action.payload
      const notification = state.notifications.find(n => n.id === id)
      if (notification != null) {
        notification.status = status
      }
    },
    updateAllStatus: (state, action: PayloadAction<boolean>) => {
      console.log(action)
      console.log(state)
      console.log('udpate all status')
      const status = action.payload
      console.log(status, 'status')
      state.notifications.forEach(notification => {
        notification.status = status
      })
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
      state.total -= 1
    },
    removeAllNotificationsSlice: (state) => {
      console.log('xoa het')
      state.notifications = []
      state.total = 0
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload
    }
  }
})

export const { setNotification, addNotification, updateNotification, updateStatus, deleteNotification, updateAllStatus, removeAllNotificationsSlice, setTotal } = notifySlice.actions

export const selectNotifications = (state: { notify: NotifyState }) => state.notify.notifications
export const selectTotalNotifications = (state: { notify: NotifyState }) => state.notify.total

export default notifySlice.reducer
