import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { getListAllChapter, getListChapter } from 'api/chapter/chapter.api';
import { IChapter } from 'api/chapter/chapter.interface';
import { getListLesson } from 'api/lesson/lesson.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { ISubject } from 'api/subject/subject.interface';
import React, { useEffect, useState } from 'react';

export interface IChapterFilter {
    // lessonId?: string;
    chapterId?: string;
}

interface IProps {
    onChange?: (filter: IChapterFilter) => void;
}

const QCChapterFilter: React.FC<IProps> = (props) => {

    const [chapters, setChapters] = useState<IChapter[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);


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


    const handleChange = (event : SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        console.log(name, value);
        
        if (name === 'subjectId') {
            setSelectedSubjectId(value);
            const filtered = chapters?.filter(item => item.subjectId === value);
            
            setFilteredChapter(filtered);
            setSelectedChapterId('');

            // if (props.onChange) {
            //     props.onChange({
            //         chapterId: '',
            //     } as IChapterFilter);
            // }
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
            <Card>
                <CardContent>
                <FormControl fullWidth style={{ marginBottom: '1rem' }}>
                    <InputLabel>Chương</InputLabel>
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

                {/* Dropdown chọn lesson */}
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
                </CardContent>
            </Card>
        </Box>
    );
};

export default QCChapterFilter;