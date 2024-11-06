import { DATA_TYPE } from "utils/enums";


export const formatDisplayData = (data: any, dataType: DATA_TYPE): string => {
    switch (dataType) {
        case DATA_TYPE.NUMBER:
            return data;
        case DATA_TYPE.DATE:
            return new Date(data).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
        case DATA_TYPE.DATETIME:
            return new Date(data).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,  // Nếu bạn không muốn sử dụng định dạng 12 giờ (AM/PM)
              });
        default:
            return data;
    }
}