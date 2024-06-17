import React, { useCallback, useMemo, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRive, useStateMachineInput } from 'rive-react'
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { setToLocalStorage } from "utils/functions";
import { signIn, signUp, googleSignIn, facebookSignIn } from "api/post/post.api";
import ROUTES from 'routes/constant'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import loginImage from 'assets/bb.jpg'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import GoogleIcon from '@mui/icons-material/Google'

const theme = createTheme();

const STATE_MACHINE_NAME = "Login Machine";
const SignIn = () => {
    const navigate = useNavigate()
    const [type, setType] = useState<boolean>(false)
    const [isSignUp, setIsSignUp] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const { t, i18n } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState('en')

    const schema = useMemo(() => {
        const messUsername = t('login.username_not_empty')
        const messPassword = t('login.password_not_empty')
        const messConfirm = t('login.password_must_match')
        const messEmail = t('login.email_not_valid')

        return yup
            .object({
                username: yup.string().required(messUsername),
                password: yup.string().required(messPassword),
                confirm_password: isSignUp
                    ? yup.string().oneOf([yup.ref('password')], messConfirm).required(messConfirm)
                    : yup.string(),
                email: isSignUp
                    ? yup.string().email(messEmail).required(t('login.email_required'))
                    : yup.string().email(messEmail)
            })
            .required();
    }, [isSignUp, t]);

    const method = useForm({
        resolver: yupResolver(schema)
    })

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault()
    }
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
    const handleLogin = useCallback(async () => {
        console.log('ASKJDHFKJDSHFKJ')
        try {
            const response = await signIn({
                username: method.getValues('username'),
                password: method.getValues('password')
            })
            if (response) {
                toast.success('Login success')
                const tokens = JSON.stringify(response.data)
                setToLocalStorage('tokens', tokens)
                navigate(ROUTES.home)
            } else {
                toast.error('Login failed')
                setErrorMessage('Login failed')
            }
        } catch (error: { code: number, message: string } | any) {
            toast.error('Login failed')
            setErrorMessage(error?.message)
        }
    }, [method, navigate])

    const handleRegister = useCallback(async () => {
        alert('call register');
        try {
            const username = method.getValues('username');
            const password = method.getValues('password');
            const email = method.getValues('email');

            const result = await signUp({ username, password, email });

            console.log('signUp result:', result);

            // Check if the result has the expected data structure
            if (result?.data) {
                navigate(ROUTES.email_verify_send);
            } else {
                setErrorMessage('Unexpected response from server');
            }
        } catch (error: any) {
            console.error('signUp error:', error);
            setErrorMessage(error?.message || 'Registration failed');
        }
    }, [method, navigate]);
    const [user, setUser] = useState('');

    return (
        <div className="tw-flex tw-bg-gray-200">
            <div className="tw-bg-red-500 tw-h-screen tw-w-2/5 tw-shadow-2xl tw-shadow-black">
                <img src={loginImage} alt="loginImg" className="tw-h-full" />
            </div>
            <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-w-3/5">
                <div className="tw-w-3/5">
                    <div className="tw-text-teal-500 tw-font-bold tw-text-2xl tw-text-center">{t('login.title_signIn')}</div>
                    <form className="tw-mt-8 tw-space-y-6" action="#" method="POST">
                        {/* <input type="hidden" name="remember" value="true" /> */}
                        <div className="tw-rounded-md tw-shadow-sm tw-space-y-7">
                            <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                    placeholder="Username"
                                />
                                <AccountCircleOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                            </div>
                            <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                    placeholder="Password"
                                />
                                <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                            </div>
                        </div>
                        <div className="tw-flex tw-items-center tw-justify-between">
                            <div className="tw-flex tw-items-center">
                                <input id="remember_me" name="remember_me" type="checkbox" className="tw-h-4 tw-w-4 tw-text-indigo-600 tw-focus:ring-indigo-500 tw-border-gray-300 tw-rounded" />
                                <label htmlFor="remember_me" className="tw-ml-2 tw-block tw-text-sm tw-text-gray-900">
                                    Keep me logged in
                                </label>
                            </div>

                            <div className="tw-text-sm">
                                <Link to={ROUTES.forgot_password} className="tw-font-medium tw-text-black hover:tw-text-teal-500 tw-cursor-pointer">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="tw-group tw-relative tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-text-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-teal-600 tw-hover:bg-indigo-700 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-offset-2 tw-focus:ring-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                        <div className="tw-flex tw-items-center tw-justify-center tw-my-2">
                            <hr className="tw-flex-grow tw-border-gray-300 tw-mr-2" />
                            <div>or</div>
                            <hr className="tw-flex-grow tw-border-gray-300 tw-ml-2" />
                        </div>
                        <div className="tw-flex tw-justify-center tw-gap-4">
                            <div className="tw-bg-white tw-rounded-full tw-p-1">
                                <GoogleIcon className="tw-cursor-pointer tw-text-2xl tw-text-red-500" fontSize="large" />
                            </div>
                            <div className="tw-bg-white tw-rounded-full tw-p-1">
                                <FacebookOutlinedIcon className="tw-cursor-pointer tw-text-2xl tw-text-blue-500" fontSize="large" />
                            </div>
                        </div>
                        <div className="tw-flex tw-justify-center tw-items-center">
                            Have not account yet?&nbsp; <Link to={ROUTES.sign_up} replace={true} className="tw-text-teal-500 tw-cursor-pointer tw-font-bold">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default SignIn