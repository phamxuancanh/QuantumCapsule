import { IAnswer, IQuestion } from "api/practice/question.interfaces";

export const  InitAnswerFromQuestion = (question: IQuestion, studenId?: string): IAnswer => {
    return {
        correctAnswer: question.correctAnswer,
        explainAnswer: question.explainAnswer,
        questionId: question.id,
        lessonId: question.lessonId,
        studentId: studenId,
        subjectId: question.subjectId,
        topicId: question.topicId,
        isCorrect: false,
        score: 0,
        time: 0,
        yourAnswer: ""
    }
}
export const  InitListAnswerFromListQuestion = (questions: IQuestion[], studenId?: string): IAnswer[] => {
    return questions.map((question) => InitAnswerFromQuestion(question, studenId));
}