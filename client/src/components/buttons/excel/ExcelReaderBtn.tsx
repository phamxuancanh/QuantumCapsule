import React from 'react';
import * as XLSX from 'xlsx';
import IconBtn from '../iconBtn/Iconbtn';
import { ACTIONS, IconName } from 'utils/enums';
import { makeStyles } from '@mui/styles';
import { SxProps } from '@mui/material';

const useStyles = makeStyles((_: any) => ({
    input: {
        display: 'none',
    },
}));


export interface IExcelReaderBtnProps {
    onUpload: (data: any[]) => void;
    sx?: SxProps;
    name: string;
    variant?: 'text' | 'outlined' | 'contained';
}

const ExcelReaderBtn: React.FC<IExcelReaderBtnProps> = (props: IExcelReaderBtnProps) => {
    const classes = useStyles();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const fileExtension = file?.name?.split('.').pop()?.toLowerCase();

        if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            handleExcelFile(file);
        } else if (fileExtension === 'txt') {
            handleTextFile(file);
        } else {
            alert('Unsupported file type. Please upload an Excel or text file.');
        }
    };

    const handleExcelFile = (file: File | undefined) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target?.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const keys = jsonData[0] as string[];

            const rows = jsonData.slice(1).map((row: any) => {
                if (row.length > 0) {
                    const obj: { [key: string]: any } = {};
                    keys?.forEach((key, index) => {
                        obj[key] = row[index];
                    });
                    return obj;
                }
                else return;
            }).filter(row=>row !== undefined);
            

            props.onUpload && props.onUpload(rows);
        };

        reader.readAsArrayBuffer(file as Blob);
    };

    const handleTextFile = (file: File | undefined) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const text = e.target?.result as string;
            const lines = text?.split('\n');
            const keys: string[] = lines?.[0].split('\t'); // Assuming tab-separated values
            const rows = lines?.slice(1).map(line => {
                const values = line.split('\t');
                const obj: { [key: string]: any } = {};
                keys.forEach((key, index) => {
                    let cleanKey = key.replace(/\r/g, '');
                    let cleanValue = values[index].replace(/\r/g, '');
                    obj[cleanKey] = cleanValue;
                });
                return obj;
            });

            props.onUpload && props.onUpload(rows);
        };

        reader.readAsText(file as Blob);
        return
    };
    const handleClick = () => {
        document.getElementById('contained-button-file')?.click();
    };
    return (
        <div>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => { handleFileUpload(e) }}
                id="contained-button-file"
                // multiple
                className={classes.input}
            />
            <IconBtn
                iconName={IconName.upload_file}
                name={props.name}
                onClick={handleClick}
                action={ACTIONS.VIEW}
                variant={props.variant}
                sx={props.sx}
            />

        </div>
    );
};

export default ExcelReaderBtn;