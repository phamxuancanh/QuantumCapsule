import React, { useCallback, useMemo, useState, useEffect } from "react"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { signUp, googleSignIn, facebookSignIn } from "api/user/api"
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
import ReCAPTCHA from "react-google-recaptcha"
import PeopleIcon from '@mui/icons-material/People'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import SchoolIcon from '@mui/icons-material/School'
import { fetchLocations, City, District, Ward } from './locationData'
const theme = createTheme()

const SignUp = () => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [termCheck, setTermCheck] = useState(false)
    const [errorMessageFirstName, setErrorMessageFirstName] = useState("")
    const [errorMessageLastName, setErrorMessageLastName] = useState("")
    const [errorMessageUsername, setErrorMessageUsername] = useState("")
    const [errorMessageEmail, setErrorMessageEmail] = useState("")
    const [errorMessagePassword, setErrorMessagePassword] = useState("")
    const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState("")
    const [errorMessageTermCheck, setErrorMessageTermCheck] = useState("")
    const { t, i18n } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const [loading, setLoading] = useState(false)
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [showCaptcha, setShowCaptcha] = useState(false);
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
    const [classes, setClasses] = useState([
        { Id: '1', Name: 'Khối 1' },
        { Id: '2', Name: 'Khối 2' },
        { Id: '3', Name: 'Khối 3' },
        { Id: '4', Name: 'Khối 4' },
        { Id: '5', Name: 'Khối 5' },
        { Id: '6', Name: 'Khối 6' },
        { Id: '7', Name: 'Khối 7' },
        { Id: '8', Name: 'Khối 8' },
        { Id: '9', Name: 'Khối 9' },
        { Id: '10', Name: 'Khối 10' },
        { Id: '11', Name: 'Khối 11' },
        { Id: '12', Name: 'Khối 12' }
    ])
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchLocations();
            setCities(data);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            const city = cities.find(city => city.Id === selectedCity);
            setDistricts(city?.Districts || []);
            setSelectedDistrict(''); // Reset district selection
            setWards([]); // Clear wards
            setSelectedWard(''); // Reset ward selection
        } else {
            setDistricts([]);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedDistrict) {
            const district = districts.find(district => district.Id === selectedDistrict);
            setWards(district?.Wards || []);
            setSelectedWard('');
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    // Update classes when a ward is selected
    useEffect(() => {
        if (selectedWard) {
            const ward = wards.find(ward => ward.Id === selectedWard);
        } else {
        }
    }, [selectedWard]);
    const handleAccountTypeChange = (type: any) => {
        setTypeAccount(type);
    }
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
    const handleCaptchaChange = (value: React.SetStateAction<string | null>) => {
        setErrorMessageCaptcha('');
        setCaptchaValue(value);
    };
    // const handleEmailBlur = () => {
    //     if (email) {
    //         setShowCaptcha(true);
    //     }
    // };
    async function handleRegister(e: { preventDefault: () => void; }) {
        setShowCaptcha(true);
        e.preventDefault();
        // Clear previous error messages
        setErrorMessageFirstName('')
        setErrorMessageLastName('')
        setErrorMessageUsername('')
        setErrorMessageEmail('')
        setErrorMessagePassword('')
        setErrorMessageConfirmPassword('')
        setErrorMessageTermCheck('')
        setErrorMessageCaptcha('')

        const messFirstName = t('signUp.first_name_required');
        const messLastName = t('signUp.last_name_required');
        const messUsername = t('signUp.user_name_required');
        const messEmail = t('signUp.email_required');
        const messPassword = t('signUp.password_required');
        const messConfirm = t('signUp.confirm_password_required');
        const messTermCheckBox = t('signUp.term_required');

        const schema = yup.object({
            firstName: yup
                .string()
                .required(messFirstName)
                .matches(/^[A-Z][a-zA-Z]*$/, t('signUp.first_name_invalid')),
            lastName: yup
                .string()
                .required(messLastName)
                .matches(/^[A-Z][a-zA-Z]*$/, t('signUp.last_name_invalid')),
            email: yup
                .string()
                .email(t('signUp.email_invalid'))
                .required(messEmail),
            username: yup
                .string()
                .required(messUsername)
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, t('signUp.username_invalid')),
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
            await schema.validate({ firstName, lastName, username, email, password, confirm_password: confirmPassword, termCheck }, { abortEarly: false })
            setLoading(true);
            const result = await signUp({ firstName, lastName, username, email, password, captchaValue })
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
                setErrorMessageUsername('');
                setErrorMessageEmail('');
                setErrorMessagePassword('');
                setErrorMessageConfirmPassword('');
                setErrorMessageTermCheck('');
                setErrorMessageCaptcha('')

                // Iterate over the errorOrder array and set errors in that order
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
                                case 'username':
                                    setErrorMessageUsername(err.message);
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
                                if (message.includes('Username')) {
                                    setErrorMessageUsername(message);
                                } else if (message.includes('Email')) {
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
            <div className="lg:tw-w-2/5 tw-shadow-2xl tw-shadow-black tw-w-full lg:tw-block tw-hidden tw-bg-black">
                <img src={loginImage} alt="loginImg" className="tw-h-screen" />
            </div>
            <div className="tw-flex lg:tw-relative lg:tw-w-3/5 tw-w-full tw-items-center tw-justify-between">
                <img src={loginImage} alt="loginImg" className="tw-absolute tw-h-full tw-w-full lg:tw-hidden tw-hidden sm:tw-block" />
                <div className="tw-flex tw-z-20 tw-items-center tw-justify-center lg:tw-h-full sm:tw-h-screen tw-min-h-screen lg:tw-w-full tw-w-full">
                    <div className="tw-w-4/5 lg:tw-w-3/5 tw-bg-gray-200 tw-bg-opacity-25 tw-rounded-3xl tw-p-5">
                        <div className="tw-text-sky-500 tw-font-bold tw-text-2xl tw-text-center">{t('signUp.title')}</div>
                        <form className="tw-mt-8 tw-space-y-6" action="#" method="POST" onSubmit={handleRegister}>
                            <select className="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-font-bold tw-text-gray-700  tw-border tw-border-gray-300 tw-focus:border-indigo-500 tw-focus:outline-none tw-shadow" onChange={handleChange}>
                                {languageOptions.map((option, index) => (
                                    <option key={index} value={option.value} className='tw-font-bold tw-py-2'>
                                        {option.flag}&nbsp;&nbsp;&nbsp;{option.label}&nbsp;&nbsp;{option.value === selectedLanguage && '✔'}
                                    </option>
                                ))}
                            </select>
                            <div className="tw-w-full tw-text-center tw-font-bold tw-text-neutral-800">Hay chon loai tai khoan phu hop voi ban</div>
                            <div className="tw-flex tw-w-full">
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
                            </div>
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
                                            name="userName"
                                            type="userName"
                                            autoComplete="userName"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder={t('signUp.user_name')}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <AccountCircleOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageUsername}</div>

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
                                <div>
                                    <div className="tw-relative tw-border-2 tw-border-sky-500 tw-rounded-2xl">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="phone"
                                            autoComplete="phone"
                                            required
                                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                                            placeholder={t('signUp.phone')}
                                            value={email}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                        <LocalPhoneOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                                    </div>
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageEmail}</div>
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
                                {typeAccount === 'student' && (
                                    <div>
                                        <div className="tw-space-y-3 tw-font-bold">Noi hoc tap</div>
                                        <div className="tw-space-y-4 tw-mt-2">
                                            <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                                                {/* Selector for City */}
                                                <div className="tw-flex tw-flex-col">
                                                    <Select
                                                        id="city"
                                                        className="tw-shadow-sm tw-border-sky-500 tw-rounded-2xl"
                                                        options={cities.map(city => ({ value: city.Id, label: city.Name }))}
                                                        value={cities.find(city => city.Id === selectedCity) ? { value: selectedCity, label: cities.find(city => city.Id === selectedCity)?.Name } : null}
                                                        onChange={(option) => setSelectedCity(option?.value ?? '')}
                                                        placeholder="Chọn thành phố"
                                                    />
                                                </div>

                                                {/* Selector for District */}
                                                <div className="tw-flex tw-flex-col">
                                                    <Select
                                                        id="district"
                                                        value={districts.find(district => district.Id === selectedDistrict) ? { value: selectedDistrict, label: districts.find(district => district.Id === selectedDistrict)?.Name } : null}
                                                        onChange={(option) => setSelectedDistrict(option?.value ?? '')}
                                                        isDisabled={!selectedCity}
                                                        className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                                                        options={districts.map(district => ({ value: district.Id, label: district.Name }))}
                                                        placeholder="Chọn quận/huyện"
                                                    />
                                                </div>
                                            </div>

                                            <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                                                {/* Selector for Ward */}
                                                <div className="tw-flex tw-flex-col">
                                                    <Select
                                                        id="ward"
                                                        value={wards.find(ward => ward.Id === selectedWard) ? { value: selectedWard, label: wards.find(ward => ward.Id === selectedWard)?.Name } : null}
                                                        onChange={(option) => setSelectedWard(option?.value ?? '')}
                                                        isDisabled={!selectedDistrict}
                                                        className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                                                        options={wards.map(ward => ({ value: ward.Id, label: ward.Name }))}
                                                        placeholder="Chọn phường/xã"
                                                    />
                                                </div>

                                                {/* Selector for Class */}
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
                                )}
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
                                {showCaptcha && (
                                    <ReCAPTCHA
                                        sitekey={keySite ?? ''}
                                        // sitekey='6LdynQEqAAAAAEj_i6vqYyZUNA54yn-oRIdC00Vy'
                                        onChange={handleCaptchaChange}
                                    />
                                )}
                                {(errorMessageCaptcha && showCaptcha) && (
                                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageCaptcha}</div>
                                )}
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
                                <div className="tw-bg-white tw-rounded-full tw-p-1 tw-cursor-pointer">
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
