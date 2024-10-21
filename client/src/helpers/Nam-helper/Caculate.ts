export const calculateScore = (totalScore?: number, yourScore?: number) => {
    if (!totalScore || !yourScore) return 0;
    const rawScore = (yourScore / totalScore) * 10;
    return Math.round(rawScore * 2) / 2;
}