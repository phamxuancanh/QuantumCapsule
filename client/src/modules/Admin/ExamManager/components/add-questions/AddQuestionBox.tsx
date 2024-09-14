import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from "@mui/material"
import ModalAction from "components/modals/modalAction/ModalAction"
import { data as listQuestion } from "modules/Practice/data/questions"
import React, { useEffect } from "react"
import { useDataSelected, useOpenForm } from "../../context/context"
import { ACTIONS } from "utils/enums"
import { render } from "react-dom"

interface IProps {
    // Define the props for the component here
}

const AddQuestionBox: React.FC<IProps> = (props) => {
    const { openForm, setOpenForm } = useOpenForm()
    const {dataSelected} = useDataSelected()
    const [listIdQuesionSelected, setListIdQuesionSelected] = React.useState<string[]>([])
    const handleSave = async() => {
        console.log(listIdQuesionSelected);
        
        setOpenForm(false)
    }
    const handleRemove = (questionId : string) => {
        setListIdQuesionSelected((pre: string[]) => {
            return pre?.filter((item) => item !== questionId)
        })
        
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const { value } = event.target
        setListIdQuesionSelected((pre: string[] | undefined) =>{
            return pre?.includes(value) ? pre.filter((item) => item !== value) : [...pre!, value]
        })
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
                                listIdQuesionSelected?.includes(question.id!) ? true : false
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
            title="Add Questions"
            onSave={handleSave}
            onClose={() => setOpenForm(false)}
            type={ACTIONS.UPDATE}
        >
            <Box sx={{ maxHeight: "800px", overflowY: "scroll" }} p={2}>
                <Grid container spacing={2}>
                    {listIdQuesionSelected.map((item, index) => {
                        return (
                            <Grid item lg={2} md={4} xs={4}  key={index}>
                                <Grid container sx={{borderRadius: 5, border: "1px solid black"}} p={0.5}>
                                    <Grid item xs={10}>
                                        {listQuestion.find((question) => question.id === item)?.title}

                                    </Grid>
                                    <Grid item xs={2}>
                                        <span onClick={e => handleRemove(item)}>x</span>
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
