
const generateRandomNumber = (): number => {
    return Math.floor(Math.random() * 10000);
}

export function generateExamId(): string {
    const date = new Date();
    const randomNum = generateRandomNumber();
    const ID = `exam${date.getDay()}${date.getMonth()+1}${date.getFullYear()}_${randomNum}`;
    return ID;
}

export function currentDateString(): string {
    const date = new Date();
    const dateString = `${date.getDate()}${date.getMonth()+1}${date.getFullYear()}`;
    return dateString;
}

export function generateQuestionUID(): string {
    const date = new Date();
    const randomNum = generateRandomNumber();
    const ID = `question${currentDateString()}_${randomNum}`;
    return ID;
}
export function generateTheoryUID(): string {
    const randomNum = generateRandomNumber();
    const ID = `theory${currentDateString()}_${randomNum}`;
    return ID;
}

export function generateAnswerUID(): string { 
    const randomNum1 = generateRandomNumber();
    const randomNum2 = generateRandomNumber();
    const ID = `answer${currentDateString()}_${randomNum1}_${randomNum2}`;
    return ID;
}

export function generateResultUID(): string {
    const randomNum1 = generateRandomNumber();
    const randomNum2 = generateRandomNumber();
    const ID = `result${currentDateString()}_${randomNum1}_${randomNum2}`;
    return ID;
}

export function generateExamQuestionUID(): string {
    const randomNum1 = generateRandomNumber();
    const randomNum2 = generateRandomNumber();
    const ID = `examquestion${currentDateString()}_${randomNum1}_${randomNum2}`;
    return ID;
}
export function generateLessonUID(): string {
    const randomNum1 = generateRandomNumber();
    const randomNum2 = generateRandomNumber();
    const ID = `lesson${currentDateString()}_${randomNum1}_${randomNum2}`;
    return ID;
}