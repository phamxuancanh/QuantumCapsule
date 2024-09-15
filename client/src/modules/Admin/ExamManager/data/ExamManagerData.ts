import { IChapter } from "api/chapter/chapter.interface"
import { IExam } from "api/exam/exam.interface"
import { IQuestion } from "api/question/question.interfaces"

export const  initTableData: IExam[] = [
    {
        id: "ádasdas",
        name: "Exam 1",
        chapterId: "chapter001",
        lessonId: "1",
        order: 1,
        status: true
    },
    {
        id: "2",
        name: "Exam 2",
        chapterId: "chapter002",
        lessonId: "2",
        order: 2,
        status: true
    },
    {
        id: "3",
        name: "Exam 3",
        chapterId: "chapter003",
        lessonId: "3",
        order: 3,
        status: true
    },
    {
        id: "4",
        name: "Exam 4",
        chapterId: "chapter004",
        lessonId: "4",
        order: 4,
        status: true
    },
    {
        id: "5",
        name: "Exam 5",
        chapterId: "chapter005",
        lessonId: "5",
        order: 5,
        status: true
    }
]

export const listChapterParams: IChapter[] = [
    {
        id: "chapter001",
        subjectId: "subject001",
        name: "Chapter 1",
        description: "",
        grade: 1,
        order: 1,
        status: true
    },
    {
        id: "chapter002",
        subjectId: "subject001",
        name: "Chapter 2",
        description: "",
        grade: 1,
        order: 2,
        status: true
    },
    {
        id: "chapter003",
        subjectId: "subject001",
        name: "Chapter 3",
        description: "",
        grade: 1,
        order: 3,
        status: true
    },
    {
        id: "chapter004",
        subjectId: "subject001",
        name: "Chapter 4",
        description: "",
        grade: 1,
        order: 4,
        status: true
    },
    {
        id: "chapter005",
        subjectId: "subject001",
        name: "Chapter 5",
        description: "",
        grade: 1,
        order: 5,
        status: true
    }

]
