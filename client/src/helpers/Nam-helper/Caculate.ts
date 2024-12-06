export const calculateScore = (totalScore?: number, yourScore?: number) => {
    if (!totalScore || !yourScore || totalScore <= 0) return 0; // Xử lý trường hợp không hợp lệ
  
    const rawScore = yourScore / totalScore * 10; // Tính điểm thô
    // Làm tròn lên đến 0.5 gần nhất
    const roundedScore = parseFloat(rawScore.toFixed(2));
  
    return roundedScore;
  };


  export function calculateTimeSpent(startTime?: Date | string, endTime?: Date | string): string {
    // Xử lý trường hợp không hợp lệ
    if (!startTime || !endTime) return '0 phút 0 giây';
  
    try {
      // Chuyển đổi startTime và endTime thành đối tượng Date nếu cần
      const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
      const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  
      // Kiểm tra tính hợp lệ của start và end
      if (!(start instanceof Date) || isNaN(start.getTime()) || !(end instanceof Date) || isNaN(end.getTime())) {
        return '0 phút 0 giây';
      }
  
      // Tính thời gian đã sử dụng
      const timeSpent = end.getTime() - start.getTime();
      if (timeSpent < 0) return '0 phút 0 giây'; // Nếu endTime nhỏ hơn startTime, trả về giá trị mặc định
  
      const minutes = Math.floor(timeSpent / 60000); // 1 phút = 60000 milliseconds
      const seconds = Math.floor((timeSpent % 60000) / 1000); // Lấy phần dư tính giây
  
      return `${minutes} phút ${seconds} giây`;
    } catch {
      // Xử lý bất kỳ lỗi nào khác
      return '0 phút 0 giây';
    }
  }
  