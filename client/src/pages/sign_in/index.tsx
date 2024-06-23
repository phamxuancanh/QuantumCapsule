import React, { useCallback, useMemo, useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { setToLocalStorage } from "utils/functions"
import { signIn, googleSignIn, facebookSignIn } from "api/post/post.api"
import ROUTES from 'routes/constant'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import loginImage from 'assets/bb.jpg'
import { ClockLoader, PacmanLoader } from "react-spinners"

const theme = createTheme();

const SignIn = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberChecked, setRememberChecked] = useState(false)
    const [errorMessageUsername, setErrorMessageUsername] = useState("")
    const [errorMessagePassword, setErrorMessagePassword] = useState("")
    const [errorVerified, setErrorVerified] = useState("")
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const [loading, setLoading] = useState(false)
    // TODO: them loading
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
        setErrorMessageUsername('')
        setErrorMessagePassword('')
        setErrorVerified('')
        const messUsername = t('signIn.user_name_required')
        const messPassword = t('signIn.password_required')

        const schema = yup.object({
            username: yup
                .string()
                .required(messUsername),
            password: yup
                .string()
                .required(messPassword)
        }).required()

        try {
            await schema.validate({ username, password }, { abortEarly: false })
            const result = await signIn({ username, password })
            console.log(result)
            console.log('result.data:', result?.data)
            if (result?.data) {
                setLoading(true)
                const tokens = JSON.stringify(result.data)
                setTimeout(() => {
                    setLoading(false);
                    setToLocalStorage('tokens', tokens)
                    navigate(ROUTES.home)
                    toast.success(t('signIn.success'))
                }, 3000);
            } else {
                alert('Unexpected response from server')
            }
        } catch (error) {
            console.log('error:', error);
            if (error instanceof yup.ValidationError) {
                const errorOrder = ['username', 'password']
                setErrorMessageUsername('')
                setErrorMessagePassword('')
                setErrorVerified('')
                errorOrder.forEach(field => {
                    if (error instanceof yup.ValidationError) {
                        const err = error.inner.find(e => e.path === field);
                        if (err) {
                            switch (field) {
                                case 'username':
                                    setErrorMessageUsername(err.message)
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
                if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                    console.log('error.code:', error.code);
                    if (error.code === 401) {
                        if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                            console.log('error.code:', error.message)
                            const message = String(error.message)
                            if (message.includes('Username')) {
                                setErrorMessageUsername(message)
                            } else if (message.includes('Password')) {
                                setErrorMessagePassword(message)
                            } else if (message.includes('Email')) {
                                setErrorVerified(message)
                            }
                        }
                    } else {
                        console.log(error)
                    }
                }
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
                            // margin={10}
                            speedMultiplier={3}
                            size={40}
                        />
                    </div>
                </div>
            )}
            <div className="tw-bg-red-500 tw-h-screen lg:tw-w-2/5 tw-shadow-2xl tw-shadow-black tw-w-full lg:tw-block tw-hidden">
                <img src={loginImage} alt="loginImg" className="tw-h-full" />
            </div>
            <div className="tw-flex lg:tw-relative lg:tw-w-3/5 tw-w-full tw-items-center tw-justify-between">
                <img src={loginImage} alt="loginImg" className="tw-absolute tw-h-full tw-w-full lg:tw-hidden tw-hidden sm:tw-block" />
                {/* <div className="tw-flex tw-z-20  tw-items-center tw-justify-center lg:tw-h-full sm:tw-h-screen tw-h-full lg:tw-w-full tw-w-full"> */}
                <div className="tw-flex tw-z-20 tw-items-center tw-justify-center lg:tw-h-full sm:tw-h-screen tw-min-h-screen lg:tw-w-full tw-w-full">
                    <div className="tw-w-4/5 lg:tw-w-3/5 tw-bg-gray-200 tw-bg-opacity-25 tw-rounded-3xl tw-p-5">
                        <div className="tw-text-teal-500 tw-font-bold tw-text-2xl tw-text-center">{t('signIn.title')}</div>
                        <form className="tw-mt-8 tw-space-y-6" action="#" method="POST" onSubmit={handleLogin}>
                            <select className="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-font-bold tw-text-gray-700  tw-border tw-border-gray-300 tw-focus:border-indigo-500 tw-focus:outline-none tw-shadow" onChange={handleChange}>
                                {languageOptions.map((option, index) => (
                                    <option key={index} value={option.value} className='tw-font-bold tw-py-2'>
                                        {option.flag}&nbsp;&nbsp;&nbsp;{option.label}&nbsp;&nbsp;{option.value === selectedLanguage && '✔'}
                                    </option>
                                ))}
                            </select>
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
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <AccountCircleOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />

                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageUsername}</div>
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
                                    <input id="remember_me" name="remember_me" type="checkbox" className="tw-h-4 tw-w-4 tw-text-indigo-600 tw-focus:ring-indigo-500 tw-border-gray-300 tw-rounded" />
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
                                <div className="tw-bg-white tw-rounded-full tw-p-1 tw-cursor-pointer" onClick={googleSignIn}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path> </svg>
                                </div>
                                <div className="tw-bg-white tw-rounded-full tw-p-1 tw-cursor-pointer" onClick={facebookSignIn}>
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