import React from 'react';
import { signOut } from '../../api/post/post.api';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'routes/constant';
import { removeAllLocalStorage } from 'utils/functions';
// import { Helmet } from 'react-helmet'
const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut({});
            removeAllLocalStorage()
            navigate(ROUTES.login);
        } catch (error) {
            alert('Logout failed. Please try again.');
        }
    };
    return (
        <div>
                    {/* <Helmet>
            <title>Home - My Website</title>
        </Helmet> */}
            FORGOT PASSWWORD
        </div>
    );
};

export default ForgotPassword;
