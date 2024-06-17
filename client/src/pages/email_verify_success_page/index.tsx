import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ROUTES from 'routes/constant'
import { t } from "i18next";
const EmailVerifySuccessPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    if(countdown === 0) navigate(ROUTES.sign_in, {replace: true});

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="tw-bg-teal-700 tw-min-h-screen tw-flex tw-items-center tw-justify-center">
            <div className="tw-bg-white tw-w-[500px] tw-rounded-lg tw-text-center">
                <div
                    className="tw-relative tw-bg-[#E5E8FD] tw-h-32 tw-rounded-t-lg"
                    style={{
                        borderBottomLeftRadius: "50% 3rem",
                        borderBottomRightRadius: "50% 3rem",
                    }}
                >
                    <div
                        className="tw-absolute tw-left-1/2 -tw-translate-x-1/2 bottom-0 tw-translate-y-1/2 tw-w-24 tw-h-24 tw-border-4 tw-border-solid tw-border-white tw-rounded-full tw-bg-teal-700 tw-flex tw-items-center tw-justify-center"
                    >
                        <div className="tw-relative">
                            <img
                                className="tw-w-16 tw-h-16"
                                src="https://cdn-icons-png.flaticon.com/256/1804/1804188.png"
                                alt=""
                            />
                            <div
                                className="tw-absolute tw-bottom-0 tw-right-0 tw-w-6 tw-h-6 tw-text-sm tw-flex tw-items-center tw-justify-center tw-bg-green-500 tw-text-white tw-rounded-full">
                                <i className="fa-solid fa-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-px-14 tw-py-16">
                    <p className="tw-font-bold tw-text-gray-800 tw-text-xl">{t('verify_success.verified')}</p>
                    <p className="tw-text-gray-600 tw-text-sm tw-font-medium tw-mt-8">
                    {t('verify_success.message2')}<br/>
                    {t('verify_success.message3')}
                    </p>
                    <Link to={ROUTES.sign_in} replace={true}
                        className="tw-px-4 tw-py-1.5 tw-rounded-full tw-bg-blue-400 hover:tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-mb-5">
                        <button className="tw-mt-8">
                        {t('verify_success.go_to_login')} ({countdown})
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EmailVerifySuccessPage;
