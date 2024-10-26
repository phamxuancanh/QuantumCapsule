import React, { useEffect } from 'react';
import Draggable from 'react-draggable';
import pikachu from '../../assets/pet/pikachu.gif';
import pokemon_bg from '../../assets/pet/pokemon_bg.png';
import pokemon_circle_bg from '../../assets/pet/pokemon_circle_bg.png';
import { fetchUser, loginState, selectUser, updateStateInfo } from '../../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux/store';

const Pet = () => {
    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    };
    const dispatch = useDispatch<AppDispatch>()
    const userRedux = useSelector(selectUser)
    useEffect(() => {
      if (userRedux?.id) {
        dispatch(fetchUser())
      }
    }, []);
    useEffect(() => {
        dispatch(fetchUser());
      }, [dispatch]);
    return (
        <Draggable>
            <div className="tw-fixed tw-bottom-4 tw-right-4 tw-w-40 tw-h-40 tw-flex tw-items-center tw-justify-center tw-cursor-grab tw-z-30">
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
                {/* {userRedux?.starPoint} */}
            </div>
        </Draggable>
    );
};
export default Pet;