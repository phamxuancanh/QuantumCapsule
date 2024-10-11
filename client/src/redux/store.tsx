// store.js hoặc một file riêng
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice'
import commentReducer from '../redux/comment/commentSlice'
import notificationReducer from '../redux/notification/notifySlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    comments: commentReducer,
    notify: notificationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export default store;