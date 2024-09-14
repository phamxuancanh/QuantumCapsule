export function generateExamId(): string {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const examId = `${timestamp}-${randomNum}`;
    return examId;
}