import { getListSubject } from 'api/subject/subject.api';
import { ISubject } from 'api/subject/subject.interface';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getFromLocalStorage } from 'utils/functions';
import QCDateFilter, { IDateFilter } from 'QCComponents/QCDateFilter/QCDateFilter';
import Select from 'react-select';
import { ListChapterParams } from 'api/chapter/chapter.interface';
import { getListChapterNoPaging } from 'api/chapter/chapter.api';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const DashboardReport = () => {
    const { t, i18n } = useTranslation();
    const query = useQuery();
    const navigate = useNavigate();
    const location = useLocation(); // Use the useLocation hook
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const initialSubject = query.get('subject') || 'subject1';
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
    const [activeTab, setActiveTab] = useState<string>('general');
    const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'))
    const chapters = [
        { value: 1, label: 'C 1' },
        { value: 2, label: 'c 2' },
        { value: 3, label: 'c 3' },
    ];
    const [selectedChapter, setSelectedChapter] = useState<{ value: number; label: string } | null>(null);

    const fetchSubjects = async () => {
        try {
            const response = await getListSubject();
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách môn học:', error);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);
    const fetchChapters = async (params?: ListChapterParams) => {
        try {
            const res = await getListChapterNoPaging({ params });
            // setChaptersData(res.data);
            console.log('Chapters:', res.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get('page') || '1', 10);
        const currentGrade = 1
        const currentSubject = queryParams.get('subject') || 'subject1';
        setSelectedSubject(currentSubject);
        if (currentSubject && currentGrade && currentPage) {
            fetchChapters({ subjectId: currentSubject, grade: currentGrade });
        }
    }, [location.search]);

    const handleSelectSubject = (subject: string) => {
        setSelectedSubject(subject);
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('subject', subject);
        navigate(`?${queryParams.toString()}`);
    };
    const handleChapterChange = (selectedChapter: any) => {
        setSelectedChapter(selectedChapter);
        // const searchParams = new URLSearchParams(location.search);
        // searchParams.set('grade', selectedChapter.name); // Cập nhật giá trị grade trong URL
        // navigate({ search: searchParams.toString() }); // Thay đổi URL với giá trị mới
    };
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };
    const handleFilter = async (filter: IDateFilter) => {
        try {
            console.log(filter);
            // const res = await getListResultByUserId(
            //     getUserIDLogin(), 
            //     {
            //         from: filter.from,
            //         to: filter.to
            //     } as IGetResultByUserIdFilterParams
            // );
            // setListResult(res.data.data);
        } catch (err: any) {
            // toast.error(err.message);
        }
    }

    return (
        <div className='tw-text-lg tw-bg-slate-50 tw-min-h-screen tw-flex tw-justify-center'>
            <div className='tw-w-11/12 tw-h-auto tw-flex tw-flex-col tw-items-center tw-py-2 tw-space-y-3'>
                <div className='tw-flex tw-w-full tw-space-x-3 tw-justify-center'>
                    {subjects?.map((subject) => (
                        <div
                            key={subject.id}
                            className={`tw-flex tw-space-y-2 tw-flex-col tw-justify-center tw-items-center tw-w-48 tw-h-36 tw-bg-slate-100 tw-border tw-p-5 tw-shadow-lg tw-rounded-2xl tw-cursor-pointer hover:tw-bg-white tw-transition-colors tw-duration-300 ${selectedSubject === subject.id ? 'tw-bg-white' : ''}`}
                            onClick={() => handleSelectSubject(subject.id ?? '')}
                        >
                            <img
                                src={selectedSubject === subject.id ? subject.image_on : subject.image_off}
                                alt={subject.name}
                            />
                            <div className='tw-font-bold tw-text-lg'>
                                {subject.name === 'Toán' ? t('homepage.math') : t('homepage.literature')}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='tw-flex tw-items-center tw-justify-between tw-w-2/5'>
                    <div className='tw-font-bold'>Chọn chương: </div>
                    <Select
                        value={selectedChapter}
                        onChange={handleChapterChange}
                        options={chapters}
                        placeholder="Chọn"
                        className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm"
                    />
                </div>
                <div className='tw-flex tw-space-x-3 tw-text-lg'>
                    <div
                        className={`tw-border tw-font-bold tw-p-2 tw-px-2 tw-rounded-md tw-shadow-2xl tw-cursor-pointer ${activeTab === 'general' ? 'tw-bg-green-400 tw-text-white' : 'tw-bg-white tw-text-black'}`}
                        onClick={() => handleTabClick('general')}
                    >
                        Đánh giá chung
                    </div>
                    <div
                        className={`tw-border tw-font-bold tw-p-2 tw-px-2 tw-rounded-md tw-shadow-2xl tw-cursor-pointer ${activeTab === 'history' ? 'tw-bg-green-400 tw-text-white' : 'tw-bg-white tw-text-black'}`}
                        onClick={() => handleTabClick('history')}
                    >
                        Lịch sử luyện tập
                    </div>
                    <div
                        className={`tw-border tw-font-bold tw-p-2 tw-px-2 tw-rounded-md tw-shadow-2xl tw-cursor-pointer ${activeTab === 'progress' ? 'tw-bg-green-400 tw-text-white' : 'tw-bg-white tw-text-black'}`}
                        onClick={() => handleTabClick('progress')}
                    >
                        Tiến độ học tập
                    </div>
                </div>
                <div className='tw-w-11/12 tw-bg-white tw-shadow-2xl tw-border-black tw-border'>
                    {activeTab === 'general' &&
                        <div className='tw-flex tw-flex-col'>
                            <div className='tw-flex tw-justify-between tw-items-center tw-px-10 tw-pt-3'>
                                <div className='tw-text-2xl tw-font-bold'>Trong 7 ngay qua</div>
                                <div className='tw-flex tw-items-center'>
                                    <QCDateFilter
                                        onChange={(filter) => {
                                            console.log(filter);
                                            handleFilter(filter);
                                        }}
                                    />
                                </div>
                            </div>
                            <hr className='tw-my-4 tw-border-gray-300 tw-mx-4' />
                            <div className='tw-flex tw-flex-col tw-items-center tw-px-10'>
                                <div className='tw-flex'>
                                    <div className='tw-border'>Số bài đã học</div>
                                    <div className='tw-border'>Số bài tập đã làm</div>
                                    <div className='tw-border'>Số bài kiểm tra đã làm</div>
                                    <div className='tw-border'>Tổng số sao đạt được</div>
                                </div>
                                <div className='tw-text-2xl'>
                                    TỔNG QUAN TOÀN BỘ KIẾN THỨC - <span className='tw-text-blue-500'>{`${currentUser?.currentUser?.firstName?.toUpperCase()} ${currentUser?.currentUser?.lastName?.toUpperCase()}`}</span>
                                </div>
                            </div>
                            <hr className='tw-my-4 tw-border-gray-300 tw-mx-4' />
                            <div className='tw-flex tw-flex-col tw-px-10 tw-items-center tw-space-y-10'>
                                <div className='tw-flex tw-justify-between tw-w-3/5'>
                                    <div>
                                        <h4 className="tw-text-md tw-font-semibold">Bài học</h4>
                                        <div className="tw-flex tw-items-center tw-space-x-4">
                                            <div className="tw-flex tw-items-center tw-space-x-1">
                                                <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-blue-500 tw-rounded-full tw-bg-blue-500 tw-bg-opacity-20"></div>
                                                <span>Học rồi</span>
                                            </div>
                                            <div className="tw-flex tw-items-center tw-space-x-1">
                                                <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-gray-300 tw-rounded-full tw-bg-gray-300 tw-bg-opacity-20"></div>
                                                <span>Chưa học</span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="tw-w-px tw-h-auto tw-bg-slate-200 tw-mx-3" />
                                    <div>
                                        <h4 className="tw-text-md tw-font-semibold">Bài tập & Kiểm tra</h4>
                                        <div className="tw-flex tw-items-center tw-space-x-4">
                                            <div className="tw-flex tw-items-center tw-space-x-1">
                                                <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-green-500 tw-rounded-full tw-bg-green-500 tw-bg-opacity-20"></div>
                                                <span>Tốt</span>
                                            </div>
                                            <div className="tw-flex tw-items-center tw-space-x-1">
                                                <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-red-500 tw-rounded-full tw-bg-red-500 tw-bg-opacity-20"></div>
                                                <span>Chưa tốt</span>
                                            </div>
                                            <div className="tw-flex tw-items-center tw-space-x-1">
                                                <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-gray-300 tw-rounded-full tw-bg-gray-300 tw-bg-opacity-20"></div>
                                                <span>Chưa làm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-bg-blue-100 tw-w-full'>Nội dung</div>
                            </div>
                        </div>
                    }
                    {activeTab === 'history' &&
                        <div>
                            Lich su luyen tap content
                        </div>
                    }
                    {activeTab === 'progress' &&
                        <div>
                            Tien do hoc tap content
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default DashboardReport;