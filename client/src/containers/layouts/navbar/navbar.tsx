import React, { useCallback, useMemo, FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'services/i18n'
import ROUTES from 'routes/constant'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Notifications from '../../../components/dropdown/dropdown_notification'
import UserMenu from '../../../components/dropdown/dropdown_usermenu'
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { t, i18n } = useTranslation()

  const location = useLocation()
  const { pathname } = location
  return (
    <header className='tw-sticky tw-top-0 tw-bg-white tw-border-b tw-border-slate-200 tw-z-30 tw-shadow-bottom tw-flex-col'>
      <div className='tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-w-full tw-flex tw-justify-center'>
        <div className="tw-flex tw-h-16 tw--mb-px tw-space-x-4 tw-w-3/4">
          <div className="tw-flex">
            <a href="/" className="tw-flex-shrink-0 tw-flex tw-items-center">
              <p className="tw-font-bold">
                <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-teal-600">VIO</span>
                <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-amber-800">EDU</span>
              </p>
            </a>
          </div>
          <div className="tw-hidden lg:tw-flex lg:tw-items-center lg:tw-justify-center lg:tw-flex-1 lg:tw-space-x-2">
            <a href="/" className={`tw-block tw-p-1 tw-font-bold ${pathname === '/' ? 'tw-text-slate-600 ' : 'tw-text-gray-500'} hover:tw-text-black tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-black'} tw-rounded px-2`}>
              support@vio.edu.vn
            </a>
            <a href="/facebook" className={`tw-block tw-p-1 tw-font-bold ${pathname.includes('facebook') ? 'tw-text-slate-600 ' : 'tw-text-gray-500'} hover:tw-text-black tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-black'} tw-rounded px-2`}>
              Facebook VioEdu
            </a>
            <a href="/canh" className={`tw-block tw-p-1 tw-font-bold ${pathname.includes('about') ? 'tw-text-slate-600' : 'tw-text-gray-500'} hover:tw-text-black tw-truncate tw-transition tw-duration-150 ${pathname.includes('about') && 'hover:tw-text-black'} tw-rounded px-2`}>
              0934060177
            </a>
            <a href="/nam" className={`tw-block tw-p-1 tw-font-bold ${pathname.includes('contact') ? 'tw-text-slate-600' : 'tw-text-gray-500'} hover:tw-text-black tw-truncate tw-transition tw-duration-150 ${pathname.includes('contact') && 'hover:tw-text-black'} tw-rounded px-2`}>
              033660652
            </a>
          </div>

          <div className="tw-flex tw-items-center tw-space-x-3">
            <div className='lg:tw-hidden'>
              <a href="/cart">
                <ShoppingCartOutlinedIcon className="tw-w-4 tw-h-4" sx={{ color: 'teal' }} />
              </a>
            </div>
            <div className="tw-flex tw-items-center tw-space-x-3">
              <Notifications align="right" />
              <hr className="tw-w-px tw-h-6 tw-bg-slate-200 tw-mx-3" />
              <UserMenu align="right" />

            </div>
          </div>
        </div>
      </div>
      {/* Head thu 222222222222222222222222222222222222222222222222222222222222222222222222222222222222222 */}
      <div className='tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-w-full tw-flex tw-justify-center tw-bg-green-400'>
        <div className="tw-flex tw-items-center tw-justify-between tw-h-16 tw--mb-px tw-w-3/5">
          <div className="tw-hidden lg:tw-flex lg:tw-items-center lg:tw-justify-center lg:tw-flex-1 lg:tw-space-x-2">
            <Link to="/" className={`tw-block tw-p-4 tw-font-bold ${pathname === '/' ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Vao hoc
            </Link>
            <Link to="/gift-exchange" className={`tw-block tw-p-4 tw-font-bold ${pathname.includes('gift-exchange') ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname.includes('about') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Doi qua
            </Link>
            <Link to="/dashboard-report" className={`tw-block tw-p-4 tw-font-bold ${pathname.includes('dashboard-report') ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname.includes('contact') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Danh gia
            </Link>
            <Link to="/package" className={`tw-block tw-p-4 tw-font-bold ${pathname.includes('package') ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname.includes('contact') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Mua khoa hoc
            </Link>
            <Link to="/news" className={`tw-block tw-p-4 tw-font-bold ${pathname.includes('news') ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname.includes('contact') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Tin tuc
            </Link>
            <Link to="/gianhangvio" className={`tw-block tw-p-4 tw-font-bold ${pathname.includes('gianhangvio') ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname.includes('contact') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
              Gian hang Vio
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
