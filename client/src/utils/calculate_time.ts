export const calculateTime = (inputDateStr: string, translations: Record<string, string>): string => {
    const inputDate = new Date(inputDateStr)
    const currentDate = new Date()
    const diffInMs = Math.abs(currentDate.getTime() - inputDate.getTime())
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInMonths = currentDate.getMonth() - inputDate.getMonth() +
      (12 * (currentDate.getFullYear() - inputDate.getFullYear()))
    const diffInYears = currentDate.getFullYear() - inputDate.getFullYear()
  
    if (diffInDays === 0) {
      return translations['hôm nay']
    } else if (diffInDays === 1) {
      return translations['1 ngày trước']
    } else if (diffInDays < 30) {
      return `${diffInDays} ${translations['ngày trước']}`
    } else if (diffInDays === 30 || diffInMonths === 1) {
      return translations['1 tháng trước']
    } else if (diffInDays < 365) {
      if (diffInDays === 15) {
        return translations['nửa tháng trước']
      } else {
        return `${diffInMonths} ${translations['ngày trước']}`
      }
    } else if (diffInDays === 365 || diffInYears === 1) {
      return translations['1 năm trước']
    } else {
      return `${diffInYears} ${translations['năm trước']}`
    }
  }
  