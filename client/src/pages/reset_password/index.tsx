// import {useSendVerifyEmail} from "../../apis/useSendVerifyEmail";
import { t } from "i18next";
import {useLocation} from "react-router-dom";

const ResetPassword = () => {
    const location = useLocation();
    const { email } = location.state || {}; // Default to an empty object if state is undefined
    // const sendVerifyEmail = useSendVerifyEmail();

    // const handleBtnResendClick = () => {
    //     sendVerifyEmail(email);
    // }

    return (
        <div className="tw-bg-teal-700 tw-min-h-screen tw-flex tw-items-center tw-justify-center">
            Reset password for {email}
        </div>
    )
}

export default ResetPassword

