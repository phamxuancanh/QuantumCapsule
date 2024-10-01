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
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import { useTranslation } from 'react-i18next'

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
    const [grades] = useState([
        { Id: 1, Name: '1' },
        { Id: 2, Name: '2' },
        { Id: 3, Name: '3' },
        { Id: 4, Name: '4' },
        { Id: 5, Name: '5' },
        { Id: 6, Name: '6' },
        { Id: 7, Name: '7' },
        { Id: 8, Name: '8' },
        { Id: 9, Name: '9' },
        { Id: 10, Name: '10' },
        { Id: 11, Name: '11' },
        { Id: 12, Name: '12' }
    ])
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const query = useQuery();
    const initialPage = parseInt(query.get('page') || '1', 10);
    const initialSubject = query.get('subject') || 'subject1';
    const initialGrade = parseInt(query.get('grade') || '1', 10);

    const [page, setPage] = useState<number>(initialPage);
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
    const [selectedGrade, setSelectedGrade] = useState<number>(initialGrade);
    const [chaptersData, setChaptersData] = useState<DataListChapter | undefined>(
        undefined
    )
    const [lessonsData, setLessonsData] = useState<ILesson[]>([]);
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const fetchSubjects = async () => {
        try {
            const response = await getListSubject()
            console.log('Danh sách môn học:', response.data.data);
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

    const handleGradeClick = (classId: number) => {
        setSelectedGrade(classId);
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('grade', classId.toString());
        queryParams.set('page', '1');
        navigate(`?${queryParams.toString()}`);
    };
    const fetchChapters = async (params?: ListChapterParams) => {
        try {
            const res = await getListChapter({ params });
            setChaptersData(res.data);
            console.log('Chapters:', res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get('page') || '1', 10);
        const currentGrade = parseInt(queryParams.get('grade') || '1', 10);
        const currentSubject = queryParams.get('subject') || 'subject1';
        setPage(currentPage);
        setSelectedGrade(currentGrade);
        setSelectedSubject(currentSubject);
        if (currentSubject && currentGrade) {
            fetchChapters({ page: currentPage, subjectId: currentSubject, grade: currentGrade });
        }
    }, [location.search]);

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
            console.log('Danh sách bài học:', response.data);
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
                    console.log(`Danh sách bài học cho chapter ${chapter.id}:`, lessons);
                }
                console.log('Tất cả bài học trước khi cập nhật state:', allLessons);
                setLessonsData(allLessons);
            }
            setLessonLoading(false);
        };
        fetchAllLessons();
    }, [chaptersData]);

    useEffect(() => {
        console.log('Lessons data sau khi update:', lessonsData);
    }, [lessonsData]);

    const toggleChapterExpansion = (chapterId: string) => {
        console.log('Toggle chapter expansion:', chapterId);
        if (expandedChapters.includes(chapterId)) {
            setExpandedChapters(expandedChapters.filter(id => id !== chapterId));
        } else {
            setExpandedChapters([...expandedChapters, chapterId]);
        }
    };
    const toggleAllChapterExpansion = () => {
        if (expandedChapters.length === chaptersData?.data.length) {
            setExpandedChapters([]);
        } else {
            setExpandedChapters(chaptersData?.data.map(chapter => chapter.id ?? '') ?? []);
        }
    };

    const allChaptersExpanded = expandedChapters.length === chaptersData?.data.length;

    const handleLessonClick = (lesson: ILesson) => {
        navigate(`/lessonDetail?lessonId=${lesson.id}`, { state: { lesson } });
    };
    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className='tw-text-lg tw-flex tw-items-center tw-justify-center tw-bg-slate-50'>
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
                            {/* <div className='tw-font-bold tw-text-lg'>{subject.name}</div> */}
                            <div className='tw-font-bold tw-text-lg'>
                                {subject.name === 'Toán' ? t('homepage.math') : t('homepage.literature')}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='tw-flex tw-justify-between'>
                    <div className='tw-text-4xl tw-font-bold'>{(t('homepage.course_content'))}</div>
                </div>
                <div className='tw-flex tw-w-full tw-space-x-16'>
                    <div className='tw-w-1/4 tw-border tw-rounded-2xl tw-bg-white tw-h-fit'>
                        <div className='tw-bg-green-400 tw-font-bold tw-text-lg tw-text-center tw-rounded-t-2xl tw-p-3'>{t('homepage.grade')}</div>
                        <div className='tw-border tw-rounded-md tw-p-1 tw-m-2'>
                            <div className='tw-flex tw-flex-col tw-space-y-2'>
                                {grades.map((cls) => (
                                    <button
                                        key={cls.Id}
                                        className={`tw-flex tw-justify-center tw-p-2 tw-rounded-md tw-bg-blue-200 hover:tw-bg-blue-300 tw-text-left ${selectedGrade === cls.Id ? 'tw-bg-blue-400' : ''}`}
                                        onClick={() => handleGradeClick(cls.Id)}
                                    >
                                       {t('homepage.grade')} {cls.Name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='tw-flex-col tw-w-3/4 tw-border tw-space-y-5'>
                        <div className='tw-w-full tw-border tw-rounded-2xl tw-bg-white'>
                            <div className='tw-flex tw-justify-between tw-border-b tw-border-dashed tw-p-5 tw-mx-4 tw-space-x-10'>

                                <img
                                    className='tw-w-64 tw-h-40'
                                    src={
                                        selectedSubject === 'subject1' && selectedGrade === 1
                                            ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/toan1.jpg'
                                            : selectedSubject === 'subject1' && selectedGrade === 2
                                                ? 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/toan2.jpg'
                                                : selectedSubject !== 'subject1' && selectedGrade === 1
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
                                                {selectedSubject === 'subject1' && selectedGrade === 1 && t('homepage.math1_title')}
                                                {selectedSubject === 'subject1' && selectedGrade === 2 && t('homepage.math2_title')}
                                                {selectedSubject !== 'subject1' && selectedGrade === 1 && t('homepage.literature1_title')}
                                                {selectedSubject !== 'subject1' && selectedGrade === 2 && t('homepage.literature2_title')}
                                            </div>
                                        </div>
                                        <div>
                                            {selectedSubject === 'subject1' && selectedGrade === 1 && t('homepage.math1_description')}
                                            {selectedSubject === 'subject1' && selectedGrade === 2 && t('homepage.math2_description')}
                                            {selectedSubject !== 'subject1' && selectedGrade === 1 && t('homepage.literature1_description')}
                                            {selectedSubject !== 'subject1' && selectedGrade === 2 && t('homepage.literature2_description')}
                                        </div>
                                    </div>
                                    <ProgressBar
                                        bgColor='orange'
                                        className='tw-w-2/3'
                                        maxCompleted={100}
                                        completed={70}
                                    />
                                    <div className="tw-flex tw-items-center">
                                        <BarChartIcon className="tw-mr-2" />
                                        <span>{t('homepage.completed')}: 0/{lessonsData.length} {t('homepage.lesson')} ({t('homepage.archived')} 0%)</span>
                                    </div>
                                    <button className='tw-cursor-pointer tw-bg-green-200 tw-border tw-rounded-lg tw-p-2 tw-flex tw-items-center'>
                                        <ArrowCircleRightOutlinedIcon className='tw-mr-2' />
                                        {t('homepage.continue_learning')}
                                    </button>
                                </div>
                            </div>
                            <div className='tw-flex tw-justify-between tw-p-5'>
                                <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                    <div className='tw-font-bold tw-text-2xl'>0/{lessonsData.length}</div>
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
                        <div className='tw-font-bold tw-text-2xl tw-px-5'>{t('homepage.content')}</div>
                        <div className='tw-flex tw-justify-between tw-px-5'>
                            <div className='tw-flex tw-items-center tw-space-x-2'>
                                {/* <div><span className='tw-font-bold'>{chaptersData?.data?.length}</span> {t('homepage.chapter')}</div> */}
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
                            <div
                                className='tw-font-bold tw-text-green-500 tw-cursor-pointer'
                                onClick={toggleAllChapterExpansion}
                            >
                                {allChaptersExpanded ? t('homepage.colapse_all') : t('homepage.expand_all')}
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
                                            //  margin={10}
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
                                                            className='tw-flex tw-justify-between tw-items-center tw-bg-gray-200 tw-cursor-pointer tw-p-2 tw-border tw-rounded-md tw-px-5'
                                                            onClick={() => toggleChapterExpansion(chapter.id ?? '')}
                                                        >
                                                            <li className='tw-font-bold tw-flex tw-items-center tw-cursor-pointer hover:tw-bg-gray-200 hover:tw-text-gray-700'>
                                                                {expandedChapters.includes(chapter.id ?? '') ? (
                                                                    <RemoveIcon className='tw-mr-2 tw-text-red-500' />
                                                                ) : (
                                                                    <AddIcon className='tw-mr-2 tw-text-green-500' />
                                                                )}
                                                                {index + 1}. {chapter.name}
                                                            </li>
                                                            <div>
                                                                {lessonsData.filter(lesson => lesson.chapterId === chapter.id).length} {t('homepage.lesson')}
                                                                {(currentLanguage === 'en' && lessonsData.filter(lesson => lesson.chapterId === chapter.id).length >= 2) ? 's' : ''}
                                                            </div>
                                                        </div>
                                                        {expandedChapters.includes(chapter.id ?? '') && (
                                                            <ul className='tw-ml-8 tw-space-y-1'>
                                                                {lessonsData
                                                                    .filter(lesson => lesson.chapterId === chapter.id)
                                                                    .map((lesson, idx) => (
                                                                        <li
                                                                            key={lesson.id}
                                                                            className='tw-flex tw-items-center tw-p-2 tw-py-1 tw-border-b tw-text-gray-500 tw-cursor-pointer hover:tw-bg-gray-200 hover:tw-text-gray-700'
                                                                            onClick={() => handleLessonClick(lesson)}
                                                                        >
                                                                            <PlayLessonIcon className='tw-mr-2' />
                                                                            <span>{idx + 1}. {lesson.name}</span>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        )}
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
            </div>


        </div>

    )
};

export default Home;
