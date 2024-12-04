export function shuffleArray(array: any[]): any[] {
  let shuffledArray = [...array];  // Tạo bản sao mảng
  console.log('Trước khi xáo trộn:', shuffledArray);

  // Thuật toán Fisher-Yates Shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));  // Chọn chỉ số ngẫu nhiên
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];  // Hoán đổi
    console.log(`Hoán đổi chỉ số ${i} và ${j}:`, shuffledArray);  // In quá trình hoán đổi
  }

  console.log('Sau khi xáo trộn:', shuffledArray);
  return shuffledArray;
}