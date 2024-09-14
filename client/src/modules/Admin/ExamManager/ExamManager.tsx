import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React from 'react';
import { initTableData, listChapterParams } from './data/ExamManagerData';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateExamId } from 'helpers/Nam-helper/GenerateUID';
import { Box } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import ToolbarComponent from './components/toolbar/ToolbarComponent';
import { useDataSelected, useOpenForm } from './context/context';
import AddQuestionBox from './components/add-questions/AddQuestionBox';

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();


    const handleUpdateRow = (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            
        }
    }
    return (
        <Box>
            <Box p={5}>
                <SimpleTable 
                    initData={initTableData}
                    initNewRow={{
                        id: generateExamId(),
                        name: "",
                        chapterId: "",
                        lessonId: "",
                        order: 0,
                        status: true
                    }}
                    toolbarComponent={<ToolbarComponent />}
                    columns={[
                        // { field: 'id', headerName: 'ID', width: 70 },
                        { field: 'name', headerName: 'Name', width: 130},
                        { field: 'chapterId', headerName: 'Chapter ID', width: 130, 
                            valueOptions: listChapterParams.map((chapter) => {
                                return {
                                    value: chapter.id,
                                    label: chapter.name
                                }
                            }),
                            editable: true,
                            type: 'singleSelect',
                        },
                        { field: 'lessonId', headerName: 'Lesson ID', width: 130, 
          
                        },
                        { field: 'order', headerName: 'Order', width: 130 },
                        { field: 'status', headerName: 'Status', width: 130 }
                    ] as GridColDef[]}
                    onRowClick={(row) => {
                        setDataSelected(row.row)
                        // setOpenForm(true);
                    }}
                    onUpdateRow={(data, action) => handleUpdateRow(data, action)}
                />
            </Box>
            <AddQuestionBox />
        </Box>
    );
};

export default ExamManager;