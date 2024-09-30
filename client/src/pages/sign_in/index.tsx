import React, { useCallback, useMemo, useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { setToLocalStorage } from "utils/functions"
import { signIn, googleSignIn, githubSignIn, facebookSignIn } from "api/user/user.api"
import ROUTES from 'routes/constant'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import loginImage from 'assets/bb.jpg'
import { ClockLoader, PacmanLoader } from "react-spinners"
import { loginState } from '../../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import CryptoJS from 'crypto-js'
import socket from 'services/socket/socket'
const theme = createTheme();
const SignIn = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.auth)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberChecked, setRememberChecked] = useState(false)
    const [errorMessageEmail, setErrorMessageEmail] = useState("")
    const [errorMessagePassword, setErrorMessagePassword] = useState("")
    const [errorVerified, setErrorVerified] = useState("")
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const [loading, setLoading] = useState(false)

    const handleFacebookSignIn = async () => {
        try {
            const result = await facebookSignIn();
            if (result) {
                const currentUser = {
                    accessToken: result.accessToken,
                    currentUser: result.currentUser
                };
    
                let data: string | undefined;
                const userRole = currentUser?.currentUser.key;
                if (userRole) {
                    try {
                        const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication');
                        data = giaiMa.toString(CryptoJS.enc.Utf8);
                    } catch (error) {
                        console.error('Decryption error:', error);
                    }
                }
    
                if (data !== 'R1' && data !== 'R2' && currentUser.currentUser.grade === null) {
                    // alert('User grade is null');
                    navigate(ROUTES.grade_choose);
                    return;
                }
    
                console.log(currentUser);
                setToLocalStorage('persist:auth', JSON.stringify(currentUser));
                dispatch(loginState(currentUser.currentUser));
    
                if (data === 'R1' || data === 'R2') {
                    navigate(ROUTES.admin);
                } else {
                    navigate(ROUTES.home);
                }
    
                socket.on('connection', () => {
                    console.log('User Connect');
                });
                toast.success(t('signIn.success'));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            if (result) {
                const currentUser = {
                    accessToken: result.accessToken,
                    currentUser: result.currentUser
                };
    
                let data: string | undefined;
                const userRole = currentUser?.currentUser.key;
                if (userRole) {
                    try {
                        const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication');
                        data = giaiMa.toString(CryptoJS.enc.Utf8);
                    } catch (error) {
                        console.error('Decryption error:', error);
                    }
                }
    
                setToLocalStorage('persist:auth', JSON.stringify(currentUser));
    
                if (data !== 'R1' && data !== 'R2' && currentUser.currentUser.grade === null) {
                    navigate(ROUTES.grade_choose);
                    return;
                }
    
                dispatch(loginState(currentUser.currentUser));
    
                if (data === 'R1' || data === 'R2') {
                    navigate(ROUTES.admin);
                } else {
                    navigate(ROUTES.home);
                }
    
                socket.on('connection', () => {
                    console.log('User Connect');
                });
                toast.success(t('signIn.success'));
            }
        } catch (error) {
            console.log(error);
        }
    };
    // const handleGoogleSignIn = async () => {
    //     try {
    //         const result = await googleSignIn();
    //         if (result) {
    //             const currentUser = {
    //                 accessToken: result.accessToken,
    //                 currentUser: result.currentUser
    //             };
    
    //             let data: string | undefined;
    //             const userRole = currentUser?.currentUser.key;
    //             if (userRole) {
    //                 try {
    //                     const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication');
    //                     data = giaiMa.toString(CryptoJS.enc.Utf8);
    //                 } catch (error) {
    //                     console.error('Decryption error:', error);
    //                 }
    //             }
    
    //             if (data !== 'R1' && data !== 'R2' && currentUser.currentUser.grade === null) {
    //                 // alert('User grade is null');
    //                 navigate(ROUTES.grade_choose);
    //                 return;
    //             }
    
    //             console.log(currentUser);
    //             setToLocalStorage('persist:auth', JSON.stringify(currentUser));
    //             dispatch(loginState(currentUser.currentUser));
    
    //             if (data === 'R1' || data === 'R2') {
    //                 navigate(ROUTES.admin);
    //             } else {
    //                 navigate(ROUTES.home);
    //             }
    
    //             socket.on('connection', () => {
    //                 console.log('User Connect');
    //             });
    //             toast.success(t('signIn.success'));
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    
    const handleGithubSignIn = async () => {
        try {
            const result = await githubSignIn();
            if (result) {
                const currentUser = {
                    accessToken: result.accessToken,
                    currentUser: result.currentUser
                };
    
                let data: string | undefined;
                const userRole = currentUser?.currentUser.key;
                if (userRole) {
                    try {
                        const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication');
                        data = giaiMa.toString(CryptoJS.enc.Utf8);
                    } catch (error) {
                        console.error('Decryption error:', error);
                    }
                }
                if (data !== 'R1' && data !== 'R2' && currentUser.currentUser.grade === null) {
                    // alert('User grade is null');
                    navigate(ROUTES.grade_choose);
                    return;
                }
    
                console.log(currentUser);
                setToLocalStorage('persist:auth', JSON.stringify(currentUser));
                dispatch(loginState(currentUser.currentUser));
    
                if (data === 'R1' || data === 'R2') {
                    navigate(ROUTES.admin);
                } else {
                    navigate(ROUTES.home);
                }
    
                socket.on('connection', () => {
                    console.log('User Connect');
                });
                toast.success(t('signIn.success'));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleRememberCheckboxChange = (event: any) => {
        setRememberChecked(event.target.checked);
    };
    const languageOptions = useMemo(() => {
        return [
            { label: 'EN', value: 'en', flag: getUnicodeFlagIcon('GB') },
            { label: 'VN', value: 'vi', flag: getUnicodeFlagIcon('VN') }
        ]
    }, [])
    const handleChange = useCallback(
        async (e: React.ChangeEvent<HTMLSelectElement>) => {
            try {
                await i18n.changeLanguage(e.target.value)
                setSelectedLanguage(e.target.value)
            } catch (error) {
                console.log(error)
            }
        },
        [i18n]
    )
    async function handleLogin(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setErrorMessageEmail('')
        setErrorMessagePassword('')
        setErrorVerified('')
        const messUsername = t('signIn.user_name_required')
        const messPassword = t('signIn.password_required')

        const schema = yup.object({
            email: yup
                .string()
                .required(messUsername),
            password: yup
                .string()
                .required(messPassword)
        }).required()
        setLoading(true)
        try {
            await schema.validate({ email, password }, { abortEarly: false })
            const result = await signIn({ email, password, rememberChecked })
            if (result?.data) {
                setLoading(true)
                setTimeout(() => {
                    setLoading(false);
                    const currentUser = {
                        accessToken: result.data.accessToken,
                        currentUser: result.data.user
                    }
                    console.log(currentUser)
                    setToLocalStorage('persist:auth', JSON.stringify(currentUser))
                    loginState(currentUser.currentUser)
                    dispatch(loginState(currentUser.currentUser))
                    navigate(ROUTES.home)
                    toast.success(t('signIn.success'))
                }, 2000);
            }
            else {
                setLoading(false)
                alert('Unexpected response from server')
            }
        } catch (error) {
            console.log('error:', error);
            if (error instanceof yup.ValidationError) {
                setLoading(false)
                const errorOrder = ['username', 'password']
                setErrorMessageEmail('')
                setErrorMessagePassword('')
                setErrorVerified('')
                errorOrder.forEach(field => {
                    if (error instanceof yup.ValidationError) {
                        const err = error.inner.find(e => e.path === field);
                        if (err) {
                            switch (field) {
                                case 'username':
                                    setErrorMessageEmail(err.message)
                                    break
                                case 'password':
                                    setErrorMessagePassword(err.message)
                                    break
                                default:
                                    break;
                            }
                        }
                    }
                });
            } else {
                setTimeout(() => {
                    setLoading(false)
                    if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                        console.log('error.code:', error.code);
                        if (error.code === 401) {
                            if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                                console.log('error.code:', error.message)
                                const message = String(error.message)
                                if (message.includes('Username')) {
                                    setErrorMessageEmail(message)
                                } else if (message.includes('Password')) {
                                    setErrorMessagePassword(message)
                                } else if (message.includes('Email')) {
                                    setErrorVerified(message)
                                } else if (message.includes('Please')) {
                                    toast.error(message)
                                }
                            }
                        } else {
                            console.log(error)
                        }
                    }
                }, 2000)
            }
        }
    }
    return (
        <div className="tw-flex tw-bg-gray-200">
            {loading && (
                <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-opacity-50">
                    <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-140 tw-mt-20">
                        <ClockLoader
                            className='tw-flex tw-justify-center tw-items-center tw-w-full tw-mt-20'
                            color='#5EEAD4'
                            cssOverride={{
                                display: 'block',
                                margin: '0 auto',
                                borderColor: 'blue'
                            }}
                            loading
                            speedMultiplier={3}
                            size={40}
                        />
                    </div>
                </div>
            )}
            <div className="tw-h-screen lg:tw-w-2/5 tw-shadow-2xl tw-shadow-black tw-w-full lg:tw-block tw-hidden">
                <img src={loginImage} alt="loginImg" className="tw-h-full" />
            </div>
            <div className="tw-flex lg:tw-relative lg:tw-w-3/5 tw-w-full tw-items-center tw-justify-between">
                <img src={loginImage} alt="loginImg" className="tw-absolute tw-h-full tw-w-full lg:tw-hidden tw-hidden sm:tw-block" />
                <div className="tw-flex tw-z-20 tw-items-center tw-justify-center lg:tw-h-full sm:tw-h-screen tw-min-h-screen lg:tw-w-full tw-w-full">
                    <div className="tw-fixed tw-top-0 tw-right-0 tw-m-4">
                        <select className="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-font-bold tw-text-gray-700 tw-border tw-border-gray-300 tw-focus:border-indigo-500 tw-focus:outline-none tw-shadow" onChange={handleChange}>
                            {languageOptions.map((option, index) => (
                                <option key={index} value={option.value} className='tw-font-bold tw-py-2'>
                                    {option.flag}&nbsp;&nbsp;&nbsp;{option.label}&nbsp;&nbsp;{option.value === selectedLanguage && '✔'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="tw-w-4/5 lg:tw-w-3/5 tw-bg-gray-200 tw-bg-opacity-25 tw-rounded-3xl tw-p-5">
                        <div className="tw-text-teal-500 tw-font-bold tw-text-2xl tw-text-center">{t('signIn.title')}</div>
                        <form className="tw-mt-8 tw-space-y-6" action="#" method="POST" onSubmit={handleLogin}>
                            <div className="tw-space-y-7">
                                <div>
                                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="text"
                                            autoComplete="email"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder={t('signIn.user_name')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <AccountCircleOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />

                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageEmail}</div>
                                </div>
                                <div>
                                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder={t('signIn.password')}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />

                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessagePassword}</div>
                                </div>
                            </div>
                            <div className="tw-text-red-500 tw-text-sm tw-p-0">{errorVerified}</div>
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-flex tw-items-center">
                                    <input
                                        id="remember_me"
                                        name="remember_me"
                                        type="checkbox"
                                        className="tw-h-4 tw-w-4 tw-text-indigo-600 tw-focus:ring-indigo-500 tw-border-gray-300 tw-rounded"
                                        checked={rememberChecked}
                                        onChange={handleRememberCheckboxChange}
                                    />
                                    <label htmlFor="remember_me" className="tw-ml-2 tw-block tw-text-sm tw-text-gray-900">
                                        {t('signIn.keep_signed_in')}
                                    </label>
                                </div>

                                <div className="tw-text-sm">
                                    <Link to={ROUTES.forgot_password} className="tw-font-medium tw-text-black hover:tw-text-teal-500 tw-cursor-pointer">
                                        {t('signIn.forgot_password')}
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleLogin}
                                    type="submit"
                                    className="tw-group tw-relative tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-text-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-teal-600 tw-hover:bg-indigo-700 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-offset-2 tw-focus:ring-indigo-500"
                                >
                                    {t('signIn.submit')}
                                </button>
                            </div>
                            <div className="tw-flex tw-items-center tw-justify-center tw-my-2">
                                <hr className="tw-flex-grow tw-border-gray-300 tw-mr-2" />
                                <div>or</div>
                                <hr className="tw-flex-grow tw-border-gray-300 tw-ml-2" />
                            </div>
                            <div className="tw-flex tw-justify-center tw-gap-4">
                                <div className="tw-bg-white tw-rounded-full tw-p-1 tw-cursor-pointer" onClick={handleGoogleSignIn}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path> </svg>
                                </div>
                                <div className="tw-bg-white tw-rounded-full tw-p-1 tw-cursor-pointer" onClick={handleGithubSignIn}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 64 64">
                                        <path d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z"></path>
                                    </svg>
                                </div>
                                <div className="tw-bg-white tw-rounded-full tw-p-1 tw-cursor-pointer" onClick={handleFacebookSignIn}>
                                    <svg width="48" height="48" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_5_8066)">
                                            <path d="M45 22.5C45 10.0737 34.9263 0 22.5 0C10.0737 0 0 10.0737 0 22.5C0 33.7303 8.22797 43.0388 18.9844 44.7267V29.0039H13.2715V22.5H18.9844V17.543C18.9844 11.9039 22.3436 8.78906 27.483 8.78906C29.9447 8.78906 32.5195 9.22851 32.5195 9.22851V14.7656H29.6824C26.8873 14.7656 26.0156 16.5001 26.0156 18.2795V22.5H32.2559L31.2583 29.0039H26.0156V44.7267C36.772 43.0388 45 33.7305 45 22.5Z" fill="#1877F2" />
                                            <path d="M31.2583 29.0039L32.2559 22.5H26.0156V18.2795C26.0156 16.4999 26.8873 14.7656 29.6824 14.7656H32.5195V9.22852C32.5195 9.22852 29.9447 8.78906 27.4829 8.78906C22.3436 8.78906 18.9844 11.9039 18.9844 17.543V22.5H13.2715V29.0039H18.9844V44.7267C20.1474 44.9089 21.3228 45.0003 22.5 45C23.6772 45.0004 24.8526 44.909 26.0156 44.7267V29.0039H31.2583Z" fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_5_8066">
                                                <rect width="45" height="45" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="tw-flex tw-justify-center tw-items-center">
                                {t('signIn.no_account')}&nbsp; <Link to={ROUTES.sign_up} replace={true} className="tw-text-teal-500 tw-cursor-pointer tw-font-bold">{t('signIn.signUp')}</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignIn