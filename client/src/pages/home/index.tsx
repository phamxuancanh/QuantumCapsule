import React from 'react';
import { signOut } from '../../api/post/post.api';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'routes/constant';
import { removeAllLocalStorage } from 'utils/functions';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut({});
            removeAllLocalStorage()
            navigate(ROUTES.sign_in);
        } catch (error) {
            alert('Logout failed. Please try again.');
        }
    };
    return (
        <div>
            Home
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
