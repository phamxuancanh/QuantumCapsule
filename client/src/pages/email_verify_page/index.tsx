import React, { useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import ROUTES from 'routes/constant';
import { verifyEmail } from '../../api/post/post.api';

const EmailVerifyPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const { mutate: sendVerifyEmailMutate } = useMutation({
        mutationFn: (token: string) => verifyEmail(token),
        onSuccess: (res) => {
            toast('Verify email success!');
            navigate(ROUTES.email_verify_success, { replace: true });
        },
        onError: (error) => {
            console.error(error);
            toast.error('Verify email failed!');
        }
    });

    useEffect(() => {
        if (token) {
            sendVerifyEmailMutate(token);
        }
    }, [token, sendVerifyEmailMutate]);

    return (
        <div>
            Verifying email...
        </div>
    );
};

export default EmailVerifyPage;
