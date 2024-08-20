import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store'
import { findUserById } from '../../api/user/api'
import { AxiosResponse } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { setToLocalStorage } from 'utils/functions';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
interface DecodedToken {
  userId: string;
}
const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const currentUser = localStorage.getItem('persist:auth');
  if (!currentUser) {
    throw new Error('No access token found');
  }

  let userId: string;
  try {
    const currentUserObj = JSON.parse(currentUser);
    const decodedToken: DecodedToken = jwtDecode(currentUserObj.accessToken);
    console.log(decodedToken, 'decodedToken');
    userId = decodedToken.userId;
  } catch (error) {
    throw new Error('Invalid token'); 
  }
  
  const response: AxiosResponse<User> = await findUserById(userId);
  const persistAuth = localStorage.getItem('persist:auth');

if (persistAuth) {
  const authData = JSON.parse(persistAuth);
  authData.currentUser = response.data;
  console.log(authData, 'authData');
//   const currentUser = {
//     currentUser: result.data.user,
//     accessToken: result.data.accessToken
// }
console.log(currentUser)
// setToLocalStorage('persist:auth', JSON.stringify(currentUser))
  localStorage.setItem('persist:auth', JSON.stringify(authData));
}
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginState(state: AuthState, action: PayloadAction<User>) {
      console.log('loginSuccess', action.payload);
      state.user = action.payload;
      // localStorage.setItem('persist:auth', JSON.stringify(action.payload));
    },
    updateStateInfo(state: AuthState, action: PayloadAction<User>) {
      const persistAuth = localStorage.getItem('persist:auth');
      if (persistAuth) {
        const authData = JSON.parse(persistAuth);
        // Cập nhật chỉ thông tin người dùng mà không thay đổi token
        authData.currentUser = action.payload;
        localStorage.setItem('persist:auth', JSON.stringify(authData));
      }
      state.user = action.payload;
    },
    logoutState(state: AuthState) {
      state.user = null;
      localStorage.removeItem('persist:auth');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const { loginState, updateStateInfo, logoutState } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
