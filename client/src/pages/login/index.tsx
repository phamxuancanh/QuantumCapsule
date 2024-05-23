import React, { useCallback, useMemo } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRive, useStateMachineInput } from 'rive-react';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { setToLocalStorage } from "utils/functions";
import { signIn, signUp } from "api/post/post.api";
import ROUTES from 'routes/constant'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material'
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const theme = createTheme();


const STATE_MACHINE_NAME = "Login Machine";
const Login = () => {
    const navigate = useNavigate()
    const [type, setType] = useState<boolean>(false)
    const [isSignUp, setIsSignUp] = useState<boolean>(true)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const { t } = useTranslation()


    const schema = useMemo(() => {
        const messUsername = t('login.username_not_empty')
        const messPassword = t('login.password_not_empty')
        const messConfirm = t('login.password_must_match')
        return yup
            .object({
                username: yup.string().required(messUsername),
                password: yup.string().required(messPassword),
                confirm_password: isSignUp
                    ? yup.string().oneOf([yup.ref('password')], messConfirm)
                    : yup.string()
            })
            .required()
    }, [isSignUp, t])

    const method = useForm({
        resolver: yupResolver(schema)
    })

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault()
    }

    const handleLogin = useCallback(async () => {
        try {
            const response = await signIn({
                username: method.getValues('username'),
                password: method.getValues('password')
            })
            const tokens = JSON.stringify(response.data)
            setToLocalStorage('tokens', tokens)
            navigate(ROUTES.home)
            setErrorMessage('')
        } catch (error: { code: number, message: string } | any) {
            // eslint-disable-next-line no-console
            setErrorMessage(error?.message)
        }
    }, [method, navigate])

    const handleRegister = useCallback(async () => {
        alert(method.getValues('username') + ' ' + method.getValues('password') + ' ' + method.getValues('confirm_password'))
        try {
            const result = await signUp({
                username: method.getValues('username'),
                password: method.getValues('password')
            })
            setErrorMessage(result?.data?.status.toString())
        } catch (error: { code: number, message: string } | any) {
            // eslint-disable-next-line no-console
            setErrorMessage(error?.message)
        }
    }, [method])
    // CON GAU, DONT CARE
    const [user, setUser] = useState('');
    const { rive, RiveComponent } = useRive({
        // src: "520-990-teddy-login-screen.riv",
        src: "animated_login_character3.riv",
        autoplay: true,
        stateMachines: STATE_MACHINE_NAME,

    })
    useEffect(() => {
        setLook();
    }, [user])
    const stateSuccess = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        'trigSuccess',
    )
    const stateFail = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        'trigFail'
    )
    const stateHandUp = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        'isHandsUp'
    )

    const stateCheck = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        'isChecking'
    )
    const stateLook = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        'numLook'
    )
    const triggerSuccess = () => {
        stateSuccess && stateSuccess.fire();
    }
    const triggerFail = () => {
        stateFail && stateFail.fire();
    }
    const setHangUp = (hangUp: number | boolean) => {
        stateHandUp && (stateHandUp.value = hangUp);
    }
    const setLook = () => {
        if (!stateLook || !stateCheck || !setHangUp) {
            return;
        }
        setHangUp(false)
        setCheck(true);
        let nbChars = 0;
        if (user) {
            nbChars = parseFloat(user.length.toString());
        }
        let ratio = nbChars / parseFloat('41');

        let lookToSet = ratio * 100 - 25
        stateLook.value = Math.round(lookToSet);
    }
    const setCheck = (check: number | boolean) => {
        if (stateCheck) {
            stateCheck.value = check;
        }
    }
    if (rive) {
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <div className="text-2xl font-bold text-center">
                    {isSignUp ? t('login.title_signUp') : t('login.title_signIn')}
                </div>
                <CssBaseline />
                <div >
                    <RiveComponent style={{ width: '600px', height: '400px' }} />
                </div>
                <div>
                    <FormProvider {...method}>
                        <form
                            onSubmit={
                                isSignUp
                                    ? method.handleSubmit(handleRegister)
                                    : method.handleSubmit(handleLogin)
                            }
                        >
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">
                                    {t('login.username')}
                                </InputLabel>
                                <OutlinedInput
                                    {...method.register('username', { required: true })}
                                    onChange={(e) => method.setValue('username', e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    label={t('login.username')}
                                />
                            </FormControl>
                            {(method.formState.errors.username != null) && (
                                <div>
                                    {method.formState.errors.username.message}
                                </div>
                            )}
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">
                                    {t('login.password')}
                                </InputLabel>
                                <OutlinedInput
                                    type={type ? 'text' : 'password'}
                                    {...method.register('password', { required: true })}
                                    onChange={(e) => method.setValue('password', e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setType((prev) => !prev)}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {type ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label={t('login.password')}
                                />
                            </FormControl>
                            {(method.formState.errors.password != null) && (
                                <div>
                                    {method.formState.errors.password.message}
                                </div>
                            )}
                            {isSignUp && (
                                <>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">
                                            {t('login.confirm_password')}
                                        </InputLabel>
                                        <OutlinedInput
                                            {...method.register('confirm_password', {
                                                required: isSignUp
                                            })}
                                            type={type ? 'text' : 'password'}
                                            onChange={(e) =>
                                                method.setValue('confirm_password', e.target.value)
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setType((prev) => !prev)}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {type ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label={t('login.confirm_password')}
                                        />
                                    </FormControl>
                                    {(method.formState.errors.confirm_password != null) && (
                                        <div>
                                            {method.formState.errors.confirm_password.message}
                                        </div>
                                    )}
                                </>
                            )}
                            {isSignUp ? (
                                <>
                                    <Button
                                        onMouseOver={() => setHangUp(false)}
                                        onFocus={() => setHangUp(false)}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setIsSignUp(false)
                                        }}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Basck
                                    </Button>
                                    <Button
                                        onMouseOver={() => setHangUp(false)}
                                        onFocus={() => setHangUp(false)}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}>
                                        Sign Up
                                    </Button>
                                </>

                            ) : (
                                <>
                                    <Button
                                        onMouseOver={() => setHangUp(false)}
                                        onFocus={() => setHangUp(false)}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        // onClick={() => {

                                        //     setCheck(true);
                                        //     if (checkLogin(user, password)) {
                                        //         triggerSuccess()
                                        //     } else {
                                        //         triggerFail();
                                        //     }
                                        // }}
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        onMouseOver={() => setHangUp(false)}
                                        onFocus={() => setHangUp(false)}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setIsSignUp(true)
                                        }}
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        di toi trang dki
                                    </Button>
                                </>
                            )
                            }
                            {errorMessage && <div>{errorMessage}</div>}
                        </form>
                    </FormProvider>
                </div>


            </Container>
        </ThemeProvider>
    )
}
export default Login;