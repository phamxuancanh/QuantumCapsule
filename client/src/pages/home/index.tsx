import React, { useEffect, useState } from 'react';
import { signOut } from '../../api/user/user.api';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'routes/constant';
import math_on from '../../assets/icon_math_on.png';
import math_off from '../../assets/icon_math_off.png';
import literature_on from '../../assets/icon_vietnamese_literature_on.png';
import literature_off from '../../assets/icon_vietnamese_literature_off.png';
import Select from 'react-select'
import ProgressBar from '@ramonak/react-progress-bar'
import VideocamIcon from '@mui/icons-material/Videocam'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import QuizIcon from '@mui/icons-material/Quiz'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import earth from '../../assets/userCover.png';
import icon_category from '../../assets/icon_category.png';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { getListSubject } from 'api/subject/subject.api';
import { ISubject } from 'api/subject/subject.interface';
import { getListChapter } from 'api/chapter/chapter.api';

const Home = () => {
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [grades, setGrades] = useState([
        { Id: 1, Name: 'Khối 1' },
        { Id: 2, Name: 'Khối 2' },
        { Id: 3, Name: 'Khối 3' },
        { Id: 4, Name: 'Khối 4' },
        { Id: 5, Name: 'Khối 5' },
        { Id: 6, Name: 'Khối 6' },
        { Id: 7, Name: 'Khối 7' },
        { Id: 8, Name: 'Khối 8' },
        { Id: 9, Name: 'Khối 9' },
        { Id: 10, Name: 'Khối 10' },
        { Id: 11, Name: 'Khối 11' },
        { Id: 12, Name: 'Khối 12' }
    ])
    const [chaptersData, setChaptersData] = useState([])
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const fetchSubjects = async () => {
        try {
            const response = await getListSubject()
            console.log('Danh sách môn học:', response.data.data);
            setSubjects(response.data.data);
            if (response.data.data.length > 0) {
                setSelectedSubject(response.data.data[0].id);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách môn học:', error);
        }
    };
    useEffect(() => {
        fetchSubjects();
    }, []);
    const handleSelectSubject = (subject: string) => {
        setSelectedSubject(subject)
    }
    const handleClassClick = (classId: number) => {
        setSelectedGrade(classId)
    };
    const fetchChapters = async () => {
        try {
            const res = await getListChapter({ params: { subjectId: selectedSubject, grade: selectedGrade } });
            console.log('Chapters:', res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (selectedSubject && selectedGrade) {
            fetchChapters();
        }
    }, [selectedSubject, selectedGrade]);
    return (
        <div className='tw-flex tw-items-center tw-justify-center tw-bg-slate-50'>
            <div className='tw-w-4/5 tw-mt-16 tw-space-y-16'>
                <div className='tw-flex tw-space-x-10'>
                    {subjects?.map((subject) => (
                        <div
                            key={subject.id}
                            className={`tw-flex tw-space-y-2 tw-flex-col tw-justify-center tw-items-center tw-w-48 tw-bg-slate-100 tw-border tw-p-5 tw-shadow-lg tw-rounded-2xl tw-cursor-pointer hover:tw-bg-white tw-transition-colors tw-duration-300 ${selectedSubject === subject.id ? 'tw-bg-white' : ''}`}
                            onClick={() => handleSelectSubject(subject.id ?? '')}
                        >
                            <img
                                src={selectedSubject === subject.id ? subject.image_on : subject.image_off}
                                alt={subject.name}
                            />
                            <div className='tw-font-bold tw-text-lg'>{subject.name}</div>
                        </div>
                    ))}
                </div>
                <div className='tw-flex tw-justify-between'>
                    <div className='tw-text-4xl tw-font-bold'>Nội dung khóa học</div>
                </div>
                <div className='tw-flex tw-w-full tw-space-x-16'>
                    <div className='tw-w-1/4 tw-border tw-rounded-2xl tw-bg-white tw-h-fit'>
                        <div className='tw-bg-green-400 tw-font-bold tw-text-lg tw-text-center tw-rounded-t-2xl tw-p-3'>Lớp</div>
                        <div className='tw-border tw-rounded-md tw-p-1 tw-m-2'>
                            <input placeholder='Tim nhanh ki nang'></input>
                        </div>
                        <div className='tw-border tw-rounded-md tw-p-1 tw-m-2'>
                            <div className='tw-flex tw-flex-col tw-space-y-2'>
                                {grades.map((cls) => (
                                    <button
                                        key={cls.Id}
                                        className={`tw-p-2 tw-rounded-md tw-bg-blue-200 hover:tw-bg-blue-300 tw-text-left ${selectedGrade === cls.Id ? 'tw-bg-blue-400' : ''}`}
                                        onClick={() => handleClassClick(cls.Id)}
                                    >
                                        {cls.Name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='tw-flex-col tw-w-3/4 tw-border tw-space-y-10'>
                        <div className='tw-w-full tw-border tw-rounded-2xl tw-bg-white'>
                            <div className='tw-flex tw-justify-between tw-border-b tw-border-dashed tw-p-5 tw-mx-4 tw-space-x-10'>
                                <img className='tw-w-64 tw-h-40' src='https://cdn.discordapp.com/attachments/1284566452833222777/1285285340516585636/img_2024-07-23_669f35c4a55b3.png?ex=66e9b6c0&is=66e86540&hm=2af64b9973a379433bc32aa1693170f209ba32110ebc933671ce17c0935102f6&'></img>
                                <div className='tw-space-y-3'>
                                    <div className='tw-flex tw-space-x-3 tw-w-full'>
                                        <img src={icon_category} alt="icon_category" />
                                        <div className='tw-text-2xl tw-font-bold'>Toán 1: Chân trời sáng tạo</div>
                                    </div>
                                    <div>Khóa học Toán lớp 1 Chân Trời Sáng Tạo giúp học sinh nắm vững các khái niệm toán học cơ bản như số học, phép cộng, phép trừ, và hình học đơn giản. Với phương pháp giảng dạy sáng tạo và thực tế, khóa học không chỉ phát triển tư duy logic và kỹ năng giải quyết vấn đề mà còn khơi dậy niềm yêu thích toán học, chuẩn bị vững chắc cho các bậc học tiếp theo.</div>
                                    <ProgressBar
                                        bgColor='orange'
                                        className='tw-w-2/3'
                                        maxCompleted={100}
                                        completed={70}
                                    />
                                    <div className="tw-flex tw-items-center">
                                        <BarChartIcon className="tw-mr-2" />
                                        <span>Hoàn thành: 0/224 bài học (đạt 0%)</span>
                                    </div>
                                    <button className='tw-cursor-pointer tw-bg-red-200 tw-border tw-rounded-lg tw-p-2 tw-flex tw-items-center'>
                                        <ArrowCircleRightOutlinedIcon className='tw-mr-2' />
                                        Tiếp tục học bài
                                    </button>
                                </div>
                            </div>
                            <div className='tw-flex tw-justify-between tw-p-5'>
                                <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                    <div className='tw-font-bold tw-text-2xl'>0/2</div>
                                    <div>Chu diem</div>
                                </div>
                                <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                    <div className='tw-font-bold tw-text-2xl'>0/2</div>
                                    <div>Bai kiem tra</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-gray-500 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Chua thuc hanh</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-sky-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Dang thuc hanh</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-green-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Da hoan thanh</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-orange-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Chu diem con yeu</div>
                                </div>
                            </div>
                        </div>

                        <div className='tw-bg-white tw-border tw-rounded-2xl'>
                            <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-p-5">
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <div className="tw-relative tw-rounded-t-2xl overflow-hidden">
                                        <img src={earth} className="tw-rounded-t-2xl tw-transition-opacity tw-duration-300 tw-w-full tw-h-auto" />
                                        <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-0 hover:tw-opacity-50 tw-transition-opacity tw-duration-300 tw-flex tw-justify-center tw-items-center tw-rounded-t-2xl">
                                            <VideocamIcon className="tw-mx-2 tw-text-white tw-cursor-pointer" />
                                            <AssignmentIcon className="tw-mx-2 tw-text-white tw-cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='tw-font-bold tw-text-xl tw-px-6 tw-py-2'><QuizIcon fontSize='large' />BAI KIEM TRA</div>
                            <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-p-5">
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    )
};

export default Home;
