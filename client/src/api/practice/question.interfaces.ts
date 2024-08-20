export interface IQuestion {
    id?: string
    title?: string // câu 1, câu 2, câu 3, ...
    questionType?: number
    content?: string // nội dung câu hỏi
    imgContent?: string
    answer1?: string
    answer2?: string
    answer3?: string
    answer4?: string
    answer5?: string
    correctAnswer?: string
    explainAnswer?: string
    score?: number
    grade?:  number // lớp
    subjectId?: string
    lessonId?: string
    topicId?: string
}

export interface IAnswer {
    id?: string
    yourAnswer?: string
    correctAnswer?: string
    explainAnswer?: string
    isCorrect?: boolean
    score?: number
    time?: number
    questionId?: string
    studentId?: string
    subjectId?: string
    lessonId?: string
    topicId?: string
}


