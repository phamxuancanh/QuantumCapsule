import SimpleTable from "components/tables/simpleTable/SimpleTable"
import React, { useEffect } from "react"
import { initTableData, listChapterParams } from "./data/TheoryData"
import { GridColDef, GridSingleSelectColDef } from "@mui/x-data-grid"
import {
    generateExamId,
    generateTheoryUID,
} from "helpers/Nam-helper/GenerateUID"
import { Box } from "@mui/material"
import { ACTIONS } from "utils/enums"
import { useDataSelected, useDataTable, useOpenForm } from "./context/context"
import { ILesson } from "api/lesson/lesson.interface"
import { ITheory } from "api/theory/theory.interface"
import { getListTheory, importTheories } from "api/theory/theory.api"
import { getListLesson } from "api/lesson/lesson.api"
import Loading from "containers/loadable-fallback/loading"
import { toast } from "react-toastify"

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {
    const { setDataSelected } = useDataSelected()
    const { setOpenForm } = useOpenForm()
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [lessonParams, setLessonParams] = React.useState<ILesson[]>([])

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await getListTheory({
                    params: {
                        page: 1,
                        search: "",
                        size: 30,
                    },
                })

                setDataTable(response.data.data as ITheory[])

                // const response2 = await getListChapter({
                //     params: {
                //         page: 1,
                //         search: "",
                //         size: 100,
                //     },
                // })
                // setChapterParams(response2.data.data)

                const response3 = await getListLesson({
                    params: {
                        page: 1,
                        search: "",
                        size: 100,
                    },
                })
                setLessonParams(response3.data.data)
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
                await importTheories([{ ...data }])
                toast.success("lưu thành công")
            } catch (error) {
                console.error("data chưa được lưu: ", error)
            }
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
                {!dataTable?.length ? (
                    <Loading />
                ) : (
                    <SimpleTable
                        initData={dataTable ? dataTable : ([] as ITheory[])}
                        initNewRow={
                            {
                                id: generateTheoryUID(),
                                lessonId: "lesson001",
                                name: "",
                                description: "",
                                summary: "",
                                url: "",
                                type: "",
                                order: 0,
                                status: true,
                            } as ITheory
                        }
                        columns={
                            [
                                {
                                    field: "name",
                                    headerName: "Name",
                                    width: 130,
                                    editable: true,
                                },
                                {
                                    field: "description",
                                    headerName: "Description",
                                    width: 130,
                                    editable: true,
                                },
                                {
                                    field: "summary",
                                    headerName: "Summary",
                                    width: 130,
                                    editable: true,
                                },
                                {
                                    field: "url",
                                    headerName: "URL",
                                    width: 130,
                                    editable: true,
                                },
                                {
                                    field: "type",
                                    headerName: "Type",
                                    width: 130,
                                    editable: true,
                                },

                                {
                                    field: "lessonId",
                                    headerName: "Lesson ID",
                                    width: 130,
                                    valueOptions: lessonParams.map((item) => {
                                        return {
                                            value: item.id,
                                            label: item.name,
                                        }
                                    }),
                                    editable: true,
                                    type: "singleSelect",
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
                )}
            </Box>
        </Box>
    )
}

export default ExamManager
