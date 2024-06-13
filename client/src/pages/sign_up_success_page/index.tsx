// import { useSendVerifyEmail } from "../../apis/useSendVerifyEmail";
import { Link, useLocation } from "react-router-dom";
import ROUTES from "routes/constant";
const SignUpSuccessPage = () => {
//   const sendVerifyEmail = useSendVerifyEmail();
//   const { email } = useLocation().state;

//   const handleBtnResendVerifyEmailClick = () => {
//     sendVerifyEmail(email);
//   };

  return (
    <div className="tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
      <div className="tw-text-center tw-select-none">
        <i className="fa-solid fa-circle-check fa-2xl tw-text-[10rem] tw-text-green-600"></i>
        <div className="tw-mt-16">
          <p className="tw-text-2xl tw-font-bold">
            ACCOUNT REGISTERED SUCCESSFULLY
          </p>
          <p>
            A confirmation email has been sent to the mailbox you registered
            with. Please check and verify your account.
          </p>
          <div className="tw-block">
            <button className="tw-px-4 tw-py-2 tw-font-semibold  tw-bg-blue-500 tw-rounded-md tw-mr-2">
              <Link
                className="tw-text-white "
                to={ROUTES.login}
                style={{ textDecoration: "none" }}
              >
                RETURN TO LOGIN PAGE
              </Link>
            </button>
            <button
              className="tw-px-4 tw-py-2 tw-font-semibold tw-text-white tw-rounded-md tw-mt-5 tw-bg-gray-500"
            //   onClick={handleBtnResendVerifyEmailClick}
            >
              RE-SEND EMAIL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccessPage;
