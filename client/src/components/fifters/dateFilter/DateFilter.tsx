import React, { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { convertDate } from 'utils/functions';
import GridLayout from 'components/layouts/grid/GridLayout';
export interface IDateFilterProps {

    onChange?: (filter: { from: Date | string | undefined, to: Date | string | undefined }) => void
}

const DateFilter: React.FC<IDateFilterProps> = (props: IDateFilterProps) => {
    const [filter, setFilter] = React.useState<{ from: Date | string | undefined, to: Date | string | undefined }>({
        from: undefined,
        to: undefined,
    })
    useEffect(() => {
        props.onChange&& props.onChange(filter);
    },[filter, props])
    const items = [
        <DatePicker
            label="From"
            value={dayjs(filter.from)}
            onChange={(newValue) => { setFilter({ ...filter, from: convertDate(newValue?.toDate() ?? '') }) }}
            sx={{margin: '10px 0'}}

        />,
        <DatePicker
            label="To"
            value={dayjs(filter.to)}
            onChange={(newValue) => { setFilter({ ...filter, to: convertDate(newValue?.toDate() ?? '') }) }}
            sx={{margin: '10px 0'}}
        />
    ]

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}
            
        >
            <GridLayout
                items={items}
                columnSpacing={10}
                itemSpacing={{lg: 5, md:5, sm:10, xs: 10, }}
                pagination={false}
            />
        </LocalizationProvider>
    );
};

export default DateFilter;