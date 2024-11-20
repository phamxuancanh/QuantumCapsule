import React, { useCallback, useMemo, useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { signUp, googleSignIn } from "api/user/user.api"
import ROUTES from 'routes/constant'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import loginImage from 'assets/bb.jpg'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import { ClockLoader } from "react-spinners"
import { fetchLocations, City, District, Ward } from './locationData'
const theme = createTheme()

const SignUp = () => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [termCheck, setTermCheck] = useState(false)
    const [errorMessageFirstName, setErrorMessageFirstName] = useState("")
    const [errorMessageLastName, setErrorMessageLastName] = useState("")
    const [errorMessageEmail, setErrorMessageEmail] = useState("")
    const [errorMessagePassword, setErrorMessagePassword] = useState("")
    const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState("")
    const [errorMessageTermCheck, setErrorMessageTermCheck] = useState("")
    const { t, i18n } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const [loading, setLoading] = useState(false)
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    // const [showCaptcha, setShowCaptcha] = useState(false);
    const keySite = process.env.REACT_APP_SITE_KEY
    const [errorMessageCaptcha, setErrorMessageCaptcha] = useState('')
    const [typeAccount, setTypeAccount] = useState('student')
    const [cities, setCities] = useState<City[]>([])
    const [selectedCity, setSelectedCity] = useState<string>('')
    const [districts, setDistricts] = useState<District[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')
    const [wards, setWards] = useState<Ward[]>([])
    const [selectedWard, setSelectedWard] = useState<string>('')
    const [selectedClass, setSelectedClass] = useState('');
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchLocations();
            setCities(data);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            const city = cities.find(city => city.Name === selectedCity); // Tìm kiếm theo Name
            setDistricts(city?.Districts || []);
            setSelectedDistrict('');
            setWards([]);
            setSelectedWard('');
        } else {
            setDistricts([]);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedDistrict) {
            const district = districts.find(district => district.Name === selectedDistrict); // Tìm kiếm theo Name
            setWards(district?.Wards || []);
            setSelectedWard('');
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedWard) {
            const ward = wards.find(ward => ward.Id === selectedWard);
        } else {
        }
    }, [selectedWard]);
    const handleAccountTypeChange = (type: any) => {
        setTypeAccount(type);
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
    async function handleRegister(e: { preventDefault: () => void; }) {
        e.preventDefault();
        // if (!showCaptcha) {
        //     setShowCaptcha(true);
        //     return;
        // }
        setErrorMessageFirstName('')
        setErrorMessageLastName('')
        setErrorMessageEmail('')
        setErrorMessagePassword('')
        setErrorMessageConfirmPassword('')
        setErrorMessageTermCheck('')
        setErrorMessageCaptcha('')

        const messFirstName = t('signUp.first_name_required');
        const messLastName = t('signUp.last_name_required');
        const messEmail = t('signUp.email_required');
        const messPassword = t('signUp.password_required');
        const messConfirm = t('signUp.confirm_password_required');
        const messTermCheckBox = t('signUp.term_required');
        const schema = yup.object({
            firstName: yup
            .string()
            .required(messFirstName)
            .matches(/^[\p{L}\s]+$/u, t('signUp.first_name_invalid')),
        lastName: yup
            .string()
            .required(messLastName)
            .matches(/^[\p{L}\s]+$/u, t('signUp.last_name_invalid')),
            email: yup
                .string()
                .email(t('signUp.email_invalid'))
                .required(messEmail),
            password: yup
                .string()
                .required(messPassword)
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    t('signUp.password_invalid')
                ),
            confirm_password: yup
                .string()
                .required(messConfirm)
                .oneOf([yup.ref('password')], t('signUp.password_must_match')),
            termCheck: yup
                .boolean()
                .oneOf([true], messTermCheckBox)
        }).required();

        try {
            await schema.validate({ firstName, lastName, email, password, confirm_password: confirmPassword, termCheck }, { abortEarly: false })
            setLoading(true);
            const result = await signUp({ firstName, lastName, email, password })
            console.log('result')
            console.log(result)
            console.log('result.data:', result?.data)
            if (result?.data) {
                setTimeout(() => {
                    setLoading(false)
                    navigate(ROUTES.email_verify_send)
                    toast.success(t('signUp.success'))
                }, 0)
            } else {
                alert('Unexpected response from server')
            }
        } catch (error) {


            console.log('error:', error);
            if (error instanceof yup.ValidationError) {
                // Create an ordered list of error fields
                const errorOrder = ['firstName', 'lastName', 'username', 'email', 'password', 'confirm_password', 'termCheck'];

                // Clear previous error messages again
                setErrorMessageFirstName('');
                setErrorMessageLastName('');
                setErrorMessageEmail('');
                setErrorMessagePassword('');
                setErrorMessageConfirmPassword('');
                setErrorMessageTermCheck('');
                setErrorMessageCaptcha('')

                errorOrder.forEach(field => {
                    if (error instanceof yup.ValidationError) {
                        const err = error.inner.find(e => e.path === field);
                        if (err) {
                            switch (field) {
                                case 'firstName':
                                    setErrorMessageFirstName(err.message);
                                    break;
                                case 'lastName':
                                    setErrorMessageLastName(err.message);
                                    break;
                                case 'email':
                                    setErrorMessageEmail(err.message);
                                    break;
                                case 'password':
                                    setErrorMessagePassword(err.message);
                                    break;
                                case 'confirm_password':
                                    setErrorMessageConfirmPassword(err.message);
                                    break;
                                case 'termCheck':
                                    setErrorMessageTermCheck(err.message);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                });
            } else {
                setTimeout(() => {
                    setLoading(false);

                    if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                        console.log('error.code:', error.code);
                        // console.log('error.message:', error.message);
                        // const message = error.message;
                        if (error.code === 401) {
                            if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
                                console.log('error.code:', error.message);
                                const message = String(error.message);
                                if (message.includes('Email')) {
                                    setErrorMessageEmail(message);
                                } else if (message.includes('Captcha')) {
                                    setErrorMessageCaptcha(message);
                                }
                            }
                        } else {
                            console.log(error)
                        }
                    }
                }, 3000)
            }


        }
    }


    return (
        <div className="tw-text-lg tw-flex tw-bg-gray-200">
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
            <div className="lg:tw-w-2/5 tw-shadow-2xl tw-shadow-black tw-w-full lg:tw-block tw-hidden tw-bg-black">
                <img src={loginImage} alt="loginImg" className="tw-h-screen" />
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
                        <div className="tw-text-sky-500 tw-font-bold tw-text-2xl tw-text-center">{t('signUp.title')}</div>
                        <form className="tw-mt-8 tw-space-y-6" action="#" method="POST" onSubmit={handleRegister}>
                            {/* <div className="tw-w-full tw-text-center tw-font-bold tw-text-neutral-800">Hay chon loai tai khoan phu hop voi ban</div> */}
                            {/* <div className="tw-flex tw-w-full">
                                <div className="tw-flex tw-w-full tw-justify-between tw-space-x-20">
                                    <div
                                        className={`tw-w-1/3 tw-rounded-lg tw-border-2 tw-border-slate-800 tw-p-5 tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer ${typeAccount === 'student' ? 'tw-bg-green-200 tw-border-green-500 tw-text-green-500' : ''
                                            }`}
                                        onClick={() => handleAccountTypeChange('student')}
                                    >
                                        <ChildCareIcon fontSize="large" style={{ color: 'black' }} />
                                        <div className="tw-font-bold">Hoc sinh</div>
                                    </div>
                                    <div
                                        className={`tw-w-1/3 tw-rounded-lg tw-border-2 tw-border-slate-800 tw-p-5 tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer ${typeAccount === 'parent' ? 'tw-bg-green-200 tw-border-green-500 tw-text-green-500' : ''
                                            }`}
                                        onClick={() => handleAccountTypeChange('parent')}
                                    >
                                        <PeopleIcon fontSize="large" style={{ color: 'black' }} />
                                        <div className="tw-font-bold">Phu huynh</div>
                                    </div>
                                    <div
                                        className={`tw-w-1/3 tw-rounded-lg tw-border-2 tw-border-slate-800 tw-p-5 tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer ${typeAccount === 'school' ? 'tw-bg-green-200 tw-border-green-500 tw-text-green-500' : ''
                                            }`}
                                        onClick={() => handleAccountTypeChange('school')}
                                    >
                                        <SchoolIcon fontSize="large" style={{ color: 'black' }} />
                                        <div className="tw-font-bold">Nha truong</div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="tw-space-y-7">
                                <div className="sm:tw-flex sm:tw-space-x-5 sm:tw-space-y-0 tw-space-y-10">
                                    <div className="sm:tw-w-1/2">
                                        <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                            <input
                                                id="email-address"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-green-500 tw-focus:border-green-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                                placeholder={t('signUp.first_name')}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                            <AccountCircleOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                                        </div>
                                        {errorMessageFirstName && <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageFirstName}</div>}
                                    </div>
                                    <div className="sm:tw-w-1/2">
                                        <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                            <input
                                                id="email-address"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                                placeholder={t('signUp.last_name')}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                            <AccountCircleOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                                        </div>
                                        <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageLastName}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder={t('signUp.email')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <EmailOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageEmail}</div>
                                </div>
                                {/* <div>
                                    <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="phone"
                                            autoComplete="phone"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder='Số điện thoại'
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                        <LocalPhoneOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageEmail}</div>
                                </div> */}
                                <div>
                                    <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder={t('signUp.password')}
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
                                            placeholder={t('signUp.confirm_password')}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageConfirmPassword}</div>
                                </div>
                                {/* {typeAccount === 'student' && (
                                    <div>
                                        <div className="tw-space-y-3 tw-font-bold">Noi hoc tap</div>
                                        <div className="tw-space-y-4 tw-mt-2">
                                            <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                                                <div className="tw-flex tw-flex-col">
                                                    <Select
                                                        id="city"
                                                        className="tw-shadow-sm tw-border-sky-500 tw-rounded-2xl"
                                                        options={cities.map(city => ({ value: city.Name, label: city.Name }))}
                                                        value={cities.find(city => city.Name === selectedCity) ? { value: selectedCity, label: selectedCity } : null}
                                                        onChange={(option) => setSelectedCity(option?.value ?? '')}
                                                        placeholder="Chọn thành phố"
                                                    />
                                                </div>

                                                <div className="tw-flex tw-flex-col">
                                                    <Select
                                                        id="district"
                                                        value={districts.find(district => district.Name === selectedDistrict) ? { value: selectedDistrict, label: selectedDistrict } : null}
                                                        onChange={(option) => setSelectedDistrict(option?.value ?? '')}
                                                        isDisabled={!selectedCity}
                                                        className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                                                        options={districts.map(district => ({ value: district.Name, label: district.Name }))}
                                                        placeholder="Chọn quận/huyện"
                                                    />
                                                </div>
                                            </div>

                                            <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                                                <div className="tw-flex tw-flex-col">
                                                    <Select
                                                        id="ward"
                                                        value={wards.find(ward => ward.Name === selectedWard) ? { value: selectedWard, label: selectedWard } : null}
                                                        onChange={(option) => setSelectedWard(option?.label ?? '')}
                                                        isDisabled={!selectedDistrict}
                                                        className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                                                        options={wards.map(ward => ({ value: ward.Name, label: ward.Name }))}
                                                        placeholder="Chọn phường/xã"
                                                    />
                                                </div>
                                                <div className="tw-flex tw-flex-col">
                                                    <Select
                                                        id="class"
                                                        value={classes.find(cls => cls.Id === selectedClass) ? { value: selectedClass, label: classes.find(cls => cls.Id === selectedClass)?.Name } : null}
                                                        onChange={(option) => setSelectedClass(option?.value ?? '')}
                                                        isDisabled={!selectedWard}
                                                        className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                                                        options={classes.map(cls => ({ value: cls.Id, label: cls.Name }))}
                                                        placeholder="Chọn lớp"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                            <div>
                                <div className="tw-flex tw-items-center tw-justify-between">
                                    <div className="tw-flex tw-items-center">
                                        <input
                                            id="remember_me"
                                            name="remember_me"
                                            type="checkbox"
                                            className="tw-h-4 tw-w-4 tw-text-indigo-600 tw-focus:ring-indigo-500 tw-border-gray-300 tw-rounded"
                                            checked={termCheck} // Use termCheck state here
                                            onChange={() => setTermCheck(!termCheck)} // Update state when checkbox is clicked
                                        />
                                        <label htmlFor="remember_me" className="tw-ml-2 tw-block tw-text-sm tw-text-gray-900">
                                            {t('signUp.agree')} <span className="tw-text-sky-500 tw-font-bold">{t('signUp.terms')}</span>
                                        </label>
                                    </div>

                                </div>
                                <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageTermCheck}</div>
                            </div>
                            <div>
                                <button
                                    onClick={handleRegister}
                                    type="submit"
                                    className="tw-group tw-relative tw-w-full tw-flex tw-justify-center tw-py-2 tw-px-4 tw-border tw-border-transparent tw-text-sm tw-font-medium tw-rounded-md tw-text-white tw-bg-sky-600 tw-hover:bg-indigo-700 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-offset-2 tw-focus:ring-indigo-500"
                                >
                                    {t("signUp.submit")}
                                </button>
                            </div>
                            <div className="tw-flex tw-items-center tw-justify-center tw-my-2">
                                <hr className="tw-flex-grow tw-border-gray-300 tw-mr-2" />
                                <div>{t("signUp.or")}</div>
                                <hr className="tw-flex-grow tw-border-gray-300 tw-ml-2" />
                            </div>
                            <div className="tw-flex tw-justify-center tw-gap-4">
                                <div className="tw-bg-white tw-rounded-full tw-p-1 tw-cursor-pointer">
                                    {/* <GoogleIcon className="tw-cursor-pointer tw-text-2xl tw-text-red-500" fontSize="large" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path> </svg>
                                </div>
                            </div>
                            <div className="tw-flex tw-justify-center tw-items-center">
                                {t("signUp.have_account")}&nbsp; <Link to={ROUTES.sign_in} replace={true} className="tw-text-sky-500 tw-cursor-pointer tw-font-bold">{t("signUp.login")}</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignUp
