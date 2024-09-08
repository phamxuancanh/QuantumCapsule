import { requestWithJwt, requestWithoutJwt } from '../request'
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { setToLocalStorage } from 'utils/functions';
import { loginState } from 'redux/auth/authSlice';
const firebaseConfig = {
  apiKey: "AIzaSyAN42yRxXQdumIT187N_rXW-60zCcjg3e8",
  authDomain: "authenqc.firebaseapp.com",
  projectId: "authenqc",
  storageBucket: "authenqc.appspot.com",
  messagingSenderId: "937494844026",
  appId: "1:937494844026:web:90eb6cd27bb70aa9cee1c3",
  measurementId: "G-V30ZQYBLQ3"
};
// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

export const signIn = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/signIn', { data: payload }, { withCredentials: true })
}

export const signUp = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/signUp', { data: payload }, { withCredentials: true })
}

export const refresh = async (): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/refreshToken', {}, { withCredentials: true })
}
export const signOut = async (): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/signOut', {}, { withCredentials: true } )
}
export const checkEmail = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/checkEmail', { data: payload }, { withCredentials: true } )
}

export const sendOTP = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/sendOTP', { data: payload }, { withCredentials: true } )
}
export const resetPassword = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/resetPassword', { data: payload }, { withCredentials: true } )
}
export const verifyEmail = async (token: string): Promise<AxiosResponse<any>> => {
  console.log(token);
  return await requestWithoutJwt.get<any>(`/auths/verifyEmail`, {
      params: { token }
  });
};
export const verifyOTP = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/verifyOTP', { data: payload }, { withCredentials: true })
}
export const facebookSignIn = async () => {
  const auth = getAuth(app);
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    console.log('Token:', token);

    const response = await fetch('http://localhost:8000/api/v1/auths/facebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
      credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Đăng nhập thành công:', data);

      const currentUser = {
        accessToken: token,
        currentUser: data.user,
      };

      return currentUser;
    } else {
      console.error('Đăng nhập thất bại:', data);
      toast.error('Đăng nhập Facebook thất bại!');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập với Facebook:', error);

    if ((error as any).code === 'auth/account-exists-with-different-credential') {
      toast.error('Email này đã được đăng ký bằng phương thức khác. Vui lòng thử đăng nhập bằng phương thức đó.');
    } else {
      toast.error('Đã xảy ra lỗi khi đăng nhập với Facebook.');
    }

    return null;
  }
};
export const googleSignIn = async () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    console.log('Token:', token);

    const response = await fetch('http://localhost:8000/api/v1/auths/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
      credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Đăng nhập thành công:', data);

      const currentUser = {
        accessToken: token,
        currentUser: data.user,
      };

      return currentUser;
    } else {
      console.error('Đăng nhập thất bại:', data);
      toast.error('Đăng nhập Google thất bại!');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập với Google:', error);

    if ((error as any).code === 'auth/account-exists-with-different-credential') {
      toast.error('Email này đã được đăng ký bằng phương thức khác. Vui lòng thử đăng nhập bằng phương thức đó.');
    } else {
      toast.error('Đã xảy ra lỗi khi đăng nhập với Google.');
    }

    return null;
  }
};

export const githubSignIn = async () => {
  const auth = getAuth(app);
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const githubToken = credential?.accessToken;
    console.log("GitHub Token:", githubToken);
    const response = await fetch('http://localhost:8000/api/v1/auths/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ githubToken }),
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Đăng nhập GitHub thành công:', data);
      const currentUser = {
        accessToken: githubToken,
        currentUser: data.user,
      };
      return currentUser;
    } else {
      console.error('Đăng nhập GitHub thất bại:', data);
      toast.error('Đăng nhập GitHub thất bại!');
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập với GitHub:", error);
    if ((error as any).code === 'auth/account-exists-with-different-credential') {
      toast.error('Email này đã được đăng ký bằng phương thức khác. Vui lòng thử đăng nhập bằng phương thức đó.');
    } else {
      toast.error('Đã xảy ra lỗi khi đăng nhập với GitHub.');
    }
    return null;
  }
};

export const findUserById = async (id: string): Promise<AxiosResponse<any>> => {
  console.log(id, 'id');
  return await requestWithJwt.get<any>(`/users/${id}`)
}
export const updateUser = async (id: string, payload: any): Promise<AxiosResponse<any>> => {
  console.log(payload, 'payload');
  return await requestWithJwt.put<any>(`/users/${id}`, { data: payload })
}
export const changeAVT = async (id: string, payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.put<any>(`/users/${id}/changeAVT`, payload);
}
export const changePassword = async (id: string, payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.put<any>(`/auths/${id}/changePassword`, payload);
}
