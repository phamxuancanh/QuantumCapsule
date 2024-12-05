/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: UserPage
   ========================================================================== */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Transition from '../../utils/transition'
import { getFromLocalStorage, removeLocalStorage, removeAllLocalStorage } from 'utils/functions'
import UserAvatar from '../../assets/userAVT.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded'
import LayersIcon from '@mui/icons-material/Layers'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import ROUTES from 'routes/constant'
import { useTranslation } from 'services/i18n'
//    import { useTheme } from 'services/styled-themes'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { useDispatch } from 'react-redux'
import ChoiceModal from 'components/modals/choiceModal'
import CryptoJS from 'crypto-js'
import { signOut } from 'api/user/user.api'
import { toast } from 'react-toastify'
import { logoutState } from '../../redux/auth/authSlice'
import Select, { ActionMeta, SingleValue } from 'react-select';
interface DropdownProfileProps {
  align: string
}

function DropdownProfile({ align }: DropdownProfileProps) {
  const navigate = useNavigate()
  const [tokens, setTokens] = useState(getFromLocalStorage<any>('tokens'))
  useEffect(() => {
    const handleStorageChange = () => {
      setTokens(getFromLocalStorage<any>('tokens'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  //  const { theme, setTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdown = useRef<HTMLDivElement | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [choiceModalOpen, setChoiceModalOpen] = useState(false)
  // close on click outside
  const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'))
  const userLastName = currentUser?.currentUser.lastName
  const userFirstName = currentUser?.currentUser.firstName
  const userEmail = currentUser?.currentUser.email
  const userRole = currentUser?.currentUser.key
  const userAVT = currentUser?.currentUser.avatar
  const userGrade = currentUser?.currentUser.grade

  let data: string | undefined
  if (userRole) {
    try {
      const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication')
      data = giaiMa.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Decryption error:', error)
    }
  }
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }) => {
      if (!dropdown.current) return
      if (!dropdownOpen || dropdown.current?.contains(target as Node) || trigger.current?.contains(target as Node)) return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })
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
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  const handleOpenLogOutModal = useCallback(() => {
    setChoiceModalOpen(true)
  }, [])
  const languageOptions = useMemo(() => {
    return [
      { label: 'EN', value: 'en', flag: getUnicodeFlagIcon('GB') },
      { label: 'VN', value: 'vi', flag: getUnicodeFlagIcon('VN') }
    ]
  }, [])

useEffect(() => {
  const savedLanguage = localStorage.getItem('selectedLanguage')
  if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
      i18n.changeLanguage(savedLanguage)
  }
}, [i18n]);

const handleChange = useCallback(
  async (e: any) => {
      try {
          const newLanguage = e.target.value;
          await i18n.changeLanguage(newLanguage);
          setSelectedLanguage(newLanguage);
          localStorage.setItem('selectedLanguage', newLanguage);
      } catch (error) {
          console.log(error);
      }
  },
  [i18n]
);


  const activateLink = useCallback((isLastItem?: boolean) => {
    return ({ isActive }: { isActive: boolean }) => ({
      marginRight: (isLastItem ?? false) ? 0 : 20,
      color: isActive ? 'green' : ''
    })
  }, [])

  const locationPath = 'delete.png'
  return (
    <div className="tw-relative tw-inline-flex">
      <button
        ref={trigger}
        className="tw-inline-flex tw-justify-center tw-items-center tw-group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className='tw-flex tw-space-x-3 tw-justify-center tw-items-center'>
          <img className="tw-w-8 tw-h-8 tw-rounded-full" src={userAVT} width="32" height="32" alt="User" />
          <div className='tw-flex-col tw-flex tw-justify-start tw-items-start'>
            <div className='tw-font-bold'>{userLastName} {userFirstName}</div>
            {(data !== 'R1' && data !== 'R2') && (
            <div className='tw-text-gray-500 tw-text-sm'>Lớp {userGrade}</div>
            )}
          </div>
        </div>
      </button>
      <Transition
        className={`tw-w-56 tw-origin-top-right tw-z-10 tw-absolute tw-top-full tw-min-w-44 tw-bg-white tw-border tw-border-slate-200 tw-py-1.5 tw-rounded tw-shadow-lg tw-overflow-hidden tw-mt-1 ${align === 'right' ? 'tw-right-0' : 'tw-left-0'}`}
        show={dropdownOpen}
        enter="tw-transition tw-ease-out tw-duration-200 tw-transform"
        enterStart="tw-opacity-0 -tw-translate-y-2"
        enterEnd="tw-opacity-100 tw-translate-y-0"
        leave="tw-transition tw-ease-out tw-duration-200"
        leaveStart="tw-opacity-100"
        leaveEnd="tw-opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="tw-flex tw-items-center tw-py-1 tw-px-3">
            <img className="tw-w-12 tw-h-12 tw-rounded-full tw--mt-2" src={userAVT} width="44" height="44" alt="User" />
            <div className="tw-pt-0.5 tw-pb-2 tw-px-3 tw-mb-1 tw-border-b tw-border-slate-200 tw-w-32">
              <p className='tw-font-bold tw-text-base tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap'>
                {`${userFirstName || ''} ${userLastName || ''}`}
              </p>
              <p className='tw-text-gray-500 tw-text-xs tw-overflow-hidden tw-overflow-ellipsis tw-whitespace-nowrap'>{userEmail}</p>
            </div>
          </div>
          {/* <div className='tw-px-2 tw-py-1'>
            <select
              className="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-font-bold tw-text-gray-700 tw-border tw-border-gray-300 tw-focus:border-indigo-500 tw-focus:outline-none tw-shadow"
              value={selectedLanguage}
              onChange={handleChange}
            >
              {languageOptions.map((option, index) => (
                <option key={index} value={option.value} className='tw-font-bold tw-py-2'>
                  {option.flag}&nbsp;&nbsp;&nbsp;{option.label}&nbsp;&nbsp;{option.value === selectedLanguage && '✔'}
                </option>
              ))}
            </select>
          </div> */}
          <ul>
          {(data !== 'R1' && data !== 'R2') && (
            <li>
              <Link
                className="tw-font-medium tw-text-sm tw-text-gray-500 hover:tw-text-teal-600 tw-flex tw-items-center tw-py-1 tw-px-6"
                to="/profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <AccountCircleIcon className="tw-mr-2" />
                {t('dropdown.profile')}
              </Link>
            </li>
            )}
            {/* {(data === 'R1' || data === 'R2') && (

              <li>
                <Link
                  className="tw-font-medium tw-text-sm tw-text-gray-500 hover:tw-text-teal-600 tw-flex tw-items-center tw-py-1 tw-px-6"
                  to={ROUTES.dev}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <QueryStatsRoundedIcon className="tw-mr-2" />
                  {t('dropdown.userDashboard')}
                </Link>
              </li>
            )} */}
            {/* <li>
              <Link
                className="tw-font-medium tw-text-sm tw-text-gray-500 hover:tw-text-teal-600 tw-flex tw-items-center tw-py-1 tw-px-6"
                to="/mycourses"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <LayersIcon className="tw-mr-2" />
                {t('dropdown.mycourse')}
              </Link>
            </li>
            <li>
              <Link
                className="tw-font-medium tw-text-sm tw-text-gray-500 hover:tw-text-teal-600 tw-flex tw-items-center tw-py-1 tw-px-6"
                to="/settings"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <SettingsIcon className="tw-mr-2" />
                {t('dropdown.setting')}
              </Link>
            </li> */}
            {/* {renderThemeSwitcher} */}
            <li>
              <button
                className="tw-font-medium tw-text-sm tw-text-gray-500 hover:tw-text-teal-600 tw-flex tw-items-center tw-py-1 tw-px-6"
                onClick={handleOpenLogOutModal}
              >
                <LogoutIcon className="tw-mr-2" />
                {t('dropdown.logout')}
              </button>
            </li>
            <hr className="tw-bg-slate-200 tw-my-2" />
            {(data === 'R1' || data === 'R2') && (
              <li>
                <Link
                  className="tw-font-medium tw-text-sm tw-text-gray-500 hover:tw-text-teal-600 tw-flex tw-items-center tw-py-1 tw-px-6"
                  to="/admin"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <AdminPanelSettingsIcon className="tw-mr-2" />
                  {t('dropdown.gotoadmin')}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </Transition>
      <ChoiceModal
        title={t('homepage.logout')}
        modalOpen={choiceModalOpen}
        setModalOpen={setChoiceModalOpen}
      >
        <div className="tw-text-sm tw-mb-5">
          <div className="tw-space-y-2">
            <p className='tw-text-gray-500 tw-font-bold'>{t('homepage.logout_confirm')}</p>
          </div>
        </div>
        {/* Modal footer */}
        <div className="tw-flex tw-flex-wrap tw-justify-end tw-space-x-2">
          <div className='tw-space-x-2 tw-flex tw-w-1/3'>
            <button className="tw-flex-1 tw-border tw-rounded-lg tw-btn-sm tw-border-slate-300 hover:tw-border-slate-400 tw-text-slate-600 tw-p-2 tw-font-bold tw-text-sm" onClick={(e) => { e.stopPropagation(); setChoiceModalOpen(false) }}>{t('homepage.decline')}</button>
            <button className="tw-flex-1 tw-border tw-rounded-lg tw-btn-sm tw-bg-indigo-500 hover:tw-bg-indigo-600 tw-text-white tw-p-2 tw-font-bold tw-text-sm" onClick={handleLogout}>{t('homepage.continue')}</button>
          </div>
        </div>
      </ChoiceModal>
    </div>
  )
}

export default DropdownProfile
