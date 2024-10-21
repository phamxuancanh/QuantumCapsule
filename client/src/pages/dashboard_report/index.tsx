import { getListSubject } from 'api/subject/subject.api';
import { ISubject } from 'api/subject/subject.interface';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

    const handleSelectSubject = (subject: string) => {
        setSelectedSubject(subject);
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('subject', subject);
        navigate(`?${queryParams.toString()}`);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className='tw-text-lg tw-bg-slate-50 tw-min-h-screen tw-flex tw-justify-center'>
            <div className='tw-w-11/12 tw-h-auto tw-flex tw-flex-col tw-items-center tw-py-2'>
                <div className='tw-flex tw-w-full tw-space-x-3 tw-bg-red-100 tw-justify-center'>
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
                <div className='tw-flex tw-space-x-3 tw-mt-4'>
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
                <div className='tw-mt-4 tw-w-11/12 tw-bg-blue-200'>
                    {activeTab === 'general' && <div>Danh gia chung content</div>}
                    {activeTab === 'history' && <div>Lich su luyen tap content</div>}
                    {activeTab === 'progress' && <div>Tien do hoc tap content</div>}
                </div>
            </div>
        </div>
    );
};

export default DashboardReport;