import React from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRive, useStateMachineInput } from 'rive-react';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const theme = createTheme();

// const STATE_MACHINE_NAME = "State Machine 1";
const STATE_MACHINE_NAME = "Login Machine";
const Login = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
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
        console.log("ratio " + ratio);

        let lookToSet = ratio * 100 - 25
        console.log("lookToSet " + Math.round(lookToSet));
        stateLook.value = Math.round(lookToSet);
    }
    const setCheck = (check: number | boolean) => {
        if (stateCheck) {
            stateCheck.value = check;
        }

    }

    if (rive) {
        console.log(rive.contents);
    }

    const handleSubmit = (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
    const checkLogin = (user: string, password: string) => {
        if (user === "admin" && password === "admin") {
            toast.success("Login Success")
            // navigate('/home')
            return true;
        }
        toast.error("Login Fail")
        return false;
    }
    return (
    <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div >
                    <RiveComponent style={{ width: '600px', height: '400px'}} />
                </div>
                <div className="font-bold text-4xl mt-3">QUANTUM CAPSULE</div>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <form autoComplete="off">
                        <TextField
                            onFocus={() => setHangUp(false)}

                            onChange={(event) => setUser(event.target.value)}
                            value={user}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus

                        />
                        <TextField
                            onChange={(event) => {
                                setHangUp(true);
                                setPassword(event.target.value);
                            }}
                            onFocus={() => setHangUp(true)}
                            // onMouseOut={() => setHangUp(false)}
                            onMouseLeave={() => setHangUp(false)}
                            value={password}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                    </form>
                    <Button
                        onMouseOver={() => setHangUp(false)}
                        onFocus={() => setHangUp(false)}
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={() => {

                            setCheck(true);
                            if (checkLogin(user, password)) {
                                triggerSuccess()
                            } else {
                                triggerFail();
                            }
                        }}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
    )
}
export default Login;