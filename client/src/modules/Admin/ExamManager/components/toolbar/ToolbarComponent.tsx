import { Button } from '@mui/material';
import React from 'react';
import { useDataSelected, useOpenForm } from '../../context/context';
import { toast } from 'react-toastify';

interface IProps {
    // Define the props for the component here
}

const ToolbarComponent: React.FC<IProps> = () => {
    const {dataSelected} = useDataSelected();
    const {setOpenForm} = useOpenForm();
    const handleClick = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(!dataSelected){
            toast.warn("Please select an exam to add questions");
        }
        else{
            setOpenForm(true);
        }
    }
    return (
        <Button onClick={e => handleClick(e)}>
            Thêm câu hỏi vào bài tập
        </Button>
    );
};

export default ToolbarComponent;