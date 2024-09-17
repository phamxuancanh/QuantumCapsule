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
                            <div className='tw-flex tw-flex-col tw-space-y-2'>
                                {grades.map((cls) => (
                                    <button
                                        key={cls.Id}
                                        className={`tw-p-2 tw-rounded-md tw-bg-blue-200 hover:tw-bg-blue-300 tw-text-left ${selectedGrade === cls.Id ? 'tw-bg-blue-400' : ''}`}
                                        onClick={() => handleGradeClick(cls.Id)}
                                    >
                                        {cls.Name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='tw-flex-col tw-w-3/4 tw-border tw-space-y-5'>
                        <div className='tw-w-full tw-border tw-rounded-2xl tw-bg-white'>
                            <div className='tw-flex tw-justify-between tw-border-b tw-border-dashed tw-p-5 tw-mx-4 tw-space-x-10'>
                                <img className='tw-w-64 tw-h-40' src='https://cdn.discordapp.com/attachments/1284566452833222777/1285285340516585636/img_2024-07-23_669f35c4a55b3.png?ex=66e9b6c0&is=66e86540&hm=2af64b9973a379433bc32aa1693170f209ba32110ebc933671ce17c0935102f6&'></img>
                                <div className='tw-space-y-3'>
                                    <div>
                                        <div className='tw-flex tw-space-x-3 tw-w-full'>
                                            <img src={icon_category} alt="icon_category" />
                                            <div className='tw-text-2xl tw-font-bold'>
                                                {selectedSubject === 'subject1' && selectedGrade === 1 && 'Toán 1: Chân trời sáng tạo'}
                                                {selectedSubject === 'subject1' && selectedGrade === 2 && 'Toán 2: Chân trời sáng tạo'}
                                                {selectedSubject !== 'subject1' && selectedGrade === 1 && 'Tiếng Việt 1 - Chân trời sáng tạo'}
                                                {selectedSubject !== 'subject1' && selectedGrade === 2 && 'Tiếng Việt 2 - Chân trời sáng tạo'}
                                            </div>
                                        </div>
                                        <div>
                                            {selectedSubject === 'subject1' && selectedGrade === 1 && 'Khóa học Toán lớp 1 Chân Trời Sáng Tạo giúp học sinh nắm vững các khái niệm toán học cơ bản như số học, phép cộng, phép trừ, và hình học đơn giản. Với phương pháp giảng dạy sáng tạo và thực tế, khóa học không chỉ phát triển tư duy logic và kỹ năng giải quyết vấn đề mà còn khơi dậy niềm yêu thích toán học, chuẩn bị vững chắc cho các bậc học tiếp theo.'}
                                            {selectedSubject === 'subject1' && selectedGrade === 2 && 'Khóa học Toán lớp 2 Chân trời sáng tạo cung cấp đầy đủ nội dung và giải bài tập SGK, giúp học sinh làm bài hiệu quả. Khóa học bao gồm các bài tập toán lớp 2 chi tiết và hướng dẫn dễ hiểu, giúp học sinh nắm vững kiến thức và giải quyết bài tập từ cả tập 1 và tập 2.'}
                                            {selectedSubject !== 'subject1' && selectedGrade === 1 && 'Khóa học Tiếng Việt lớp 1 Chân trời sáng tạo cung cấp bài giảng chi tiết, đầy đủ và bám sát chương trình SGK. Khóa học giúp học sinh nắm vững các kỹ năng cơ bản như đọc, viết, phát âm, và luyện chữ, phát triển khả năng ngôn ngữ từ sớm. Nội dung đa dạng, dễ hiểu giúp học sinh lớp 1 tiếp thu nhanh, tạo nền tảng vững chắc cho các lớp học tiếp theo và tự tin sử dụng tiếng Việt trong cuộc sống hàng ngày.'}
                                            {selectedSubject !== 'subject1' && selectedGrade === 2 && 'Khóa học tiếng Việt lớp 2 Chân Trời Sáng Tạo giúp trẻ phát triển toàn diện kỹ năng ngôn ngữ. Với chương trình học phong phú, các em sẽ nắm vững ngữ pháp, từ vựng và cải thiện kỹ năng đọc, viết. Qua các bài học tương tác, thực hành sáng tạo, trẻ em không chỉ học mà còn phát triển tư duy logic, khơi dậy đam mê học tập và chuẩn bị cho các bậc học cao hơn.'}
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
                        <div className='tw-font-bold tw-text-2xl tw-px-5'>Nội dung</div>
                        <div className='tw-flex tw-justify-between tw-px-5'>
                            <div className='tw-flex tw-items-center tw-space-x-2'>
                                <div><span className='tw-font-bold'>11</span> chương</div>
                                <div>•</div>
                                <div><span className='tw-font-bold'>138</span> bài học</div>
                                <div>•</div>
                                <div><span className='tw-font-bold'>3</span> bài kiểm tra</div>
                            </div>
                            <div
                                className='tw-font-bold tw-text-green-500 tw-cursor-pointer'
                                onClick={toggleAllChapterExpansion}
                            >
                                {allChaptersExpanded ? 'Thu gon tat ca' : 'Mo rong tat ca'}
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
                                                            <li className='tw-font-bold tw-flex tw-items-center'>
                                                                {expandedChapters.includes(chapter.id ?? '') ? (
                                                                    <RemoveIcon className='tw-mr-2 tw-text-red-500' />
                                                                ) : (
                                                                    <AddIcon className='tw-mr-2 tw-text-green-500' />
                                                                )}
                                                                {index + 1}. {chapter.name}
                                                            </li>
                                                            <div>{lessonsData.filter(lesson => lesson.chapterId === chapter.id).length} bài học</div>
                                                        </div>
                                                        {expandedChapters.includes(chapter.id ?? '') && (
                                                            <ul className='tw-ml-8 tw-space-y-1'>
                                                                {lessonsData
                                                                    .filter(lesson => lesson.chapterId === chapter.id)
                                                                    .map((lesson, idx) => (
                                                                        <li key={lesson.id} className='tw-flex tw-items-center tw-p-2 tw-border-b tw-text-gray-500'>
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
