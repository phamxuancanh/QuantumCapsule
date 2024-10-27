import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import pikachu from '../../assets/pet/pikachu.gif';
import pokemon_bg from '../../assets/pet/pokemon_bg.png';
import pokemon_circle_bg from '../../assets/pet/pokemon_circle_bg.png';
import { fetchUser, selectUser } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux/store';
import ViewStreamIcon from '@mui/icons-material/ViewStream';

const Pet = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    };

    const dispatch = useDispatch<AppDispatch>();
    const userRedux = useSelector(selectUser);

    useEffect(() => {
        if (userRedux?.id) {
            dispatch(fetchUser());
        }
    }, [dispatch, userRedux?.id]);

    const handleMouseEnter = () => {
        setIsMenuVisible(true);
    };

    const handleButtonClick = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsDropdownVisible(false);
            setIsMenuVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Draggable>
            <div
                className="tw-fixed tw-bottom-4 tw-right-4 tw-w-40 tw-h-40 tw-flex tw-items-center tw-justify-center tw-cursor-grab tw-z-30"
                onMouseEnter={handleMouseEnter}
            >
                <div className="tw-relative tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                    <img
                        className="tw-absolute tw-h-40 tw-w-40 tw-animate-spin-slow"
                        src={pokemon_bg}
                        alt="Pokemon Background"
                        onDragStart={handleDragStart}
                    />
                    <div className="tw-relative tw-w-24 tw-h-24 tw-flex tw-items-center tw-justify-center">
                        <img
                            className="tw-absolute tw-h-full tw-w-full"
                            src={pokemon_circle_bg}
                            alt="Pokemon Circle Background"
                            onDragStart={handleDragStart}
                        />
                        <img
                            className="tw-relative tw-h-20 tw-w-20"
                            src={pikachu}
                            alt="Pet"
                            onDragStart={handleDragStart}
                        />
                    </div>
                </div>
                {isMenuVisible && (
    <div ref={menuRef} className="tw-absolute -tw-top-5 tw-left-0 tw-bg-transparent tw-p-2 tw-z-40">
        <button
            className="tw-cursor-pointer"
            onClick={handleButtonClick}
        >
            <ViewStreamIcon />
        </button>
        {isDropdownVisible && (
            <div className="tw-absolute tw-bottom-full tw-w-[500px] tw-h-[300px] tw-right-0 tw-mb-2 tw-bg-blue-200 tw-shadow-lg tw-rounded-lg tw-p-2 ">
                <ul>
                    <li className="tw-py-1 tw-px-2 hover:tw-bg-gray-200 tw-cursor-pointer">Option 1</li>
                    <li className="tw-py-1 tw-px-2 hover:tw-bg-gray-200 tw-cursor-pointer">Option 2</li>
                    <li className="tw-py-1 tw-px-2 hover:tw-bg-gray-200 tw-cursor-pointer">Option 3</li>
                </ul>
            </div>
        )}
    </div>
)}
            </div>
        </Draggable>
    );
};

export default Pet;