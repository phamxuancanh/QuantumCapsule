/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: Profile
   ========================================================================== */
import React, { useEffect, useState, useRef, useCallback } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { updateUser, changeAVT, changePassword } from '../../api/user/user.api'
import { getFromLocalStorage, removeAllLocalStorage } from 'utils/functions'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from 'api/user/user.api'
import { logoutState } from '../../redux/auth/authSlice'
import { AppDispatch } from '../../redux/store'
import { fetchUser, loginState, selectUser, updateStateInfo } from '../../redux/auth/authSlice'
import AVTChangeModal from 'components/modals/changeAVTModal'
import ZoomModal from 'components/modals/zoomAVTModal'
import AvatarEditor from 'react-avatar-editor'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock'
import LinkIcon from '@mui/icons-material/Link'
import QrCodeIcon from '@mui/icons-material/QrCode'
import LogoutIcon from '@mui/icons-material/Logout'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { fetchLocations, City, District, Ward } from './locationData'
import * as yup from 'yup'
import ROUTES from 'routes/constant'
interface User {
  id: string
  firstName: string
  lastName: string
  gender: string
  age: string
  email: string
  username: string
  password?: string
  newPassword?: string
  currentPassword?: string
}

interface PayloadType {
  firstName: string
  lastName: string
  gender: string
  age: string
  email: string
  username: string
  password?: string
  newPassword?: string
  currentPassword?: string
}
function Profile() {
  const dispatch = useDispatch<AppDispatch>()
  const userRedux = useSelector(selectUser)
  useEffect(() => {
    if (userRedux?.id) {
      dispatch(fetchUser())
    }
  }, []);
  const [selectedSection, setSelectedSection] = useState(1)
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false)
  const { t } = useTranslation()
  const [choiceModalAVTOpen, setChoiceModalAVTOpen] = useState(false)
  const [zoomModalAVTOpen, setZoomModalAVTOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageSrc, setImageSrc] = useState('')
  const [zoom, setZoom] = useState(1)
  const [rotate, setRotate] = useState(0)
  const cropRef = useRef<AvatarEditor>(null)
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedWard, setSelectedWard] = useState<string>('')
  const [firstName, setFirstName] = useState<string>(userRedux?.firstName ?? '')
  const [lastName, setLastName] = useState<string>(userRedux?.lastName ?? '')
  const [dob, setDob] = useState<string>(userRedux?.dob ?? '');
  const [phone, setPhone] = useState<string>(userRedux?.phone ?? '')
  const [email, setEmail] = useState<string>(userRedux?.email ?? '')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errorMessageOldPassword, setErrorMessageOldPassword] = useState("")
  const [errorMessageNewPassword, setErrorMessagePassword] = useState("")
  const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState("")
  const [erroMessageFirstName, setErrorMessageFirstName] = useState('')
  const [errorMessageLastName, setErrorMessageLastName] = useState('')
  const [errorMessageEmail, setErrorMessageEmail] = useState('')
  const [errorMessagePhone, setErrorMessagePhone] = useState('')

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    setFirstName(userRedux?.firstName ?? '');
    setLastName(userRedux?.lastName ?? '');
    setDob(userRedux?.dob ? userRedux.dob.split('T')[0] : '');
    setPhone(userRedux?.phone ?? '');
    setEmail(userRedux?.email ?? '');
    if (!selectedCity && userRedux?.city) {
      setSelectedCity(userRedux.city);
    }
    if (!selectedDistrict && userRedux?.district) {
      setSelectedDistrict(userRedux.district);
    }
    if (!selectedWard && userRedux?.ward) {
      setSelectedWard(userRedux.ward);
    }
  }, [userRedux, selectedCity, selectedDistrict, selectedWard]);

  useEffect(() => {
    if (selectedCity) {
      const city = cities.find(city => city.Name === selectedCity);
      setDistricts(city?.Districts || []);

      if (userRedux?.city && userRedux.city !== selectedCity) {
        setSelectedDistrict('');
        setWards([]);
        setSelectedWard('');
      }
    } else {
      setDistricts([]);
    }
  }, [selectedCity, userRedux, cities]);

  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find(district => district.Name === selectedDistrict);
      setWards(district?.Wards || []);

      if (userRedux?.district && userRedux.district !== selectedDistrict) {
        setSelectedWard('');
      }
    } else {
      setWards([]);
    }
  }, [selectedDistrict, userRedux, districts]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLocations();
      setCities(data);
    };
    loadData();
  }, []);

  const navigate = useNavigate()



  const handleSectionSelect = (section: number) => {
    setSelectedSection(section);
  };

  const handleUploadClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (validTypes.includes(file.type)) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImageSrc(reader.result as string)
          setChoiceModalAVTOpen(false)
          setZoomModalAVTOpen(true)
        }
        reader.readAsDataURL(file)
        console.log('Selected file:', file)
      } else {
        toast.error('Invalid file type. Please select a JPG, JPEG, PNG, or GIF file.')
      }
    }
  }
  const handleInputZoomChange = (event: { target: { value: any } }) => {
    const zoomValue = event.target.value
    setZoom(zoomValue)
  }

  const handleInputRotateChange = (event: { target: { value: any } }) => {
    const rotateValue = event.target.value
    setRotate(rotateValue)
  }
  const handleSaveAVT = async () => {
    try {
      let dataUrl = userRedux?.avatar || '';
      if (cropRef.current) {
        const canvas = cropRef.current.getImage();
        dataUrl = canvas.toDataURL();
      }

      if (dataUrl) {
        const result = await fetch(dataUrl);
        const blob = await result.blob();
        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.png');
        let response = { status: 400 };
        if (userRedux?.id) {
          response = await changeAVT(userRedux.id, formData);
        }
        if (response.status === 200) {
          toast.success('Change AVT successfully');
          if (userRedux) {
            dispatch(updateStateInfo({
              ...userRedux,
              avatar: dataUrl
            }));
          }
          setImageSrc(userRedux?.avatar || '');
          setZoomModalAVTOpen(false);
          setZoom(1);
          setRotate(0);
        } else {
          console.log('Change AVT failed');
          toast.error('Change AVT failed');
        }
      } else {
        toast.error('No avatar available for saving');
      }
    } catch (error) {
      console.error('An error occurred while changing the avatar:', error);
      toast.error('An error occurred while changing the avatar');
    }
  };

  // validate
  const defaultObjCheckInput = {
    isValidFirstName: true,
    isValidLastName: true,
    isValidAge: true,
    isValidEmail: true,
    isValidGender: true,
    isValidPassword: true,
    isValidCurrentPassword: true
  }
  const handleOpenChangeAVTModal = useCallback(() => {
    setChoiceModalAVTOpen(true)
  }, [])

  const handleEditPersonalInfo = () => {
    setIsEditingPersonalInfo(!isEditingPersonalInfo);
  };

  const handleUpdatePersonalInfo = async () => {
    // Reset error messages
    setErrorMessageFirstName('');
    setErrorMessageLastName('');
    setErrorMessageEmail('');
    setErrorMessagePhone('');
  
    // Define error messages for validation
    const messageFirstName = 'Họ không được để trống';
    const messageLastName = 'Tên không được để trống';
    const messageEmail = 'Email không được để trống';
    const messagePhone = 'Số điện thoại không được để trống';
  
    // Define validation schema with yup
    const schema = yup.object({
      firstName: yup
        .string()
        .required(messageFirstName)
        .matches(/^[A-Z][a-zA-Z]*$/, 'Họ không hợp lệ'),
      lastName: yup
        .string()
        .required(messageLastName)
        .matches(/^[A-Z][a-zA-Z]*$/, 'Tên không hợp lệ'),
      email: yup
        .string()
        .email('Email không hợp lệ')
        .required(messageEmail),
      phone: yup
        .string()
        .required(messagePhone)
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
    });
  
    const payload = {
      firstName,
      lastName,
      dob,
      phone,
      email,
      city: selectedCity,
      district: selectedDistrict,
      ward: selectedWard,
    };
  
    try {
      // Validate the form before proceeding
      await schema.validate(payload, { abortEarly: false });
  
      // If the user ID is available, proceed with the update
      if (userRedux?.id) {
        const result = await updateUser(userRedux.id, payload);
        console.log(result);
  
        if (result) {
          // Update Redux state if the update is successful
          dispatch(updateStateInfo({
            ...userRedux,
            ...payload,
          }));
          toast.success('Cập nhật thông tin cá nhân thành công!');
        } else {
          toast.error('Cập nhật thông tin cá nhân thất bại!');
        }
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Handle validation errors
        error.inner.forEach((validationError) => {
          if (validationError.path === 'firstName') {
            setErrorMessageFirstName(validationError.message);
          } else if (validationError.path === 'lastName') {
            setErrorMessageLastName(validationError.message);
          } else if (validationError.path === 'email') {
            setErrorMessageEmail(validationError.message);
          } else if (validationError.path === 'phone') {
            setErrorMessagePhone(validationError.message);
          }
        });
      } else {
        // Handle general errors (e.g., API call errors)
        console.error(error);
        toast.error('Đã xảy ra lỗi khi cập nhật thông tin cá nhân!');
      }
    }
  };
  const handleCancelUpdatePersonalInfo = () => {
    setFirstName(userRedux?.firstName ?? '');
    setLastName(userRedux?.lastName ?? '');
    setDob(userRedux?.dob ?? '');
    setPhone(userRedux?.phone ?? '');
    setEmail(userRedux?.email ?? '');
    setSelectedCity(userRedux?.city ?? '');
    setSelectedDistrict(userRedux?.district ?? '');
    setSelectedWard(userRedux?.ward ?? '');
  }
  
  const handleChangePassword = async () => {
    setErrorMessageOldPassword('');
    setErrorMessagePassword('');
    setErrorMessageConfirmPassword('');
  
    const messageOldPassword = 'Mật khẩu cũ không được để trống';
    const messageNewPassword = 'Mật khẩu mới không được để trống';
    const messageConfirmPassword = 'Nhập lại mật khẩu mới không được để trống';
  
    const schema = yup.object({
      oldPassword: yup
        .string()
        .required(messageOldPassword)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Mật khẩu không hợp lệ'
        ),
      newPassword: yup
        .string()
        .required(messageNewPassword)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Mật khẩu không hợp lệ'
        ),
      confirmPassword: yup
        .string()
        .required(messageConfirmPassword)
        .oneOf([yup.ref('newPassword')], 'Mật khẩu mới phải trùng khớp'),
    });
  
    try {
      // Validate the form before proceeding
      await schema.validate({ oldPassword, newPassword, confirmPassword }, { abortEarly: false });
  
      // Proceed only if validation is successful
      if (userRedux?.id) {
        const result = await changePassword(userRedux.id, {
          oldPassword,
          newPassword
        });
  
        console.log(result, 'result');
  
        if (result.data.success) {
          toast.success('Đổi mật khẩu thành công!');
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          toast.error(result.data.message || 'Đổi mật khẩu thất bại!');
        }
      }
    } catch (error) {
      // Handle both validation and general errors in this single catch block
      if (error instanceof yup.ValidationError) {
        // Handle validation errors
        error.inner.forEach((validationError) => {
          if (validationError.path === 'oldPassword') {
            setErrorMessageOldPassword(validationError.message);
          } else if (validationError.path === 'newPassword') {
            setErrorMessagePassword(validationError.message);
          } else if (validationError.path === 'confirmPassword') {
            setErrorMessageConfirmPassword(validationError.message);
          }
        });
      } else {
        // Handle general errors (e.g., API call errors)
        console.error(error);
        toast.error((error as Error)?.message || 'Đã xảy ra lỗi khi đổi mật khẩu!');
      }
    }
  };
  
  
  
  const handleCancelChangePassword = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }
  const handleLogout = useCallback(async () => {
    try {
      const response = await signOut()
      if (response) {
        dispatch(logoutState())
        removeAllLocalStorage()
        navigate(ROUTES.sign_in)
        toast.success(t('homepage.logout_success'))
      }
    } catch (error) {
      console.error(error)
    }
  }, [dispatch, navigate])
  return (
    <div className="tw-text-lg tw-flex tw-justify-center">
      <div className='tw-w-10/12 tw-flex tw-space-x-4 tw-mt-5 tw-mb-5'>
        {/* <div className="tw-w-3/12 tw-p-4 tw-border tw-border-gray-300 tw-rounded-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-white tw-space-y-2"> */}
        <div className="tw-w-3/12 tw-p-4 tw-border tw-border-gray-300 tw-border-b-4 tw-border-b-green-500 tw-rounded-md tw-rounded-b-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-white tw-space-y-2 tw-shadow-2xl">
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-b-2 tw-p-4'>
            <div className='tw-rounded-full tw-border-4 tw-border-green-400 tw-overflow-hidden tw-w-20 tw-h-20 sm:tw-w-28 sm:tw-h-28 md:tw-w-32 md:tw-h-32 lg:tw-w-20 lg:tw-h-20 tw-flex-shrink-0'>
              <img className="tw-w-full tw-h-full tw-object-cover tw-cursor-pointer" src={userRedux?.avatar} alt="User upload" />
            </div>
            <div className="tw-text-center">{userRedux?.firstName} {userRedux?.lastName}</div>
            <div className='tw-text-slate-600'>{t('profile.grade')} {userRedux?.grade}</div>
            <div className='tw-bg-green-200 tw-text-green-500 tw-p-2 tw-cursor-pointer tw-font-bold tw-rounded-lg' onClick={handleOpenChangeAVTModal}>{t('profile.updateAVT')}</div>
          </div>
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-2'>
            <div className='tw-font-bold tw-text-lg'>{t('profile.personal_info')}</div>
            <div className='tw-text-slate-600 tw-text-sm tw-pl-2'>{t('profile.description')}</div>

            {/* Mục sidebar */}
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1' onClick={() => handleSectionSelect(1)}>
              <AccountCircleIcon className='tw-mr-2' />
              {t('profile.personal_info')}
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(2)}>
              <LockIcon className='tw-mr-2' />
              {t('profile.password_security')}
            </div>
            {/* <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1' onClick={() => handleSectionSelect(3)}>
              <SchoolIcon className='tw-mr-2' />
              Khoa hoc cua ban
            </div> */}
            {/* <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(5)}>
              <LinkIcon className='tw-mr-2' />
              Lien ket tai khoan
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(6)}>
              <QrCodeIcon className='tw-mr-2' />
              Nhap ma kich hoat
            </div> */}
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleLogout()}>
              <LogoutIcon className='tw-mr-2' />
              {t('profile.logout')}
            </div>
          </div>
        </div>
        <div className="tw-w-9/12 tw-p-4 tw-border tw-border-gray-300 tw-rounded-md tw-flex tw-bg-white tw-shadow-2xl">
          {/* THONG TIN CA NHAN */}
          {selectedSection === 1 && (
            !isEditingPersonalInfo ? (
              <div className='tw-w-full tw-space-y-4'>
                <div className='tw-mx-5'>
                  <div className='tw-flex'>
                    <div className='tw-flex-1 tw-font-bold tw-text-green-500 tw-text-xl'>{t('profile.personal_info')}</div>
                    <div className='tw-flex-1 tw-flex tw-justify-end'>
                      <div
                        className='tw-border tw-rounded-3xl tw-px-8 tw-py-2 tw-flex tw-items-center tw-cursor-pointer'
                        onClick={handleEditPersonalInfo}
                      >
                        <EditIcon className='tw-mr-2' />
                        {t('profile.update')}
                      </div>
                    </div>
                  </div>
                  <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div className="tw-p-4 tw-space-y-2">
                      <div>
                        <div className='tw-text-gray-500 tw-text-sm'>{t('profile.first_name')}:</div>
                        <div className='tw-font-bold text-text-sm'>{userRedux?.firstName}</div>
                      </div>
                      <div>
                        <div className='tw-text-gray-500 tw-text-sm'>{t('profile.last_name')}:</div>
                        <div className='tw-font-bold text-text-sm'>{userRedux?.lastName}</div>
                      </div>
                      {/* <div>
                        <div className='tw-text-gray-500 tw-text-sm'>Loại tài khoản:</div>
                        <div className='tw-font-bold text-text-sm'>Pxc</div>
                      </div> */}
                      <div>
                        <div className='tw-text-gray-500 tw-text-sm'>{t('profile.grade')}:</div>
                        <div className='tw-font-bold text-text-sm'>{userRedux?.grade}</div>
                      </div>
                    </div>
                    <div className="tw-p-4 tw-space-y-2">
                      <div>
                        <div className='tw-text-gray-500 tw-text-sm'>{t('profile.birthday')}:</div>
                        <div className='tw-font-bold text-text-sm'>
                          {userRedux?.dob ?? 'Chưa cập nhật'}
                        </div>
                      </div>
                      <div>
                        <div className='tw-text-gray-500 tw-text-sm'>{t('profile.phone')}:</div>
                        <div className='tw-font-bold text-text-sm'>
                          {userRedux?.phone ?? 'Chưa cập nhật'}
                        </div>
                      </div>
                      <div>
                        <div className='tw-text-gray-500 tw-text-sm'>{t('profile.email')}:</div>
                        <div className='tw-font-bold text-text-sm'>{userRedux?.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className='tw-space-y-4 -tw-mt-2'>
                    <div className='tw-px-4'>
                      <div className='tw-text-gray-500 tw-text-sm'>{t('profile.ward_commune')}:</div>
                      <div className='tw-font-bold text-text-sm'>{userRedux?.ward}</div>
                    </div>
                    <div className='tw-px-4'>
                      <div className='tw-text-gray-500 tw-text-sm'>{t('profile.district')}:</div>
                      <div className='tw-font-bold text-text-sm'>{userRedux?.district}</div>
                    </div>
                    <div className='tw-px-4'>
                      <div className='tw-text-gray-500 tw-text-sm'>{t('profile.city_province')}:</div>
                      <div className='tw-font-bold text-text-sm'>{userRedux?.city}</div>
                    </div>
                  </div>
                </div>
                <div className='tw-bg-blue-200 tw-mx-5 tw-p-2 tw-rounded-lg'>
                  <div className='tw-font-bold'>{t('profile.note')}:</div>
                  <div>{t('profile.note_content')}</div>
                </div>
              </div>
            ) : (
              <div className='tw-w-full tw-space-y-4'>
                <div className='tw-mx-5 tw-space-y-3'>
                  <div className='tw-flex'>
                    <div className='tw-font-bold tw-text-green-500 tw-text-base tw-cursor-pointer' onClick={handleEditPersonalInfo}>
                      <ArrowBackIcon className='tw-mr-2' />{t('profile.back')}
                    </div>
                  </div>
                  <div className='tw-flex tw-justify-center tw-font-bold tw-text-2xl'>{t('profile.update_info_title')}</div>
                  <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div className="tw-p-4 tw-space-y-2">
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.first_name')}:</div>
                        <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                          <input
                            id="firstname"
                            name="firstname"
                            type="text"
                            autoComplete="firstname"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                            placeholder='Họ'
                          />
                          <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                        </div>
                        <div className="tw-text-red-500 tw-text-sm tw-p-2">{erroMessageFirstName}</div>

                      </div>
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.city_province')}:</div>
                        <Select
                          id="city"
                          className="tw-shadow-sm tw-border-sky-500 tw-rounded-2xl"
                          options={cities.map(city => ({ value: city.Name, label: city.Name }))}
                          value={cities.find(city => city.Name === selectedCity) ? { value: selectedCity, label: selectedCity } : null}
                          onChange={(option) => setSelectedCity(option?.value ?? '')}
                          placeholder={`${t('profile.select')} ${t('profile.city_province')}`}
                        />
                      </div>
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.district')}:</div>
                        <Select
                          id="district"
                          className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                          value={districts.find(district => district.Name === selectedDistrict) ? { value: selectedDistrict, label: selectedDistrict } : null}
                          onChange={(option) => setSelectedDistrict(option?.value ?? '')}
                          isDisabled={!selectedCity}
                          options={districts.map(district => ({ value: district.Name, label: district.Name }))}
                          placeholder={`${t('profile.select')} ${t('profile.district')}`}
                        />
                      </div>
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.ward_commune')}:</div>
                        <Select
                          id="ward"
                          value={wards.find(ward => ward.Name === selectedWard) ? { value: selectedWard, label: selectedWard } : null}
                          onChange={(option) => setSelectedWard(option?.value ?? '')}
                          isDisabled={!selectedDistrict}
                          className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                          options={wards.map(ward => ({ value: ward.Name, label: ward.Name }))}
                          placeholder={`${t('profile.select')} ${t('profile.ward_commune')}`}
                        />
                      </div>


                    </div>
                    <div className="tw-p-4 tw-space-y-2">
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.last_name')}:</div>
                        <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                          <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            autoComplete="current-password"
                            required
                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                            placeholder='Tên'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                        </div>
                        <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageLastName}</div>

                      </div>
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.email')}:</div>
                        <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                          <input
                            id="email"
                            name="email"
                            type="text"
                            required
                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                        </div>
                        <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageEmail}</div>

                      </div>
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.birthday')}:</div>
                        <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                          <input
                            id="dob"
                            name="dob"
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <div className='tw-font-bold tw-text-sm'>{t('profile.phone')}:</div>
                        <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            required
                            className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                            placeholder={t('profile.ward_commune')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                        </div>
                        <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessagePhone}</div>

                        </div>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-2 tw-gap-8">
                      <div className='tw-flex tw-justify-end tw-items-center'>
                        <div className='tw-bg-green-500 tw-border-green-500 tw-text-white tw-font-bold tw-px-3 tw-py-2 tw-rounded-3xl tw-cursor-pointer' onClick={handleUpdatePersonalInfo}>
                          {t('profile.update_info')}
                        </div>
                      </div>
                      <div className='tw-flex tw-justify-start tw-items-center tw-cursor-pointer'>
                        <div className='tw-bg-white tw-border-gray-500 tw-border tw-rounded-3xl tw-px-3 tw-py-2' onClick={handleCancelUpdatePersonalInfo}>
                          {t('profile.cancel')}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* MAT KHAU VA BAO MAT */}
          {selectedSection === 2 &&
            <div className='tw-w-full'>
              <div className='tw-ml-5'>
                <div className='tw-font-bold tw-text-green-500 tw-text-xl'>{t('profile.password_security')}</div>
                <div className='tw-text-slate-500 tw-text-sm'>{t('profile.password_management')}</div>
                <div className='tw-font-bold tw-pl-5 tw-text-lg'>{t('profile.change_password')}</div>
                <div className='tw-text-slate-500 tw-text-sm tw-pl-5'>{t('profile.last_change')}:</div>
                <div className='tw-pl-5 tw-py-3 tw-space-y-3 tw-w-3/5'>
                  <div className='tw-space-y-1'>
                    <div className='tw-font-bold'>{t('profile.old_password')}:</div>
                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                      <input
                        id="oldpass"
                        name="oldpass"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                        placeholder={t('profile.old_password')}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                    </div>
                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageOldPassword}</div>
                  </div>
                  <div className='tw-space-y-1'>
                    <div className='tw-font-bold'>{t('profile.new_password')}:</div>
                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                        placeholder={t('profile.new_password')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                    </div>
                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageNewPassword}</div>

                  </div>
                  <div className='tw-space-y-1'>
                    <div className='tw-font-bold'>{t('profile.confirm_password')}:</div>
                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                        placeholder={t('profile.confirm_password')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />

                    </div>
                    <div className="tw-text-red-500 tw-text-sm tw-p-2">{errorMessageConfirmPassword}</div>
                  </div>
                  <div className='tw-flex tw-space-x-8 tw-pr-8'>
                    <div className='tw-cursor-pointer tw-flex-1 tw-p-2 tw-rounded-3xl tw-border tw-border-green-500 tw-font-bold tw-bg-green-500 tw-flex tw-justify-center tw-items-center tw-text-white' onClick={handleChangePassword}>
                    {t('profile.change_password')}
                    </div>
                    <div className='tw-cursor-pointer tw-flex-1 tw-p-2 tw-rounded-3xl tw-border tw-border-gray-500 tw-bg-white tw-flex tw-justify-center tw-items-center' onClick={handleCancelChangePassword}>
                    {t('profile.cancel')}
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {/* KHOA HOC CUA BAN */}
          {selectedSection === 3 && <div>Khóa học của bạn</div>}
          {/* TAO TAI KHOAN CHO CON */}
          {selectedSection === 4 && <div>Tạo tài khoản cho con</div>}
          {/* LIEN KET TAI KHOAN */}
          {selectedSection === 5 && <div>Liên kết tài khoản</div>}
          {/* NHAP MA KICH HOAT */}
          {selectedSection === 6 && <div>Nhập mã kích hoạt</div>}
          {/* DANG XUAT */}
        </div>
      </div>
      <AVTChangeModal
        title={t('profile.selectAnImage')}
        modalOpen={choiceModalAVTOpen}
        setModalOpen={setChoiceModalAVTOpen}
      >
        <div className='tw-flex tw-space-x-3'>
          <div className='tw-bg-teal-300 tw-w-full tw-rounded-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-5 tw-space-y-3' onClick={handleUploadClick}>
            <div className='tw-rounded-full tw-bg-sky-700 tw-w-32 tw-h-32 tw-flex tw-items-center tw-justify-center tw-cursor-pointer'>
              <AddPhotoAlternateIcon className='tw-text-slate-300 tw-cursor-pointer' fontSize='large' />
            </div>
            <div className='tw-font-bold hover:tw-text-gray-700 tw-cursor-pointer'>{t('profile.uploadImage')}</div>
          </div>
          <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept='.jpg,.jpeg,.png,.gif'
            onChange={handleFileChange}
          />
        </div>
      </AVTChangeModal>
      <ZoomModal
        title={t('profile.editIMG')}
        modalOpen={zoomModalAVTOpen}
        setModalOpen={setZoomModalAVTOpen}
      >
        <>
          <AvatarEditor
            ref={cropRef}
            className="tw-col-span-9 tw-mx-auto tw-mb-5 tw-rounded-sm"
            image={imageSrc}
            width={320}
            height={320}
            border={50}
            borderRadius={250}
            scale={zoom}
            rotate={rotate}
          />
          <label className="tw-col-span-2 tw-text-sm tw-font-semibold tw-text-dark-2">
            {t('profile.zoom')}
          </label>
          <input
            type="range"
            className="tw-col-span-5 tw-transparent tw-h-[4px] tw-w-full tw-cursor-pointer tw-appearance-none tw-border-transparent tw-bg-neutral-200 dark:tw-bg-neutral-600 tw-mt-2"
            id="customRange1"
            min={0}
            max={2}
            step={0.05}
            value={zoom}
            onChange={handleInputZoomChange}
          />
          <input
            type="number"
            className="tw-bg-dark-2 tw-text-dark-2 tw-col-span-2 tw-py-1.5 tw-rounded-md tw-text-sm tw-font-semibold tw-text-center"
            min={0}
            max={2}
            step={0.05}
            value={zoom}
            onChange={handleInputZoomChange}
          />
          <div></div>
          <label className="tw-col-span-2 tw-text-sm tw-font-semibold tw-text-dark-2">
            {t('profile.rotate')}
          </label>
          <input
            type="range"
            className="tw-col-span-5 tw-transparent tw-h-[4px] tw-w-full tw-cursor-pointer tw-appearance-none tw-border-transparent tw-bg-neutral-200 dark:tw-bg-neutral-600 tw-mt-2"
            id="customRange1"
            min={-180}
            max={180}
            value={rotate}
            step={1}
            onChange={handleInputRotateChange}
          />
          <input
            type="number"
            className="tw-bg-dark-2 tw-text-dark-2 tw-col-span-2 tw-py-1.5 tw-rounded-md tw-text-sm tw-font-semibold tw-text-center"
            min={-180}
            max={180}
            step={1}
            value={rotate}
            onChange={handleInputRotateChange}
          />
        </>
        <div className='tw-flex tw-justify-between tw-m-3 tw-font-bold'>
          <div className='tw-cursor-pointer hover:tw-text-gray-700 hover:tw-underline tw-py-1' onClick={() => setZoomModalAVTOpen(false)}>{t('profile.skip')}</div>
          <div className='tw-flex tw-space-x-4'>
            <div className='tw-cursor-pointer hover:tw-text-gray-700 hover:tw-underline tw-py-1' onClick={() => setZoomModalAVTOpen(false)}>{t('profile.cancel')}</div>
            <div className='tw-cursor-pointer hover:tw-text-gray-700 tw-bg-teal-300 hover:tw-bg-teal-500 tw-rounded-md tw-px-3 tw-py-1' onClick={handleSaveAVT}>{t('profile.save')}</div>
          </div>
        </div>
      </ZoomModal>
    </div>
  )
}

export default Profile
