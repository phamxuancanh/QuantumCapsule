import React, { useState, useRef, useEffect } from 'react'
import { verifyOTP, sendOTP } from 'api/post/post.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'routes/constant'
import CloseIcon from '@mui/icons-material/Close'
import { ClockLoader } from 'react-spinners'
interface OTPModalProps {
  onClose: () => void
  email: string
}

const OTPModal: React.FC<OTPModalProps> = ({ onClose, email }) => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [errorOTP, setErrorOTP] = useState<string>('');
  const [loading, setLoading] = useState(false)

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Chuyển tới ô tiếp theo nếu có
      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  async function handleResend () {
    console.log('start')
    setLoading(true)

    const result = await sendOTP({ email })
    if (result?.data) {
        setTimeout(() => {
            setLoading(false)
            toast.success('OTP code has been resent to your email')
        }, 2000)
    } else {
        setLoading(false)
        alert('Unexpected response from server');
    }
  };

  async function handleVerify() {
    const otpCode = otp.join('');
    // Kiểm tra ngay lập tức nếu otpCode rỗng
    if (!otpCode) {
      toast.error('OTP code cannot be empty.');
      return;
    }
    // Bắt đầu loading chỉ khi otpCode không rỗng
    setLoading(true);
    try {
      const response = await verifyOTP({ email: email, otp: otpCode });
      setTimeout (() => {
      if (response) {
        toast.success('Verify success')
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        navigate(ROUTES.reset_password, { state: { email: email } })
      } else {
        alert('Verify failed');
        setLoading(false);
      }
    }, 2000);
    } catch (error) {
      setTimeout(() => { // Đặt toàn bộ logic xử lý lỗi vào trong setTimeout
        console.log(error);
        setLoading(false);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          const message = String(error.message);
          if (message) {
            setErrorOTP(message);
            toast.error(message);
          }
        }
        setOtp(Array(6).fill(''));
      }, 2000)
    }
  }
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-500 tw-bg-opacity-50 tw-z-30">
      {loading && (
        <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-opacity-50">
          <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-140 tw-mt-20">
            <ClockLoader
              className='tw-flex tw-justify-center tw-items-center tw-w-full tw-mt-20'
              color='#5EEAD4'
              cssOverride={{
                display: 'block',
                margin: '0 auto',
                borderColor: 'blue'
              }}
              loading
              // margin={10}
              speedMultiplier={3}
              size={40}
            />
          </div>
        </div>
      )}
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-text-center">
        <div className='tw-text-right tw-p-3 tw-cursor-pointer' onClick={onClose}><CloseIcon className='tw-rounded-3xl hover:tw-bg-gray-500'/></div>
        <div className='tw-pb-8 tw-px-8'>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">
          Nhập mã OTP, mã OTP đã được gửi về mail <br/><div className='tw-text-blue-500'>{email}</div>
        </h2>
        <div className="tw-flex tw-justify-center tw-mb-4 tw-space-x-2">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"

              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
              className="tw-w-10 tw-h-10 tw-text-center tw-border tw-rounded-lg tw-font-bold focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </div>
        <div className="tw-flex tw-justify-center tw-space-x-4">
          <button
            type="submit"
            onClick={handleResend}
            className="tw-font-bold tw-px-4 tw-py-2 tw-bg-sky-500 tw-text-white tw-rounded-2xl tw-transition-colors tw-duration-300 ease-in-out hover:tw-bg-sky-600"
          >
            Gửi lại OTP
          </button>
          <button
            type="submit"
            onClick={handleVerify}
            className="tw-font-bold tw-px-4 tw-py-2 tw-bg-teal-600 tw-text-white tw-rounded-2xl tw-transition-colors tw-duration-300 ease-in-out hover:tw-bg-teal-700"
          >
            Xác thực
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
