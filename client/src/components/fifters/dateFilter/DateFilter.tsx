import React, { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { convertDate } from 'utils/functions';
// import GridLayout from 'components/layouts/grid/GridLayout';
import { Box, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export enum DateFilterMode {
    MONTH = 'month',
    YEAR = 'year',
    DATE = 'date',
    QUARTER = 'quarter'
}
interface IDateFilter {
    mode: DateFilterMode,
    from: Date | string | undefined,
    to: Date | string | undefined,
    month: Date | string | undefined,
    year: Date | string | undefined
}
export interface IDateFilterProps {
    onChange?: (filter: IDateFilter) => void
    fixedMode?: DateFilterMode
}

const DateFilter: React.FC<IDateFilterProps> = (props: IDateFilterProps) => {
    const [filter, setFilter] = React.useState<IDateFilter>({
        mode: DateFilterMode.DATE,
        from: undefined,
        to: undefined,
        month: undefined,
        year: undefined
    });
    const flat = React.useRef(false);
    useEffect(() => {
        if (flat.current) {
            props.onChange && props.onChange(filter);
            return;
        }
        flat.current = true;
    }, [filter, props]);

    const handleChangeMode = (mode: DateFilterMode)=>{
        if(mode === DateFilterMode.DATE){
            setFilter({...filter, mode, month: undefined, year: undefined,
                from: convertDate(dayjs(filter.from).toDate(), true),
                to: convertDate(dayjs(filter.from).toDate(), true)
            });
        }
        if(mode === DateFilterMode.MONTH){
            setFilter({...filter, mode, year: undefined,
                month: convertDate(dayjs(filter.from).startOf('month').add(1, 'days').toDate(), true),
                from: convertDate(dayjs(filter.from).startOf('month').add(1, 'days').toDate(), true),
                to: convertDate(dayjs(filter.from).endOf('month').toDate(), true)
            });
        }
        if(mode === DateFilterMode.YEAR){
            setFilter({...filter, mode, month: undefined,
                year: convertDate(dayjs(filter.from).startOf('year').add(1, 'days').toDate(), true),
                from: convertDate(dayjs(filter.from).startOf('year').add(1, 'days').toDate(), true),
                to: convertDate(dayjs(filter.from).endOf('year').toDate(), true)
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
                                    month: convertDate(dayjs(newValue?.toDate() ?? '').startOf('month').add(1, 'days').toDate(), true),
                                    from: convertDate(dayjs(newValue?.toDate() ?? '').startOf('month').add(1, 'days').toDate(), true),
                                    to: convertDate(dayjs(newValue?.toDate() ?? '').endOf('month').toDate(), true)
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
                                    year: convertDate(dayjs(newValue?.toDate() ?? '').startOf('year').add(1, 'days').toDate(), true),
                                    from: convertDate(dayjs(newValue?.toDate() ?? '').startOf('year').add(1, 'days').toDate(), true),
                                    to: convertDate(dayjs(newValue?.toDate() ?? '').endOf('year').toDate(), true)
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
                            setFilter({ ...filter, from: convertDate(newValue?.toDate() ?? '', true) });
                        }}
                        sx={{ margin: '10px 0' }}
                    />
                    <DatePicker
                        key="to"
                        label="To"
                        value={dayjs(filter.to)}
                        onChange={(newValue) => {
                            setFilter({ ...filter, to: convertDate(newValue?.toDate() ?? '', true) });
                        }}
                        sx={{ margin: '10px 0' }}
                    />
                </Box>
            </LocalizationProvider>
        </Card >
    );
};

export default DateFilter;
