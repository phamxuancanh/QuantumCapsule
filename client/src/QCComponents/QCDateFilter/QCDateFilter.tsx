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
    mode: DateFilterMode,
    from: Date | undefined,
    to: Date | undefined,
    month: Date | undefined,
    year: Date | undefined
}

export interface IDateFilterProps {
    onChange?: (filter: IDateFilter) => void
    isFirstFilter?: boolean
    fixedMode?: DateFilterMode
}

const QCDateFilter: React.FC<IDateFilterProps> = (props: IDateFilterProps) => {
    const [filter, setFilter] = React.useState<IDateFilter>({
        mode: DateFilterMode.DATE,
        from: undefined, // Initially undefined
        to: undefined, // Initially undefined
        month: undefined,
        year: undefined
    });

    useEffect(() => {
        props.onChange && props.onChange(filter);
    }, [filter.from, filter.to]);

    const handleChangeMode = (mode: DateFilterMode) => {
        if (mode === DateFilterMode.DATE) {
            setFilter({
                ...filter,
                mode,
                month: undefined,
                year: undefined,
                from: filter.from,
                to: filter.to
            });
        }
        if (mode === DateFilterMode.MONTH) {
            setFilter({
                ...filter,
                mode,
                year: undefined,
                month: filter.from ? dayjs(filter.from).startOf('month').toDate() : undefined,
                from: filter.from ? dayjs(filter.from).startOf('month').toDate() : undefined,
                to: filter.from ? dayjs(filter.from).endOf('month').toDate() : undefined
            });
        }
        if (mode === DateFilterMode.YEAR) {
            setFilter({
                ...filter,
                mode,
                month: undefined,
                from: filter.from ? dayjs(filter.from).startOf('year').toDate() : undefined,
                to: filter.from ? dayjs(filter.from).endOf('year').toDate() : undefined
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