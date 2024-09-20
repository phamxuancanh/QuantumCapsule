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
  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  //  const handleLogout = useCallback(async () => {
  //    try {
  //      dispatch(startLogout())
  //      const response = await logout()
  //      if (response) {
  //        removeLocalStorage('tokens')
  //        removeAllLocalStorage()
  //        navigate(ROUTES.dev)
  //      }
  //      dispatch(finishLogout())
  //    } catch (error) {
  //      console.error(error)
  //    }
  //  }, [dispatch, navigate])
  const handleOpenLogOutModal = useCallback(() => {
    setChoiceModalOpen(true)
  }, [])
  const languageOptions = useMemo(() => {
    return [
      { label: 'EN', value: 'en', flag: getUnicodeFlagIcon('GB') },
      { label: 'FR', value: 'fr', flag: getUnicodeFlagIcon('FR') },
      { label: 'JP', value: 'jp', flag: getUnicodeFlagIcon('JP') },
      { label: 'VN', value: 'vi', flag: getUnicodeFlagIcon('VN') }
    ]
  }, [])

  //  const handleChange = useCallback(
  //    async (e: { target: { value: React.SetStateAction<string> | undefined } }) => {
  //      try {
  //        await i18n.changeLanguage(e.target.value)
  //        setSelectedLanguage(e.target.value)
  //      } catch (error) {
  //        console.log(error)
  //      }
  //    },
  //    [i18n]
  //  )
  const activateLink = useCallback((isLastItem?: boolean) => {
    return ({ isActive }: { isActive: boolean }) => ({
      marginRight: (isLastItem ?? false) ? 0 : 20,
      color: isActive ? 'green' : ''
    })
  }, [])

  //  const handleThemeSwitch = useCallback(async () => {
  //    try {
  //      const newTheme = theme === 'dark' ? 'light' : 'dark'
  //      setTheme(newTheme)
  //    } catch (error) {
  //      console.log(error)
  //    }
  //  }, [setTheme, theme])
  const locationPath = 'delete.png'
  //  const renderThemeSwitcher = useMemo(() => {
  // //    const icon = theme === 'dark' ? <span className='flex items-center'><div className='mr-3'>☀️</div> <div>{t('dropdown.lightTheme')}</div></span> : <span className='flex items-center'><div className='mr-3'>🌙</div> <div>{t('dropdown.darkTheme')}</div></span>

  //    return (
  //      <div className='cursor-pointer py-1 px-6 font-medium text-sm text-gray-500 hover:text-teal-600'>
  //        {/* {icon} */}
  //      </div>
  //      //   <Switch.Group as="div" className="flex items-center">
  //      //   <Switch.Label as="span" className="mr-3">
  //      //     {theme === 'dark' ? 'Dark mode' : 'Light mode'}
  //      //   </Switch.Label>
  //      //   <Switch
  //      //     as="button"
  //      //     checked={theme === 'dark'}
  //      //     onChange={handleThemeSwitch}
  //      //     className={`${
  //      //       theme === 'dark' ? 'bg-blue-600' : 'bg-gray-400'
  //      //     } relative inline-block w-10 align-middle select-none transition duration-200 ease-in`}
  //      //   >
  //      //     <span
  //      //       aria-hidden="true"
  //      //       className={`${
  //      //         theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
  //      //       } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
  //      //     />
  //      //   </Switch>
  //      // </Switch.Group>
  //    )
  //  }, [handleThemeSwitch, theme])
  return (
    <div className="tw-relative tw-inline-flex">
      <button
        ref={trigger}
        className="tw-inline-flex tw-justify-center tw-items-center tw-group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img className="tw-w-8 tw-h-8 tw-rounded-full" src={userAVT} width="32" height="32" alt="User" />
      </button>

      <Transition
        className={`tw-origin-top-right tw-z-10 tw-absolute tw-top-full tw-min-w-44 tw-bg-white tw-border tw-border-slate-200 tw-py-1.5 tw-rounded tw-shadow-lg tw-overflow-hidden tw-mt-1 ${align === 'right' ? 'tw-right-0' : 'tw-left-0'}`}
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
          <div className='tw-px-2 tw-py-1'>
            <select className="tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-font-bold tw-text-gray-700  tw-border tw-border-gray-300 focus:tw-border-indigo-500 focus:tw-outline-none tw-shadow">
              {languageOptions.map((option, index) => (
                <option key={index} value={option.value} className='tw-font-bold tw-py-2'>
                  {option.flag}&nbsp;&nbsp;&nbsp;{option.label}&nbsp;&nbsp;{option.value === selectedLanguage && '✔'}
                </option>
              ))}
            </select>
          </div>
          <ul>
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

            {(data === 'R1' || data === 'R2') && (

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
            )}
            <li>
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
                to="/blog"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <NewspaperIcon className="tw-mr-2" />
                {t('dropdown.blog')}
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
            </li>
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
                  {t('dropdown.gottoadmin')}
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
          <div className='tw-space-x-2 tw-flex'>
            <button className="tw-flex-1 tw-border tw-rounded-lg tw-btn-sm tw-border-slate-300 hover:tw-border-slate-400 tw-text-slate-600 tw-p-2 tw-font-bold tw-text-sm" onClick={(e) => { e.stopPropagation(); setChoiceModalOpen(false) }}>{t('homepage.decline')}</button>
            <button className="tw-flex-1 tw-border tw-rounded-lg tw-btn-sm tw-bg-indigo-500 hover:tw-bg-indigo-600 tw-text-white tw-p-2 tw-font-bold tw-text-sm" onClick={handleLogout}>{t('homepage.continue')}</button>
          </div>
        </div>
      </ChoiceModal>
    </div>
  )
}

export default DropdownProfile
