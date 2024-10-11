/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: UserPage
   ========================================================================== */
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Transition from '../../utils/transition'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { setNotification, deleteNotification, selectNotifications, selectTotalNotifications, updateStatus, updateAllStatus, removeAllNotificationsSlice, setTotal } from '../../redux/notification/notifySlice'
import { getNotifications, readNotification, readAllNotification, markUnread, markAllUnread, removeNotification, removeAllNotification } from '../../api/notification/notification.api'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { PulseLoader } from 'react-spinners'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import LensIcon from '@mui/icons-material/Lens'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { toast } from 'react-toastify'
import NotifiyIcon from '../../assets/icon_math_on.png'
interface DropdownNotificationProps {
  align: string
}
function DropdownNotification({ align }: DropdownNotificationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdown = useRef<HTMLDivElement | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false)
  const { t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') ?? 'en'
  })
  useEffect(() => {
    setSelectedLanguage(localStorage.getItem('selectedLanguage') ?? 'en')
  }, [localStorage.getItem('selectedLanguage')])
  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id)
    setIsMainMenuOpen(false)
  }
  const toggleMainMenu = () => {
    setIsMainMenuOpen(!isMainMenuOpen)
    setOpenMenuId(null)
  }
  const dispatch = useDispatch()
  const notifications = useSelector((state: any) => selectNotifications(state))
  const total = useSelector((state: any) => selectTotalNotifications(state))

  const handleDeleteNotification = (id: string) => {
    dispatch(deleteNotification(id))
  }
  const handleUpdateUnreadStatus = (id: string) => {
    dispatch(updateStatus({ id, status: false }))
  }
  const handleUpdateMarkAsReadStatus = (id: string) => {
    dispatch(updateStatus({ id, status: true }))
  }
  const loadNotifications = async (isScroll: boolean = false) => {
    if (isScroll) {
      setIsLoading(true)
    }
    try {
      const res = await getNotifications(5, offset)
      console.log('res', res)
      if (res.data.notifications.length < 5) {
        setHasMore(false)
      }
      dispatch(setTotal(res.data.total))

      const notifications = res.data.notifications.map((notification: { id: any, notificationId: any, status: any, userId: any, createdAt: any, updatedAt: any, Notification: { id: any, title: any, message: any, url: any, createdAt: any, updatedAt: any } }) => ({
        id: notification.id,
        notificationId: notification.notificationId,
        status: notification.status,
        userId: notification.userId,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        notificationDetails: {
          id: notification.Notification.id,
          title: notification.Notification.title,
          message: notification.Notification.message,
          url: notification.Notification.url,
          createdAt: notification.Notification.createdAt,
          updatedAt: notification.Notification.updatedAt
        }
      }))

      notifications.forEach((data: any) => {
        dispatch(setNotification(data))
      })

      setOffset((prevOffset) => prevOffset + 5)
    } catch (err) {
      console.error(err)
    } finally {
      if (isScroll) {
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    }
  }

  useEffect(() => {
    loadNotifications(true)
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
    if (bottom && hasMore) {
      loadNotifications(true)
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

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await readNotification({ recipientsId: id })
      if (response) {
        handleUpdateMarkAsReadStatus(id)
        await loadNotifications()
        setOpenMenuId(null)
      } else {
        console.error('Failed to mark as read')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAsUnread = async (id: string) => {
    try {
      const response = await markUnread({ recipientsId: id })
      if (response) {
        handleUpdateUnreadStatus(id)
        await loadNotifications()
        setOpenMenuId(null)
      } else {
        console.error('Failed to mark as unread')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveNotification = async (id: string) => {
    try {
      console.log('id', id)
      const response = await removeNotification({ recipientsId: id })
      if (response) {
        console.log('response', response)
        handleDeleteNotification(id)
        await loadNotifications()
        setOpenMenuId(null)
      } else {
        console.error('Failed to remove notification')
      }
    } catch (err) {
      console.error(err)
    }
  }
  const handleRemoveAllNotifications = async () => {
    try {
      await removeAllNotification()
      dispatch(removeAllNotificationsSlice())
      loadNotifications()
      setIsMainMenuOpen(false)
      setDropdownOpen(false)
      toast.success('All notifications have been removed')
    } catch (err) {
      console.error(err)
    }
  }
  const handleMarkAllAsRead = async () => {
    try {
      await readAllNotification()
      dispatch(updateAllStatus(true))
      setIsMainMenuOpen(false)
      loadNotifications()
      toast.success('All notifications have been marked as readdd')
    } catch (err) {
      console.error(err)
    }
  }
  const handleMarkAllAsUnread = async () => {
    try {
      await markAllUnread()
      dispatch(updateAllStatus(false))
      loadNotifications()
      setIsMainMenuOpen(false)
      toast.success('All notifications have been marked as unread')
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className="tw-relative tw-inline-flex">
      <button
        ref={trigger}
        className={`tw-mx-2 tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-bg-slate-100 hover:tw-bg-slate-200 tw-transition tw-duration-150 tw-rounded-full ${dropdownOpen && 'tw-bg-slate-200'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="tw-sr-only">{t('homepage.notifications')}</span>
        {total > 0 && (
          <div className="tw-absolute -tw-top-1.5 tw-left-7 tw-w-auto tw-px-1.5 tw-bg-rose-500 tw-font-bold tw-border-2 tw-border-white tw-rounded-lg tw-flex tw-justify-center tw-items-center tw-text-xs tw-text-white">
            {total}<br />
          </div>
        )}
        <NotificationsNoneOutlinedIcon sx={{ color: 'green' }} />
      </button>
      <Transition
        className={`tw-min-h-60 tw-w-80 tw-origin-top-right tw-z-10 tw-absolute tw-top-full tw-min-w-full tw-bg-white tw-border tw-border-slate-200 tw-py-1.5 tw-rounded tw-shadow-lg tw-overflow-hidden tw-mt-1 ${align === 'right' ? 'tw-right-0' : 'tw-left-0'}`}
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
          <div className="tw-text-xs tw-font-semibold tw-text-slate-400 tw-uppercase tw-pt-1.5 tw-pb-2 tw-px-4 tw-flex tw-items-center tw-justify-between">
            <div>{t('notification.notifications')}</div>
            <div className="tw-relative">
              <MoreHorizIcon
                className="tw-cursor-pointer tw-rounded-full hover:tw-bg-slate-200 tw-mx-4"
                onClick={toggleMainMenu}
              />
              {isMainMenuOpen && (
                <div className="tw-absolute tw-right-0 tw-mt-2 sm:tw-w-72 tw-w-40 tw-bg-green-200 tw-shadow-2xl tw-rounded-2xl tw-border tw-z-30">
                  <div className="tw-absolute -tw-top-2 tw-right-5 tw-w-0 tw-h-0 tw-border-l-8 tw-border-r-8 tw-border-b-8 tw-border-transparent tw-border-b-green-200"></div>
                  <ul className='tw-m-2 tw-text-xs tw-text-slate-800 tw-normal-case'>
                    <li className="tw-px-4 tw-py-2 hover:tw-bg-slate-100 tw-cursor-pointer tw-font-bold tw-rounded-2xl" onClick={async () => {
                      await handleMarkAllAsRead()
                    }}>
                      <CheckIcon className='tw-mr-2' />{t('notification.mark_all_as_read')}
                    </li>
                    <li className="tw-px-4 tw-py-2 hover:tw-bg-slate-100 tw-cursor-pointer tw-font-bold tw-rounded-2xl" onClick={async () => {
                      await handleMarkAllAsUnread()
                    }}>
                      <NotificationsIcon className='tw-mr-2' />{t('notification.mark_all_as_unread')}
                    </li>
                    <li className="tw-px-4 tw-py-2 hover:tw-bg-slate-100 tw-cursor-pointer tw-font-bold tw-rounded-2xl" onClick={async () => {
                      await handleRemoveAllNotifications()
                    }}>
                      <CloseIcon className='tw-mr-2' />{t('notification.removed_all_notifications')}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          {notifications.length === 0 ? (
            <div className="tw-h-60 tw-text-lg tw-px-4 tw-py-4 tw-text-center tw-text-slate-400 tw-flex tw-items-center tw-justify-center">
              {t('notification.no_notifications')}
            </div>
          ) : (
            <ul className="tw-h-128 tw-overflow-y-auto" onScroll={handleScroll}>
              {notifications.map((notification) => (
                <li key={notification.id} className={`tw-duration-300 tw-border-b tw-border-slate-200 ${isLoading ? '' : 'last:tw-border-0'} tw-flex tw-items-center ${notification.status ? 'tw-bg-white hover:tw-bg-slate-100' : 'tw-bg-slate-100'}`}>
                  <Link
                    className='tw-block tw-py-2 tw-px-4 tw-transition tw-w-5/6 tw-space-y-2'
                    to={notification.notificationDetails.url}
                    onClick={async () => {
                      setDropdownOpen(!dropdownOpen)
                      if (!notification.status) {
                        await handleMarkAsRead(notification.id)
                      }
                      console.log('notification', notification.notificationDetails.url)
                    }}
                  >
                    <div className='tw-flex tw-justify-between'>
                      <div className='tw-flex tw-space-x-2 tw-items-center'>
                        <img className='tw-rounded-full tw-w-10 tw-h-10 tw-bg-black' src={NotifiyIcon}></img>
                        <span className="tw-block tw-font-bold tw-text-black tw-mb-2">{notification.notificationDetails.title}</span>
                      </div>
                    </div>
                    <span className="tw-block tw-text-sm tw-mb-2">
                      📣{' '}
                      {notification.notificationDetails.message.split(' ').map((word, index) => (
                        word === 'Congratulations!' || word === 'completed!'
                          ? (
                            <span key={index} className="tw-font-medium tw-text-slate-800">{word}</span>
                            )
                          : (
                            <span key={index} className="tw-font-bold tw-text-slate-800"> {word} </span>
                            )
                      ))}
                    </span>
                    {selectedLanguage === 'en'
                      ? <span className="tw-block tw-text-xs tw-font-medium tw-text-slate-400">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      : <span className="tw-block tw-text-xs tw-font-medium tw-text-slate-400">
                        {new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    }

                  </Link>
                  {notification.status ? <div></div> : <LensIcon className='tw-text-blue-300' fontSize='small' />}
                  {notification.status ? <div></div> : <div className='tw-rounded-full tw-bg-green-500'></div>}
                  <div className="tw-relative">
                    <MoreHorizIcon
                      className="tw-cursor-pointer tw-rounded-full hover:tw-bg-slate-200 tw-mx-4"
                      onClick={() => toggleMenu(parseInt(notification.id))}
                    />
                    {openMenuId === parseInt(notification.id) && (
                      <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-72 tw-bg-green-500 tw-shadow-2xl tw-rounded-2xl tw-border tw-z-30">
                        <div className="tw-absolute -tw-top-2 tw-right-5 tw-w-0 tw-h-0 tw-border-l-8 tw-border-r-8 tw-border-b-8 tw-border-transparent tw-border-b-green-200"></div>
                        <ul className='tw-m-2 tw-text-xs tw-text-slate-800'>
                          <li
                            className={`tw-px-4 tw-py-2 tw-cursor-pointer tw-font-bold tw-rounded-2xl ${notification.status ? 'tw-cursor-not-allowed tw-opacity-50' : 'hover:tw-bg-slate-100'}`}
                            onClick={async () => {
                              if (!notification.status) {
                                console.log('notification.id', notification.id)
                                await handleMarkAsRead(notification.id)
                              }
                            }}
                          >
                            <CheckIcon className='tw-mr-2' />{t('notification.mark_as_read')}
                          </li>
                          <li
                            className={`tw-px-4 tw-py-2 tw-cursor-pointer tw-font-bold tw-rounded-2xl ${notification.status ? 'hover:tw-bg-slate-100' : 'tw-cursor-not-allowed tw-opacity-50'}`}
                            onClick={async () => {
                              if (notification.status) {
                                await handleMarkAsUnread(notification.id)
                              }
                            }}
                          >
                            <NotificationsIcon className='tw-mr-2' />{t('notification.mark_as_unread')}
                          </li>
                          <li
                            className='tw-px-4 tw-py-2 hover:tw-bg-slate-100 tw-cursor-pointer tw-font-bold tw-rounded-2xl'
                            onClick={async () => {
                              await handleRemoveNotification(notification.id)
                            }}
                          >
                            <CloseIcon className='tw-mr-2' />{t('notification.removed_notification')}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* <ul className="tw-h-128 tw-overflow-y-auto" onScroll={handleScroll}>
            {notifications.map((notification) => (
              <li key={notification.id} className={`tw-duration-300 tw-border-b tw-border-slate-200  ${isLoading ? '' : 'last: tw-border-0'} tw-flex tw-items-center ${notification.status ? 'tw-bg-white hover:tw-bg-slate-100' : 'tw-bg-slate-100'}`}>
                <Link
                  className='tw-block tw-py-2 tw-px-4 tw-transition tw-w-5/6 tw-space-y-2'
                  to={notification.notificationDetails.url}
                  onClick={async () => {
                    setDropdownOpen(!dropdownOpen)
                    if (!notification.status) {
                      await handleMarkAsRead(notification.id)
                    }
                    console.log('notification', notification.notificationDetails.url)
                  }}
                >
                  <div className='tw-flex tw-justify-between'>
                    <div className='tw-flex tw-space-x-2 tw-items-center'>
                      <img className='tw-rounded-full tw-w-10 tw-h-10 tw-bg-black' src={NotifiyIcon}></img>
                      <span className="tw-block tw-font-bold tw-text-black tw-mb-2">{notification.notificationDetails.title}</span>
                    </div>
                  </div>
                  <span className="tw-block tw-text-sm tw-mb-2">
                    📣{' '}
                    {notification.notificationDetails.message.split(' ').map((word: string, index: React.Key | null | undefined) => (
                      word === 'Congratulations!' || word === 'completed!'
                        ? (
                          <span key={index} className="tw-font-medium tw-text-slate-800">{word}</span>
                          )
                        : (
                          <span key={index} className="tw-font-bold tw-text-slate-800"> {word} </span>
                          )
                    ))}
                  </span>
                  {selectedLanguage === 'en'
                    ? <span className="tw-block tw-text-xs tw-font-medium tw-text-slate-400">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    : <span className="tw-block tw-text-xs tw-font-medium tw-text-slate-400">
                      {new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  }

                </Link>
                {notification.status ? <div></div> : <LensIcon className='tw-text-blue-300' fontSize='small' />}
                {notification.status ? <div></div> : <div className='tw-rounded-full tw-bg-teal-300'></div>}
                <div className="tw-relative">
                  <MoreHorizIcon
                    className="tw-cursor-pointer tw-rounded-full hover:tw-bg-slate-200 tw-mx-4"
                    onClick={() => toggleMenu(parseInt(notification.id))}
                  />
                  {openMenuId === parseInt(notification.id) && (
                    <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-72 tw-bg-teal-200 tw-shadow-2xl tw-rounded-2xl tw-border tw-z-30">
                      <div className="tw-absolute -tw-top-2 tw-right-5 tw-w-0 tw-h-0 tw-border-l-8 tw-border-r-8 tw-border-b-8 tw-border-transparent tw-border-b-teal-200"></div>
                      <ul className='tw-m-2 tw-text-xs tw-text-slate-800'>
                        <li
                          className={`tw-px-4 tw-py-2 tw-cursor-pointer tw-font-bold tw-rounded-2xl ${notification.status ? 'tw-cursor-not-allowed tw-opacity-50' : 'hover:tw-bg-slate-100'}`}
                          onClick={async () => {
                            if (!notification.status) {
                              console.log('notification.id', notification.id)
                              await handleMarkAsRead(notification.id)
                            }
                          }}
                        >
                          <CheckIcon className='tw-mr-2' />{t('notification.mark_as_read')}
                        </li>
                        <li
                          className={`tw-px-4 tw-py-2 tw-cursor-pointer tw-font-bold tw-rounded-2xl ${notification.status ? 'hover:tw-bg-slate-100' : 'tw-cursor-not-allowed tw-opacity-50'}`}
                          onClick={async () => {
                            if (notification.status) {
                              await handleMarkAsUnread(notification.id)
                            }
                          }}
                        >
                          <NotificationsIcon className='tw-mr-2' />{t('notification.mark_as_unread')}
                        </li>
                        <li
                          className='tw-px-4 tw-py-2 hover:tw-bg-slate-100 tw-cursor-pointer tw-font-bold tw-rounded-2xl'
                          onClick={async () => {
                            await handleRemoveNotification(notification.id)
                          }}
                        >
                          <CloseIcon className='tw-mr-2' />{t('notification.removed_notification')}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul> */}
          {isLoading && (
            <PulseLoader
              className="tw-flex tw-justify-center tw-items-center tw-w-full tw-mt-20 tw-text-center"
              color="#000000"
              cssOverride={{
                display: 'block',
                margin: '0 auto',
                borderColor: 'blue'
              }}
              loading
              speedMultiplier={1}
              size={10}
            />
          )}
        </div>
      </Transition>
    </div>
  )
}

export default DropdownNotification
