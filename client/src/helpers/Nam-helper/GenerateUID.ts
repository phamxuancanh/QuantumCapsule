export function generateExamId(): string {
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 10000);
    const ID = `exam${date.getDay}${date.getMonth}${date.getFullYear}_${randomNum}`;
    return ID;
}

export function generateQuestionUID(): string {
    // const timestamp = Date.now();
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 10000);
    const ID = `question${date.getDay}${date.getMonth}${date.getFullYear}_${randomNum}`;
    return ID;
}
export function generateTheoryUID(): string {
    // const timestamp = Date.now();
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 10000);
    const ID = `theory${date.getDay}${date.getMonth}${date.getFullYear}_${randomNum}`;
    return ID;
}