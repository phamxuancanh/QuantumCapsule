import React, { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import GridLayout from 'components/layouts/grid/GridLayout';
import { Box, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export enum DateFilterMode {
    MONTH = 'month',
    YEAR = 'year',
    DATE = 'date',
    QUARTER = 'quarter'
}
export interface IDateFilter {
    mode: DateFilterMode,
    from: Date | undefined,
    to: Date  | undefined,
    month: Date | undefined,
    year:  Date | undefined
}
export interface IDateFilterProps {
    onChange?: (filter: IDateFilter) => void
    isFirstFilter?: boolean
    fixedMode?: DateFilterMode
}

const QCDateFilter: React.FC<IDateFilterProps> = (props: IDateFilterProps) => {
    const [filter, setFilter] = React.useState<IDateFilter>({
        mode: DateFilterMode.DATE,
        from: new Date(new Date().setHours(0, 0, 0, 0)), // Đầu ngày hôm nay (00:00:00)
        to: new Date(new Date().setHours(23, 59, 59, 999)),
        month: undefined,
        year: undefined
    });
    const flat = React.useRef(false);
    useEffect(() => {
        props.onChange && props.onChange(filter);
    }, [filter.from, filter.to]);

    const handleChangeMode = (mode: DateFilterMode)=>{
        if(mode === DateFilterMode.DATE){
            setFilter({...filter, mode, month: undefined, year: undefined,
                from: filter.from,
                to: filter.to
            });
        }
        if(mode === DateFilterMode.MONTH){
            setFilter({...filter, mode, year: undefined,
                month: dayjs(filter.from).startOf('month').toDate(),
                from: dayjs(filter.from).startOf('month').toDate(),
                to: dayjs(filter.from).endOf('month').toDate()
            });
        }
        if(mode === DateFilterMode.YEAR){
            setFilter({...filter, mode, month: undefined,
                // year: dayjs(filter.from).startOf('year').add(1, 'days').toDate(),
                from: dayjs(filter.from).startOf('year').toDate(),
                to: dayjs(filter.from).endOf('year').toDate()
            });
        }
    }

    return (
        <Card sx={{ maxWidth: '790px', padding: '5px 10px'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
                <Box sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <FormControl key='mode' sx={{ margin: '10px 0' }}>
                        <InputLabel>Mode</InputLabel>
                        <Select
                            value={filter.mode}
                            label="Mode"
                            disabled={props.fixedMode !== undefined}
                            onChange={(e) => handleChangeMode(e.target.value as DateFilterMode)}
                        >
                            <MenuItem value={DateFilterMode.DATE}>Date</MenuItem>
                            <MenuItem value={DateFilterMode.MONTH}>Month</MenuItem>
                            <MenuItem value={DateFilterMode.YEAR}>Year</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        filter.mode === DateFilterMode.MONTH && <DatePicker
                            key="month"
                            views={['year', 'month']}
                            label="Month"
                            value={dayjs(filter.month)}
                            onChange={(newValue) => {
                                setFilter({
                                    ...filter,
                                    month: dayjs(newValue?.toDate() ?? '').startOf('month').toDate(),
                                    from: dayjs(newValue?.toDate() ?? '').startOf('month').toDate(),
                                    to: dayjs(newValue?.toDate() ?? '').endOf('month').toDate()
                                });
                            }}
                            sx={{ margin: '10px 0', width: '182px'}}
                        />
                    }
                    {
                        filter.mode === DateFilterMode.YEAR && <DatePicker
                            key="year"
                            views={['year']}
                            label="Year"
                            value={dayjs(filter.year)}
                            onChange={(newValue) => {
                                setFilter({
                                    ...filter,
                                    year: dayjs(newValue?.toDate() ?? '').startOf('year').toDate(),
                                    from: dayjs(newValue?.toDate() ?? '').startOf('year').toDate(),
                                    to: dayjs(newValue?.toDate() ?? '').endOf('year').toDate()
                                });
                            }}
                            sx={{ margin: '10px 0', width: '100px'}}
                        />
                    }
                    <DatePicker
                        key="from"
                        label="From"
                        value={dayjs(filter.from)}
                        onChange={(newValue) => {
                            setFilter({ ...filter, from: newValue?.toDate() });
                        }}
                        sx={{ margin: '10px 0' }}
                        disabled={filter.mode !== DateFilterMode.DATE}
                    />
                    <DatePicker
                        key="to"
                        label="To"
                        value={dayjs(filter.to)}
                        onChange={(newValue) => {
                            setFilter({ ...filter, to: newValue?.toDate() });
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
