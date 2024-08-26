import { IAnswer } from "api/answer/answer.interfaces";
import { IQuestion } from "api/question/question.interfaces";

export const  InitAnswerFromQuestion = (question: IQuestion, studenId?: string, resultId?: string): IAnswer => {
    return {
        questionType: question.questionType,
        title: question.title,
        content: question.content,
        contentImg: question.contentImg,
        answerA: question.answerA,
        answerB: question.answerB,
        answerC: question.answerC,
        answerD: question.answerD,
        answerE: question.answerE,
        correctAnswer: question.correctAnswer,
        explainAnswer: question.explainAnswer,
        score: question.score,
        yourAnswer: "",
        isCorrect: false,
        studentId: studenId, //
        resultId: resultId, //
        subjectId: question.subjectId,
        grade: question.grade,
        skillId: question.skillId,
        topicId: question.topicId,
        practiceId: question.practiceId,
        examId: question.examId,
        questionId: question.id,
    }
}
export const  InitListAnswerFromListQuestion = (questions: IQuestion[], studenId?: string, resultId?: string): IAnswer[] => {
    return questions.map((question) => InitAnswerFromQuestion(question, studenId, resultId));
}