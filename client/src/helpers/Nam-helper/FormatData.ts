import { DATA_TYPE } from "utils/enums";


export const formatDisplayData = (data: any, dataType: DATA_TYPE): string => {
    switch (dataType) {
        case DATA_TYPE.NUMBER:
            return data;
        case DATA_TYPE.DATE:
            return new Date(data).toLocaleDateString();
        case DATA_TYPE.DATETIME:
            return new Date(data).toLocaleString();
        default:
            return data;
    }
}