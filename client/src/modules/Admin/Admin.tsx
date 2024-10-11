import { IChapter } from 'api/chapter/chapter.interface';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import { ILesson } from 'api/lesson/lesson.interface';
import { IQuestion } from 'api/question/question.interfaces';
import { ITheory } from 'api/theory/theory.interface';
import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import React from 'react';
import { importChapters } from 'api/chapter/chapter.api';
import { importLessons } from 'api/lesson/lesson.api';
import { importTheories } from 'api/theory/theory.api';
import { importExamQuestions, importExams } from 'api/exam/exam.api';
import { importQuestions } from 'api/question/question.api';
import { toast } from 'react-toastify';
import ExamManager from './ExamManager/ExamManagerProvider';
import ComentManager from './ComentManager/CommentManagerProvider';
import QuestionManager from './QuestionManager/QuestionManagerProvider';
import TheoryManager from './TheoryManager/TheoryManagerProvider';
import TabMenu from 'components/menus/tabMenu/TabMenu';
import { Box, IconButton, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExamQuestionManager from './ExamQuestionManager/ExamQuestionManagerProvider';
const Admin: React.FC = () => {
    const handleImportChapter = async (listData: IChapter[]) => {
        try {
            console.log(listData);
            const response = await importChapters(listData);
            toast.success('Chapters imported successfully');
        } catch (error) {
            toast.error(`Error importing chapters: ${(error as Error).message || error}`);
        }
    };

    const handleImportLesson = async (listData: ILesson[]) => {
        try {
            console.log(listData);
            const response = await importLessons(listData);
            toast.success('Lessons imported successfully');
        } catch (error) {
            toast.error(`Error importing lessons: ${(error as Error).message || error}`);
        }
    };

    const handleImportTheory = async (listData: ITheory[]) => {
        try {
            console.log(listData);
            const response = await importTheories(listData);
            toast.success('Theories imported successfully');
        } catch (error) {
            toast.error(`Error importing theories: ${(error as Error).message || error}`);
        }
    };

    const handleImportExam = async (listData: IExam[]) => {
        try {
            console.log(listData);
            const response = await importExams(listData);
            toast.success('Exams imported successfully');
        } catch (error) {
            toast.error(`Error importing exams: ${(error as Error).message || error}`);
        }
    };

    const handleImportQuestion = async (listData: IQuestion[]) => {
        try {
            console.log(listData);
            const response = await importQuestions(listData);
            toast.success('Questions imported successfully');
        } catch (error) {
            toast.error(`Error importing questions: ${(error as Error).message || error}`);
        }
    };

    const handleImportExamQuestion = async (listData: IExamQuestion[]) => {
        try {
            console.log(listData);
            const response = await importExamQuestions(listData);
            toast.success('Exam - Question imported successfully');
        } catch (error) {
            toast.error(`Error importing exam questions: ${(error as Error).message || error}`);
        }
    };
    const handleDownloadTemplate = () => {
        const url = 'https://canhbk29.s3.ap-southeast-2.amazonaws.com/excel_mau.xlsx'; 
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template.xlsx'); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    return (
        <div>
            <Box p={2}>
                <TabMenu
                    listItems={[
                        { index: 0, label: 'Quản lý bài bài tập', item: <ExamManager /> },
                        { index: 1, label: 'Quản lý câu hỏi', item: <QuestionManager /> },
                        { index: 2, label: 'Quản lý bài học', item: <ComentManager /> },
                        { index: 3, label: 'Quản lý bài giảng (lý thuyết)', item: <TheoryManager /> },
                        { index: 4, label: 'Quản lý bài kiểm tra và câu hỏi', item: <ExamQuestionManager /> }
                    ]}
                    defaultIndex={0}
                />
            </Box>
            <div className='tw-flex tw-justify-center'>
                <div className='tw-w-11/12'>
                    <div className='tw-border tw-border-gray-300 tw-mb-4 tw-p-4'>
                        <h1 className='tw-font-bold'>Tải về file mẫu</h1>
                        <IconButton onClick={handleDownloadTemplate}>
                            <FileDownloadIcon />
                            <Typography>File excel mẫu</Typography>
                        </IconButton>
                    </div>
                    <div className='tw-border tw-border-gray-300 tw-mb-4 tw-p-4'>
                        <h1 className='tw-font-bold'>Chương</h1>
                        <ExcelReaderBtn sheetIndex={0} name='Nhập dữ liệu chương' onUpload={handleImportChapter} />
                    </div>
                    <div className='tw-border tw-border-gray-300 tw-mb-4 tw-p-4'>
                        <h1 className='tw-font-bold'>Bài học</h1>
                        <ExcelReaderBtn sheetIndex={1} name='Nhập dữ liệu bài học' onUpload={handleImportLesson} />
                    </div>
                    <div className='tw-border tw-border-gray-300 tw-mb-4 tw-p-4'>
                        <h1 className='tw-font-bold'>Bài tập</h1>
                        <ExcelReaderBtn sheetIndex={2} name='Nhập dữ liệu bài tập' onUpload={handleImportExam} />
                    </div>
                    <div className='tw-border tw-border-gray-300 tw-mb-4 tw-p-4'>
                        <h1 className='tw-font-bold'>Lý thuyết</h1>
                        <ExcelReaderBtn sheetIndex={3} name='Nhập dữ liệu lý thuyết' onUpload={handleImportTheory} />
                    </div>
                    <div className='tw-border tw-border-gray-300 tw-mb-4 tw-p-4'>
                        <h1 className='tw-font-bold'>Câu hỏi</h1>
                        <ExcelReaderBtn sheetIndex={6} name='Nhập dữ liệu Câu hỏi' onUpload={handleImportQuestion} />
                    </div>
                    <div className='tw-border tw-border-gray-300 tw-mb-4 tw-p-4'>
                        <h1 className='tw-font-bold'>Bài tập - Câu hỏi</h1>
                        <ExcelReaderBtn sheetIndex={4} name='Nhập dữ liệu bài tập - câu hỏi' onUpload={handleImportExamQuestion} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Admin;