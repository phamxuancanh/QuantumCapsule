import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLessonById } from 'api/lesson/lesson.api';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ITheory } from 'api/theory/theory.interface';
import { IExam } from 'api/exam/exam.interface';
import { getTheoriesByLessonId } from 'api/theory/theory.api';
import { getExamsByLessonId } from 'api/exam/exam.api';
import { IChapter } from 'api/chapter/chapter.interface';
import { getChapterById } from 'api/chapter/chapter.api';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'routes/constant';
import { useTranslation } from 'react-i18next'

const LessonDetail = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(location.state?.lesson || null);
    const [theories, setTheories] = useState<ITheory[]>([]);
    const [exams, setExams] = useState<IExam[]>([]);
    const [chapter, setChapter] = useState<IChapter | null>(null);
    const subjects = [
        { id: 'subject1', name: 'Toán' },
        { id: 'subject2', name: 'Tiếng Việt' }
    ];
    const getSubjectName = (subjectId: string) => {
        const subject = subjects.find(subject => subject.id === subjectId);
        return subject ? subject.name : 'Unknown Subject';
    };
    const fetchTheories = async () => {
        try {
            const response = await getTheoriesByLessonId(lesson.id);
            console.log(response.data);
            setTheories(response.data.theories);
        } catch (error) {
            console.error('Error fetching theories:', error);
        }
    }
    const fetchExams = async () => {
        try {
            const response = await getExamsByLessonId(lesson.id);
            console.log(response.data);
            setExams(response.data.exams);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    }
    const fetchChapter = async () => {
        try {
            const response = await getChapterById(lesson.chapterId);
            setChapter(response.data.chapter);
        } catch (error) {
            console.error('Error fetching chapter:', error);
        }
    }
    useEffect(() => {
        if (lesson && lesson.id) {
            fetchTheories();
            fetchExams();
            fetchChapter();
        }
    }, [lesson?.id]);
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const lessonId = queryParams.get('lessonId');
        const fetchLesson = async () => {
            try {
                if (lessonId) {
                    const response = await getLessonById(lessonId);
                    setLesson(response.data);
                } else {
                    console.error('Lesson ID is undefined');
                }
            } catch (error) {
                console.error('Error fetching lesson:', error);
            }
        };

        if (!lesson) {
            fetchLesson();
        }
    }, [lesson]);
    const handleTitleClick = () => {
        if (chapter) {
            const params = new URLSearchParams({
                subject: chapter.subjectId || '',
                grade: chapter.grade?.toString() || ''
            });
            navigate(`${ROUTES.home}?${params.toString()}`);
        }
    };

    const handleTopicClick = () => {
        if (lesson) {
            const params = new URLSearchParams({
                chapter: lesson.chapterId || '',
            });
            navigate(`${ROUTES.chapterDetail}?${params.toString()}`);
        }
    };

    const handleTheoryExamClick = (type: 'theory' | 'exam', id: string) => {
        if (type === 'theory') {
            navigate(`${ROUTES.learning}?theoryId=${id}`);
        } else if (type === 'exam') {
            navigate(`${ROUTES.skill_practice}?examId=${id}`);
        }
    };
    return (
        <div className='tw-flex tw-justify-center tw-min-h-screen'>
            {lesson ? (
                <div className='tw-mt-32 tw-w-4/5 tw-space-y-2'>
                    <div className='tw-flex tw-items-center'>
                        <div onClick={handleTitleClick} className='tw-font-bold tw-text-xl tw-inline-flex tw-items-center tw-cursor-pointer tw-text-gray-500 hover:tw-text-green-500'>
                            {getSubjectName(chapter?.subjectId || '')} {chapter?.grade} - Chân trời sáng tạo
                        </div>
                        <NavigateNextIcon className='tw-ml-2' />
                        <div onClick={handleTopicClick} className='tw-font-bold tw-text-xl tw-inline-flex tw-items-center tw-cursor-pointer tw-text-gray-500 hover:tw-text-green-500'>
                            {chapter?.name}
                        </div>
                    </div>
                    <div className='tw-font-bold tw-text-3xl'>{lesson.name}</div>
                    <div className='tw-flex tw-shadow-2xl tw-border tw-rounded-lg'>
                        <div className='tw-w-1/2 tw-p-4 tw-space-y-3'>
                            <h1 className='tw-text-xl tw-font-bold'>{t('lessonDetail.theory')}</h1>
                            <ul className='tw-space-y-1'>
                                {theories && theories.length > 0 ? (
                                    theories.map((theory, index) => (
                                        <li
                                            key={index}
                                            className='tw-flex tw-items-center tw-text-blue-500 tw-cursor-pointer hover:tw-underline'
                                            onClick={() => theory.id && handleTheoryExamClick('theory', theory.id)}
                                        >
                                            <PlayCircleOutlineIcon className='tw-mr-2' />
                                            {theory.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className='tw-text-gray-500'>{t('lessonDetail.not_have_theory')}</li>
                                )}
                            </ul>
                        </div>
                        <div className='tw-w-1/2 tw-p-4 tw-space-y-3'>
                            <h1 className='tw-text-xl tw-font-bold'>{t('lessonDetail.practice')}</h1>
                            <ul className='tw-space-y-1'>
                                {exams && exams.length > 0 ? (
                                    exams.map((exam, index) => (
                                        <li
                                            key={index}
                                            className='tw-flex tw-items-center tw-text-blue-500 tw-cursor-pointer hover:tw-underline'
                                            onClick={() => exam.id && handleTheoryExamClick('exam', exam.id)}
                                        >
                                            <CheckCircleOutlineIcon className='tw-mr-2' />
                                            {exam.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className='tw-text-gray-500'>{t('lessonDetail.not_have_practice')}</li>
                                )}
                            </ul>
                        </div>

                    </div>
                </div>
            ) : (
                <p>No lesson data available.</p>
            )}
        </div>
    );
};

export default LessonDetail;