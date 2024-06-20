// import {useSendVerifyEmail} from "../../apis/useSendVerifyEmail";
import { t } from "i18next";
import {useLocation} from "react-router-dom";

const EmailVerifySendPage = () => {
    const location = useLocation();
    const userInfo = location.state;
    const email = userInfo?.email;
    const displayName = userInfo?.display_name;

    // const sendVerifyEmail = useSendVerifyEmail();

    // const handleBtnResendClick = () => {
    //     sendVerifyEmail(email);
    // }

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
                    <div className="tw-absolute tw-left-1/2 -tw-translate-x-1/2 bottom-0 tw-translate-y-1/2 tw-w-24 tw-h-24 tw-border-4 tw-border-solid tw-border-white tw-rounded-full tw-bg-teal-700 tw-flex tw-items-center tw-justify-center">
                        <img
                            className="tw-w-16 tw-h-16"
                            src="https://cdn-icons-png.flaticon.com/256/1804/1804188.png"
                            alt=""
                        />
                    </div>
                </div>
                <div className="tw-px-5 sm:tw-px-14 tw-py-16 tw-pb-8">
                    <p className="tw-font-bold tw-text-gray-800 tw-text-xl">{t('email_verify_send.check')}</p>
                    <p className="tw-text-gray-600 tw-text-sm tw-font-medium tw-mt-5">
                        {t('email_verify_send.hello')}<b className="tw-font-bold tw-text-gray-800">{displayName}</b>, {t('email_verify_send.vrf1')}<br/>
                        {t('email_verify_send.vrf2_part1')} <b className="tw-font-bold tw-text-gray-800">{email}</b> {t('email_verify_send.vrf2_part2')}
                    </p>
                    <button className="tw-px-4 tw-py-1.5 tw-rounded-full tw-bg-blue-400 tw-text-white tw-text-sm tw-font-semibold tw-mt-7">
                    {t('email_verify_send.sure')}
                    </button>
                    <p className="tw-font-medium tw-text-gray-600 tw-text-sm tw-mt-7">
                    {t('email_verify_send.didnt_receive')}
                        <button
                            className="tw-text-teal-400 tw-ml-2"
                            // onClick={handleBtnResendClick}
                        >
                            {t('email_verify_send.send_it_again')}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailVerifySendPage;
