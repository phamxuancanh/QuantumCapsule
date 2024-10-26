import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '@ramonak/react-progress-bar'
import icon_category from '../../assets/icon_category.png';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { getListSubject } from 'api/subject/subject.api';
import { ISubject } from 'api/subject/subject.interface';
import { DataListChapter, IChapter, ListChapterParams } from 'api/chapter/chapter.interface';
import { getListChapter, getListChapterNoPaging } from 'api/chapter/chapter.api';
import { styled } from '@mui/system'
import { Pagination, Rating } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { getFirstLessonByChapterId, getLessonByChapterId } from 'api/lesson/lesson.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { ClockLoader } from 'react-spinners'
import { useTranslation } from 'react-i18next'
import { AppDispatch } from 'redux/store';
import { fetchUser, selectUser } from '../../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getTheoriesByLessonId } from 'api/theory/theory.api';
import { getExamsByChapterId, getExamsByLessonId } from 'api/exam/exam.api';
import { IExam } from 'api/exam/exam.interface';
import { ITheory } from 'api/theory/theory.interface';
import Select, { ActionMeta, SingleValue } from 'react-select';
import ROUTES from 'routes/constant';
import { findProgressByChapter, findProgressByGradeAndSubject } from 'api/progress/progress.api';
import thumnail from '../../assets/thumnail.png';
import thumnail_exercise from '../../assets/thumnail_exercises.png';
import thumnail_exam from '../../assets/thumnail_exam.png';
import { getListUniqueDoneResultByChapterId } from 'api/result/result.api';
import { calculateScore } from 'helpers/Nam-helper/Caculate';
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
const Home = () => {
    const CustomPagination = styled(Pagination)({
        '.MuiPagination-ul': {
            display: 'inline-flex',
            fontSize: 'large',
            listStyle: 'none',
            margin: '10px',
            '@media (max-width: 600px)': {
                margin: '5px'
            }
        },
        '.MuiPaginationItem-root': {
            fontSize: 'large',
            fontWeight: 'bold',
            borderRadius: '4px',
            margin: '2px',
            border: '1px solid #cbd5e0',
            backgroundColor: 'white',
            color: '#718096',
            '&:hover': {
                backgroundColor: '#667eea',
                color: 'white'
            },
            '@media (max-width: 600px)': {
                margin: '0px'
            }
        },
        '.MuiPaginationItem-firstLast': {
            borderRadius: '4px'
        },
        '.MuiPaginationItem-previousNext': {
            borderRadius: '4px',
            margin: '10px',
            '@media (min-width: 600px)': {
                margin: '20px'
            },
            '@media (max-width: 600px)': {
                fontSize: 'medium',
                margin: '0px'
            }
        },
        '.MuiPaginationItem-page.Mui-selected': {
            color: '#667eea',
            fontWeight: 'bold',
            border: '2px solid #667eea',
            '&:hover': {
                backgroundColor: '#667eea',
                color: 'white'
            }
        },
        '.MuiPaginationItem-ellipsis': {
            color: '#a0aec0',
            border: '1px solid #cbd5e0',
            backgroundColor: 'white',
            padding: '2px',
            margin: '0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
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
    const [selectedChapter, setSelectedChapter] = useState<IChapter | null>(null)
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const query = useQuery();
    const initialSubject = query.get('subject') || 'subject1';

    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
    const [chaptersData, setChaptersData] = useState<DataListChapter | undefined>(
        undefined
    )
    const [lessonsData, setLessonsData] = useState<ILesson[]>([]);

    const [subjects, setSubjects] = useState<ISubject[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const [numberTheoryDone, setNumberTheoryDone] = useState<number>(0);
    const [numberExcersiceDone, setNumberExcersiceDone] = useState<number>(0);
    const [numberExamDone, setNumberExamDone] = useState<number>(0);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get('page') || '1', 10);
        console.log('userReduxGrade:', userRedux?.grade);
        const currentGrade = parseInt(queryParams.get('grade') || userRedux?.grade?.toString() || '1', 10);
        const currentSubject = queryParams.get('subject') || 'subject1';
        setSelectedSubject(currentSubject);
        if (currentSubject && currentGrade && currentPage) {
            fetchChapters({ subjectId: currentSubject, grade: currentGrade });
        }
    }, [location.search, userRedux]);
    const fetchSubjects = async () => {
        try {
            const response = await getListSubject()
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
        queryParams.set('page', '1');
        navigate(`?${queryParams.toString()}`);
    }
    const fetchChapters = async (params?: ListChapterParams) => {
        try {
            const res = await getListChapterNoPaging({ params });
            setChaptersData(res.data);
            console.log('Chapters:', chaptersData);
            if (res.data.data.length > 0) {
                if (res.data.data[0].id) {
                    setSelectedChapterId(res.data.data[0].id);
                    setSelectedChapter(res.data.data[0]);
                    const firstLessonInChapter = await getFirstLessonByChapterId(res.data.data[0].id);
                    console.log('First lesson in chapter:', firstLessonInChapter);
                    setSelectedLessonId(firstLessonInChapter?.data.data.id ?? null);
                    console.log('Selected chapter:', selectedChapter);
                    console.log('Selected chapter:', res.data.data[0]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchLessonByChapterId = async (chapterId: string) => {
        try {
            const response = await getLessonByChapterId(chapterId);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bài học:', error);
            return [];
        }
    }
    const [theories, setTheories] = useState<{ [key: string]: ITheory[] }>({});
    const [exams, setExams] = useState<{ [key: string]: IExam[] }>({});
    const [exams2, setExams2] = useState<IExam[]>([]);
    const [selectedLessonsByChapter, setSelectedLessonsByChapter] = useState<{ [key: string]: string | null }>({});

    const fetchExam2ByChapterId = async (chapterId: string) => {
        try {
            const response = await getExamsByChapterId(chapterId);
            setExams2(response.data.exams);
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
            setExams(prevState => ({
                ...prevState,
                [lessonId]: examsResponse.data.exams,
            }));
        } catch (error) {
            console.error('Error fetching theories and exercises:', error);
        }
    };

    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    useEffect(() => {
        if (selectedChapterId) {
            fetchExam2ByChapterId(selectedChapterId);
        }
    }, [selectedChapterId]);

    useEffect(() => {
        if (selectedLessonId && !theories[selectedLessonId] && !exams[selectedLessonId]) {
            fetchTheoriesAndExercises(selectedLessonId);
        }
    }, [selectedLessonId]);

    const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({})

    const handleChapterClick = async (chapterId: string) => {
        setExpandedChapters(prevState => ({
            ...prevState,
            [chapterId]: !prevState[chapterId]
        }));

        if (!expandedChapters[chapterId]) {
            setSelectedChapterId(chapterId);
            setSelectedChapter(chaptersData?.data.find(chapter => chapter.id === chapterId) ?? null);

            const selectedLessonForChapter = selectedLessonsByChapter[chapterId];
            if (selectedLessonForChapter) {
                setSelectedLessonId(selectedLessonForChapter);
            } else {
                const firstLessonInChapter = await getFirstLessonByChapterId(chapterId);
                const firstLessonId = firstLessonInChapter?.data.data.id ?? null;
                setSelectedLessonId(firstLessonId);

                setSelectedLessonsByChapter(prev => ({
                    ...prev,
                    [chapterId]: firstLessonId,
                }));
            }
        }
    };
    const handleLessonClick = (lessonId: string) => {
        setSelectedLessonId(lessonId);

        setSelectedLessonsByChapter(prev => ({
            ...prev,
            [selectedChapterId as string]: lessonId,
        }));
    };

    const [lessonLoading, setLessonLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchAllLessons = async () => {
            setLessonLoading(true);
            if ((chaptersData?.data?.length ?? 0) > 0) {
                const chapters = chaptersData?.data ?? [];
                let allLessons: ILesson[] = [];
                for (const chapter of chapters) {
                    if (chapter.id) {
                        const lessons = await fetchLessonByChapterId(chapter.id);

                        if (Array.isArray(lessons.data)) {
                            allLessons.push(...lessons.data);
                        }
                    }
                }
                setLessonsData(allLessons);
            }
            setLessonLoading(false);
        };
        fetchAllLessons();
    }, [chaptersData]);

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const handleTheoryExamClick = (type: 'theory' | 'exam', id: string) => {
        if (type === 'theory') {
            navigate(`${ROUTES.learning}?theoryId=${id}`);
        } else if (type === 'exam') {
            navigate(`${ROUTES.skill_practice2}?examId=${id}`);
        }
    };
    const handleExam2Click = (type: 'theory' | 'exam', id: string) => {
        if (type === 'theory') {
            navigate(`${ROUTES.learning}?theoryId=${id}`);
        } else if (type === 'exam') {
            navigate(`${ROUTES.skill_practice}?examId=${id}`);
        }
    };
    useEffect(() => {
        const fetchChapterProgress = async () => {
            if (selectedChapterId) {
                const progress = await findProgressByChapter(selectedChapterId);
                setNumberTheoryDone(progress?.data.data.length ?? 0);
            }
        };
        fetchChapterProgress();
    }, [selectedChapterId])

    const [progress, setProgress] = useState<any>(null);
    useEffect(() => {
        const fetchResultProgress = async () => {
            if (userRedux?.grade && selectedSubject) {
                if (selectedChapterId) {
                    const progress = await getListUniqueDoneResultByChapterId(selectedChapterId);
                    console.log('Progress:', progress);
                    setProgress(progress.data.data);
                    setNumberExamDone(progress?.data.data.exams.length ?? 0);
                    setNumberExcersiceDone(progress?.data.data.exercises.length ?? 0);
                }
            }
        };
        fetchResultProgress();
    }, [selectedChapterId]);

    return (
        <div className='tw-text-lg tw-bg-slate-50 tw-flex tw-items-center tw-justify-center'>
            <div className='tw-w-11/12 tw-space-x-5 tw-flex tw-relative tw-mt-3'>
                {lessonLoading && (
                    <div className='tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center tw-bg-white tw-bg-opacity-75'>
                        <ClockLoader
                            color='#5EEAD4'
                            cssOverride={{
                                display: 'block',
                                margin: '0 auto',
                                borderColor: 'blue'
                            }}
                            loading
                            speedMultiplier={3}
                            size={40}
                        />
                    </div>
                )}
                <div className='tw-flex tw-space-y-5 tw-flex-col tw-w-2/5'>
                    <div className='tw-flex tw-w-full tw-space-x-3'>
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
                    <div className='tw-w-full tw-space-y-16'>
                        <div>
                            <div className='tw-font-bold tw-text-2xl tw-px-5'>{t('homepage.content')}</div>
                            <div className='tw-flex tw-justify-between tw-px-5'>
                                <div className='tw-flex tw-items-center tw-space-x-2'>
                                    <div>
                                        <span className='tw-font-bold'>{chaptersData?.data?.length} </span>
                                        {t('homepage.chapter')}
                                        {(currentLanguage !== 'vi' && (chaptersData?.data?.length ?? 0) >= 2) ? 's' : ''}
                                    </div>
                                    <div>•</div>
                                    <div>
                                        <span className='tw-font-bold'>{lessonsData.length} </span>
                                        {t('homepage.lesson')}
                                        {(currentLanguage !== 'vi' && lessonsData.length >= 2) ? 's' : ''}
                                    </div>
                                    {/* <div>•</div>
                                    <div>
                                        <span className='tw-font-bold'>{lessonsData.length} </span>
                                        bài tập
                                        {(currentLanguage !== 'vi' && lessonsData.length >= 2) ? 's' : ''}
                                    </div> */}
                                </div>
                            </div>
                            <div className='tw-bg-white tw-border tw-rounded-2xl tw-h-screen tw-overflow-y-auto'>
                                <div className='tw-p-2'>
                                    {chaptersData?.data.length ?? 0 > 0 ? (
                                        <div>
                                            <ul className='tw-space-y-2'>
                                                {chaptersData?.data.map((chapter, index) => (
                                                    <div key={chapter.id}>
                                                        <div
                                                            className={`tw-flex tw-justify-between tw-items-center tw-cursor-pointer tw-p-2 tw-border tw-rounded-md tw-px-5 ${chapter.id && expandedChapters[chapter.id] ? 'tw-bg-slate-100' : 'tw-bg-white'}`}
                                                            onClick={() => chapter.id && handleChapterClick(chapter.id)}
                                                        >
                                                            <li className='tw-font-bold tw-flex tw-items-center tw-cursor-pointer'>
                                                                {chapter.id && expandedChapters[chapter.id] ? <RemoveIcon className='tw-mr-2' /> : <AddIcon className='tw-mr-2' />} {index + 1}. {chapter.name}
                                                            </li>
                                                            <div>
                                                                {lessonsData.filter(lesson => lesson.chapterId === chapter.id).length} {t('homepage.lesson')}
                                                                {(currentLanguage === 'en' && lessonsData.filter(lesson => lesson.chapterId === chapter.id).length >= 2) ? 's' : ''}
                                                            </div>
                                                        </div>

                                                        {chapter.id && expandedChapters[chapter.id] && (
                                                            <ul className='tw-mx-8 tw-mt-2 tw-space-y-2'>
                                                                {lessonsData.filter(lesson => lesson.chapterId === chapter.id).map((lesson) => (
                                                                    <li
                                                                        key={lesson.id}
                                                                        className={`tw-p-2 tw-cursor-pointer tw-border-b tw-border-b-1 tw-border-gray-300 ${selectedLessonId === lesson.id ? 'tw-font-bold' : ''}`}
                                                                        onClick={() => handleLessonClick(lesson.id ?? '')}
                                                                    >
                                                                        {lesson.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className='tw-font-bold tw-text-2xl tw-text-center tw-p-5'>There are currently no lessons</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='tw-flex tw-flex-col tw-space-y-5 tw-w-3/5'>
                    <div className='tw-w-full tw-border tw-rounded-2xl tw-bg-white'>
                        <div className='tw-flex tw-border-b tw-border-dashed tw-p-5 tw-mx-4 tw-space-x-10'>

                            <img
                                className='tw-w-64 tw-h-40'
                                src={
                                    selectedSubject === 'subject1' && userRedux?.grade === 1
                                        ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/toan1.jpg'
                                        : selectedSubject === 'subject1' && userRedux?.grade === 2
                                            ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/toan2.jpg'
                                            : selectedSubject !== 'subject1' && userRedux?.grade === 1
                                                ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/tiengviet1.jpg'
                                                : 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/tiengviet2.jpg'
                                }
                            />
                            <div className='tw-space-y-3 '>
                                <div>
                                    <div className='tw-flex tw-space-x-3 tw-w-full'>
                                        <img src={icon_category} alt="icon_category" />
                                        <div className='tw-text-2xl tw-font-bold'>
                                            {selectedChapter?.name}
                                        </div>
                                    </div>
                                </div>
                                <ProgressBar
                                    bgColor='orange'
                                    className='tw-w-2/3'
                                    maxCompleted={100}
                                    isLabelVisible={false}
                                    completed={numberTheoryDone / (chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0) * 100}
                                />
                                <div className="tw-flex tw-items-center">
                                    <BarChartIcon className="tw-mr-2" />
                                    <span>
                                        {t('homepage.completed')}: {numberTheoryDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0} bài học ({t('homepage.archived')} {(numberTheoryDone / (chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0) * 100).toFixed(2)}  %)
                                    </span>
                                </div>
                                {/* <button className='tw-cursor-pointer tw-bg-green-500 tw-border tw-rounded-lg tw-p-2 tw-flex tw-items-center'>
                                    <ArrowCircleRightOutlinedIcon className='tw-mr-2' />
                                    {t('homepage.continue_learning')}
                                </button> */}
                            </div>
                            <div className='tw-flex-col tw-flex tw-justify-start tw-items-start tw-space-y-3'>
                                <div className='tw-grid tw-grid-cols-2 tw-gap-4 tw-w-full'>
                                    <div className='tw-flex tw-justify-start tw-items-center'>
                                        <div>Bài học: </div>
                                    </div>
                                    <div className='tw-flex tw-justify-start tw-items-center'>
                                        <div className='tw-font-bold tw-text-xl'>
                                            {numberTheoryDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-grid tw-grid-cols-2 tw-gap-4 tw-w-full'>
                                    <div className='tw-flex tw-justify-start tw-items-center'>
                                        <div>Bài tập: </div>
                                    </div>
                                    <div className='tw-flex tw-justify-start tw-items-center'>
                                        <div className='tw-font-bold tw-text-xl'>
                                            {numberExcersiceDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.examCount || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className='tw-grid tw-grid-cols-2 tw-gap-4 tw-w-full'>
                                    <div className='tw-flex tw-justify-start tw-items-center'>
                                        <div>Bài thi: </div>
                                    </div>
                                    <div className='tw-flex tw-justify-start tw-items-center'>
                                        <div className='tw-font-bold tw-text-xl'>
                                            {numberExamDone}/{exams2?.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className='tw-flex tw-p-5 tw-w-11/12 tw-space-x-20'>
                            <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                <div className='tw-font-bold tw-text-2xl'>
                                    {numberTheoryDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0}
                                </div>

                                <div>Bài lý thuyết</div>
                            </div>
                            <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                <div className='tw-font-bold tw-text-2xl'>
                                    {numberExcersiceDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.examCount || 0}
                                </div>
                                <div>Bài luyện tập</div>
                            </div>

                            <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                <div className='tw-font-bold tw-text-2xl'>{numberExamDone}/{exams2?.length}</div>

                                <div>{capitalizeFirstLetter(t('homepage.exam'))}</div>
                            </div>
                            <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                <div className="tw-border-4 tw-border-gray-500 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                <div>{t('homepage.not_yet_practice')}</div>
                            </div>
                            <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                <div className="tw-border-4 tw-border-sky-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                <div>{t('homepage.in_progress')}</div>
                            </div>
                            <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                <div className="tw-border-4 tw-border-green-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                <div>{t('homepage.completed')}</div>
                            </div>
                            <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                <div className="tw-border-4 tw-border-orange-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                <div>{t('homepage.need_improvement')}</div>
                            </div>
                        </div> */}
                    </div>

                    <div className='tw-bg-transparent tw-w-full tw-overflow-auto tw-h-screen'>
                        <div className="tw-container tw-mx-auto tw-p-1">
                            {selectedLessonId ? (
                                <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-space-y-6">
                                    {/* Hiển thị danh sách Theories */}
                                    <div className="">
                                        <h3 className="tw-text-xl tw-font-semibold tw-mb-2">Bài học</h3>
                                        {theories[selectedLessonId] && theories[selectedLessonId].length > 0 ? (
                                            <ul className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
                                                {theories[selectedLessonId].map((theory) => (
                                                    <li
                                                        key={theory.id}
                                                        className="tw-bg-slate-100 tw-rounded-md tw-shadow-md tw-border tw-border-gray-300 tw-cursor-pointer"
                                                        onClick={() => theory.id && handleTheoryExamClick('theory', theory.id)}
                                                    >
                                                        <div className="tw-overflow-hidden tw-rounded-t-md">
                                                            <img
                                                                src={thumnail}
                                                                alt={theory.name}
                                                                className="tw-w-full tw-h-auto tw-mb-2 tw-transition-transform tw-duration-300 hover:tw-scale-105"
                                                            />
                                                        </div>
                                                        <h4 className="tw-p-4 tw-pt-0 tw-font-bold tw-text-lg">{theory.name}</h4>
                                                        <p className="tw-text-sm tw-mt-2">{theory.description}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No theories available.</p>
                                        )}
                                    </div>


                                    {/* Hiển thị danh sách Exams */}
                                    <div className="tw-mt-4">
                                        <h3 className="tw-text-xl tw-font-semibold tw-mb-2">Bài tập</h3>
                                        {exams[selectedLessonId] && exams[selectedLessonId].length > 0 ? (
                                            <ul className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
                                                {exams[selectedLessonId].map((exam) => {
                                                    const exerciseProgress = progress.exercises.find((exercise: any) => exercise.examId === exam.id);
                                                    const starRating = exerciseProgress ? exerciseProgress.star : null;
                                                    const yourScore = exerciseProgress ? exerciseProgress.yourScore : null;
                                                    const totalScore = exerciseProgress ? exerciseProgress.totalScore : null;

                                                    return (
                                                        <li
                                                            key={exam.id}
                                                            className="tw-bg-slate-100 tw-rounded-md tw-shadow-md tw-border tw-border-gray-300 tw-cursor-pointer"
                                                            onClick={() => exam.id && handleTheoryExamClick('exam', exam.id)}
                                                        >
                                                            <div className="tw-overflow-hidden tw-rounded-t-md">
                                                                <img
                                                                    src={thumnail_exercise}
                                                                    alt={exam.name}
                                                                    className="tw-w-full tw-h-auto tw-mb-2 tw-transition-transform tw-duration-300 hover:tw-scale-105"
                                                                />
                                                            </div>
                                                            <h4 className="tw-p-4 tw-pt-0 tw-font-bold tw-text-lg">{exam.name}</h4>
                                                            {exerciseProgress ? (
                                                                <div className="tw-p-4 tw-pt-0 tw-flex tw-flex-col tw-items-start">
                                                                    <Rating name="customized-10" value={starRating} max={3} readOnly />
                                                                    <div>Làm đúng: {yourScore}/{totalScore} câu</div>
                                                                    {/* <div>Điểm: <span style={{ fontWeight: 'bold' }}>{(yourScore / totalScore * 10).toFixed(2)}</span></div> */}
                                                                </div>
                                                            ) : (
                                                                <div className="tw-p-4 tw-pt-0 tw-flex tw-flex-col tw-items-start">
                                                                    <Rating name="customized-10" value={0} max={3} readOnly />
                                                                    <div>Chưa làm</div>
                                                                    {/* <div>Làm đúng: {yourScore}/{totalScore} câu</div>
                <div>Điểm: <span style={{ fontWeight: 'bold' }}>{(yourScore / totalScore * 10).toFixed(2)}</span></div> */}
                                                                </div>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p>No exams available.</p>
                                        )}
                                    </div>
                                    {/* <div className="tw-mt-4">
                                        <h3 className="tw-text-xl tw-font-semibold tw-mb-2">Bài luyện tập</h3>
                                        {exams[selectedLessonId] && exams[selectedLessonId].length > 0 ? (
                                            <ul className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
                                                {exams[selectedLessonId].map((exam) => {
                                                    const exerciseProgress = progress.exercises.find((exercise: any) => exercise.examId === exam.id);
                                                    const starRating = exerciseProgress ? exerciseProgress.star : null;
                                                    const yourScore = exerciseProgress ? exerciseProgress.yourScore : null;
                                                    const totalScore = exerciseProgress ? exerciseProgress.totalScore : null;
                                                    return (
                                                        <li
                                                            key={exam.id}
                                                            className="tw-bg-slate-100 tw-rounded-md tw-shadow-md tw-border tw-border-gray-300 tw-cursor-pointer"
                                                            onClick={() => exam.id && handleTheoryExamClick('exam', exam.id)}
                                                        >
                                                            <div className="tw-overflow-hidden tw-rounded-t-md">
                                                                <img
                                                                    src={thumnail_exercise}
                                                                    alt={exam.name}
                                                                    className="tw-w-full tw-h-auto tw-mb-2 tw-transition-transform tw-duration-300 hover:tw-scale-105"
                                                                />
                                                            </div>
                                                            <h4 className="tw-p-4 tw-pt-0 tw-font-bold tw-text-lg">{exam.name}</h4>
                                                            {starRating && (
                                                            <div className="tw-p-4 tw-pt-0 tw-flex tw-flex-col tw-items-start">
                                                                <Rating name="customized-10" value={starRating} max={3} readOnly />
                                                                <div>Làm đúng: {yourScore}/{totalScore} câu</div>
                                                            </div>
                                                        )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p>No exams available.</p>
                                        )}
                                    </div> */}
                                </div>
                            ) : (
                                <p className="tw-text-gray-500">Chọn 1 bài trong chương để xem thông tin bài học.</p>
                            )}
                        </div>
                        {/* <div className="tw-container tw-mx-auto tw-p-4">
                            <div className='tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-space-y-6'>
                                <div className="tw-mt-4">
                                    <h3 className="tw-text-xl tw-font-semibold tw-mb-2">Bài kiểm tra</h3>
                                    {exams2.length > 0 ? (
                                        <ul className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
                                            {exams2.map((exam) => (
                                                <li
                                                    key={exam.id}
                                                    className="tw-bg-slate-100 tw-rounded-md tw-shadow-md tw-border tw-border-gray-300 tw-cursor-pointer"
                                                    onClick={() => exam.id && handleExam2Click('exam', exam.id)}
                                                >
                                                    <div className="tw-overflow-hidden tw-rounded-t-md">
                                                        <img
                                                            src={thumnail_exam}
                                                            alt={exam.name}
                                                            className="tw-w-full tw-h-auto tw-mb-2 tw-transition-transform tw-duration-300 hover:tw-scale-105"
                                                        />
                                                    </div>
                                                    <h4 className="tw-p-4 tw-pt-0 tw-font-bold tw-text-lg">{exam.name}</h4>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No exams available.</p>
                                    )}
                                </div>
                            </div>
                        </div> */}
                        <div className="tw-container tw-mx-auto tw-p-4">
                            <div className='tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-space-y-6'>
                                <div className="tw-mt-4">
                                    <h3 className="tw-text-xl tw-font-semibold tw-mb-2">Bài thi</h3>
                                    {exams2?.length > 0 ? (
                                        <ul className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
                                            {exams2?.map((exam) => {
                                                const examProgress = progress?.exams?.find((prog: any) => prog.examId === exam.id);
                                                const starRating = examProgress ? examProgress.star : null;
                                                const yourScore = examProgress ? examProgress.yourScore : null;
                                                const totalScore = examProgress ? examProgress.totalScore : null;

                                                return (
                                                    <li
                                                        key={exam.id}
                                                        className="tw-bg-slate-100 tw-rounded-md tw-shadow-md tw-border tw-border-gray-300 tw-cursor-pointer"
                                                        onClick={() => exam.id && handleExam2Click('exam', exam.id)}
                                                    >
                                                        <div className="tw-overflow-hidden tw-rounded-t-md">
                                                            <img
                                                                src={thumnail_exam}
                                                                alt={exam.name}
                                                                className="tw-w-full tw-h-auto tw-mb-2 tw-transition-transform tw-duration-300 hover:tw-scale-105"
                                                            />
                                                        </div>
                                                        <h4 className="tw-p-4 tw-pt-0 tw-font-bold tw-text-lg">{exam.name}</h4>
                                                        {examProgress ? (
                                                            <div className="tw-p-4 tw-pt-0 tw-flex tw-flex-col tw-items-start">
                                                                {/* <Rating name="customized-10" value={starRating} max={3} readOnly /> */}
                                                                <div>Điểm: <span className='tw-font-bold'>{calculateScore(totalScore, yourScore)}</span></div>
                                                                <div>Làm đúng: {yourScore}/{totalScore} câu</div>
                                                            </div>
                                                        ) : (
                                                            <div className="tw-p-4 tw-pt-0 tw-flex tw-flex-col tw-items-start">
                                                                <div>Điểm: <span className='tw-font-bold'>{0}</span></div>
                                                                <div>Chưa làm</div>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p>No exams available.</p>
                                    )}
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
