import { Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getListAllChapter, getListChapter } from 'api/chapter/chapter.api';
import { IChapter } from 'api/chapter/chapter.interface';
import { getListLesson } from 'api/lesson/lesson.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { ISubject } from 'api/subject/subject.interface';
import { mode } from 'crypto-js';
import React, { useEffect, useState } from 'react';

export interface IChapterFilter {
    // lessonId?: string;
    chapterId?: string;
    grade?: number;
    subjectId?: string;
}

interface IProps {
    onChange?: (filter: IChapterFilter) => void;
    mode?: number; // 1: grade and subject, default is 1 + chapter
}

const QCChapterFilter: React.FC<IProps> = (props) => {

    const [grades, setGrades] = useState<number[]>([1, 2, 3, 4, 5]);
    const [chapters, setChapters] = useState<IChapter[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);

    const [selectedGrade, setSelectedGrade] = useState<number>(1);
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [filteredChapter, setFilteredChapter] = useState<IChapter[]>([]);

    useEffect(() => {
        (
            async () => {
                const response = await getListAllChapter();
                setChapters(response.data.data);

                setSubjects([
                    {
                        id: 'subject1',
                        name: 'Toán'
                    },
                    {
                        id: 'subject2',
                        name: 'Tiếng việt'
                    }
                ]);
            }
        )()
    }, []);


    const handleChange = (event : SelectChangeEvent<any>) => {
        const { name, value } = event.target;
        console.log(name, value);
        // if(!selectedGrade || !selectedSubjectId) return;

        if (name === 'grade') {
            setSelectedGrade(value);
        }
        if (name === 'subjectId') {
            setSelectedSubjectId(value);
        }

        if (name === 'grade' || name === 'subjectId') {
            const grade = name === 'grade' ? value : selectedGrade;
            const subjectId = name === 'subjectId' ? value : selectedSubjectId;
            const filtered = chapters?.filter(item => 
                (!grade || item.grade === grade) &&
                (!subjectId || item.subjectId === subjectId)
            );
            // console.log(filtered);
            
            setFilteredChapter(filtered);
            setSelectedChapterId('');
            if(props.mode === 1) {
                if (props.onChange) {
                    props.onChange({
                        grade: grade,
                        subjectId: subjectId,
                    } as IChapterFilter);
                }
                return
            }

        } else if (name === 'chapterId') {
            setSelectedChapterId(value);
        
            if (props.onChange) {
                props.onChange({
                    chapterId: value,
                } as IChapterFilter);
            }
        }
    };

    return (
        <Box>
            <Card sx={{
                p: "1rem",
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth style={{ marginBottom: '1rem' }}>
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
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth style={{ marginBottom: '1rem' }}>
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
                    {props.mode !== 1 &&
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

                    {/* Dropdown chọn lesson */}


                </Grid>
            </Card>
        </Box>
    );
};

export default QCChapterFilter;