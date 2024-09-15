import SimpleTable from "components/tables/simpleTable/SimpleTable"
import React, { useEffect } from "react"
import { initTableData, listChapterParams } from "./data/TheoryData"
import { GridColDef, GridSingleSelectColDef } from "@mui/x-data-grid"
import { generateExamId } from "helpers/Nam-helper/GenerateUID"
import { Box } from "@mui/material"
import { ACTIONS } from "utils/enums"
import { useDataSelected, useDataTable, useOpenForm } from "./context/context"
import { getListComment } from "api/comment/coment.api"
import { IComment } from "api/comment/comment.interface"
import Loading from "containers/loadable-fallback/loading"
import { ITheory } from "api/theory/theory.interface"

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
                // const response2 = await getTheo({
                //     params: {
                //         page: 1,
                //         search: "",
                //         size: 30,
                //     },
                // })

                // setDataTable(response.data.data as IComment[])
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
        setLoading(false)
    }, [])

    const handleUpdateRow = (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data)
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data)
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data)
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
                                    headerName: "Content",
                                    width: 130,
                                },
                                {
                                    field: "theoryId",
                                    headerName: "Theory ID",
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
                                    headerName: "User ID",
                                    width: 130,
                                },
                                {
                                    field: "order",
                                    headerName: "Order",
                                    width: 130,
                                },
                                {
                                    field: "status",
                                    headerName: "Status",
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
