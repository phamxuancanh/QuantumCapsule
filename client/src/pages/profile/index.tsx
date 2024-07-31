/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PAGE: Profile
   ========================================================================== */
   import React from 'react'
   import AccountPanel from '../profile/components/profile_panel'
   
   function Profile () {
     return (

         <div className="tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-w-full tw-max-w-9xl tw-mx-auto">
           <div className="tw-bg-white tw-shadow-lg tw-rounded-sm tw-mb-8">
             <div className="tw-flex tw-flex-col md:tw-flex-row md:-tw-mr-px">
               <AccountPanel />
             </div>
           </div>
   
         </div>
     )
   }
   
   export default Profile
   