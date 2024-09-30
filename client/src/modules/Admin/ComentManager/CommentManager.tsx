import SimpleTable from "components/tables/simpleTable/SimpleTable"
import React, { useEffect } from "react"
import { initTableData, listChapterParams } from "./data/TheoryData"
import { GridColDef, GridSingleSelectColDef } from "@mui/x-data-grid"
import { generateExamId } from "helpers/Nam-helper/GenerateUID"
import { Box } from "@mui/material"
import { ACTIONS } from "utils/enums"
import { useDataSelected, useDataTable, useOpenForm } from "./context/context"
import { addComment, deleteComment, getListComment, updateComment } from "api/comment/coment.api"
import { IComment } from "api/comment/comment.interface"
import Loading from "containers/loadable-fallback/loading"
import { ITheory } from "api/theory/theory.interface"
import { toast } from "react-toastify"
import { t } from "i18next"
import { getListTheory } from "api/theory/theory.api"

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {
    const { setDataSelected } = useDataSelected()
    const { setOpenForm } = useOpenForm()
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [theoryParams, setTheoryParams] = React.useState<ITheory[]>([])


    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await getListComment({
                    params: {
                        page: 1,
                        search: "",
                        size: 30,
                    },
                })
                setDataTable(response.data.data as IComment[])

                const response2 = await getListTheory({
                    params: {
                        page: 1,
                        search: "",
                        size: 100,
                    },
                })

                setTheoryParams(response2.data.data as ITheory[])
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
        setLoading(false)
    }, [])

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data)
            try {
                const response = await addComment(data)
                toast.success(response.data.message)
            } catch (error : any) {
                toast.error(error.message)
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data)
            try {
                const response = await updateComment(data.id, data)
                toast.success(response.data.message)
            } catch (error : any) {
                toast.error(error.message)
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data)
            try {
                const response = await deleteComment(data)
                toast.success(response.data.message)
            } catch (error : any) {
                toast.error(error.message)
            }
        }
    }
    return (
        <Box>
            <Box p={5}>
                {/* {!dataTable?.length ? (
                    <Loading />
                ) : ( */}
                    <SimpleTable
                        initData={dataTable ? dataTable : [] as IComment[]}
                        initNewRow={{
                            id: generateExamId(),
                            name: "",
                            chapterId: "",
                            lessonId: "",
                            order: 0,
                            status: true,
                        }}
                        columns={
                            [
                                // { field: 'id', headerName: 'ID', width: 70 },
                                {
                                    field: "content",
                                    headerName: "Nội dung",
                                    width: 130,
                                    editable: true
                                },
                                {
                                    field: "theoryId",
                                    headerName: "Bài lý thuyết",
                                    width: 130,
                                    valueOptions: theoryParams.map(
                                        (item) => {
                                            return {
                                                value: item.id,
                                                label: item.name,
                                            }
                                        },
                                    ),
                                    editable: true,
                                    type: "singleSelect",
                                },
                                {
                                    field: "userId",
                                    headerName: "Mã học sinh",
                                    width: 130,
                                },
                                {
                                    field: "order",
                                    headerName: "Thứ tự",
                                    width: 130,
                                    editable: true,
                                },
                                {
                                    field: "status",
                                    headerName: "Trạng thái",
                                    width: 130,
                                },
                            ] as GridColDef[]
                        }
                        onRowClick={(row) => {
                            setDataSelected(row.row)
                            // setOpenForm(true);
                        }}
                        onUpdateRow={(data, action) =>
                            handleUpdateRow(data, action)
                        }
                    />
                {/* )} */}
            </Box>
        </Box>
    )
}

export default ExamManager
