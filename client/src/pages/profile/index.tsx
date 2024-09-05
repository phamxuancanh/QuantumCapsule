/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: Profile
   ========================================================================== */
import React, { useEffect, useState, useRef, useCallback } from 'react'
import ImageCover from '../../assets/tt.jpg'
import { findUserById, updateUser, changeAVT } from '../../api/user/api'
import { getFromLocalStorage } from 'utils/functions'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { fetchUser, selectUser, updateStateInfo } from '../../redux/auth/authSlice'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
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
  const [selectedSection, setSelectedSection] = useState(1)
  const { t } = useTranslation()
  const [choiceModalAVTOpen, setChoiceModalAVTOpen] = useState(false)
  const [zoomModalAVTOpen, setZoomModalAVTOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageSrc, setImageSrc] = useState('')
  const [zoom, setZoom] = useState(1)
  const [rotate, setRotate] = useState(0)
  const cropRef = useRef<AvatarEditor>(null)
  const [user, setUser] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    email: '',
    username: '',
    password: '',
    newPassword: '',
    currentPassword: ''
  })
  const handleSectionSelect = (section: number) => {
    setSelectedSection(section);
  };
  const dispatch = useDispatch<AppDispatch>()
  const userRedux = useSelector(selectUser)

  console.log(userRedux, 'userRedux');
  useEffect(() => {
    const storedUser = localStorage.getItem('persist:auth')
    if (storedUser) {
      const user = JSON.parse(storedUser).currentUser;
      console.log(user, 'user');
      dispatch(fetchUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (userRedux?.id) {
      dispatch(fetchUser())
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false)
  const handleUploadClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleEditClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setChoiceModalAVTOpen(false);
    setImageSrc(userRedux?.avatar || '');
    setZoomModalAVTOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = userRedux?.avatar || ''; // Cập nhật giá trị của input file với userRedux.img
    }
  };
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

  const handleEditProfile = () => {
    setIsEditing(true)
  }
  const handleCancelEdit = () => {
    setIsEditing(false)
    //    setUser(originalUser)
    setObjCheckInput({ ...defaultObjCheckInput })
    setIsSettingNewPassword(false)
  }
  const handleCancelSet = () => {
    setObjCheckInput({ ...defaultObjCheckInput })
    setIsSettingNewPassword(false)
    setUser(prevUser => ({ ...prevUser, newPassword: '', currentPassword: '' }))
  }

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
  const [objCheckInput, setObjCheckInput] = useState(defaultObjCheckInput)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const genderRef = useRef<HTMLSelectElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const currentPasswordRef = useRef<HTMLInputElement>(null)

  const [errorField, setErrorField] = useState<string>('')
  const handleOpenChangeAVTModal = useCallback(() => {
    setChoiceModalAVTOpen(true)
  }, [])
  const isValidInputs = () => {
    setObjCheckInput(defaultObjCheckInput)
    if (user.firstName === '' || user.firstName === null) {
      toast.error('FirstName is required')
      setObjCheckInput({ ...defaultObjCheckInput, isValidFirstName: false })
      if (firstNameRef.current) {
        firstNameRef.current.focus()
      }
      return false
    }
    const regxFirstName = /^[a-zA-Z\u00C0-\u017F\u1E00-\u1EFF\s]*$/
    if (!regxFirstName.test(user.firstName)) {
      toast.error('FirstName must be a string')
      setObjCheckInput({ ...defaultObjCheckInput, isValidFirstName: false })
      if (firstNameRef.current) {
        firstNameRef.current.focus()
      }
      return false
    }
    const regxLastName = /^[a-zA-Z\u00C0-\u017F\u1E00-\u1EFF\s]*$/
    if (!regxLastName.test(user.lastName)) {
      toast.error('LastName must be a string')
      setObjCheckInput({ ...defaultObjCheckInput, isValidLastName: false })
      if (lastNameRef.current) {
        lastNameRef.current.focus()
      }
      return false
    }
    if (user.lastName === '' || user.lastName === null) {
      toast.error('LastName is required')
      setObjCheckInput({ ...defaultObjCheckInput, isValidLastName: false })
      if (lastNameRef.current) {
        lastNameRef.current.focus()
      }
      return false
    }
    if (user.gender === '' || user.gender === null) {
      toast.error('Gender is required')
      setObjCheckInput({ ...defaultObjCheckInput, isValidGender: false })
      if (genderRef.current) {
        genderRef.current.focus()
      }
      return false
    }
    if (user.age === '' || user.age === null) {
      toast.error('Age is required')
      setObjCheckInput({ ...defaultObjCheckInput, isValidAge: false })
      if (ageRef.current) {
        ageRef.current.focus()
      }
      return false
    }
    if (isNaN(Number(user.age))) {
      toast.error('Age must be a number')
      setObjCheckInput({ ...defaultObjCheckInput, isValidAge: false })
      if (ageRef.current) {
        ageRef.current.focus()
      }
      return false
    }
    if (Number(user.age) > 150) {
      toast.error('Invalid age')
      setObjCheckInput({ ...defaultObjCheckInput, isValidAge: false })
      if (ageRef.current) {
        ageRef.current.focus()
      }
      return false
    }
    const regxs = /^[0-9]*$/
    if (!regxs.test(user.age)) {
      toast.error('Age must be a positive integer')
      setObjCheckInput({ ...defaultObjCheckInput, isValidAge: false })
      if (ageRef.current) {
        ageRef.current.focus()
      }
      return false
    }
    if (user.email === '' || user.email === null) {
      toast.error('Email is required')
      setObjCheckInput({ ...defaultObjCheckInput, isValidEmail: false })
      if (emailRef.current) {
        emailRef.current.focus()
      }
      return false
    }
    const regx = /\S+@\S+\.\S+/
    if (!regx.test(user.email)) {
      toast.error('Email is invalid')
      setObjCheckInput({ ...defaultObjCheckInput, isValidEmail: false })
      if (emailRef.current) {
        emailRef.current.focus()
      }
      return false
    }
    const regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (user.newPassword && !regxPassword.test(user.newPassword)) {
      toast.error('Password at least 8 characters')
      setObjCheckInput({ ...defaultObjCheckInput, isValidPassword: false })
      if (passwordRef.current) {
        passwordRef.current.focus()
      }
      return false
    }
    if (isSettingNewPassword && (user.currentPassword === '' || user.currentPassword === null || user.currentPassword === undefined)) {
      toast.error('Current password is required')
      setObjCheckInput({ ...defaultObjCheckInput, isValidCurrentPassword: false })
      if (currentPasswordRef.current) {
        currentPasswordRef.current.focus()
      }
      return false
    }
    if (isSettingNewPassword && (user.newPassword === '' || user.newPassword === null || user.newPassword === undefined)) {
      toast.error('New password is required')
      setObjCheckInput({ ...defaultObjCheckInput, isValidPassword: false })
      if (passwordRef.current) {
        passwordRef.current.focus()
      }
      return false
    }
    return true
  }

  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false)

  const handleSetNewPasswordClick = () => {
    setIsSettingNewPassword(true)
  }

  const handleSaveChanges = async () => {
    try {
      if (isValidInputs()) {
        const { id, newPassword, password, ...payload } = user
        let finalPayload: PayloadType = payload
        if (newPassword) {
          finalPayload = { ...payload, password: newPassword }
        }
        if (userRedux?.id) {
          const response = await updateUser(userRedux?.id, finalPayload)
          if (response.status === 200) {
            toast.success('Update successfully')
            setIsEditing(false)
            setIsSettingNewPassword(false)
            dispatch(updateStateInfo({ ...userRedux, ...payload }))
            window.dispatchEvent(new Event('storage'))
          } else {
            toast.error('Update failed')
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message)
      if (error.field) {
        setErrorField(error.field)
        if (error.field === 'currentPassword') {
          currentPasswordRef.current?.focus()
        }
      }
    }
  }
  return (
    <div className="tw-flex tw-justify-center">
      <div className='tw-w-10/12 tw-flex tw-space-x-4 tw-mt-5'>
        {/* <div className="tw-w-3/12 tw-p-4 tw-border tw-border-gray-300 tw-rounded-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-white tw-space-y-2"> */}
        <div className="tw-w-3/12 tw-p-4 tw-border tw-border-gray-300 tw-border-b-4 tw-border-b-green-500 tw-rounded-md tw-rounded-b-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-bg-white tw-space-y-2 tw-shadow-2xl">
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-border-b-2 tw-p-4'>
            <div className='tw-rounded-full tw-border-4 tw-border-orange-400 tw-overflow-hidden tw-w-20 tw-h-20 sm:tw-w-28 sm:tw-h-28 md:tw-w-32 md:tw-h-32 lg:tw-w-20 lg:tw-h-20 tw-flex-shrink-0'>
              <img className="tw-w-full tw-h-full tw-object-cover tw-cursor-pointer" src={ImageCover} alt="User upload" />
            </div>
            <div className="tw-text-center">{userRedux?.firstName}</div>
            <div className='tw-text-slate-600'>Khoi null</div>
            <div className='tw-bg-orange-200 tw-text-orange-500 tw-p-2 tw-cursor-pointer tw-font-bold tw-rounded-lg'>Cap nhat avatar</div>
          </div>
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-2'>
            <div className='tw-font-bold tw-text-lg'>Cai dat tai khoan</div>
            <div className='tw-text-slate-600 tw-text-sm tw-pl-2'>Thong tin ca nhan, cai dat bao mat, quan ly thong bao, v.v</div>

            {/* Mục sidebar */}
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1' onClick={() => handleSectionSelect(1)}>
              <AccountCircleIcon className='tw-mr-2' />
              Thong tin ca nhan
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(2)}>
              <LockIcon className='tw-mr-2' />
              Mat khau va bao mat
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1' onClick={() => handleSectionSelect(3)}>
              <SchoolIcon className='tw-mr-2' />
              Khoa hoc cua ban
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(4)}>
              Tao tai khoan cho con
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(5)}>
              <LinkIcon className='tw-mr-2' />
              Lien ket tai khoan
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(6)}>
              <QrCodeIcon className='tw-mr-2' />
              Nhap ma kich hoat
            </div>
            <div className='hover:tw-bg-slate-100 tw-rounded-lg hover:tw-font-bold tw-text-sm tw-w-11/12 tw-cursor-pointer tw-pl-2 tw-py-1 tw-flex tw-items-center' onClick={() => handleSectionSelect(7)}>
              <LogoutIcon className='tw-mr-2' />
              Dang xuat
            </div>
          </div>
        </div>
        <div className="tw-w-9/12 tw-p-4 tw-border tw-border-gray-300 tw-rounded-md tw-flex tw-bg-white tw-shadow-2xl">
          {/* thong tin ca nhan */}
          {selectedSection === 1 &&
            <div className='tw-w-full tw-space-y-4'>
              <div className='tw-mx-5'>
                <div className='tw-flex'>
                  <div className='tw-flex-1 tw-font-bold tw-text-green-500 tw-text-xl'>Thong tin ca nhan</div>
                  <div className='tw-flex-1 tw-flex tw-justify-end'>
                    <div className='tw-border tw-rounded-3xl tw-px-8 tw-py-2 tw-flex tw-items-center tw-cursor-pointer'>
                      <EditIcon className='tw-mr-2' />
                      Cap nhat
                    </div>
                  </div>
                </div>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                  <div className="tw-p-4 tw-space-y-2">
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Ho ten:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Ten dang nhap:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Loai tai khoan:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Khoi:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                  </div>
                  <div className="tw-p-4 tw-space-y-2">
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Ngay sinh:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Dien thoai:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Email:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                    <div>
                      <div className='tw-text-gray-500 tw-text-sm'>Dia chi:</div>
                      <div className='tw-font-bold text-text-sm'>Pxc</div>
                    </div>
                  </div>
                </div>
                <div className='tw-space-y-4'>
                  <div className='tw-px-4'>
                    <div className='tw-text-gray-500 tw-text-sm'>Lop:</div>
                    <div className='tw-font-bold text-text-sm'>Pxc</div>
                  </div>
                  <div className='tw-px-4'>
                    <div className='tw-text-gray-500 tw-text-sm'>Truong hoc:</div>
                    <div className='tw-font-bold text-text-sm'>Pxc</div>
                  </div>
                  <div className='tw-px-4'>
                    <div className='tw-text-gray-500 tw-text-sm'>Quan:</div>
                    <div className='tw-font-bold text-text-sm'>Pxc</div>
                  </div>
                  <div className='tw-px-4'>
                    <div className='tw-text-gray-500 tw-text-sm'>Tinh:</div>
                    <div className='tw-font-bold text-text-sm'>Pxc</div>
                  </div>
                </div>
              </div>
              <div className='tw-bg-blue-200 tw-mx-5 tw-p-2 tw-rounded-lg'>
                <div className='tw-font-bold'>Lưu ý:</div>
                <div>Hệ thống sẽ tự động nâng lớp cho học sinh vào năm học mới.</div>
              </div>
            </div>}
          {/* mat khau va bao mat */}
          {selectedSection === 2 &&
            <div className='tw-w-full'>
              <div className='tw-ml-5'>
                <div className='tw-font-bold tw-text-green-500 tw-text-xl'>Mat khau va bao mat</div>
                <div className='tw-text-slate-500 tw-text-sm'>Quan ly mat khau</div>
                <div className='tw-font-bold tw-pl-5 tw-text-lg'>Doi mat khau</div>
                <div className='tw-text-slate-500 tw-text-sm tw-pl-5'>Lan doi gan nhat: 26 ngay truoc</div>
                <div className='tw-pl-5 tw-py-3 tw-space-y-3 tw-w-3/5'>
                  <div className='tw-space-y-1'>
                    <div className='tw-font-bold'>Mat khau cu</div>
                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                        placeholder={t('signIn.password')}
                      // value={password}
                      // onChange={(e) => setPassword(e.target.value)}
                      />
                      <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                    </div>
                  </div>
                  <div className='tw-space-y-1'>
                    <div className='tw-font-bold'>Mat khau moi</div>
                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                        placeholder={t('signIn.password')}
                      />
                      <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />
                    </div>
                  </div>
                  <div className='tw-space-y-1'>
                    <div className='tw-font-bold'>Nhap lai mat khau moi</div>
                    <div className="tw-relative tw-border-2 tw-border-teal-300 tw-rounded-2xl">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="tw-appearance-none tw-rounded-2xl tw-relative tw-block tw-w-full tw-px-3 tw-py-2 tw-border-0 tw-placeholder-gray-500 tw-text-gray-900 tw-focus:outline-none tw-focus:ring-indigo-500 tw-focus:border-indigo-500 tw-focus:z-10 tw-sm:text-sm tw-pl-10"
                        placeholder={t('signIn.password')}
                      // value={password}
                      // onChange={(e) => setPassword(e.target.value)}
                      />
                      <LockOutlinedIcon className="tw-absolute tw-top-2 tw-left-2 tw-text-gray-500" />

                    </div>
                  </div>
                  <div className='tw-flex tw-space-x-8 tw-pr-8'>
                    <div className='tw-flex-1 tw-p-2 tw-rounded-3xl tw-border tw-border-green-500 tw-font-bold tw-bg-green-500 tw-flex tw-justify-center tw-items-center tw-text-white'>
                      Doi mat khau
                    </div>
                    <div className='tw-flex-1 tw-p-2 tw-rounded-3xl tw-border tw-border-gray-500 tw-bg-white tw-flex tw-justify-center tw-items-center'>
                      Huy bo
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {/* khoa hoc cua ban */}
          {selectedSection === 3 && <div>Khóa học của bạn</div>}
          {/* tao tai khoan cho con */}
          {selectedSection === 4 && <div>Tạo tài khoản cho con</div>}
          {/* lien ket tai khoan */}
          {selectedSection === 5 && <div>Liên kết tài khoản</div>}
          {/* nhap ma kich hoat */}
          {selectedSection === 6 && <div>Nhập mã kích hoạt</div>}
          {/* dang xuat */}
          {selectedSection === 7 && <div>Đăng xuất</div>}
        </div>
      </div>
    </div>
    // <div className="tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-w-full tw-max-w-9xl tw-mx-auto">
    //   <div className="tw-bg-white tw-shadow-lg tw-rounded-sm tw-mb-8">
    //     <div className="tw-flex tw-flex-col md:tw-flex-row md:-tw-mr-px">
    //       {/* <AccountPanel /> */}
    //       <div className="tw-bg-white tw-shadow-lg tw-rounded-sm tw-border tw-border-slate-200 tw-w-full">
    //         <div className="tw-relative">
    //           <img className="tw-w-full tw-h-48 sm:tw-h-56 md:tw-h-64 lg:tw-h-72 xl:tw-h-80 tw-object-cover" src={ImageCover} alt="User cover" />
    //           <div className="tw-absolute tw-left-4 sm:tw-left-8 md:tw-left-10 -tw-bottom-14 sm:-tw-bottom-16 md:-tw-bottom-20 tw-flex tw-items-center">
    //             {/* <div className="tw-rounded-full tw-border-4 tw-border-teal-400 tw-overflow-hidden tw-w-20 tw-h-20 sm:tw-w-28 sm:tw-h-28 md:tw-w-32 md:tw-h-32 lg:tw-w-40 lg:tw-h-40 tw-flex-shrink-0">
    //                        <img className="tw-w-full tw-h-full tw-object-cover tw-cursor-pointer" src={Image} alt="User upload" />
    //                    </div> */}
    //             <div className="tw-relative tw-inline-block" onClick={handleOpenChangeAVTModal}>
    //               <div className="tw-rounded-full tw-border-4 tw-border-teal-400 tw-overflow-hidden tw-w-20 tw-h-20 sm:tw-w-28 sm:tw-h-28 md:tw-w-32 md:tw-h-32 lg:tw-w-40 lg:tw-h-40 tw-flex-shrink-0">
    //                 <img className="tw-w-full tw-h-full tw-object-cover tw-cursor-pointer" src={userRedux?.avatar} alt="User upload" />
    //               </div>
    //               <div className="tw-absolute tw-bottom-2 tw-right-2 tw-w-8 tw-h-8 tw-cursor-pointer tw-bg-slate-300 hover:tw-bg-slate-400 tw-rounded-full tw-flex tw-justify-center tw-items-center">
    //                 <CameraAltIcon />
    //               </div>
    //             </div>
    //             <div className="tw-mt-16 tw-ml-4 sm:tw-ml-6 tw-flex tw-flex-col tw-justify-center tw-w-36 sm:tw-w-44 md:tw-w-64 lg:tw-w-72 xl:tw-w-80">
    //               <p className='tw-font-semibold tw-text-base sm:tw-text-lg md:tw-text-xl tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap'>{userRedux?.firstName + ' ' + userRedux?.lastName}</p>
    //               <p className='tw-text-gray-500 tw-text-xs sm:tw-text-sm md:tw-text-base tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap'>{userRedux?.email}</p>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="tw-mt-8 sm:tw-mt-12 md:tw-mt-16 tw-flex tw-justify-end tw-pr-4 sm:tw-pr-8 md:tw-pr-10 lg:tw-pr-12">
    //           <button className="tw-bg-gray-300 tw-text-black tw-rounded-md tw-px-2 tw-py-1 sm:tw-px-3 sm:tw-py-2 hover:tw-bg-gray-400 hover:tw-text-black tw-flex tw-items-center" onClick={handleEditProfile}>
    //             <ManageAccountsIcon className='tw-tw-mr-2 -tw-tw-mt-1' />
    //             <span className="tw-hidden sm:tw-inline">{t('profile.editProfile')}</span>
    //           </button>
    //         </div>

    //         <div className='tw-p-5'>
    //           <div className="tw-my-16 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-p-5">
    //             <div>
    //               <h2 className="tw-text-2xl tw-text-slate-800 tw-font-bold tw-mb-6">{t('profile.myProfile')}</h2>
    //               <div className="tw-grid tw-gap-5 md:tw-grid-cols-4">
    //                 <div>
    //                   {/* Start */}
    //                   <div>
    //                     <label className={`tw-block tw-text-sm tw-font-medium tw-mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="firstName">
    //                       {t('profile.firstName')}
    //                     </label>
    //                     <input
    //                       ref={firstNameRef}
    //                       id="firstName"
    //                       className={objCheckInput.isValidFirstName ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
    //                       type="text"
    //                       required
    //                       value={user?.firstName ?? ''}
    //                       onChange={(e) => {
    //                         setUser({ ...user, firstName: e.target.value })
    //                         setObjCheckInput({ ...objCheckInput, isValidFirstName: true })
    //                       }}
    //                       disabled={!isEditing}
    //                     />
    //                   </div>
    //                   {/* End */}
    //                 </div>

    //                 <div>
    //                   {/* Start */}
    //                   <div>
    //                     <label className={`tw-block tw-text-sm tw-font-medium mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="lastName">
    //                       {t('profile.lastName')}
    //                     </label>
    //                     <input id="lastName"
    //                       className={objCheckInput.isValidLastName ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
    //                       type="text"
    //                       required
    //                       value={user?.lastName ?? ''}
    //                       onChange={(e) => {
    //                         setUser({ ...user, lastName: e.target.value })
    //                         setObjCheckInput({ ...objCheckInput, isValidLastName: true })
    //                       }}
    //                       disabled={!isEditing}
    //                     />
    //                   </div>
    //                   {/* End */}
    //                 </div>

    //                 {/* Select */}
    //                 <div>
    //                   <label className={`tw-block text-sm font-medium mb-1 ${isEditing ? '' : 'text-neutral-400'}`} htmlFor="gender">
    //                     {t('profile.gender')}
    //                   </label>
    //                   <select id="gender"
    //                     className={objCheckInput.isValidGender ? `tw-form-select tw-w-full tw-border tw-border-gray-300 tw-p-2.5 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-select w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
    //                     value={user?.gender ?? ''}
    //                     onChange={(e) => {
    //                       setUser({ ...user, gender: e.target.value })
    //                       setObjCheckInput({ ...objCheckInput, isValidGender: true })
    //                     }}
    //                     disabled={!isEditing}
    //                   >
    //                     <option value="">{t('profile.selectGender')}</option>
    //                     <option value="Male">{t('profile.male')}</option>
    //                     <option value="Female">{t('profile.female')}</option>
    //                     <option value="Other">{t('profile.other')}</option>
    //                   </select>
    //                 </div>

    //                 <div>
    //                   {/* Start */}
    //                   <div className='tw-w-1/2'>
    //                     <label className={`tw-block tw-text-sm tw-font-medium tw-mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="age">
    //                       {t('profile.age')}
    //                     </label>
    //                     <input id="age"
    //                       className={objCheckInput.isValidAge ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
    //                       type="text"
    //                       required
    //                       value={user?.age ?? ''}
    //                       onChange={(e) => {
    //                         setUser({ ...user, age: e.target.value })
    //                         setObjCheckInput({ ...objCheckInput, isValidAge: true })
    //                       }}
    //                       disabled={!isEditing}
    //                     />
    //                   </div>
    //                   {/* End */}
    //                 </div>
    //               </div>
    //               <div className="grid gap-5 md:grid-cols-2 mt-5">
    //                 {/* Start */}
    //                 <div>
    //                   <label className={`tw-block text-sm tw-font-medium mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="email">
    //                     {t('profile.email')}
    //                   </label>
    //                   <input id="email"
    //                     className={objCheckInput.isValidEmail ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
    //                     type="email"
    //                     required
    //                     value={user?.email ?? ''}
    //                     onChange={(e) => {
    //                       setUser({ ...user, email: e.target.value })
    //                       setObjCheckInput({ ...objCheckInput, isValidEmail: true })
    //                     }}
    //                     disabled={!isEditing}
    //                   />
    //                 </div>
    //                 {/* End */}
    //               </div>
    //               <div className="tw-grid gap-5 md:tw-grid-cols-1 tw-mt-5">
    //                 {/* Start */}
    //                 <div>
    //                   <label className={`tw-block tw-text-sm tw-font-medium tw-mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="password">
    //                     {t('profile.password')}
    //                   </label>
    //                   {isSettingNewPassword && (
    //                     <>
    //                       <div className="tw-grid tw-gap-5 md:tw-grid-cols-3 tw-mb-4">
    //                         <input
    //                           className={objCheckInput.isValidCurrentPassword ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'} ${errorField === 'currentPassword' ? 'tw-border-red-500' : ''} ` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
    //                           type="password"
    //                           id="currentPassword"
    //                           placeholder={t('profile.enterCurrentPassword') ?? 'Defaultplaceholder'}
    //                           onChange={(e) => {
    //                             setUser({ ...user, currentPassword: e.target.value })
    //                             setObjCheckInput({ ...objCheckInput, isValidCurrentPassword: true })
    //                             setErrorField('')
    //                           }}
    //                         />
    //                       </div>
    //                       <div className="tw-grid tw-gap-5 md:tw-grid-cols-3 tw-mb-4">
    //                         <input
    //                           className={objCheckInput.isValidPassword ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
    //                           type="password"
    //                           id="newPassword"
    //                           placeholder={t('profile.enterNewPassword') ?? 'Defaultplaceholder'}
    //                           onChange={(e) => {
    //                             setUser({ ...user, newPassword: e.target.value })
    //                             setObjCheckInput({ ...objCheckInput, isValidPassword: true })
    //                           }}
    //                         />
    //                       </div>
    //                     </>
    //                   )}
    //                   {isSettingNewPassword && (
    //                     <div>
    //                       <button className="tw-bg-white tw-text-teal-400 tw-px-2 tw-py-2 tw-rounded-md tw-border tw-border-gray-300 hover:tw-bg-teal-400 hover:tw-text-white" onClick={handleCancelSet}>{t('profile.cancelSetNewPassword')}</button>
    //                     </div>
    //                   )}
    //                   {!isSettingNewPassword && (
    //                     <div>
    //                       <p className={`tw-text-gray-500 ${isEditing ? '' : 'tw-text-neutral-400'}`}>{t('profile.title')}</p>
    //                       <button
    //                         className={`tw-bg-white tw-text-teal-400 tw-px-2 tw-py-2 tw-rounded-md tw-border tw-border-gray-300 hover:tw-bg-teal-400 hover:tw-text-teal-600 ${isEditing ? '' : 'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-white hover:tw-text-neutral-400'}`}
    //                         disabled={!isEditing}
    //                         onClick={handleSetNewPasswordClick}
    //                       >
    //                         {t('profile.setNewPassword')}
    //                       </button>
    //                     </div>
    //                   )}

    //                 </div>
    //                 {/* End */}
    //               </div>
    //               {isEditing
    //                 ? (
    //                   <div className="tw-flex tw-justify-end tw-mt-6">
    //                     <button className="tw-bg-gray-300 tw-text-black tw-px-4 tw-py-2 tw-rounded-md tw-mr-2 hover:tw-bg-gray-400 hover:tw-text-black" onClick={handleCancelEdit}>{t('profile.cancel')}</button>
    //                     <button className="tw-bg-teal-400 tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-teal-500 hover:tw-text-white" onClick={handleSaveChanges}>{t('profile.saveChanges')}</button>
    //                   </div>
    //                 )
    //                 : null}
    //             </div>
    //           </div>
    //         </div>
    //         <AVTChangeModal
    //           title={t('profile.selectAnImage')}
    //           modalOpen={choiceModalAVTOpen}
    //           setModalOpen={setChoiceModalAVTOpen}
    //         >
    //           <div className='tw-flex tw-space-x-3'>
    //             <div className='tw-bg-teal-300 tw-w-full tw-rounded-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-5 tw-space-y-3' onClick={handleUploadClick}>
    //               <div className='tw-rounded-full tw-bg-sky-700 tw-w-32 tw-h-32 tw-flex tw-items-center tw-justify-center tw-cursor-pointer'>
    //                 <AddPhotoAlternateIcon className='tw-text-slate-300 tw-cursor-pointer' fontSize='large' />
    //               </div>
    //               <div className='tw-font-bold hover:tw-text-gray-700 tw-cursor-pointer'>Upload Image</div>
    //             </div>
    //             <input
    //               type='file'
    //               ref={fileInputRef}
    //               style={{ display: 'none' }}
    //               accept='.jpg,.jpeg,.png,.gif'
    //               onChange={handleFileChange}
    //             />
    //             {/* <div className='tw-bg-teal-300 tw-w-1/2 tw-rounded-md tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-5 tw-space-y-3' onClick={handleEditClick}>
    //                     <div className='tw-rounded-full tw-border-4 tw-border-sky-700 tw-w-32 tw-h-32 tw-flex tw-items-center tw-justify-center tw-cursor-pointer'>
    //                         <img className='tw-rounded-full tw-w-full tw-h-full' src={userRedux?.avatar}></img>
    //                     </div>
    //                     <div className='tw-font-bold hover:tw-text-gray-700 tw-cursor-pointer'>Edit Image</div>
    //                 </div> */}
    //           </div>
    //         </AVTChangeModal>
    //         <ZoomModal
    //           title={t('profile.zoom')}
    //           modalOpen={zoomModalAVTOpen}
    //           setModalOpen={setZoomModalAVTOpen}
    //         >
    //           <>
    //             <AvatarEditor
    //               ref={cropRef}
    //               className="tw-col-span-9 tw-mx-auto tw-mb-5 tw-rounded-sm"
    //               image={imageSrc}
    //               width={320}
    //               height={320}
    //               border={50}
    //               borderRadius={250}
    //               scale={zoom}
    //               rotate={rotate}
    //             />
    //             <label className="tw-col-span-2 tw-text-sm tw-font-semibold tw-text-dark-2">
    //               Zoom
    //             </label>
    //             <input
    //               type="range"
    //               className="tw-col-span-5 tw-transparent tw-h-[4px] tw-w-full tw-cursor-pointer tw-appearance-none tw-border-transparent tw-bg-neutral-200 dark:tw-bg-neutral-600 tw-mt-2"
    //               id="customRange1"
    //               min={0}
    //               max={2}
    //               step={0.05}
    //               value={zoom}
    //               onChange={handleInputZoomChange}
    //             />
    //             <input
    //               type="number"
    //               className="tw-bg-dark-2 tw-text-dark-2 tw-col-span-2 tw-py-1.5 tw-rounded-md tw-text-sm tw-font-semibold tw-text-center"
    //               min={0}
    //               max={2}
    //               step={0.05}
    //               value={zoom}
    //               onChange={handleInputZoomChange}
    //             />
    //             <label className="tw-col-span-2 tw-text-sm tw-font-semibold tw-text-dark-2">
    //               Rotate
    //             </label>
    //             <input
    //               type="range"
    //               className="tw-col-span-5 tw-transparent tw-h-[4px] tw-w-full tw-cursor-pointer tw-appearance-none tw-border-transparent tw-bg-neutral-200 dark:tw-bg-neutral-600 tw-mt-2"
    //               id="customRange1"
    //               min={-180}
    //               max={180}
    //               value={rotate}
    //               step={1}
    //               onChange={handleInputRotateChange}
    //             />
    //             <input
    //               type="number"
    //               className="tw-bg-dark-2 tw-text-dark-2 tw-col-span-2 tw-py-1.5 tw-rounded-md tw-text-sm tw-font-semibold tw-text-center"
    //               min={-180}
    //               max={180}
    //               step={1}
    //               value={rotate}
    //               onChange={handleInputRotateChange}
    //             />
    //           </>
    //           <div className='tw-flex tw-justify-between tw-m-3 tw-font-bold'>
    //             <div className='tw-cursor-pointer hover:tw-text-gray-700 hover:tw-underline tw-py-1' onClick={() => setZoomModalAVTOpen(false)}>Skip</div>
    //             <div className='tw-flex tw-space-x-4'>
    //               <div className='tw-cursor-pointer hover:tw-text-gray-700 hover:tw-underline tw-py-1' onClick={() => setZoomModalAVTOpen(false)}>Cancel</div>
    //               <div className='tw-cursor-pointer hover:tw-text-gray-700 tw-bg-teal-300 hover:tw-bg-teal-500 tw-rounded-md tw-px-3 tw-py-1' onClick={handleSaveAVT}>Save</div>
    //             </div>
    //           </div>
    //         </ZoomModal>
    //       </div >
    //     </div>
    //   </div>
    // </div>
  )
}

export default Profile
