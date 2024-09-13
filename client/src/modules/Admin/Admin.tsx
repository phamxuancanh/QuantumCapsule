import { IChapter } from 'api/chapter/chapter.interface';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import { ILesson } from 'api/lesson/lesson.interface';
import { IQuestion } from 'api/question/question.interfaces';
import { ITheory } from 'api/theory/theory.interface';
import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import React from 'react';
import { importChapters} from 'api/chapter/api';
import { importLessons } from 'api/lesson/api';
import { importTheories } from 'api/theory/api';
const Admin: React.FC = () => {
    const handleImportChapter = async (listData: IChapter[]) => {
        try {
          console.log(listData);
          const response = await importChapters(listData);
          console.log('Chapters imported successfully:', response.data);
        } catch (error) {
            console.error('Error importing chapters:', error);
        }
    };
    const handleImportLesson = async (listData: ILesson[]) => {
        try {
          console.log(listData);
          const response = await importLessons(listData);
          console.log('Lessons imported successfully:', response.data);
        } catch (error) {
            console.error('Error importing lessons:', error);
        }
    }
    const handleImportTheory = async (listData: ITheory[]) => { 
        try {
          console.log(listData);
          const response = await importTheories(listData);
          console.log('Theories imported successfully:', response.data);
        } catch (error) {
            console.error('Error importing lessons:', error);
        }
    }
    return (
        <div>
            <div>
                <h1>chapter</h1>
                <ExcelReaderBtn sheetIndex={0} name='import chapter' onUpload={handleImportChapter} />
            </div>
            <div>
                <h1>lesson</h1>
                <ExcelReaderBtn sheetIndex={1} name='import lesson' onUpload={handleImportLesson}/>
            </div>
            <div>
                <h1>exam</h1>
                <ExcelReaderBtn sheetIndex={2} name='import exam' onUpload={(listData : IExam[])=>{
                    
                }}/>
            </div>
            <div>
                <h1>theory</h1>
                <ExcelReaderBtn sheetIndex={3} name='import theory' onUpload={handleImportTheory}/>
            </div>
            <div>
                <h1>exam - question</h1>
                <ExcelReaderBtn sheetIndex={4} name='import exam - question' onUpload={(listData : IExamQuestion[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
            <div>
                <h1>question</h1>
                <ExcelReaderBtn sheetIndex={5} name='import question' onUpload={(listData : IQuestion[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
           
        </div>
    );
};

export default Admin;