/* LOADABLE FALLBACK COMPONENT: LOADING
   ========================================================================== */
   import React from 'react'
   import { PacmanLoader } from 'react-spinners'
   const Loading = () => {
     return <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-140 tw-mt-20">
       <PacmanLoader
         className='tw-flex tw-justify-center tw-items-center tw-w-full tw-mt-20'
         color='#5EEAD4'
         cssOverride={{
           display: 'block',
           margin: '0 auto',
           borderColor: 'blue'
         }}
         loading
         margin={10}
         speedMultiplier={3}
         size={40}
       /></div>
   }
   
   export default Loading