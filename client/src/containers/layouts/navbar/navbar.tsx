import React, { useCallback, useMemo, FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'services/i18n'
import ROUTES from 'routes/constant'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Notifications from '../../../components/dropdown/dropdown_notification'
import UserMenu from '../../../components/dropdown/dropdown_usermenu'
const Navbar = () => {
  const { t, i18n } = useTranslation()

  const location = useLocation()
  const { pathname } = location
  return (
    <header className='tw-sticky tw-top-0 tw-bg-white tw-border-b tw-border-slate-200 tw-z-30 tw-shadow-bottom'>
      <div className='tw-px-4 sm:tw-px-6 lg:tw-px-8'>
        <div className="tw-flex tw-items-center tw-justify-between tw-h-16 tw--mb-px">

          {/* Header: Left side */}
          <div className="tw-flex">
            {/* Logo */}
            <a href="/" className="tw-flex-shrink-0 tw-flex tw-items-center">
              <p className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-teal-600 tw-font-bold">Quantum Capsule</p>
            </a>
          </div>
          {/* Header: Center */}
          <div className="tw-hidden lg:tw-flex lg:tw-items-center lg:tw-justify-center lg:tw-flex-1 lg:tw-space-x-2">
            {/* Home */}
            <a href="/" className={`tw-block tw-p-1 tw-font-bold ${pathname === '/' ? 'tw-text-white tw-bg-teal-300' : 'tw-text-gray-500'} hover:tw-text-neutral-400 tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Home
            </a>
            {/* About */}
            <a href="/about" className={`tw-block tw-p-1 tw-font-bold ${pathname.includes('about') ? 'tw-text-white tw-bg-teal-300' : 'tw-text-gray-500'} hover:tw-text-neutral-400 tw-truncate tw-transition tw-duration-150 ${pathname.includes('about') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              About
            </a>
            {/* Contact us */}
            <a href="/contact" className={`tw-block tw-p-1 tw-font-bold ${pathname.includes('contact') ? 'tw-text-white tw-bg-teal-300' : 'tw-text-gray-500'} hover:tw-text-neutral-400 tw-truncate tw-transition tw-duration-150 ${pathname.includes('contact') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Contact us
            </a>
            {/* Cart */}
            <a href="/cart" className={`tw-items-center tw-flex tw-p-1 tw-font-bold tw-space-x-2 ${pathname.includes('cart') ? 'tw-text-white tw-bg-teal-300' : 'tw-text-gray-500'} hover:tw-text-neutral-400 tw-truncate tw-transition tw-duration-150 ${pathname.includes('cart') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              <div>Cart</div>
              <ShoppingCartOutlinedIcon sx={{ color: 'teal' }} />
            </a>
          </div>

          <div className="tw-flex tw-items-center tw-space-x-3">
            <div className='lg:tw-hidden'>
              <a href="/cart">
                <ShoppingCartOutlinedIcon className="tw-w-4 tw-h-4" sx={{ color: 'teal' }} />
              </a>
            </div>
            <div className="tw-flex tw-items-center tw-space-x-3">
            {/* Cart */}
            <Notifications align="right" />
            {/*  Divider */}
            <hr className="tw-w-px tw-h-6 tw-bg-slate-200 tw-mx-3" />
            <UserMenu align="right" />

          </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
