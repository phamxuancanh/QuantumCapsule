import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import loginImage from 'assets/bb.jpg'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { ClockLoader } from 'react-spinners'
import OTPModal from 'components/modals/OTPModal'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { sendOTP, checkEmail } from "api/user/user.api"
import ReCAPTCHA from 'react-google-recaptcha'
const ForgotPassword = () => {
    const { t, i18n } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const keySite = process.env.REACT_APP_SITE_KEY
    const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessageEmail, setErrorMessageEmail] = useState('')
    const [errorMessageCaptcha, setErrorMessageCaptcha] = useState('')
    // const [errorMessagePassword, setErrorMessagePassword] = useState('')
    // const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
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
    async function handleSendOTP(e: { preventDefault: () => void; }) {
        setShowCaptcha(true)
        console.log('handleSendOTP')
        e.preventDefault();
        setErrorMessageEmail('')
        setErrorMessageCaptcha('')
        const messEmail = t('forgot_password.email_required')
        const schema = yup.object({
            email: yup
                .string()
                .required(messEmail)
        }).required()

        setLoading(true)
        try {
            await schema.validate({ email }, { abortEarly: false })
            const result = await sendOTP({ email, captchaValue, type: 'forgot_password' })
            console.log('result:', result)
            if (result?.data) {
                console.log('go')
                setTimeout(() => {
                    setLoading(false)
                    setIsModalOpen(true);
                    toast.success(t('forgot_password.successfully_sended'));
                }, 1000)
            } else {
                setLoading(false)
                alert('Unexpected response from server');
            }
        } catch (error) {
            setLoading(false)
            console.log('error:', error);
            if (error instanceof yup.ValidationError) {
                const errorOrder = ['email']
                setErrorMessageEmail('')
                setErrorMessageCaptcha('')
                errorOrder.forEach(field => {
                    if (error instanceof yup.ValidationError) {
                        const err = error.inner.find(e => e.path === field);
                        if (err) {
                            switch (field) {
                                case 'email':
                                    setErrorMessageEmail(err.message)
                                    break
                                default:
                                    break;
                            }
                        }
                    }
                });
            } else {
                if (typeof error === 'object' && error !== null && 'message' in error) {
                    if (typeof error === 'object' && error !== null && 'message' in error) {
                        console.log('error.code:', error.message)
                        const message = String(error.message)
                        if (message.includes('User')) {
                            setErrorMessageEmail(message)
                        }
                        if (message.includes('captcha token')) {
                            setErrorMessageCaptcha(t('forgot_password.captcha_error'))
                        }
                    }

                }
            }
        }
    }
    const handleCloseModal = () => {
        setCaptchaValue(null)
        setEmail('')
        setErrorMessageCaptcha('')
        setErrorMessageEmail('')
        setShowCaptcha(false)
        setIsModalOpen(false)
    };
    const handleCaptchaChange = (value: React.SetStateAction<string | null>) => {
        setErrorMessageCaptcha('');
        setCaptchaValue(value);
    };
    const handleEmailBlur = () => {
        if (email) {
            setShowCaptcha(true);
        }
    };
    return (
        <div className="tw-flex tw-bg-gray-200">
            {isModalOpen && <OTPModal onClose={handleCloseModal} email={email} />}
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
                        <div className="tw-text-orange-400 tw-font-bold tw-text-2xl tw-text-center">{t('forgot_password.title')}</div>
                        <form className="tw-mt-8 tw-space-y-6" action="#" method="POST" onSubmit={handleSendOTP}>
                            <select className="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-font-bold tw-text-gray-700  tw-border tw-border-gray-300 tw-focus:border-indigo-500 tw-focus:outline-none tw-shadow" onChange={handleChange}>
                                {languageOptions.map((option, index) => (
                                    <option key={index} value={option.value} className='tw-font-bold tw-py-2'>
                                        {option.flag}&nbsp;&nbsp;&nbsp;{option.label}&nbsp;&nbsp;{option.value === selectedLanguage && '✔'}
                                    </option>
                                ))}
                            </select>
                            <div className="tw-space-y-7">
                                <div>
                                    <div className="tw-relative tw-border-2 tw-border-orange-300 tw-rounded-2xl">
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="text"
                                            autoComplete="email"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder={t('forgot_password.your_register_email')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={handleEmailBlur}
                                        />
                                        <EmailOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />

                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageEmail}</div>
                                </div>
                                {showCaptcha && (
                                    <ReCAPTCHA
                                        sitekey={keySite ?? ''}
                                        onChange={handleCaptchaChange}
                                    />
                                )}
                                {(errorMessageCaptcha && showCaptcha) && (
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageCaptcha}</div>
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    onClick={handleSendOTP}
                                    className="tw-group tw-relative tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-text-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-orange-400 tw-hover:bg-indigo-700 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-offset-2 tw-focus:ring-indigo-500"
                                >
                                    {t('forgot_password.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
