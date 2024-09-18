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
const ChapterDetail = () => {
    const [chapter, setChapter] = useState<IChapter | null>(null);
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const chapterId = queryParams.get('chapter');
        console.log(chapterId);
        const fetchChapter = async () => {
            try {
                if (chapterId) {
                    const response = await getChapterById(chapterId);
                    setChapter(response.data.chapter);
                } else {
                    console.error('ChapterId ID is undefined');
                }
            } catch (error) {
                console.error('Error fetching chapter:', error);
            }
        };

        if (!chapter) {
            fetchChapter();
        }
    }, [chapter]);
    console.log(chapter);
    return (
        <div>
            ChapterDetail
            {chapter?.name}
        </div>
    );
};

export default ChapterDetail;