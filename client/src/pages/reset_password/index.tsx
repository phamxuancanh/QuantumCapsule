import { t } from "i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ROUTES from 'routes/constant'
import { useTranslation } from "react-i18next";
import { resetPassword } from "api/post/post.api";
import { ClockLoader } from "react-spinners";
import * as yup from 'yup'
import { toast } from "react-toastify";
const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {}; // Default to an empty object if state is undefined
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessagePassword, setErrorMessagePassword] = useState('');
    const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleResetPassword(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setErrorMessagePassword('')
        setErrorMessageConfirmPassword('')
        const messPassword = t('reset_password.password_required');
        const messConfirm = t('reset_password.confirm_password_required');
        const schema = yup.object({
            password: yup
                .string()
                .required(messPassword)
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    t('reset_password.password_invalid')
                ),
            confirm_password: yup
                .string()
                .required(messConfirm)
                .oneOf([yup.ref('password')], t('reset_password.password_must_match')),
        }).required();

        try {
            await schema.validate({ password, confirm_password: confirmPassword }, { abortEarly: false })
            setLoading(true);
            setTimeout(async () => {
                const result = await resetPassword({ email, newPassword: password })
                console.log('result')
                console.log(result)
                console.log('result.data:', result?.data)
                if (result?.data) {
                    setTimeout(() => {
                        setLoading(false)
                        navigate(ROUTES.sign_in)
                        toast.success(t('reset_password.reset_sucessfully'))
                    }, 0)
                } else {
                    alert('Unexpected response from server')
                }
            }, 3000)
        } catch (error) {
            setLoading(false);
            console.log('error:', error);
            if (error instanceof yup.ValidationError) {
                // Create an ordered list of error fields
                const errorOrder = ['password', 'confirm_password'];

                // Clear previous error messages again
                setErrorMessagePassword('');
                setErrorMessageConfirmPassword('');

                // Iterate over the errorOrder array and set errors in that order
                errorOrder.forEach(field => {
                    if (error instanceof yup.ValidationError) {
                        const err = error.inner.find(e => e.path === field);
                        if (err) {
                            switch (field) {
                                case 'password':
                                    setErrorMessagePassword(err.message);
                                    break;
                                case 'confirm_password':
                                    setErrorMessageConfirmPassword(err.message);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                });
            } else {
                // if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                //     console.log('error.code:', error.code);
                //     // console.log('error.message:', error.message);
                //     // const message = error.message;
                //     if (error.code === 404) {
                //         if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                //             console.log('error.code:', error.message);
                //             const message = String(error.message);
                //             if (message.includes('Username')) {
                //                 setErrorMessageUsername(message);
                //             } else if (message.includes('Email')) {
                //                 setErrorMessageEmail(message);
                //             }
                //         }
                //     } else {
                //         console.log(error)
                //     }
                // }
                console.log('error:', error);
            }
        }
    }

    return (
        <div className="tw-bg-gray-200 tw-flex tw-items-center tw-justify-center tw-min-h-screen">
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
            <div className="tw-bg-white tw-items-center tw-justify-center tw-p-10 tw-space-y-8 tw-border tw-rounded-2xl tw-shadow">
                <div className="bg-tw-gray-500 tw-font-bold tw-text-5xl tw-text-center">{t('reset_password.title')}</div>
                <div className="tw-text-center tw-font-bold">{t('reset_password.enter')} {email}</div>
                <form action="#" method="POST" onSubmit={handleResetPassword}>
                    <div>
                        <div>
                            <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                    placeholder={t('reset_password.new_password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                            </div>
                            <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessagePassword}</div>

                        </div>
                        <div>
                            <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                    placeholder={t('reset_password.confirm_password')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                            </div>
                            <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageConfirmPassword}</div>

                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleResetPassword}
                            type="submit"
                            className="tw-group tw-relative tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-text-sm tw-font-medium tw-rounded-md tw-text-black tw-bg-sky-400 hover:tw-bg-sky-500"
                        >
                            {t('reset_password.reset')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword