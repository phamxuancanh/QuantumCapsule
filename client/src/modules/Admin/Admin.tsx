import { IChapter } from 'api/chapter/chapter.interface';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import { ILesson } from 'api/lesson/lesson.interface';
import { IQuestion } from 'api/question/question.interfaces';
import { ITheory } from 'api/theory/theory.interface';
import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import React from 'react';

const Admin: React.FC = () => {
    return (
        <div>
            <div>
                <h1>chapter</h1>
                <ExcelReaderBtn sheetIndex={0} name='import chapter' onUpload={(listData : IChapter[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
            <div>
                <h1>lesson</h1>
                <ExcelReaderBtn sheetIndex={1} name='import chapter' onUpload={(listData : ILesson[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
            <div>
                <h1>exam</h1>
                <ExcelReaderBtn sheetIndex={1} name='import chapter' onUpload={(listData : IExam[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
            <div>
                <h1>theory</h1>
                <ExcelReaderBtn sheetIndex={1} name='import chapter' onUpload={(listData : ITheory[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
            <div>
                <h1>exam - question</h1>
                <ExcelReaderBtn sheetIndex={1} name='import chapter' onUpload={(listData : IExamQuestion[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
            <div>
                <h1>question</h1>
                <ExcelReaderBtn sheetIndex={1} name='import chapter' onUpload={(listData : IQuestion[])=>{
                    console.log(listData);
                    
                }}/>
            </div>
           
        </div>
    );
};

export default Admin;