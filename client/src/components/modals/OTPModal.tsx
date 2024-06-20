import React, { useState } from 'react';
interface OTPModalProps {
    onClose: () => void; // Thêm prop này
  }
  const OTPModal: React.FC<OTPModalProps> = ({ onClose }) => {
  const [otp, setOtp] = useState(Array(6).fill(''))

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleResend = () => {
    // Logic to resend OTP
    console.log('Resend OTP')
  };

  const handleVerify = () => {
    // Logic to verify OTP
    console.log('OTP entered: ', otp.join(''))
  }

  return (
    <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-500 tw-bg-opacity-50 tw-z-50">
      <div className="tw-bg-white tw-p-8 rounded tw-shadow-md tw-text-center">
      <button onClick={onClose} className="tw-top-2 tw-right-2">
          {/* < className="tw-h-6 tw-w-6" /> */}x
        </button>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">Nhập mã OTP, mã OTP đã được gửi về mail của bạn</h2>
        <div className="tw-flex tw-justify-center tw-mb-4 tw-space-x-2">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="tw-w-10 tw-h-10 tw-text-center tw-border tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        <div className="tw-flex tw-justify-center tw-space-x-4">
          <button
            onClick={handleResend}
            className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded hover:tw-bg-blue-600"
          >
            Gửi lại OTP
          </button>
          <button
            onClick={handleVerify}
            className="tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded hover:tw-bg-green-600"
          >
            Xác thực
          </button>
        </div>
      </div>
    </div>
  )
}

export default OTPModal;
