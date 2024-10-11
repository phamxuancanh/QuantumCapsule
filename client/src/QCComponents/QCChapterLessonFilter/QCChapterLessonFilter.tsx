import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getListChapter } from 'api/chapter/chapter.api';
import { IChapter } from 'api/chapter/chapter.interface';
import { getListLesson } from 'api/lesson/lesson.api';
import { ILesson } from 'api/lesson/lesson.interface';
import React, { useEffect, useState } from 'react';

interface IFilter {
    lessonId?: string;
    chapterId?: string;
}

interface IProps {
    onChange?: (filter: IFilter) => void;
}

const QCChapterLessonFilter: React.FC<IProps> = (props) => {

    const [chapters, setChapters] = useState<IChapter[]>([]);
    const [lessons, setLessons] = useState<ILesson[]>([]);


    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('');
    const [filteredLessons, setFilteredLessons] = useState<ILesson[]>([]);

    useEffect(() => {
        (
            async () => {
                const response = await getListChapter({
                    params: {
                        page: 0,
                        size: 1000
                    }
                });
                setChapters(response.data.data);
                const responseLesson = await getListLesson({
                    params: {
                        page: 0,
                        size: 1000
                    }
                });
                setLessons(responseLesson.data.data);
            }
        )()
    }, []);


    const handleChange = (event : SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (name === 'chapter') {
            setSelectedChapter(value);
            const filtered = lessons.filter(lesson => lesson.chapterId === value);
            setFilteredLessons(filtered);
            setSelectedLesson('');

            if (props.onChange) {
                props.onChange({
                    chapterId: value,
                    lessonId: ''
                } as IFilter);
            }
        } else if (name === 'lesson') {
            setSelectedLesson(value);
        
            if (props.onChange) {
                props.onChange({
                    chapterId: selectedChapter,
                    lessonId: value
                } as IFilter);
            }
        }
    };

    return (
        <Box>
            <Card>
                <CardContent>
                <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                    <InputLabel>Chương</InputLabel>
                    <Select
                        name="chapter"
                        value={selectedChapter}
                        label="Chương"
                        onChange={e =>handleChange(e)}
                    >
                    {chapters.map((chapter) => (
                        <MenuItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                {/* Dropdown chọn lesson */}
                <FormControl fullWidth>
                    <InputLabel>Bài học</InputLabel>
                    <Select
                        name="lesson"
                        value={selectedLesson}
                        label="Bài học"
                        onChange={(e)=>handleChange(e)}
                        disabled={!selectedChapter} // Disable nếu chưa chọn chapter
                    >
                    {filteredLessons.map((lesson) => (
                        <MenuItem key={lesson.id} value={lesson.id}>
                            {lesson.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </CardContent>
            </Card>
        </Box>
    );
};

export default QCChapterLessonFilter;