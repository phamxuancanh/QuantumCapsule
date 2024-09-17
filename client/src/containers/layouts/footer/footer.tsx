import React from 'react'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Logo from '../../../assets/logoEL2.png'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <div className='tw-bg-neutral-800 tw-text-white tw-mt-10'>
      <div className="tw-container tw-mx-auto tw-px-4 sm:tw-grid tw-flex tw-flex-col sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-8 tw-pt-10">

        <div className="tw-col-span-1 tw-flex tw-items-center tw-justify-center">
          <img src={Logo} alt="QuantumCapsule" className="tw-w-32 tw-h-32 sm:tw-w-40 sm:tw-h-40 tw-rounded-full" />
        </div>

        <div className="tw-col-span-1">
          <h2 className="tw-text-xl tw-font-bold tw-mb-4 tw-border-b tw-pb-3">{t('footer.contact_with_us')}</h2>
          <address className="tw-not-italic tw-mb-4 tw-font-semibold tw-cursor-pointer tw-flex tw-items-center">
            <PlaceOutlinedIcon className='tw-mr-2' />{t('footer.address')}
          </address>
          <p className="tw-mb-2 tw-font-semibold tw-cursor-pointer tw-flex tw-items-center"><LocalPhoneOutlinedIcon className='tw-mr-2' />+84-(0)28-3829-3991</p>
          <p>
            <a href="mailto:hotro@sorimachigroup.vn" className="hover:tw-underline tw-font-semibold tw-cursor-pointer tw-flex tw-items-center">
              <LocalPostOfficeOutlinedIcon className='tw-mr-2' />daotao@prd.edu.vn
            </a>
          </p>
        </div>

        <div className="tw-col-span-2">
          <h2 className="tw-text-xl tw-font-bold mb-4 tw-border-b tw-pb-3">{t('footer.missions')}</h2>
          <p className="tw-mb-4 tw-italic">{t('footer.introduction')}</p>
        </div>
      </div>

      <div className="tw-text-center tw-mt-8 tw-border-t tw-border-white tw-pt-4 tw-pb-4 tw-mx-4 lg:tw-mx-28">
        QC VIET NAM &copy; 2024 All Rights Reserved.
      </div>
                {/* <div className="tw-hidden lg:tw-flex lg:tw-items-center lg:tw-justify-center lg:tw-flex-1 lg:tw-space-x-2">
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
          </div> */}
    </div>
  )
}

export default Footer
