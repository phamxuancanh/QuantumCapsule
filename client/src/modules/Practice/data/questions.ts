import { IQuestion } from "api/question/question.interfaces";

export const data: IQuestion[] = [
    //init questions
    {
        title: "Câu hỏi 1",
        content: "Có bao nhiêu quả trứng chưa nở?",
        questionType: 1,
        grade: 1,
        contentImg: "https://s3.vio.edu.vn/image_1620704319139.png",
        answerA: "1",
        answerB: "2",
        answerC: "3",
        answerD: undefined,
        answerE: undefined,
        correctAnswer: "2",
        explainAnswer: "Kotaiete kudasai",
        score: 10,
        subjectId: "1",
        skillId: "1",
        topicId: "1"
    },
    {
        content: "Câu hỏi 2",
        questionType: 1,
        grade: 1,
        contentImg: "https://s3.vio.edu.vn/image_1620704319139.png",
        answerA: "Đáp án 1",
        answerB: "Đáp án 2",
        answerC: "Đáp án 3",
        answerD: "Đáp án 4",
        answerE: "Đáp án 5",
        correctAnswer: "Đáp án 1",
        explainAnswer: "Giải thích câu trả lời",
        score: 10,
        subjectId: "1",
        skillId: "1",
        topicId: "1"
    },

]