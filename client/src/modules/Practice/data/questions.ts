import { IQuestion } from "api/question/question.interfaces";

export const data: IQuestion[] = [
    // //init questions
    {
        id: "1",
        title: "Câu 1",
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
        score: 1,
        theoryId: "1",
    },
    {
        id: "2",
        title: "Câu 2",
        content: "dap an la 'hello'",
        questionType: 2,
        contentImg: "https://s3.vio.edu.vn/image_1620704319139.png",
        correctAnswer: "hello",
        explainAnswer: "nothing to giai thich",
        score: 2,
        theoryId: "1",
    },
    {
        id: "3",
        title: "Câu 3",
        content: "dap an la 'b c d'",
        questionType: 3,
        contentImg: "https://s3.vio.edu.vn/image_1620704319139.png",
        A: "a",
        B: "b",
        C: "c",
        D: "d",
        correctAnswer: "bcd",
        explainAnswer: "nothing to giai thich",
        score: 3,
        theoryId: "1",
    },

]