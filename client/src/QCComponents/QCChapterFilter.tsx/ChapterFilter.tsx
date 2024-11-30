import { Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getListAllChapter, getListChapter } from 'api/chapter/chapter.api';
import { IChapter } from 'api/chapter/chapter.interface';
import { getListLesson, getListLessonByChapterId } from 'api/lesson/lesson.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { ISubject } from 'api/subject/subject.interface';
import { mode } from 'crypto-js';
import React, { useEffect, useState } from 'react';

export interface IChapterFilter {
    // lessonId?: string;
    chapterId?: string;
    grade?: number;
    subjectId?: string;
    lessonId?: string;
}
const defaultFilter: IChapterFilter = {
    grade: 1,
    subjectId: '',
    chapterId: '',
    lessonId: '',
}

interface IProps {
    onChange?: (filter: IChapterFilter) => void;
    mode: number; // 1: grade and subject, 2: ... + chapter, 3: ... + lesson, 4: ... + exam
}

const QCChapterFilter: React.FC<IProps> = (props) => {

    const [grades, setGrades] = useState<number[]>([1, 2, 3, 4, 5]);
    const [chapters, setChapters] = useState<IChapter[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([
        {
            id: 'subject1',
            name: 'Toán'
        },
        {
            id: 'subject2',
            name: 'Tiếng việt'
        }
    ]);

    const [selectedGrade, setSelectedGrade] = useState<number>(1);
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('subject1');
    const [selectedLessonId, setSelectedLessonId] = useState('');
    const [filteredChapter, setFilteredChapter] = useState<IChapter[]>([]);
    const [filteredLesson, setFilteredLesson] = useState<ILesson[]>([]);

    const resetFilter = () => {
        // setSelectedGrade(undefined);
        setSelectedChapterId('');
        setSelectedSubjectId('');
        setSelectedLessonId('');
        setFilteredChapter([]);
        setFilteredLesson([]);
    }

    useEffect(() => {
        (
            async () => {
                const response = await getListAllChapter();
                setChapters(response.data.data);
            }
        )()
    }, []);
    // useEffect(() => {
    //     props.onChange && props.onChange({
    //         grade: 1,
    //         subjectId: '',
    //         chapterId: '',
    //         lessonId: '',
    //     } as IChapterFilter);
    //     // setFilteredChapter([])
    //     setFilteredLesson([])
    //     setSelectedChapterId('')
    //     setSelectedLessonId('')
    // }, [props.mode]);


    const handleChange = async (event : SelectChangeEvent<any>) => {
        const { name, value } = event.target;
        if (name === 'subjectId') {
            // resetFilter();
            const filtered = chapters?.filter(item => 
                (selectedGrade && item.grade === selectedGrade) &&
                (item.subjectId === value)
            );
            setFilteredChapter(filtered);
            setSelectedSubjectId(value);
            setSelectedChapterId('');
            setSelectedLessonId('');
            props.onChange && props.onChange({
                grade: selectedGrade,
                subjectId: value,
            } as IChapterFilter);
        } 

        if (name === 'grade') {
            // resetFilter();
            setSelectedGrade(value);
            const filtered = chapters?.filter(item => 
                (item.grade === value) &&
                (selectedSubjectId && item.subjectId === selectedSubjectId)
            );
            
            setFilteredChapter(filtered);
            props.onChange && props.onChange({
                grade: value,
                subjectId: selectedSubjectId,
            } as IChapterFilter);
        }

        if (name === 'chapterId') {
            setSelectedChapterId(value);
            const listLesson = await getListLessonByChapterId(value);
            setFilteredLesson(listLesson.data.data);
            props.onChange && props.onChange({
                grade: selectedGrade,
                subjectId: selectedSubjectId,
                chapterId: value,
            } as IChapterFilter);
        }
        if (name === 'lessonId') {
            setSelectedLessonId(value);
            if (props.onChange) {
                props.onChange && props.onChange({
                    grade: selectedGrade,
                    subjectId: selectedSubjectId,
                    chapterId: selectedChapterId,
                    lessonId: value,
                } as IChapterFilter);
            }
        }
    };

    return (
        <Card sx={{p: 1}}>
            <Grid container spacing={2} p={0}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Môn</InputLabel>
                        <Select
                            name="subjectId"
                            value={selectedSubjectId}
                            label="Môn"
                            onChange={e =>handleChange(e)}
                        >
                        {subjects?.map((subject) => (
                            <MenuItem key={subject.id} value={subject.id}>
                                {subject.name}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Lớp</InputLabel>
                        <Select
                            name="grade"
                            value={selectedGrade}
                            label="Môn"
                            onChange={e =>handleChange(e)}
                        >
                        {grades?.map((grade) => (
                            <MenuItem key={grade} value={grade}>
                                {grade}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
                {props.mode >=2 &&
                    <Grid item xs={12} md={5}>
                        <FormControl fullWidth>
                            <InputLabel>Chương</InputLabel>
                            <Select
                                name="chapterId"
                                value={selectedChapterId}
                                label="Chương"
                                onChange={(e)=>handleChange(e)}
                                // disabled={selectedSubjectId === ''} // Disable nếu chưa chọn chapter
                            >
                            {filteredChapter?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>

                    </Grid>

                }
                {props.mode >=3 &&
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth >
                            <InputLabel>Bài học</InputLabel>
                            <Select
                                name="lessonId"
                                value={selectedLessonId}
                                label="Bài học"
                                onChange={(e)=>handleChange(e)}
                                // disabled={selectedChapterId === ''} // Disable nếu chưa chọn lesson
                            >
                            {filteredLesson?.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>
                }

                {/* Dropdown chọn lesson */}


            </Grid>
        </Card>
    );
};

export default QCChapterFilter;