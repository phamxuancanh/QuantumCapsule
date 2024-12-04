export const calculateScore = (totalScore?: number, yourScore?: number) => {
    if (!totalScore || !yourScore || totalScore <= 0) return 0; // Xử lý trường hợp không hợp lệ
  
    const rawScore = yourScore / totalScore * 10; // Tính điểm thô
    // Làm tròn lên đến 0.5 gần nhất
    const roundedScore = Math.round(rawScore * 2) / 2;
  
    return rawScore;
  };

export function calculateTimeSpent(startTime: Date, endTime: Date): string {
  if(!startTime || !endTime) return '0 phút 0 giây'; // Xử lý trường hợp không hợp lệ

  // Tính thời gian làm bài (số milliseconds giữa hai thời điểm)
  let timeSpent = endTime.getTime() - startTime.getTime();

  // Tính số phút và giây
  let minutes = Math.floor(timeSpent / 60000);  // 1 phút = 60000 milliseconds
  let seconds = Math.floor((timeSpent % 60000) / 1000); // Lấy phần dư tính giây

  // Trả về chuỗi kết quả
  return `${minutes} phút ${seconds} giây`;
} 