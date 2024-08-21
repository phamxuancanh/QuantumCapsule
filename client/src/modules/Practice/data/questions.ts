import { IQuestion } from "api/practice/question.interfaces";

export const data: IQuestion[] = [
    //init questions
    {
        title: "Câu hỏi 1",
        content: "Có bao nhiêu quả trứng chưa nở?",
        questionType: 1,
        grade: 1,
        imgContent: "https://s3.vio.edu.vn/image_1620704319139.png",
        answer1: "1",
        answer2: "2",
        answer3: "3",
        answer4: undefined,
        answer5: undefined,
        correctAnswer: "2",
        explainAnswer: "Kotaiete kudasai",
        score: 10,
        subjectId: "1",
        lessonId: "1",
        topicId: "1"
    },
    {
        content: "Câu hỏi 2",
        questionType: 1,
        grade: 1,
        imgContent: "https://s3.vio.edu.vn/image_1620704319139.png",
        answer1: "Đáp án 1",
        answer2: "Đáp án 2",
        answer3: "Đáp án 3",
        answer4: "Đáp án 4",
        answer5: "Đáp án 5",
        correctAnswer: "Đáp án 1",
        explainAnswer: "Giải thích câu trả lời",
        score: 10,
        subjectId: "1",
        lessonId: "1",
        topicId: "1"
    },

]