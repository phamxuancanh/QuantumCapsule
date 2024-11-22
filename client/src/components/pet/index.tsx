import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import pikachu from '../../assets/pet/pikachu.gif';
import pokemon_bg from '../../assets/pet/pokemon_bg.png';
import pokemon_circle_bg from '../../assets/pet/pokemon_circle_bg.png';
import { fetchUser, selectUser, updateStateInfo } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux/store';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { IPet } from 'api/pet/pet.interface';
import { getListPet, getPetById } from 'api/pet/pet.api';
import { updateUser } from 'api/user/user.api';
import { toast } from 'react-toastify'
import { getFromLocalStorage } from 'utils/functions';
import CryptoJS from 'crypto-js'

const Pet = () => {


    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [listPet, setListPet] = useState<IPet[]>([]);
    const [userPet, setUserPet] = useState<IPet | null>(null);
    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    };

    const dispatch = useDispatch<AppDispatch>();
    const userRedux = useSelector(selectUser);
    const [currentUser] = useState(getFromLocalStorage<any>('persist:auth'))
    const userRole = currentUser?.currentUser.key
    let data: string | undefined
    if (userRole) {
      try {
        const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication')
        data = giaiMa.toString(CryptoJS.enc.Utf8)
      } catch (error) {
        console.error('Decryption error:', error)
      }
    }
    useEffect(() => {
        if (userRedux?.id) {
            dispatch(fetchUser());
        }
    }, [dispatch, userRedux?.id]);
    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
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

    const fetchUserPet = async () => {
        try {
            const res = await getPetById(userRedux?.petId ?? '');
            setUserPet(res.data.data);
        } catch (error) {
            console.error('Failed to fetch pet list:', error);
        }
    }
    useEffect(() => {
        fetchUserPet();
    }, [userRedux?.petId]);
    const fetchPetList = async () => {
        try {
            const res = await getListPet();
            setListPet(res.data.data);
        } catch (error) {
            console.error('Failed to fetch pet list:', error);
        }
    };

    useEffect(() => {
        fetchPetList();
    }, []);
    const handlePetSelection = async (petId: string) => {
        const payload = {
            petId,
        };
        if (userRedux?.id) {
            const result = await updateUser(userRedux.id, payload);
            if (result) {
                dispatch(updateStateInfo({
                    ...userRedux,
                    ...payload,
                }));
                toast.success('Chọn pet thành công');
            } else {
                toast.warning('Chọn pet thất bại');
            }
        }
    };
    // const handlePetSelection = async (petId: string) => {
    //     const payload = {
    //         petId,
    //     };
    //     const updatedUser = { ...userRedux, petId };
    //     localStorage.setItem('persist:auth', JSON.stringify(updatedUser));
    //     if (userRedux?.id) {
    //         const result = await updateUser(userRedux.id, payload);
    //         console.log(result);
    //         if (result) {
    //             dispatch(updateStateInfo({
    //                 ...userRedux,
    //                 ...payload,
    //             }));
    //             toast.success('Chọn pet thành công');
    //         } else {
    //             toast.warning('Chọn pet thất bại');
    //         }
    //     }
    // };
    return (
            data !== 'R1' && data !== 'R2' ? (
                <Draggable>
                    <div
                        className="tw-fixed tw-bottom-4 tw-right-4 tw-w-36 tw-h-36 tw-flex tw-items-center tw-justify-center tw-cursor-grab tw-z-30"
                        onMouseEnter={handleMouseEnter}
                    >
                        <div className="tw-relative tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                            <img
                                className="tw-absolute tw-h-36 tw-w-36 tw-animate-spin-slow"
                                src={pokemon_bg}
                                alt="Pokemon Background"
                                onDragStart={handleDragStart}
                            />
                            <div className="tw-relative tw-w-20 tw-h-20 tw-flex tw-items-center tw-justify-center">
                                <img
                                    className="tw-absolute tw-h-full tw-w-full"
                                    src={pokemon_circle_bg}
                                    alt="Pokemon Circle Background"
                                    onDragStart={handleDragStart}
                                />
                                <img
                                    className="tw-relative tw-h-16 tw-w-16"
                                    src={userPet?.imageUrl}
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
                                    <div className="tw-absolute tw-bottom-full tw-w-[700px] tw-max-h-[400px] tw-right-0 tw-mb-2 tw-bg-blue-200 tw-shadow-lg tw-rounded-lg tw-p-2 tw-overflow-auto">
                                        <div>Điểm hiện tại: <span className='tw-font-bold'>{userRedux?.starPoint}</span></div>
                                        <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-mt-5">
                                            {listPet?.map(pet => (
                                                <div key={pet.id} className="tw-flex tw-flex-col tw-items-center tw-mb-2">
                                                    <img className='tw-w-14 tw-h-14 tw-mb-2' src={pet.imageUrl} alt={pet.name} />
                                                    <div className="tw-text-center">
                                                        <h3 className="tw-font-bold">{pet.name}</h3>
                                                        <p>Points Required: {pet.pointsRequired}</p>
                                                        {userRedux?.petId === pet.id ? (
                                                            <button className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-font-bold tw-cursor-not-allowed" disabled>
                                                                Đang chọn
                                                            </button>
                                                        ) : (pet.pointsRequired ?? 0) <= (userRedux?.starPoint ?? 0) ? (
                                                            <button
                                                                className="tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-font-bold hover:tw-bg-green-600"
                                                                onClick={() => pet.id && handlePetSelection(pet.id)}
                                                            >
                                                                Chọn
                                                            </button>
                                                        ) : (
                                                            <button className="tw-bg-gray-500 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-cursor-not-allowed" disabled>
                                                                Không đủ điểm
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Draggable>
            ) : (
                <div></div>
            )
        );
};

export default Pet;