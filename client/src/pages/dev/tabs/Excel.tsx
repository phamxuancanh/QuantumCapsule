import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import React from 'react';

const Excel: React.FC = () => {
    const [data, setData] = React.useState<any[]>([]);
    const onUpload = (data: any[]) => {
        console.log(data);
        
        setData(data);
    
    }

    return (
        <div>
            <ExcelReaderBtn 
                onUpload={onUpload}
                name='Upload Excel File'
                
            />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Excel;