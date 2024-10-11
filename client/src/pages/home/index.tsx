import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '@ramonak/react-progress-bar'
import icon_category from '../../assets/icon_category.png';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { getListSubject } from 'api/subject/subject.api';
import { ISubject } from 'api/subject/subject.interface';
import { DataListChapter, IChapter, ListChapterParams } from 'api/chapter/chapter.interface';
import { getListChapter } from 'api/chapter/chapter.api';
import { styled } from '@mui/system'
import { Pagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { getLessonByChapterId } from 'api/lesson/lesson.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { ClockLoader } from 'react-spinners'
import { useTranslation } from 'react-i18next'
import { AppDispatch } from 'redux/store';
import { fetchUser, selectUser } from '../../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getTheoriesByLessonId } from 'api/theory/theory.api';
import { getExamsByLessonId } from 'api/exam/exam.api';
import { IExam } from 'api/exam/exam.interface';
import { ITheory } from 'api/theory/theory.interface';
import Select, { ActionMeta, SingleValue } from 'react-select';
import ROUTES from 'routes/constant';
import { findProgressByGradeAndSubject } from 'api/progress/progress.api';
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
    console.log('User from redux:', userRedux?.grade);
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const query = useQuery();
    const initialPage = parseInt(query.get('page') || '1', 10);
    const initialSubject = query.get('subject') || 'subject1';

    const [page, setPage] = useState<number>(initialPage);
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
    const [chaptersData, setChaptersData] = useState<DataListChapter | undefined>(
        undefined
    )
    const [lessonsData, setLessonsData] = useState<ILesson[]>([]);
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const [selectedClass, setSelectedClass] = useState<{ value: number; label: string } | null>(null);
    const [numberTheoryDone, setNumberTheoryDone] = useState<number>(0);
    const classes = [
        { value: 1, label: 'Lớp 1' },
        { value: 2, label: 'Lớp 2' },
        { value: 3, label: 'Lớp 3' },
    ];
    const handleClassChange = (newValue: SingleValue<{ value: number; label: string }>, actionMeta: ActionMeta<{ value: number; label: string }>) => {
        if (newValue) {
            setSelectedClass(newValue);
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('grade', newValue.value.toString());
            queryParams.set('page', '1');
            navigate(`?${queryParams.toString()}`);
        }
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get('page') || '1', 10);
        console.log('userReduxGrade:', userRedux?.grade);
        const currentGrade = parseInt(queryParams.get('grade') || userRedux?.grade?.toString() || '1', 10);
        const currentSubject = queryParams.get('subject') || 'subject1';
        setPage(currentPage);
        setSelectedSubject(currentSubject);
        setSelectedClass({ value: currentGrade, label: `Lớp ${currentGrade}` });
        if (currentSubject && currentGrade) {
            fetchChapters({ page: currentPage, subjectId: currentSubject, grade: currentGrade });
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
            const res = await getListChapter({ params });
            setChaptersData(res.data);
            if (res.data.data.length > 0) {
                if (res.data.data[0].id) {
                    setSelectedChapter(res.data.data[0]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const totalPage = useMemo(() => {
        const size = (chaptersData != null) ? chaptersData.size : 5;
        const totalRecord = (chaptersData != null) ? chaptersData.totalRecords : 5;
        return Math.ceil(totalRecord / size);
    }, [chaptersData]);

    const handleChangeChapterPagination = (value: number) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', value.toString());
        navigate(`?${queryParams.toString()}`);
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
    const [lessonLoading, setLessonLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchAllLessons = async () => {
            setLessonLoading(true);
            if ((chaptersData?.data?.length ?? 0) > 0) {
                const chapters = chaptersData?.data ?? [];
                let allLessons: ILesson[] = [];
                for (const chapter of chapters) {
                    const lessons = await fetchLessonByChapterId(chapter.id ?? '');
                    if (Array.isArray(lessons.data)) {
                        allLessons.push(...lessons.data);
                    }
                }
                setLessonsData(allLessons);
            }
            setLessonLoading(false);
        };
        fetchAllLessons();
    }, [chaptersData]);

    const handleExpandAll = async () => {
        const newExpandedLessons = lessonsData.reduce((acc: { [key: string]: boolean }, lesson) => {
            if (lesson.id !== undefined) {
                acc[lesson.id] = true;
            }
            return acc;
        }, {});

        setExpandedLessons(newExpandedLessons);
        await Promise.all(
            lessonsData.map(async (lesson) => {
                if (lesson.id !== undefined) {
                    await fetchTheoriesAndExams(lesson.id);
                }
            })
        );
    };

    const handleCollapseAll = () => {
        setExpandedLessons({});
    };
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpandCollapse = async () => {
        if (isExpanded) {
            handleCollapseAll();
        } else {
            await handleExpandAll();
        }
        setIsExpanded(!isExpanded);
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const [selectedChapter, setSelectedChapter] = useState<IChapter | null>(null);
    const [expandedLessons, setExpandedLessons] = useState<{ [key: string]: boolean }>({});


    const [theories, setTheories] = useState<{ [key: string]: ITheory[] }>({});
    const [exams, setExams] = useState<{ [key: string]: IExam[] }>({});

    const handleChapterClick = (chapter: any) => {
        setSelectedChapter(chapter);
    };

    const handleLessonClick = async (lessonId: any) => {
        setExpandedLessons((prevState) => ({
            ...prevState,
            [lessonId]: !prevState[lessonId as string],
        }));

        if (!expandedLessons[lessonId]) {
            await fetchTheoriesAndExams(lessonId);
        }
    };

    const fetchTheoriesAndExams = async (lessonId: string) => {
        try {
            const [theoriesResponse, examsResponse] = await Promise.all([
                getTheoriesByLessonId(lessonId),
                getExamsByLessonId(lessonId),
            ]);
            console.log(theoriesResponse);
            console.log(examsResponse);
            setTheories((prevState) => ({
                ...prevState,
                [lessonId]: theoriesResponse.data.theories,
            }));
            setExams((prevState) => ({
                ...prevState,
                [lessonId]: examsResponse.data.exams,
            }));
        } catch (error) {
            console.error('Error fetching theories and exams:', error);
        }
    };
    const handleTheoryExamClick = (type: 'theory' | 'exam', id: string) => {
        if (type === 'theory') {
            navigate(`${ROUTES.learning}?theoryId=${id}`);
        } else if (type === 'exam') {
            navigate(`${ROUTES.skill_practice}?examId=${id}`);
        }
    };
    useEffect(() => {
        const fetchProgress = async () => {
            console.log('Selected class:', selectedClass);
            console.log('Selected subject:', selectedSubject);
            const progress = selectedClass?.value !== undefined
                ? await findProgressByGradeAndSubject(selectedClass.value, selectedSubject)
                : await findProgressByGradeAndSubject(userRedux?.grade ?? 1, selectedSubject);
            console.log('Progress1:', progress);
            setNumberTheoryDone(progress?.data.data.length ?? 0);
        };
        fetchProgress();
    }, [location.search]);
    return (
        <div className='tw-text-lg tw-bg-slate-50 tw-flex tw-items-center tw-justify-center'>
            <div className='tw-w-4/5 tw-py-5'>
                <div className='tw-bg-transparent'>
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
                                <div className='tw-font-bold tw-text-lg'>
                                    {subject.name === 'Toán' ? t('homepage.math') : t('homepage.literature')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='tw-flex tw-justify-center tw-space-x-5 tw-mt-16'>
                    <div className='tw-w-2/5 tw-space-y-16 '>
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
                                    <div>•</div>
                                    <div>
                                        <span className='tw-font-bold'>{lessonsData.length} </span>
                                        {t('homepage.exam')}
                                        {(currentLanguage !== 'vi' && lessonsData.length >= 2) ? 's' : ''}
                                    </div>
                                </div>
                            </div>

                            <div className='tw-bg-white tw-border tw-rounded-2xl'>
                                <div className='tw-p-2'>
                                    {lessonLoading ? (
                                        <div className='tw-p-5'>
                                            <ClockLoader
                                                className='tw-flex tw-justify-center tw-items-center tw-w-full tw-mt-20'
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
                                    ) : (
                                        chaptersData?.data.length ?? 0 > 0 ? (
                                            <div>
                                                <ul className='tw-space-y-2'>
                                                    {chaptersData?.data.map((chapter, index) => (
                                                        <div key={chapter.id}>
                                                            <div
                                                                className={`tw-flex tw-justify-between tw-items-center tw-cursor-pointer tw-p-2 tw-border tw-rounded-md tw-px-5 ${selectedChapter?.id === chapter.id ? 'tw-bg-blue-200' : 'tw-bg-gray-200'
                                                                    }`}
                                                                onClick={() => handleChapterClick(chapter.id)}
                                                            >
                                                                <li className='tw-font-bold tw-flex tw-items-center tw-cursor-pointer hover:tw-bg-gray-200 hover:tw-text-gray-700'>
                                                                    {index + 1}. {chapter.name}
                                                                </li>
                                                                <div>
                                                                    {lessonsData.filter(lesson => lesson.chapterId === chapter.id).length} {t('homepage.lesson')}
                                                                    {(currentLanguage === 'en' && lessonsData.filter(lesson => lesson.chapterId === chapter.id).length >= 2) ? 's' : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ul>
                                                <div className='tw-flex tw-justify-center tw-mt-10 md:tw-mt-5 lg:tw-mt-3'>
                                                    <CustomPagination
                                                        count={totalPage}
                                                        page={page}
                                                        onChange={(_, page) => handleChangeChapterPagination(page)}
                                                        boundaryCount={1}
                                                        siblingCount={1}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='tw-font-bold tw-text-2xl tw-text-center tw-p-5'>There are currently no lessons</div>
                                        )
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='tw-bg-transparent tw-w-3/5'>
                        <div>
                            <div className='tw-flex tw-justify-between'>
                                {/* <div className='tw-text-4xl tw-font-bold'>{t('homepage.course_content')}</div> */}
                                <Select
                                    value={selectedClass}
                                    onChange={handleClassChange}
                                    options={classes}
                                    placeholder="Select Class"
                                    className="tw-w-1/3"
                                />
                            </div>
                            <div className='tw-flex tw-w-full tw-space-x-16 tw-py-5'>
                                <div className='tw-flex-col tw-w-full tw-space-y-5'>
                                    <div className='tw-w-full tw-border tw-rounded-2xl tw-bg-white'>
                                        <div className='tw-flex tw-justify-between tw-border-b tw-border-dashed tw-p-5 tw-mx-4 tw-space-x-10'>

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
                                            { }
                                            <div className='tw-space-y-3'>
                                                <div>
                                                    <div className='tw-flex tw-space-x-3 tw-w-full'>
                                                        <img src={icon_category} alt="icon_category" />
                                                        <div className='tw-text-2xl tw-font-bold'>
                                                            {selectedSubject === 'subject1' && userRedux?.grade === 1 && t('homepage.math1_title')}
                                                            {selectedSubject === 'subject1' && userRedux?.grade === 2 && t('homepage.math2_title')}
                                                            {selectedSubject !== 'subject1' && userRedux?.grade === 1 && t('homepage.literature1_title')}
                                                            {selectedSubject !== 'subject1' && userRedux?.grade === 2 && t('homepage.literature2_title')}
                                                        </div>
                                                    </div>
                                                    {/* <div>
                                                        {selectedSubject === 'subject1' && userRedux?.grade === 1 && t('homepage.math1_description')}
                                                        {selectedSubject === 'subject1' && userRedux?.grade === 2 && t('homepage.math2_description')}
                                                        {selectedSubject !== 'subject1' && userRedux?.grade === 1 && t('homepage.literature1_description')}
                                                        {selectedSubject !== 'subject1' && userRedux?.grade === 2 && t('homepage.literature2_description')}
                                                    </div> */}
                                                </div>
                                                <ProgressBar
                                                    bgColor='orange'
                                                    className='tw-w-2/3'
                                                    maxCompleted={100}
                                                    isLabelVisible={false}
                                                    completed={numberTheoryDone / lessonsData.length * 100}
                                                />
                                                <div className="tw-flex tw-items-center">
                                                    <BarChartIcon className="tw-mr-2" />
                                                    <span>
                                                        {t('homepage.completed')}: {numberTheoryDone}/{lessonsData.length} {t('homepage.lesson')} ({t('homepage.archived')} {lessonsData.length > 0 ? (numberTheoryDone / lessonsData.length * 100).toFixed(2) : '0.00'}%)
                                                    </span>
                                                </div>
                                                <button className='tw-cursor-pointer tw-bg-green-200 tw-border tw-rounded-lg tw-p-2 tw-flex tw-items-center'>
                                                    <ArrowCircleRightOutlinedIcon className='tw-mr-2' />
                                                    {t('homepage.continue_learning')}
                                                </button>
                                            </div>
                                        </div>
                                        <div className='tw-flex tw-justify-between tw-p-5'>
                                            <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                                <div className='tw-font-bold tw-text-2xl'>{numberTheoryDone}/{lessonsData.length}</div>
                                                <div>{capitalizeFirstLetter(t('homepage.lesson'))}</div>
                                            </div>
                                            <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                                <div className='tw-font-bold tw-text-2xl'>0/0</div>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>

                            {selectedChapter?.id && (
                                <div className='tw-bg-gray-100 tw-p-4 tw-mt-4 tw-rounded-lg'>
                                    <h2 className='tw-font-bold tw-text-xl'>Lessons</h2>
                                    <div className='tw-flex tw-justify-end tw-mb-4'>
                                        <button
                                            className='tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md'
                                            onClick={toggleExpandCollapse}
                                        >
                                            {isExpanded ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
                                        </button>
                                    </div>
                                    <ul className='tw-space-y-2'>
                                        {lessonsData.filter(lesson => lesson.chapterId === selectedChapter?.id).map((lesson) => (
                                            <React.Fragment key={lesson.id}>
                                                <li
                                                    className='tw-p-2 tw-bg-white tw-rounded-md tw-shadow tw-cursor-pointer tw-flex tw-justify-between tw-items-center'
                                                    onClick={() => handleLessonClick(lesson.id)}
                                                >
                                                    <span className='tw-font-bold tw-text-lg'>{lesson.name}</span>
                                                    {lesson.id !== undefined && (
                                                        expandedLessons[lesson.id] ? <RemoveIcon /> : <AddIcon />
                                                    )}
                                                </li>
                                                {lesson.id !== undefined && expandedLessons[lesson.id] && (
                                                    <div className='tw-bg-gray-100 tw-p-4 tw-mt-4 tw-rounded-lg tw-flex'>
                                                        <div className='tw-flex-1'>
                                                            <h3 className='tw-font-bold tw-text-lg'>Theory</h3>
                                                            <ul className='tw-space-y-2'>
                                                                {theories[lesson.id]?.map((theory) => (
                                                                    <li
                                                                        key={theory.id}
                                                                        className={`tw-p-1 ${selectedChapter?.grade !== undefined && selectedChapter?.grade > (userRedux?.grade ?? 0) ? 'tw-text-gray-500' : 'tw-text-blue-500 hover:tw-underline tw-cursor-pointer'}`}
                                                                        onClick={selectedChapter?.grade !== undefined && selectedChapter?.grade > (userRedux?.grade ?? 0) ? undefined : () => handleTheoryExamClick('theory', theory.id ?? '')}
                                                                    >
                                                                        {theory.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className='tw-flex-1'>
                                                            <h3 className='tw-font-bold tw-text-lg'>Exams</h3>
                                                            <ul className='tw-space-y-2'>
                                                                {exams[lesson.id]?.map((exam) => (
                                                                    <li
                                                                        key={exam.id}
                                                                        className={`tw-p-1 ${selectedChapter?.grade !== undefined && selectedChapter?.grade > (userRedux?.grade ?? 0) ? 'tw-text-gray-500' : 'tw-text-blue-500 hover:tw-underline tw-cursor-pointer'}`}
                                                                        onClick={selectedChapter?.grade !== undefined && selectedChapter?.grade > (userRedux?.grade ?? 0) ? undefined : () => handleTheoryExamClick('exam', exam.id ?? '')}
                                                                    >
                                                                        {exam.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
)}
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* {selectedChapterId && (
                                <div className='tw-bg-gray-100 tw-p-4 tw-mt-4 tw-rounded-lg'>
                                    <h2 className='tw-font-bold tw-text-xl'>Lessons</h2>
                                    <div className='tw-flex tw-justify-end tw-mb-4'>
                                        <button
                                            className='tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md'
                                            onClick={toggleExpandCollapse}
                                        >
                                            {isExpanded ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
                                        </button>
                                    </div>
                                    <ul className='tw-space-y-2'>
                                        {lessonsData.filter(lesson => lesson.chapterId === selectedChapterId).map((lesson) => (
                                            <React.Fragment key={lesson.id}>
                                                <li
                                                    className='tw-p-2 tw-bg-white tw-rounded-md tw-shadow tw-cursor-pointer tw-flex tw-justify-between tw-items-center'
                                                    onClick={() => handleLessonClick(lesson.id)}
                                                >
                                                    <span className='tw-font-bold tw-text-lg'>{lesson.name}</span>
                                                    {lesson.id !== undefined && (
                                                        expandedLessons[lesson.id] ? <RemoveIcon /> : <AddIcon />
                                                    )}
                                                </li>
                                                {lesson.id !== undefined && expandedLessons[lesson.id] && (
                                                    <div className='tw-bg-gray-100 tw-p-4 tw-mt-4 tw-rounded-lg tw-flex'>
                                                        <div className='tw-flex-1'>
                                                            <h3 className='tw-font-bold tw-text-lg'>Theory</h3>
                                                            <ul className='tw-space-y-2'>
                                                                {theories[lesson.id]?.map((theory) => (
                                                                    <li
                                                                        key={theory.id}
                                                                        className='tw-p-1 tw-text-blue-500 hover:tw-underline tw-cursor-pointer'
                                                                        onClick={() => handleTheoryExamClick('theory', theory.id ?? '')}
                                                                    >
                                                                        {theory.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className='tw-flex-1'>
                                                            <h3 className='tw-font-bold tw-text-lg'>Exams</h3>
                                                            <ul className='tw-space-y-2'>
                                                                {exams[lesson.id]?.map((exam) => (
                                                                    <li
                                                                        key={exam.id}
                                                                        className='tw-p-1 tw-text-blue-500 hover:tw-underline tw-cursor-pointer'
                                                                        onClick={() => handleTheoryExamClick('exam', exam.id ?? '')}
                                                                    >
                                                                        {exam.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default Home;
