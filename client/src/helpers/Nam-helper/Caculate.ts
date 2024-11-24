export const calculateScore = (totalScore?: number, yourScore?: number) => {
    if (!totalScore || !yourScore || totalScore <= 0) return 0; // Xử lý trường hợp không hợp lệ
  
    const rawScore = yourScore / totalScore * 10; // Tính điểm thô
    // Làm tròn lên đến 0.5 gần nhất
    const roundedScore = Math.round(rawScore * 2) / 2;
  
    return rawScore;
  };