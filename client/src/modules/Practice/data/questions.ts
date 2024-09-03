import { IQuestion } from "api/question/question.interfaces";

export const data: IQuestion[] = [
    // //init questions
    {
        title: "Câu hỏi 1",
        content: "Có bao nhiêu quả trứng chưa nở?",
        questionType: 1,
        contentImg: "https://s3.vio.edu.vn/image_1620704319139.png",
        A: "1",
        B: "2",
        C: "3",
        D: undefined,
        E: undefined,
        correctAnswer: "2",
        explainAnswer: "Kotaiete kudasai",
        score: 10,
        theoryId: "1",
    },
    {
        content: "Câu hỏi 2",
        questionType: 1,
        contentImg: "https://s3.vio.edu.vn/image_1620704319139.png",
        A: "Đáp án 1",
        B: "Đáp án 2",
        C: "Đáp án 3",
        D: "Đáp án 4",
        E: "Đáp án 5",
        correctAnswer: "Đáp án 1",
        explainAnswer: "Giải thích câu trả lời",
        score: 10,
        theoryId: "1",
    },

]