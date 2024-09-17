/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: UserPage
   ========================================================================== */
   import React, { useState, useRef, useEffect } from 'react'
   import { Link } from 'react-router-dom'
   import Transition from '../../utils/transition'
   import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
   
   interface DropdownNotificationProps {
     align: string
   }
   function DropdownNotification ({ align }: DropdownNotificationProps) {
     const [dropdownOpen, setDropdownOpen] = useState(false)
   
     const dropdown = useRef<HTMLDivElement | null>(null)
     const trigger = useRef<HTMLButtonElement | null>(null)
   
     // close on click outside
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
   
     return (
         <div className="tw-relative tw-inline-flex">
           <button
             ref={trigger}
             className={`tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-bg-slate-100 hover:tw-bg-slate-200 tw-transition tw-duration-150 tw-rounded-full ${dropdownOpen && 'tw-bg-slate-200'}`}
             aria-haspopup="true"
             onClick={() => setDropdownOpen(!dropdownOpen)}
             aria-expanded={dropdownOpen}
           >
             <span className="tw-sr-only">Notifications</span>
             <div className="tw-absolute tw-top-0 tw-right-0 tw-w-2.5 tw-h-2.5 tw-bg-rose-500 tw-border-2 tw-border-white tw-rounded-full"></div>
             <NotificationsNoneOutlinedIcon sx={{ color: 'green' }} />
           </button>
   
         <Transition
           className={`tw-origin-top-right tw-z-10 tw-absolute tw-top-full -tw-mr-48 sm:tw-mr-0 tw-min-w-80 tw-bg-white tw-border tw-border-slate-200 tw-py-1.5 tw-rounded tw-shadow-lg tw-overflow-hidden tw-mt-1 ${align === 'right' ? 'tw-right-0' : 'tw-left-0'}`}
           show={dropdownOpen}
           enter="tw-transition tw-ease-out tw-duration-200 tw-transform"
           enterStart="tw-opacity-0 -tw-translate-y-2"
           enterEnd="tw-opacity-100 tw-translate-y-0"
           leave="tw-transition tw-ease-in tw-duration-200"
           leaveStart="tw-opacity-100"
           leaveEnd="tw-opacity-0"
         >
             <div
               ref={dropdown}
               onFocus={() => setDropdownOpen(true)}
               onBlur={() => setDropdownOpen(false)}
             >
               <div className="tw-text-xs tw-font-semibold tw-text-slate-400 tw-uppercase tw-pt-1.5 tw-pb-2 tw-px-4">Notifications</div>
               <ul>
                 <li className="tw-border-b tw-border-slate-200 last:tw-border-0">
                   <Link
                     className="tw-block tw-py-2 tw-px-4 hover:tw-bg-slate-50"
                     to="#0"
                     onClick={() => setDropdownOpen(!dropdownOpen)}
                   >
                     <span className="tw-block tw-text-sm tw-mb-2">📣 <span className="tw-font-medium tw-text-slate-800">Edit your information in a swipe</span> Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</span>
                     <span className="tw-block tw-text-xs tw-font-medium tw-text-slate-400">Feb 12, 2021</span>
                   </Link>
                 </li>
                 <li className="tw-border-b tw-border-slate-200 last:tw-border-0">
                   <Link
                     className="tw-block tw-py-2 tw-px-4 hover:tw-bg-slate-50"
                     to="#0"
                     onClick={() => setDropdownOpen(!dropdownOpen)}
                   >
                     <span className="tw-block tw-text-sm tw-mb-2">📣 <span className="tw-font-medium tw-text-slate-800">Edit your information in a swipe</span> Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</span>
                     <span className="tw-block tw-text-xs tw-font-medium tw-text-slate-400">Feb 9, 2021</span>
                   </Link>
                 </li>
                 <li className="tw-border-b tw-border-slate-200 last:tw-border-0">
                   <Link
                     className="tw-block tw-py-2 tw-px-4 hover:tw-bg-slate-50"
                     to="#0"
                     onClick={() => setDropdownOpen(!dropdownOpen)}
                   >
                     <span className="tw-block tw-text-sm tw-mb-2">🚀<span className="tw-font-medium tw-text-slate-800">Say goodbye to paper receipts!</span> Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</span>
                     <span className="tw-block tw-text-xs tw-font-medium tw-text-slate-400">Jan 24, 2020</span>
                   </Link>
                 </li>
               </ul>
             </div>
           </Transition>
         </div>
     )
   }
   
   export default DropdownNotification
   