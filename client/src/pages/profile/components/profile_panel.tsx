/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: AccountPanel
   ========================================================================== */
   import React, { useEffect, useState, useRef } from 'react'
   import Image from '../../../assets/userAVT.png'
   import ImageCover from '../../../assets/userCover.png'
   import { findUserById, updateUser } from '../../../api/user/api'
   import { getFromLocalStorage } from 'utils/functions'
   import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
   import { toast } from 'react-toastify'
   import { useTranslation } from 'react-i18next'
   import { useDispatch, useSelector } from 'react-redux'
   import { AppDispatch, RootState } from '../../../redux/store'
   import { fetchUser, selectUser } from '../../../redux/auth/authSlice'
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
   
   function AccountPanel() {
       const { t } = useTranslation()
   
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
    const dispatch = useDispatch<AppDispatch>()
    const userRedux = useSelector(selectUser)

    useEffect(() => {
    const storedUser = localStorage.getItem('persist:auth')
    if (storedUser) {
      const user = JSON.parse(storedUser).currentUser;
      dispatch(fetchUser());
    }
    }, [dispatch]);
  
    useEffect(() => {
      if (userRedux?.id) {
        dispatch(fetchUser())
      }
    }, []);
       const [isEditing, setIsEditing] = useState(false)
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
   
       // function validate
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
                   if(userRedux?.id) {
                   const response = await updateUser(userRedux?.id, finalPayload)
                   if (response.status === 200) {
                       toast.success('Update successfully')
                       setIsEditing(false)
                       setIsSettingNewPassword(false)
                       const tokens = getFromLocalStorage<any>('tokens')
                       tokens.firstName = response.data.firstName
                       tokens.lastName = response.data.lastName
                       tokens.email = response.data.email
                       localStorage.setItem('tokens', JSON.stringify(tokens))
                       window.dispatchEvent(new Event('storage'))
                   } else {
                       toast.error('Update failed 1')
                   }}
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
           <div className="tw-bg-white tw-shadow-lg tw-rounded-sm tw-border tw-border-slate-200 tw-w-full">
               <div className="tw-relative">
                   <img className="tw-w-full tw-h-48 sm:tw-h-56 md:tw-h-64 lg:tw-h-72 xl:tw-h-80 tw-object-cover" src={ImageCover} alt="User cover" />
                   <div className="tw-absolute tw-left-4 sm:tw-left-8 md:tw-left-10 -tw-bottom-14 sm:-tw-bottom-16 md:-tw-bottom-20 tw-flex tw-items-center">
                       <div className="tw-rounded-full tw-border-4 tw-border-teal-400 tw-overflow-hidden tw-w-20 tw-h-20 sm:tw-w-28 sm:tw-h-28 md:tw-w-32 md:tw-h-32 lg:tw-w-40 lg:tw-h-40 tw-flex-shrink-0">
                           <img className="tw-w-full tw-h-full tw-object-cover" src={Image} alt="User upload" />
                       </div>
                       <div className="tw-mt-16 tw-ml-4 sm:tw-ml-6 tw-flex tw-flex-col tw-justify-center tw-w-36 sm:tw-w-44 md:tw-w-64 lg:tw-w-72 xl:tw-w-80">
                           <p className='tw-font-semibold tw-text-base sm:tw-text-lg md:tw-text-xl tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap'>{userRedux?.firstName + ' ' + userRedux?.lastName}</p>
                           <p className='tw-text-gray-500 tw-text-xs sm:tw-text-sm md:tw-text-base tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap'>{userRedux?.email}</p>
                       </div>
                   </div>
               </div>
               <div className="tw-mt-8 sm:tw-mt-12 md:tw-mt-16 tw-flex tw-justify-end tw-pr-4 sm:tw-pr-8 md:tw-pr-10 lg:tw-pr-12">
                   <button className="tw-bg-gray-300 tw-text-black tw-rounded-md tw-px-2 tw-py-1 sm:tw-px-3 sm:tw-py-2 hover:tw-bg-gray-400 hover:tw-text-black tw-flex tw-items-center" onClick={handleEditProfile}>
                       <ManageAccountsIcon className='tw-tw-mr-2 -tw-tw-mt-1' />
                       <span className="tw-hidden sm:tw-inline">{t('profile.editProfile')}</span>
                   </button>
               </div>
   
               <div className='tw-p-5'>
                   <div className="tw-my-16 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow tw-p-5">
                       <div>
                           <h2 className="tw-text-2xl tw-text-slate-800 tw-font-bold tw-mb-6">{t('profile.myProfile')}</h2>
                           <div className="tw-grid tw-gap-5 md:tw-grid-cols-4">
                               <div>
                                   {/* Start */}
                                   <div>
                                       <label className={`tw-block tw-text-sm tw-font-medium tw-mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="firstName">
                                           {t('profile.firstName')}
                                       </label>
                                       <input
                                           ref={firstNameRef}
                                           id="firstName"
                                           className={objCheckInput.isValidFirstName ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
                                           type="text"
                                           required
                                           value={user?.firstName ?? ''}
                                           onChange={(e) => {
                                               setUser({ ...user, firstName: e.target.value })
                                               setObjCheckInput({ ...objCheckInput, isValidFirstName: true })
                                           }}
                                           disabled={!isEditing}
                                       />
                                   </div>
                                   {/* End */}
                               </div>
   
                               <div>
                                   {/* Start */}
                                   <div>
                                       <label className={`tw-block tw-text-sm tw-font-medium mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="lastName">
                                           {t('profile.lastName')}
                                       </label>
                                       <input id="lastName"
                                           className={objCheckInput.isValidLastName ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
                                           type="text"
                                           required
                                           value={user?.lastName ?? ''}
                                           onChange={(e) => {
                                               setUser({ ...user, lastName: e.target.value })
                                               setObjCheckInput({ ...objCheckInput, isValidLastName: true })
                                           }}
                                           disabled={!isEditing}
                                       />
                                   </div>
                                   {/* End */}
                               </div>
   
                               {/* Select */}
                               <div>
                                   <label className={`tw-block text-sm font-medium mb-1 ${isEditing ? '' : 'text-neutral-400'}`} htmlFor="gender">
                                       {t('profile.gender')}
                                   </label>
                                   <select id="gender"
                                       className={objCheckInput.isValidGender ? `tw-form-select tw-w-full tw-border tw-border-gray-300 tw-p-2.5 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-select w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
                                       value={user?.gender ?? ''}
                                       onChange={(e) => {
                                           setUser({ ...user, gender: e.target.value })
                                           setObjCheckInput({ ...objCheckInput, isValidGender: true })
                                       }}
                                       disabled={!isEditing}
                                   >
                                       <option value="">{t('profile.selectGender')}</option>
                                       <option value="Male">{t('profile.male')}</option>
                                       <option value="Female">{t('profile.female')}</option>
                                       <option value="Other">{t('profile.other')}</option>
                                   </select>
                               </div>
   
                               <div>
                                   {/* Start */}
                                   <div className='tw-w-1/2'>
                                       <label className={`tw-block tw-text-sm tw-font-medium tw-mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="age">
                                           {t('profile.age')}
                                       </label>
                                       <input id="age"
                                           className={objCheckInput.isValidAge ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
                                           type="text"
                                           required
                                           value={user?.age ?? ''}
                                           onChange={(e) => {
                                               setUser({ ...user, age: e.target.value })
                                               setObjCheckInput({ ...objCheckInput, isValidAge: true })
                                           }}
                                           disabled={!isEditing}
                                       />
                                   </div>
                                   {/* End */}
                               </div>
                           </div>
                           <div className="grid gap-5 md:grid-cols-2 mt-5">
                               {/* Start */}
                               <div>
                                   <label className={`tw-block text-sm tw-font-medium mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="email">
                                       {t('profile.email')}
                                   </label>
                                   <input id="email"
                                       className={objCheckInput.isValidEmail ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
                                       type="email"
                                       required
                                       value={user?.email ?? ''}
                                       onChange={(e) => {
                                           setUser({ ...user, email: e.target.value })
                                           setObjCheckInput({ ...objCheckInput, isValidEmail: true })
                                       }}
                                       disabled={!isEditing}
                                   />
                               </div>
                               {/* End */}
                           </div>
                           <div className="tw-grid gap-5 md:tw-grid-cols-1 tw-mt-5">
                               {/* Start */}
                               <div>
                                   <label className={`tw-block tw-text-sm tw-font-medium tw-mb-1 ${isEditing ? '' : 'tw-text-neutral-400'}`} htmlFor="password">
                                       {t('profile.password')}
                                   </label>
                                   {isSettingNewPassword && (
                                       <>
                                           <div className="tw-grid tw-gap-5 md:tw-grid-cols-3 tw-mb-4">
                                               <input
                                                   className={objCheckInput.isValidCurrentPassword ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'} ${errorField === 'currentPassword' ? 'tw-border-red-500' : ''} ` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
                                                   type="password"
                                                   id="currentPassword"
                                                   placeholder={t('profile.enterCurrentPassword') ?? 'Defaultplaceholder'}
                                                   onChange={(e) => {
                                                       setUser({ ...user, currentPassword: e.target.value })
                                                       setObjCheckInput({ ...objCheckInput, isValidCurrentPassword: true })
                                                       setErrorField('')
                                                   }}
                                               />
                                           </div>
                                           <div className="tw-grid tw-gap-5 md:tw-grid-cols-3 tw-mb-4">
                                               <input
                                                   className={objCheckInput.isValidPassword ? `tw-form-input tw-w-full tw-border tw-border-gray-300 tw-p-2 tw-rounded-md focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-teal-400 ${isEditing ? '' : 'disabled:tw-opacity-50 tw-cursor-not-allowed'}` : 'tw-form-input tw-w-full tw-border tw-p-2 tw-rounded-md focus:tw-outline-none tw-border-red-500'}
                                                   type="password"
                                                   id="newPassword"
                                                   placeholder={t('profile.enterNewPassword') ?? 'Defaultplaceholder'}
                                                   onChange={(e) => {
                                                       setUser({ ...user, newPassword: e.target.value })
                                                       setObjCheckInput({ ...objCheckInput, isValidPassword: true })
                                                   }}
                                               />
                                           </div>
                                       </>
                                   )}
                                   {isSettingNewPassword && (
                                       <div>
                                           <button className="tw-bg-white tw-text-teal-400 tw-px-2 tw-py-2 tw-rounded-md tw-border tw-border-gray-300 hover:tw-bg-teal-400 hover:tw-text-white" onClick={handleCancelSet}>{t('profile.cancelSetNewPassword')}</button>
                                       </div>
                                   )}
                                   {!isSettingNewPassword && (
                                       <div>
                                           <p className={`tw-text-gray-500 ${isEditing ? '' : 'tw-text-neutral-400'}`}>{t('profile.title')}</p>
                                           <button
                                               className={`tw-bg-white tw-text-teal-400 tw-px-2 tw-py-2 tw-rounded-md tw-border tw-border-gray-300 hover:tw-bg-teal-400 hover:tw-text-teal-600 ${isEditing ? '' : 'tw-opacity-50 tw-cursor-not-allowed hover:tw-bg-white hover:tw-text-neutral-400'}`}
                                               disabled={!isEditing}
                                               onClick={handleSetNewPasswordClick}
                                           >
                                               {t('profile.setNewPassword')}
                                           </button>
                                       </div>
                                   )}
   
                               </div>
                               {/* End */}
                           </div>
                           {isEditing
                               ? (
                                   <div className="tw-flex tw-justify-end tw-mt-6">
                                       <button className="tw-bg-gray-300 tw-text-black tw-px-4 tw-py-2 tw-rounded-md tw-mr-2 hover:tw-bg-gray-400 hover:tw-text-black" onClick={handleCancelEdit}>{t('profile.cancel')}</button>
                                       <button className="tw-bg-teal-400 tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-teal-500 hover:tw-text-white" onClick={handleSaveChanges}>{t('profile.saveChanges')}</button>
                                   </div>
                               )
                               : null}
                       </div>
                   </div>
               </div>
           </div >
       )
   }
   
   export default AccountPanel
   