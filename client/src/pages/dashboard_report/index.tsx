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
import star from '../../assets/star.svg';
import list from '../../assets/list.svg';
import { getLessonByChapterId } from 'api/lesson/lesson.api';
import { IExam } from 'api/exam/exam.interface';
import { getExamsByChapterId, getExamsByLessonId } from 'api/exam/exam.api';
import { ITheory } from 'api/theory/theory.interface';
import { getTheoriesByLessonId } from 'api/theory/theory.api';
import { getListUniqueDoneResultByChapterId } from 'api/result/result.api';
import { findProgressByChapter } from 'api/progress/progress.api';
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const DashboardReport = () => {
    const { t, i18n } = useTranslation();
    const query = useQuery();
    const navigate = useNavigate();
    const location = useLocation();
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const initialSubject = query.get('subject') || 'subject1';
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
    const [activeTab, setActiveTab] = useState<string>('general');
    const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'))
    const [chapters, setChapters] = useState<{ value: string; label: string }[]>([]);

    const [selectedChapter, setSelectedChapter] = useState<{ value: string; label: string } | null>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [theories, setTheories] = useState<{ [key: string]: ITheory[] }>({});
    const [exercises, setExercises] = useState<{ [key: string]: IExam[] }>({});
    const [exams, setExams] = useState<IExam[]>([]);
    const [examProgress, setExamProgress] = useState<any>(null);
    const [numberExcersiceDone, setNumberExcersiceDone] = useState<number>(0);
    const [numberExamDone, setNumberExamDone] = useState<number>(0);
    const [numberTheoryDone, setNumberTheoryDone] = useState<number>(0);
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
            const chaptersData = res.data.data.map((chapter: any) => ({
                value: chapter.id,
                label: chapter.name,
            }));
            setChapters(chaptersData);
            const firstChapter = {
                value: res.data.data[0]?.id || '',
                label: res.data.data[0]?.name || ''
            }
            setSelectedChapter(firstChapter)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get('page') || '1', 10);
        const currentGrade = 2
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
    };
    const fetchExamByChapterId = async (chapterId: string) => {
        try {
            const response = await getExamsByChapterId(chapterId);
            setExams(response.data.exams);
            return response.data;
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };
    const fetchTheoriesAndExercises = async (lessonId: string) => {
        try {
            const theoriesResponse = await getTheoriesByLessonId(lessonId);
            const examsResponse = await getExamsByLessonId(lessonId);
            setTheories(prevState => ({
                ...prevState,
                [lessonId]: theoriesResponse.data.theories,
            }));
            setExercises(prevState => ({
                ...prevState,
                [lessonId]: examsResponse.data.exams,
            }));
        } catch (error) {
            console.error('Error fetching theories and exercises:', error);
        }
    };
    const fetchAllTheoriesAndExercises = async (lessons: any) => {
        for (const lesson of lessons) {
            await fetchTheoriesAndExercises(lesson.id);
        }
    };
    useEffect(() => {
        if (selectedChapter) {
            fetchAllTheoriesAndExercises(lessons);
        }
        console.log(theories)
        console.log(exercises)
    }, [lessons]);
    useEffect(() => {
        if (selectedChapter) {
            fetchExamByChapterId(selectedChapter.value);
        }
    }, [selectedChapter]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };
    const fetchLessons = async (chapterId: string) => {
        try {
            const response = await getLessonByChapterId(chapterId.toString());
            setLessons(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài học:', error);
        }
    };
    useEffect(() => {
        if (selectedChapter) {
            fetchLessons(selectedChapter.value);
        }
    }, [selectedChapter])
    useEffect(() => {
        const fetchExamResultProgress = async () => {
            if (currentUser?.currentUser?.id && selectedSubject) {
                if (selectedChapter) {
                    const progress = await findProgressByChapter(selectedChapter.value);
                    setNumberTheoryDone(progress?.data.data.length ?? 0);
                }
            }
        };
        const fetchTheoryProgress = async () => {
            if (currentUser?.currentUser?.id && selectedSubject) {
                if (selectedChapter) {
                    console.log('Selected Chapter:', selectedChapter)
                    const progress = await getListUniqueDoneResultByChapterId(selectedChapter.value)
                    console.log('Progress:', progress)
                    setExamProgress(progress.data.data)
                    setNumberExamDone(progress?.data.data.exams.length ?? 0)
                    setNumberExcersiceDone(progress?.data.data.exercises.length ?? 0)
                }
            }
        }
        fetchExamResultProgress()
        fetchTheoryProgress()
    }, [selectedChapter])


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
                        className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-50"
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
                                <div className='tw-flex tw-w-full tw-justify-between'>
                                    <div className='tw-flex tw-items-center tw-p-2'>
                                        <img className='tw-w-10 tw-h-10 tw-mr-2' src={list} alt="List Icon" />
                                        <div>
                                            <div>Số bài đã học</div>
                                            <div className='tw-font-bold tw-text-lg'>{numberTheoryDone}</div>
                                        </div>
                                    </div>
                                    <div className='tw-flex tw-items-center tw-p-2'>
                                        <img className='tw-w-10 tw-h-10 tw-mr-2' src={list} alt="List Icon" />
                                        <div>
                                            <div>Số bài tập đã làm</div>
                                            <div className='tw-font-bold tw-text-lg'>{numberExcersiceDone}</div>
                                        </div>
                                    </div>
                                    <div className='tw-flex tw-items-center tw-p-2'>
                                        <img className='tw-w-10 tw-h-10 tw-mr-2' src={list} alt="List Icon" />
                                        <div>
                                            <div>Số bài kiểm tra đã làm</div>
                                            <div className='tw-font-bold tw-text-lg'>{numberExamDone}</div>
                                        </div>
                                    </div>
                                    <div className='tw-flex tw-items-center tw-p-2'>
                                        <img className='tw-w-10 tw-h-10 tw-mr-2' src={star} alt="Star Icon" />
                                        <div>
                                            <div>Tổng số sao đạt được</div>
                                            <div className='tw-font-bold tw-text-lg'>15</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-text-2xl'>
                                    TỔNG QUAN TOÀN BỘ KIẾN THỨC - <span className='tw-text-blue-500'>{`${currentUser?.currentUser?.firstName?.toUpperCase()} ${currentUser?.currentUser?.lastName?.toUpperCase()}`}</span>
                                </div>
                            </div>
                            <hr className='tw-my-4 tw-border-gray-300 tw-mx-4' />
                            <div className='tw-flex tw-flex-col tw-px-10 tw-items-center tw-space-y-10'>
                                <div className='tw-grid tw-grid-cols-2 tw-w-4/5'>
                                    <div className='tw-border-r tw-border-gray-400'>
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
                                    <div className='tw-px-2'>
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
                                <div className='tw-w-full tw-space-y-5 tw-pb-10'>
                                    {lessons.map((lesson) => (
                                        <div className='tw-text-2xl tw-font-bold tw-text-white tw-border-gray-400 tw-border' key={lesson.id}>
                                            <div className='tw-p-2 tw-bg-green-400'>{lesson.name.toUpperCase()}</div>
                                            <div className='tw-text-black tw-font-normal tw-text-lg tw-grid tw-grid-cols-2 tw-w-full tw-border-t tw-border-b tw-border-gray-400'>
                                                <div className='tw-border-r tw-border-gray-400'>
                                                    <div className='tw-font-bold tw-p-2 tw-flex tw-items-center tw-underline tw-text-blue-500 tw-bg-blue-100'>
                                                        Bài lý thuyết
                                                    </div>
                                                    <div className='tw-bg-white tw-p-2'>
                                                        {Array.isArray(theories[lesson.id]) && theories[lesson.id]
                                                            .map(t => (
                                                                <div key={t.id}>{t.name}</div>
                                                            ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='tw-font-bold tw-p-2 tw-flex tw-items-center tw-underline tw-text-blue-500 tw-bg-blue-100'>
                                                        Bài tập
                                                    </div>
                                                    <div className='tw-bg-white tw-border tw-p-2'>
                                                        {Array.isArray(exercises[lesson.id]) && exercises[lesson.id]
                                                            .map(e => (
                                                                <div key={e.id}>{e.name}</div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='tw-text-2xl tw-font-bold tw-text-white tw-border-gray-400 tw-border'>
                                        <div className='tw-p-2 tw-bg-yellow-400'>BAI THI</div>
                                        <div className='tw-text-black tw-font-normal tw-text-lg tw-grid tw-grid-cols-1 tw-w-full tw-border-t tw-border-b tw-border-gray-400'>
                                            <div className='tw-font-bold tw-p-2 tw-flex tw-items-center tw-underline tw-text-blue-500 tw-bg-yellow-100'>
                                                Bài thi chương 1
                                            </div>
                                            <div className='tw-bg-white tw-border tw-p-2'>
                                                <div className='tw-bg-white tw-border tw-p-2'>
                                                    {exams.map((exam, index) => (
                                                        <div key={index} className='tw-mb-2'>
                                                            {exam.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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