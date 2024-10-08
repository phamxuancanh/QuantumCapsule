import { Box, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Typography } from "@mui/material"
import ModalAction from "components/modals/modalAction/ModalAction"
import React, { useEffect } from "react"
import { useDataSelected, useOpenForm } from "../../context/context"
import { ACTIONS } from "utils/enums"
import { render } from "react-dom"
import { getListQuesionByExamId } from "api/question/question.api"
import { IQuestion } from "api/question/question.interfaces"
import CloseIcon from '@mui/icons-material/Close';
interface IProps {
    // Define the props for the component here
}

const AddQuestionBox: React.FC<IProps> = (props) => {
    const { openForm, setOpenForm } = useOpenForm()
    const {dataSelected} = useDataSelected()
    const [listQuesionSelected, setListQuesionSelected] = React.useState<IQuestion[]>([])
    const [listQuestion, setListQuestion] = React.useState<IQuestion[]>([])

    React.useEffect(() => {
        (
            async ()=>{
                console.log(dataSelected, openForm);
                
                if(dataSelected && openForm) {
                    const response = await getListQuesionByExamId(dataSelected.id!)
                    const listData = response.data.data as IQuestion[]
                    setListQuestion(listData)
                    setListQuesionSelected(listData)
                }
            }
        )()
    }, [openForm])

    const handleSave = async() => {
        
        setOpenForm(false)
    }
    const handleRemove = (questionId : string) => {
        setListQuesionSelected((pre: IQuestion[]) => {
            return pre?.filter((item) => item.id !== questionId)
        })
        
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const { value } = event.target
        setListQuesionSelected((pre: IQuestion[]) =>(
            checked ? [...pre, listQuestion.find((question) => question.id === value)!] : pre.filter((item) => item.id !== value)
        ))
    }
    const renderListQuestion = () => {
        return listQuestion.map((question, index) => {
            return (
                <FormControlLabel
                    key={index}
                    control={
                        <Checkbox
                            value={question.id}
                            onChange={handleChange}
                            checked={
                                listQuesionSelected.some((item) => item.id === question.id)
                            }
                        />
                    }
                    label={`${question.title}: ${question.content}`}
                />
            )
        })
    }
    return (
        <ModalAction
            open={openForm ? openForm : false}
            title="Thêm câu hỏi"
            onSave={handleSave}
            onClose={() => setOpenForm(false)}
            type={ACTIONS.UPDATE}
        >
            <Box sx={{ maxHeight: "800px", overflowY: "scroll" }} p={2}>
                <Grid container spacing={2}>
                    {listQuesionSelected.map((item, index) => {
                        return (
                            <Grid item lg={2} md={4} xs={4}  key={index}>
                                <Grid container sx={{borderRadius: 5, border: "1px solid black"}} p={0.5}>
                                    <Grid item xs={10}>
                                        {item.title}: {item.content}
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton onClick={()=>handleRemove(item.id!)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    })}
                </Grid>
                <Box p={1}>
                    <FormGroup>{renderListQuestion()}</FormGroup>

                </Box>
            </Box>
        </ModalAction>
    )
}

export default AddQuestionBox
