import { IChapter } from 'api/chapter/chapter.interface';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import { ILesson } from 'api/lesson/lesson.interface';
import { IQuestion } from 'api/question/question.interfaces';
import { ITheory } from 'api/theory/theory.interface';
import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import React from 'react';
import { importChapters } from 'api/chapter/api';
import { importLessons } from 'api/lesson/api';
import { importTheories } from 'api/theory/api';
import { importExamQuestions, importExams } from 'api/exam/api';
import { importQuestions } from 'api/question/api';
import { toast } from 'react-toastify';
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
    return (
        <div>
            <div>
                <h1>chapter</h1>
                <ExcelReaderBtn sheetIndex={0} name='import chapter' onUpload={handleImportChapter} />
            </div>
            <div>
                <h1>lesson</h1>
                <ExcelReaderBtn sheetIndex={1} name='import lesson' onUpload={handleImportLesson} />
            </div>
            <div>
                <h1>exam</h1>
                <ExcelReaderBtn sheetIndex={2} name='import exam' onUpload={handleImportExam} />
            </div>
            <div>
                <h1>theory</h1>
                <ExcelReaderBtn sheetIndex={3} name='import theory' onUpload={handleImportTheory} />
            </div>
            <div>
                <h1>question</h1>
                <ExcelReaderBtn sheetIndex={6} name='import question' onUpload={handleImportQuestion} />
            </div>
            <div>
                <h1>exam - question</h1>
                <ExcelReaderBtn sheetIndex={5} name='import exam - question' onUpload={handleImportExamQuestion} />
            </div>

        </div>
    );
};

export default Admin;