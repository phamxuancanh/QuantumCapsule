import React from 'react';
import * as XLSX from 'xlsx';
import { makeStyles } from '@mui/styles';
import { Button, SxProps } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const useStyles = makeStyles((_: any) => ({
    input: {
        display: 'none !important',
    },
}));


export interface IExcelReaderBtnProps {
    onUpload?: (data: any[]) => void;
    sheetIndex?: number;
    sx?: SxProps;
    name: string;
    variant?: 'text' | 'outlined' | 'contained';
    listSheetIndex?: number[];
    onUploadMulti?: (data: {index: number, data: any[]}[]) => void;
}

const ExcelReaderBtn: React.FC<IExcelReaderBtnProps> = (props: IExcelReaderBtnProps) => {
    const classes = useStyles();
    const [listData, setListData] = React.useState<{index: number, data: any[]}[]>([]);

    const handleExcelFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const fileExtension = file?.name?.split('.').pop()?.toLowerCase();
        
        if(!file) {
            alert('No file selected');
            return
        };
        if (fileExtension !== 'xlsx' && fileExtension !== 'xls' && fileExtension !== 'xlsm') {
            alert('Unsupported file type. Please upload an Excel file.');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[props.sheetIndex? props.sheetIndex : 0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const keys = jsonData[0] as string[];

            const rows = jsonData.slice(1).map((row: any) => {
                if(row.length === 0)
                    return null;
                const hasDataInKeys = keys.some((key, index) => row[index] !== undefined && row[index] !== '');
                if (!hasDataInKeys) {
                    return null; // Bỏ qua dòng này
                }
                const obj: { [key: string]: any } = {};
                keys?.forEach((key, index) => {
                    if(key || key !== '') {
                        obj[key] = row[index];
                    }
                });
                return obj;
            })
            .filter((row: any) => row !== null);
            props.onUpload && props.onUpload(rows);
        };
        reader.onerror = () => {
            alert('File could not be read');
            return
        };
        
        reader.readAsArrayBuffer(file as Blob);

        event.target.value = '';
    };

    
    const handleExcelFileByIndex = (file: File, excelIndex: number): Promise<{ index: number, data: any[] }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const arrayBuffer = e.target?.result;
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[excelIndex];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
                const keys = jsonData[0] as string[];
    
                const rows = jsonData.slice(1).map((row: any) => {
                    if (row.length === 0) return null;
                    const hasDataInKeys = keys.some((key, index) => row[index] !== undefined && row[index] !== '');
                    if (!hasDataInKeys) return null;
    
                    const obj: { [key: string]: any } = {};
                    keys?.forEach((key, index) => {
                        if (key || key !== '') {
                            obj[key] = row[index];
                        }
                    });
                    return obj;
                }).filter((row: any) => row !== null);
    
                resolve({ index: excelIndex, data: rows });
            };
    
            reader.onerror = () => {
                reject('File could not be read');
            };
            
            reader.readAsArrayBuffer(file);
        });
    };
    
    const handleExcelFileMulti = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const fileExtension = file?.name?.split('.').pop()?.toLowerCase();
        console.log("importing multi sheet1");
    
        if (!file) {
            alert('No file selected');
            return;
        }
        if (fileExtension !== 'xlsx' && fileExtension !== 'xls' && fileExtension !== 'xlsm') {
            alert('Unsupported file type. Please upload an Excel file.');
            return;
        }
        console.log("importing multi sheet");
        
        try {
            const listData = await Promise.all(
                props.listSheetIndex?.map((index) => handleExcelFileByIndex(file, index)) || []
            );
    
            props.onUploadMulti && props.onUploadMulti(listData);
        } catch (error) {
            alert(error);
        } finally {
            event.target.value = '';
        }
    };


    const handleClick = () => {
        document.getElementById(`contained-button-file-${props.name}-${props.sheetIndex}`)?.click();
    };
    return (
        <div>
            <input
                type="file"
                accept=".xlsx, .xls, .xlsm"
                onChange={(e) => {
                    if(props.listSheetIndex && props.onUploadMulti) {
                        handleExcelFileMulti(e);
                    }else if(props.sheetIndex && props.onUpload) {
                        handleExcelFile(e) 
                    }
                }}
                id={`contained-button-file-${props.name}-${props.sheetIndex}`}
                // multiple
                className={classes.input}
            />
            <Button onClick={handleClick} variant={props.variant} sx={props.sx} startIcon={<UploadFileIcon />}>
                {props.name}
            </Button>
        </div>
    );
};

export default ExcelReaderBtn;