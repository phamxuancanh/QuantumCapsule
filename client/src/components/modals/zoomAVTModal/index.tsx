/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react'

import Transition from '../../../utils/transition'
interface Props {
  children?: React.ReactNode
  id?: string
  title: string
  modalOpen: boolean
  setModalOpen: (value: boolean) => void
}
const ZoomModal = ({
  children,
  id,
  title,
  modalOpen,
  setModalOpen
}: Props) => {
  const modalContent = useRef(null)
  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="tw-fixed tw-inset-0 tw-bg-slate-900 tw-bg-opacity-30 tw-z-50 tw-transition-opacity"
        show={modalOpen}
        enter="tw-transition tw-ease-out tw-duration-200"
        enterStart="tw-opacity-0"
        enterEnd="tw-opacity-100"
        leave="tw-transition tw-ease-out tw-duration-100"
        leaveStart="tw-opacity-100"
        leaveEnd="tw-opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="tw-fixed tw-inset-0 tw-z-50 tw-overflow-hidden tw-flex tw-items-center tw-my-4 tw-justify-center tw-px-4 sm:tw-px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="tw-transition tw-ease-in-out tw-duration-200"
        enterStart="tw-opacity-0 tw-translate-y-4"
        enterEnd="tw-opacity-100 tw-translate-y-0"
        leave="tw-transition tw-ease-in-out tw-duration-200"
        leaveStart="tw-opacity-100 tw-translate-y-0"
        leaveEnd="tw-opacity-0 tw-translate-y-4"
      >
        <div ref={modalContent} className="tw-bg-white tw-rounded tw-shadow-lg tw-overflow-auto tw-max-w-lg tw-w-full tw-max-h-full">
          <div className="tw-p-5">
            {/* Modal header */}
            <div className="tw-mb-2">
              <div className="tw-flex tw-justify-between tw-items-center">
                <div className="tw-text-lg tw-font-semibold tw-text-slate-800">{title}</div>
                <button className="tw-text-slate-400 hover:tw-text-slate-500" onClick={(e) => { e.stopPropagation(); setModalOpen(false) }}>
                  <div className="tw-sr-only">Close</div>
                  <svg className="tw-w-4 tw-h-4 tw-fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
            </div>
            {children}
          </div>
        </div>
      </Transition>
    </>
  )
}

export default ZoomModal


