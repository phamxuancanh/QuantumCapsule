// import React, { useEffect } from 'react';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { Box, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import 'dayjs/locale/vi';

// export enum DateFilterMode {
//     MONTH = 'month',
//     YEAR = 'year',
//     DATE = 'date',
//     QUARTER = 'quarter'
// }

// export interface IDateFilter {
//     mode: DateFilterMode,
//     from: Date | undefined,
//     to: Date | undefined,
//     month: Date | undefined,
//     year: Date | undefined
// }

// export interface IDateFilterProps {
//     onChange?: (filter: IDateFilter) => void
//     isFirstFilter?: boolean
//     fixedMode?: DateFilterMode
// }

// const QCDateFilter: React.FC<IDateFilterProps> = (props: IDateFilterProps) => {
//     const [filter, setFilter] = React.useState<IDateFilter>({
//         mode: DateFilterMode.DATE,
//         from: undefined,
//         to: undefined,
//         month: undefined,
//         year: undefined
//     });

//     useEffect(() => {
//         if (props.onChange && filter.from !== undefined && filter.to !== undefined) {
//             console.log("thay doi filter");
//             props.onChange(filter);
//         }
//     }, [filter.from, filter.to]);
    
//     const handleChangeMode = (mode: DateFilterMode) => {
//         console.log("thay doi mode");
//         if (mode === DateFilterMode.DATE) {
//             setFilter({
//                 ...filter,
//                 mode,
//                 month: undefined,
//                 year: undefined,
//                 // Keep 'from' and 'to' as they are
//             });
//         }
//         if (mode === DateFilterMode.MONTH) {
//             const fromDate = filter.from || new Date(); // Use 'from' or current date
//             setFilter({
//                 ...filter,
//                 mode,
//                 year: undefined,
//                 month: dayjs(fromDate).startOf('month').toDate(),
//                 from: dayjs(fromDate).startOf('month').toDate(),
//                 to: dayjs(fromDate).endOf('month').toDate(),
//             });
//         }
//         if (mode === DateFilterMode.YEAR) {
//             const fromDate = filter.from || new Date(); // Use 'from' or current date
//             setFilter({
//                 ...filter,
//                 mode,
//                 month: undefined,
//                 year: dayjs(fromDate).startOf('year').toDate(),
//                 from: dayjs(fromDate).startOf('year').toDate(),
//                 to: dayjs(fromDate).endOf('year').toDate(),
//             });
//         }
//     };

//     return (
//         <Card sx={{ maxWidth: '790px', padding: '5px 10px' }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
//                 <Box sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <FormControl key='mode' sx={{ margin: '10px 0' }}>
//                         <InputLabel>Lọc theo</InputLabel>
//                         <Select
//                             value={filter.mode}
//                             label="Lọc theo"
//                             disabled={props.fixedMode !== undefined}
//                             onChange={(e) => handleChangeMode(e.target.value as DateFilterMode)}
//                         >
//                             <MenuItem value={DateFilterMode.DATE}>Ngày</MenuItem>
//                             <MenuItem value={DateFilterMode.MONTH}>Tháng</MenuItem>
//                             <MenuItem value={DateFilterMode.YEAR}>Năm</MenuItem>
//                         </Select>
//                     </FormControl>
//                     {filter.mode === DateFilterMode.MONTH && (
//                         <DatePicker
//                             key="month"
//                             views={['year', 'month']}
//                             label="Năm"
//                             value={filter.month ? dayjs(filter.month) : null}
//                             onChange={(newValue) => {
//                                 setFilter({
//                                     ...filter,
//                                     month: newValue ? dayjs(newValue.toDate()).startOf('month').toDate() : undefined,
//                                     from: newValue ? dayjs(newValue.toDate()).startOf('month').toDate() : undefined,
//                                     to: newValue ? dayjs(newValue.toDate()).endOf('month').toDate() : undefined
//                                 });
//                             }}
//                             sx={{ margin: '10px 0', width: '182px' }}
//                         />
//                     )}
//                     {filter.mode === DateFilterMode.YEAR && (
//                         <DatePicker
//                             key="year"
//                             views={['year']}
//                             label="Năm"
//                             value={filter.year ? dayjs(filter.year) : null}
//                             onChange={(newValue) => {
//                                 setFilter({
//                                     ...filter,
//                                     year: newValue ? dayjs(newValue.toDate()).startOf('year').toDate() : undefined,
//                                     from: newValue ? dayjs(newValue.toDate()).startOf('year').toDate() : undefined,
//                                     to: newValue ? dayjs(newValue.toDate()).endOf('year').toDate() : undefined
//                                 });
//                             }}
//                             sx={{ margin: '10px 0', width: '100px' }}
//                         />
//                     )}
//                     <DatePicker
//                         key="from"
//                         label="Từ ngày"
//                         value={filter.from ? dayjs(filter.from) : null}
//                         onChange={(newValue) => {
//                             setFilter({ ...filter, from: newValue ? newValue.toDate() : undefined });
//                         }}
//                         sx={{ margin: '10px 0' }}
//                         disabled={filter.mode !== DateFilterMode.DATE}
//                     />
//                     <DatePicker
//                         key="to"
//                         label="Đến ngày"
//                         value={filter.to ? dayjs(filter.to) : null}
//                         onChange={(newValue) => {
//                             setFilter({ ...filter, to: newValue ? newValue.toDate() : undefined });
//                         }}
//                         sx={{ margin: '10px 0' }}
//                         disabled={filter.mode !== DateFilterMode.DATE}
//                     />
//                 </Box>
//             </LocalizationProvider>
//         </Card >
//     );
// };

// export default QCDateFilter;
import React, { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Box, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import 'dayjs/locale/vi';

export enum DateFilterMode {
    MONTH = 'month',
    YEAR = 'year',
    DATE = 'date',
    QUARTER = 'quarter'
}

export interface IDateFilter {
    mode: DateFilterMode;
    from: Date | undefined;
    to: Date | undefined;
    month: Date | undefined;
    year: Date | undefined;
}

export interface IDateFilterProps {
    onChange?: (filter: IDateFilter) => void;
    isFirstFilter?: boolean;
    fixedMode?: DateFilterMode;
    activeTab?: "theory" | "exercise" | "exam"; // Thêm activeTab vào đây
}

const QCDateFilter: React.FC<IDateFilterProps> = (props: IDateFilterProps) => {
    const [filter, setFilter] = React.useState<IDateFilter>({
        mode: DateFilterMode.DATE,
        from: undefined,
        to: undefined,
        month: undefined,
        year: undefined
    });

    // Reset filter khi activeTab thay đổi
    useEffect(() => {
        setFilter({
            mode: DateFilterMode.DATE,
            from: undefined,
            to: undefined,
            month: undefined,
            year: undefined
        });
        console.log("reset filter");
    }, [props.activeTab]);

    useEffect(() => {
        if (props.onChange && filter.from !== undefined && filter.to !== undefined) {
            props.onChange(filter);
        }
    }, [filter.from, filter.to]);

    const handleChangeMode = (mode: DateFilterMode) => {
        if (mode === DateFilterMode.DATE) {
            setFilter({
                ...filter,
                mode,
                month: undefined,
                year: undefined,
            });
        } else if (mode === DateFilterMode.MONTH) {
            const fromDate = filter.from || new Date();
            setFilter({
                ...filter,
                mode,
                year: undefined,
                month: dayjs(fromDate).startOf('month').toDate(),
                from: dayjs(fromDate).startOf('month').toDate(),
                to: dayjs(fromDate).endOf('month').toDate(),
            });
        } else if (mode === DateFilterMode.YEAR) {
            const fromDate = filter.from || new Date();
            setFilter({
                ...filter,
                mode,
                month: undefined,
                year: dayjs(fromDate).startOf('year').toDate(),
                from: dayjs(fromDate).startOf('year').toDate(),
                to: dayjs(fromDate).endOf('year').toDate(),
            });
        }
    };

    return (
        <Card sx={{ maxWidth: '790px', padding: '5px 10px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                <Box sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FormControl key='mode' sx={{ margin: '10px 0' }}>
                        <InputLabel>Lọc theo</InputLabel>
                        <Select
                            value={filter.mode}
                            label="Lọc theo"
                            disabled={props.fixedMode !== undefined}
                            onChange={(e) => handleChangeMode(e.target.value as DateFilterMode)}
                        >
                            <MenuItem value={DateFilterMode.DATE}>Ngày</MenuItem>
                            <MenuItem value={DateFilterMode.MONTH}>Tháng</MenuItem>
                            <MenuItem value={DateFilterMode.YEAR}>Năm</MenuItem>
                        </Select>
                    </FormControl>
                    {filter.mode === DateFilterMode.MONTH && (
                        <DatePicker
                            key="month"
                            views={['year', 'month']}
                            label="Năm"
                            value={filter.month ? dayjs(filter.month) : null}
                            onChange={(newValue) => {
                                setFilter({
                                    ...filter,
                                    month: newValue ? dayjs(newValue.toDate()).startOf('month').toDate() : undefined,
                                    from: newValue ? dayjs(newValue.toDate()).startOf('month').toDate() : undefined,
                                    to: newValue ? dayjs(newValue.toDate()).endOf('month').toDate() : undefined
                                });
                            }}
                            sx={{ margin: '10px 0', width: '182px' }}
                        />
                    )}
                    {filter.mode === DateFilterMode.YEAR && (
                        <DatePicker
                            key="year"
                            views={['year']}
                            label="Năm"
                            value={filter.year ? dayjs(filter.year) : null}
                            onChange={(newValue) => {
                                setFilter({
                                    ...filter,
                                    year: newValue ? dayjs(newValue.toDate()).startOf('year').toDate() : undefined,
                                    from: newValue ? dayjs(newValue.toDate()).startOf('year').toDate() : undefined,
                                    to: newValue ? dayjs(newValue.toDate()).endOf('year').toDate() : undefined
                                });
                            }}
                            sx={{ margin: '10px 0', width: '100px' }}
                        />
                    )}
                    <DatePicker
                        key="from"
                        label="Từ ngày"
                        value={filter.from ? dayjs(filter.from) : null}
                        onChange={(newValue) => {
                            setFilter({ ...filter, from: newValue ? newValue.toDate() : undefined });
                        }}
                        sx={{ margin: '10px 0' }}
                        disabled={filter.mode !== DateFilterMode.DATE}
                    />
                    <DatePicker
                        key="to"
                        label="Đến ngày"
                        value={filter.to ? dayjs(filter.to) : null}
                        onChange={(newValue) => {
                            setFilter({ ...filter, to: newValue ? newValue.toDate() : undefined });
                        }}
                        sx={{ margin: '10px 0' }}
                        disabled={filter.mode !== DateFilterMode.DATE}
                    />
                </Box>
            </LocalizationProvider>
        </Card >
    );
};

export default QCDateFilter;
