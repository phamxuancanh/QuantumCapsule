// store.js hoặc một file riêng
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export default store;