import { Button } from '@mui/material';
import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
interface ExcelExportBtnProps {
    variant: 'text' | 'outlined' | 'contained';
    sx?: any;
    headers: string[];
    data: any[]
    fileName?: string;
}
const ExcelExportBtn: React.FC<ExcelExportBtnProps> = (props) => {
    const handleDowload = async() => {
        const worksheetData = [props.headers, ...props.data.map(item => 
            props.headers.map(header => item[header])
        )];
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${props.fileName}.xlsx`);
    }
    return (
        <Button 
            variant={props.variant} 
            sx={{
                ...props.sx,
            }} 
            startIcon={<DownloadIcon />} 
            onClick={handleDowload}
        >
            Tải xuống Excel
        </Button>
    );
};
export default ExcelExportBtn;