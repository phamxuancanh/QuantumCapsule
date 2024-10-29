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
import { calculateScore } from 'helpers/Nam-helper/Caculate';
import { IGetResultByUserIdFilterParams } from 'api/result/result.interface';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import { ClockLoader } from 'react-spinners';
import ROUTES from 'routes/constant';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

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
    const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'))
    const [chapters, setChapters] = useState<{ value: string; label: string }[]>([]);

    const [selectedChapter, setSelectedChapter] = useState<{ value: string; label: string } | null>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [theories, setTheories] = useState<{ [key: string]: ITheory[] }>({});
    const [exercises, setExercises] = useState<{ [key: string]: IExam[] }>({});
    const [exams, setExams] = useState<IExam[]>([]);
    const [examProgress, setExamProgress] = useState<any>(null);
    const [theoryProgress, setTheoryProgress] = useState<any>(null);

    const [numberExcersiceDone, setNumberExcersiceDone] = useState<number>(0);
    const [numberExamDone, setNumberExamDone] = useState<number>(0);
    const [numberTheoryDone, setNumberTheoryDone] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('general');
    const fetchSubjects = async () => {
        try {
            const response = await getListSubject();
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách môn học:', error);
        }
    };
    const [daysDifference, setDaysDifference] = useState(0)

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
        const fetchTheoryProgress = async () => {
            if (currentUser?.currentUser?.id && selectedSubject) {
                if (selectedChapter) {
                    setLoading(true);
                    const progress = await findProgressByChapter(selectedChapter.value);
                    setTheoryProgress(progress.data.data);
                    console.log('Progress 1:', theoryProgress);
                    setNumberTheoryDone(progress?.data.data.length ?? 0);
                    setLoading(false);
                }
            }
        };
        const fetchExamResultProgress = async () => {
            if (currentUser?.currentUser?.id && selectedSubject) {
                if (selectedChapter) {
                    console.log('Selected Chapter:', selectedChapter);
                    setLoading(true);
                    const progress = await getListUniqueDoneResultByChapterId(selectedChapter.value);
                    setExamProgress(progress.data.data);
                    console.log('Progress 2:', examProgress);
                    console.log('Progress2:', progress);
                    setNumberExamDone(progress?.data.data.exams.length ?? 0);
                    setNumberExcersiceDone(progress?.data.data.exercises.length ?? 0);
                    setLoading(false);
                }
            }
        };
        fetchExamResultProgress();
        fetchTheoryProgress();
    }, [selectedChapter]);

    const handleFilter = async (filter: IDateFilter) => {
        try {
            console.log(filter);
            const chapterId = selectedChapter?.value ?? '';
            if (filter.to && filter.from) {
                const fromDate = new Date(filter.from);
                const toDate = new Date(filter.to);
                if (toDate < fromDate) {
                    toast.error("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
                    return;
                }
                const daysDifference = differenceInDays(toDate, fromDate);
                setDaysDifference(daysDifference);
                console.log(`Số ngày chênh lệch: ${daysDifference}`);
            }
            const [examProgressResponse, theoryProgressResponse] = await Promise.all([
                getListUniqueDoneResultByChapterId(chapterId, {
                    from: filter.from,
                    to: filter.to
                } as IGetResultByUserIdFilterParams),
                findProgressByChapter(chapterId, {
                    from: filter.from,
                    to: filter.to
                } as IGetResultByUserIdFilterParams)
            ]);
            const examProgress = examProgressResponse?.data?.data;
            if (examProgress) {
                setExamProgress(examProgress);
                setNumberExamDone(examProgress.exams?.length ?? 0)
                setNumberExcersiceDone(examProgress.exercises?.length ?? 0)
            } else {
                setNumberExamDone(0);
                setNumberExcersiceDone(0);
            }
            const theoryProgress = theoryProgressResponse?.data?.data;
            if (theoryProgress) {
                setTheoryProgress(theoryProgress);
                setNumberTheoryDone(theoryProgress.length ?? 0)
            } else {
                setNumberTheoryDone(0)
            }

        } catch (err: any) {
            console.error(err);
        }
    }
    const handleTheoryExercisesClick = (type: 'theory' | 'exam', id: string) => {
        if (type === 'theory') {
            navigate(`${ROUTES.learning}?theoryId=${id}`);
        } else if (type === 'exam') {
            navigate(`${ROUTES.skill_practice2}?examId=${id}`);
        }
    };
    const handleExamClick = (type: 'theory' | 'exam', id: string) => {
        if (type === 'theory') {
            navigate(`${ROUTES.learning}?theoryId=${id}`);
        } else if (type === 'exam') {
            navigate(`${ROUTES.skill_practice}?examId=${id}`);
        }
    };
    // CHART VIEWING 

    const mockTheoryData = [
        { name: "Chapter 1", count: 45 },
        { name: "Chapter 2", count: 35 },
        { name: "Chapter 3", count: 60 },
        { name: "Chapter 4", count: 30 },
        { name: "Chapter 5", count: 50 }
    ];

    const mockExamData = [
        { name: "Jan", score: 85 },
        { name: "Feb", score: 75 },
        { name: "Mar", score: 90 },
        { name: "Apr", score: 82 },
        { name: "May", score: 88 }
    ];

    const mockExerciseData = [
        { name: "Mathematics", value: 30 },
        { name: "Physics", value: 25 },
        { name: "Chemistry", value: 20 },
        { name: "Biology", value: 25 }
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const StatCard = ({ icon: Icon, title, value, bgColor }: { icon: React.ElementType, title: string, value: string, bgColor: string }) => (
        <div className={`${bgColor} tw-p-6 tw-rounded-lg tw-shadow-lg tw-transition-transform hover:tw-scale-105`} role="region" aria-label={`${title} statistics`}>
            <div className="tw-flex tw-items-center tw-justify-between">
                <div>
                    <p className="tw-text-white tw-text-sm tw-font-medium">{title}</p>
                    <p className="tw-text-white tw-text-2xl tw-font-bold tw-mt-2">{value}</p>
                </div>
                <Icon className="tw-text-white tw-text-3xl" />
            </div>
        </div>
    );

    const FilterSection = () => (
        <div className="tw-mb-6" role="group" aria-label="Dashboard filters">
            <QCDateFilter
                onChange={(filter) => {
                }}
            />
        </div>
    );
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
                        className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-10"
                    />
                </div>
                <div className='tw-flex tw-space-x-3 tw-mt-4'>
                    <div
                        className={`tw-border tw-font-bold tw-p-2 tw-px-2 tw-rounded-md tw-shadow-2xl tw-cursor-pointer ${activeTab === 'general' ? 'tw-bg-green-400 tw-text-white' : 'tw-bg-white tw-text-black'}`}
                        onClick={() => setActiveTab('general')}
                    >
                        Đánh giá chung
                    </div>
                    <div
                        className={`tw-border tw-font-bold tw-p-2 tw-px-2 tw-rounded-md tw-shadow-2xl tw-cursor-pointer ${activeTab === 'chartView' ? 'tw-bg-green-400 tw-text-white' : 'tw-bg-white tw-text-black'}`}
                        onClick={() => setActiveTab('chartView')}
                    >
                        Xem biểu đồ 
                    </div>
                </div>
                {activeTab === 'general' ? (
                    <div className='tw-w-11/12 tw-bg-white tw-shadow-2xl tw-border-black tw-border'>
                        {loading ? (
                            <div className='tw-flex tw-justify-center tw-items-center tw-h-64'>
                                <div className='tw-text-xl tw-font-bold'>Loading...</div>
                            </div>
                        ) : (
                            <div className='tw-flex tw-flex-col'>
                                <div className='tw-flex tw-justify-between tw-items-center tw-px-10 tw-pt-3'>
                                    <div className='tw-text-2xl tw-font-bold'>Trong {daysDifference} ngày qua</div>
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
                                                <div className='tw-font-bold tw-text-lg'>{currentUser?.currentUser.starPoint}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='tw-text-2xl'>
                                        TỔNG QUAN TOÀN BỘ KIẾN THỨC - <span className='tw-text-blue-500'>{`${currentUser?.currentUser?.firstName?.toUpperCase()} ${currentUser?.currentUser?.lastName?.toUpperCase()}`}</span>
                                    </div>
                                </div>
                                <hr className='tw-my-4 tw-border-gray-300 tw-mx-4' />
                                <div className='tw-flex tw-flex-col tw-px-10 tw-items-center tw-space-y-10'>
                                    <div className='tw-grid tw-grid-cols-2 tw-w-full'>
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
                                        <div className='tw-px-2'>
                                            <h4 className="tw-text-md tw-font-semibold">Bài tập & Kiểm tra</h4>
                                            <div className="tw-flex tw-items-center tw-space-x-4">
                                                <div className="tw-flex tw-items-center tw-space-x-1">
                                                    <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-green-500 tw-rounded-full tw-bg-green-500 tw-bg-opacity-20"></div>
                                                    <span>Tốt (Đúng &gt;= 80%)</span>
                                                </div>
                                                <div className="tw-flex tw-items-center tw-space-x-1">
                                                    <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-red-500 tw-rounded-full tw-bg-red-500 tw-bg-opacity-20"></div>
                                                    <span>Chưa tốt (Đúng &lt; 80%)</span>
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
                                                            {Array.isArray(theories[lesson.id]) && theories[lesson.id].map(t => {
                                                                const isInProgress = theoryProgress.includes(t.id);
                                                                return (
                                                                    <div
                                                                        key={t.id}
                                                                        className="tw-flex tw-items-center tw-space-x-2 tw-cursor-pointer"
                                                                        onClick={() => t.id && handleTheoryExercisesClick('theory', t.id)}
                                                                    >
                                                                        <div className={`tw-w-4 tw-h-4 tw-border-2 tw-rounded-full ${isInProgress ? 'tw-border-blue-500 tw-bg-blue-500 tw-bg-opacity-20' : 'tw-border-gray-300 tw-bg-gray-300 tw-bg-opacity-20'}`}></div>
                                                                        <span className='tw-font-bold'>{t.name}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='tw-font-bold tw-p-2 tw-flex tw-items-center tw-underline tw-text-blue-500 tw-bg-blue-100'>
                                                            Bài tập
                                                        </div>
                                                        <div className='tw-bg-white tw-p-2'>
                                                            {Array.isArray(exercises[lesson.id]) && exercises[lesson.id].map(e => {
                                                                const progress = examProgress?.exercises?.find((progress: any) => progress.examId === e.id);
                                                                let statusElement;

                                                                if (progress) {
                                                                    const scoreRatio = calculateScore(progress.totalScore, progress.yourScore);
                                                                    if (scoreRatio >= 8) {
                                                                        statusElement = (
                                                                            <div className="tw-flex tw-items-center tw-space-x-1">
                                                                                <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-green-500 tw-rounded-full tw-bg-green-500 tw-bg-opacity-20"></div>
                                                                            </div>
                                                                        );
                                                                    } else {
                                                                        statusElement = (
                                                                            <div className="tw-flex tw-items-center tw-space-x-1">
                                                                                <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-red-500 tw-rounded-full tw-bg-red-500 tw-bg-opacity-20"></div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                } else {
                                                                    statusElement = (
                                                                        <div className="tw-flex tw-items-center tw-space-x-1">
                                                                            <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-gray-300 tw-rounded-full tw-bg-gray-300 tw-bg-opacity-20"></div>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <div
                                                                        key={e.id}
                                                                        className="tw-flex tw-items-center tw-space-x-2 tw-cursor-pointer"
                                                                        onClick={() => handleTheoryExercisesClick('exam', e.id ?? '')}
                                                                    >
                                                                        {statusElement}
                                                                        <span className='tw-font-bold'>{e.name}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className='tw-text-2xl tw-font-bold tw-text-white tw-border-gray-400 tw-border'>
                                            <div className='tw-p-2 tw-bg-yellow-400'>BÀI KIỂM TRA</div>
                                            <div className='tw-text-black tw-font-normal tw-text-lg tw-grid tw-grid-cols-1 tw-w-full tw-border-t tw-border-b tw-border-gray-400'>
                                                <div className='tw-font-bold tw-p-2 tw-flex tw-items-center tw-underline tw-text-blue-500 tw-bg-yellow-100'>
                                                    Bài thi {selectedChapter?.label}
                                                </div>
                                                <div className='tw-bg-white tw-border tw-p-2'>
                                                    <div className='tw-bg-white tw-p-2'>
                                                        {exams.map((exam, index) => {
                                                            const progress = examProgress?.exams?.find((progress: any) => progress.examId === exam.id);
                                                            let statusElement;

                                                            if (progress) {
                                                                const scoreRatio = calculateScore(progress.totalScore, progress.yourScore);
                                                                if (scoreRatio >= 8) {
                                                                    statusElement = (
                                                                        <div className="tw-flex tw-items-center tw-space-x-1">
                                                                            <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-green-500 tw-rounded-full tw-bg-green-500 tw-bg-opacity-20"></div>
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    statusElement = (
                                                                        <div className="tw-flex tw-items-center tw-space-x-1">
                                                                            <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-red-500 tw-rounded-full tw-bg-red-500 tw-bg-opacity-20"></div>
                                                                        </div>
                                                                    );
                                                                }
                                                            } else {
                                                                statusElement = (
                                                                    <div className="tw-flex tw-items-center tw-space-x-1">
                                                                        <div className="tw-w-4 tw-h-4 tw-border-2 tw-border-gray-300 tw-rounded-full tw-bg-gray-300 tw-bg-opacity-20"></div>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="tw-flex tw-items-center tw-space-x-2 tw-mb-2 tw-cursor-pointer"
                                                                    onClick={() => exam.id && handleExamClick('exam', exam.id)}
                                                                >
                                                                    {statusElement}
                                                                    <span className='tw-font-bold'>{exam.name}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                ) : (
                    <div className='tw-w-full tw-bg-white tw-shadow-2xl tw-border-black tw-border'>
                        <div className="tw-min-h-screen tw-bg-gray-100 tw-p-6">
                            <div className="tw-max-w-7xl tw-mx-auto">
                                <h1 className="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-8">Learning Dashboard</h1>

                                <FilterSection />

                                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-mb-8">
                                    <StatCard icon={AutoStoriesIcon} title="Theory Completion" value="75%" bgColor="tw-bg-blue-600" />
                                    <StatCard icon={AssignmentIcon} title="Exams Taken" value="24" bgColor="tw-bg-green-600" />
                                    <StatCard icon={DriveFileRenameOutlineIcon} title="Exercises Completed" value="156" bgColor="tw-bg-purple-600" />
                                </div>

                                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
                                    <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-lg">
                                        <h2 className="tw-text-xl tw-font-bold tw-mb-4">Theory Progress</h2>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={mockTheoryData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" fill="#0088FE" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-lg">
                                        <h2 className="tw-text-xl tw-font-bold tw-mb-4">Exam Performance</h2>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={mockExamData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="score" stroke="#00C49F" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-lg">
                                        <h2 className="tw-text-xl tw-font-bold tw-mb-4">Exercise Distribution</h2>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={mockExerciseData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {mockExerciseData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardReport;