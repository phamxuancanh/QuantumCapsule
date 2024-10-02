import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ROUTES from 'routes/constant';
import { loginState } from '../../redux/auth/authSlice'
import { assignClassToUser } from "api/user/user.api";
const GradeChoosePage = () => {
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const storedUser = localStorage.getItem('persist:auth');
        if (storedUser) {
            const currentUser = JSON.parse(storedUser);
            if (currentUser.currentUser.grade) {
                setSelectedGrade(currentUser.currentUser.grade);
            }
        }
    }, []);

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGrade(e.target.value);
    };

    const handleContinue = async () => {
        if (selectedGrade) {
            const storedUser = localStorage.getItem('persist:auth');
            if (storedUser) {
                const currentUser = JSON.parse(storedUser);
                console.log(currentUser);
                try {
                    const res = await assignClassToUser(currentUser.currentUser.id, { grade: selectedGrade });
                    if(res.data) {
                    currentUser.currentUser.grade = selectedGrade;
                    localStorage.setItem('persist:auth', JSON.stringify(currentUser));
                    dispatch(loginState(currentUser.currentUser));
                    navigate(ROUTES.home);
                    }
                } catch (error) {
                    console.error('Lỗi khi gán lớp cho người dùng:', error);
                    alert('Có lỗi xảy ra khi chọn lớp');
                }
            } else {
                alert('Vui lòng chọn lớp của bạn');
            }
        } else { 
            alert('Vui lòng chọn lớp của bạn');
        }
    };

        return (
            <div className="tw-text-lg tw-bg-teal-700 tw-min-h-screen tw-flex tw-items-center tw-justify-center">
                <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-lg tw-text-center tw-max-w-md tw-w-full">
                    <h1 className="tw-text-2xl tw-font-bold tw-mb-4">Chọn lớp của bạn</h1>
                    <p className="tw-mb-6 tw-text-gray-600">Vui lòng chọn lớp học của bạn từ danh sách dưới đây để tiếp tục.</p>
                    <select
                        className="tw-w-full tw-px-4 tw-py-2 tw-mb-4 tw-rounded-lg tw-border tw-border-gray-300 tw-focus:border-indigo-500 tw-focus:outline-none tw-transition tw-duration-200"
                        value={selectedGrade || ''}
                        onChange={handleGradeChange}
                    >
                        <option value="" disabled>Chọn lớp</option>
                        <option value="1">Lớp 1</option>
                        <option value="2">Lớp 2</option>
                        <option value="3">Lớp 3</option>
                        <option value="4">Lớp 4</option>
                        <option value="5">Lớp 5</option>
                    </select>
                    <button
                        className="tw-bg-indigo-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-shadow tw-hover:bg-indigo-700 tw-transition tw-duration-200"
                        onClick={handleContinue}
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        );
    };

    export default GradeChoosePage;