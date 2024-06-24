import React from 'react';
import InfoForm, { IInfoFormProps } from 'components/forms/infoForm/InfoForm';
import 'styles/global.scss'
import InfoCard from 'components/cards/infoCard/InfoCard';
import IconMenu, { IIconMenuProps } from 'components/menus/iconMenu/IconMenu';
import { IconName } from 'utils/enums'
import IconPopup, { IconPopupProps } from 'components/popups/IconPopup/IconPopup';
import SimpleBarChart, { ISimpleBarChartChartProps } from 'components/charts/barChart/SimpleBarChart';
import { Button } from '@mui/material';
import { generateRandomFloatArray } from 'utils/functions';
import SimplePieChart, { ISimplePieChartProps } from 'components/charts/pieChart/SimplePieChart';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const Components: React.FC = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const userProps: IInfoFormProps = {
        image: 'https://static.vinwonders.com/production/cach-tao-dang-chup-anh-2.jpg',
        name: 'John Doe',
        masterParams: ['Age', 'Country'],
        detailParams: ['Occupation', 'Hobby'],
        data: {
            Age: '30',
            Country: 'USA',
            Occupation: 'Engineer',
            Hobby: 'Photography Photography Photography '
        }
    };
    const iconMenuProps: IIconMenuProps = {
        listMenuItem: [
            { icon: IconName.clock, text: 'AccessAlarm', name: 'AccessAlarm' },
            { icon: IconName.phone, text: 'PhoneAndroid', name: 'PhoneAndroid' },
            { icon: IconName.block, text: 'Block', name: 'Block' },
            { icon: IconName.facebook, text: 'Facebook', name: 'Facebook' },
            { icon: IconName.mail, text: 'MailOutline', name: 'MailOutline' },
            { icon: IconName.warning, text: 'ReportGmailerrorred', name: 'ReportGmailerrorred' },
            { icon: IconName.wifi, text: 'Wifi', name: 'Wifi' },
            { icon: IconName.wifi_off, text: 'WifiOff', name: 'WifiOff' },
            { icon: IconName.shopping_cart, text: 'ShoppingCart', name: 'ShoppingCart' },
            { icon: IconName.chart, text: 'BarChart', name: 'BarChart' },
            { icon: IconName.arrow_back, text: 'ArrowBack', name: 'ArrowBack' },
            { icon: IconName.arrow_forward, text: 'ArrowForward', name: 'ArrowForward' },
        ],
        onClickItem: (itemName) => console.log(itemName)
    }
    const iconPopupProps: IconPopupProps = {
        icon: IconName.face_smile,
        text: 'Bất ngờ chưa?',
        placement: 'bottom-start'
    }


    const [baseData, setBaseData] = React.useState([
        { id: '007', name: 'Mật vụ', revenue: [2, 1, 3, 4, 5] },
        { id: '008', name: 'Vương quốc', revenue: [2, 6, 1, 5, 3] },
        { id: '009', name: 'Đấu trường', revenue: [3, 1, 2, 2, 4] },
        { id: '010', name: 'Người lo', revenue: [4, 5, 7, 2, 1] },
        { id: '011', name: 'Sứ mệnh', revenue: [5, 4, 3, 9, 1] },
    ])
    const [dataset, setDataset] = React.useState(
        baseData.map((item) => ({ ...item, value: item.revenue.reduce((a, b) => a + b, 0) }))
    )
    const [columnSelectIndex, setColumnSelectIndex] = React.useState(0)
    const [childdata, setChilddata] = React.useState(
        baseData[columnSelectIndex].revenue.map((item, index) => ({ id: index, label: `Tháng ${index + 1}`, value: item }))
    )
    React.useEffect(() => {
        setDataset(
            baseData.map((item) => ({ ...item, value: item.revenue.reduce((a, b) => a + b, 0) }))
        )
        setChilddata(
            baseData[columnSelectIndex].revenue.map((item, index) => ({ id: index, label: `Tháng ${index + 1}`, value: item }))
        )
    }, [baseData, columnSelectIndex])
    const handleChangeData = () => {
        setBaseData(baseData.map((item) => {
            return {
                ...item,
                revenue: generateRandomFloatArray(5, 1, 20, 2)
            }
        }))
    }
    const barChartProps: ISimpleBarChartChartProps = {
        yAxis: 'doanh thu (k$)',
        width: 700,
        height: 300,
        valueFormatter: (value: number | null) => `${value},000$`,
        dataset: dataset,
        labelField: "name",
        dataField: "value",
        onItemClick(index) {
            setColumnSelectIndex(index)
        },
    }
    const barChartChildProps: ISimpleBarChartChartProps = {
        yAxis: 'doanh thu (k$)',
        width: 500,
        height: 300,
        valueFormatter: (value: number | null) => `${value},000$`,
        dataset: childdata,
        labelField: "label",
        dataField: "value",
        onItemClick(index) {
            setColumnSelectIndex(index)
        },
    }
    const pieChartProps: ISimplePieChartProps = {
        data: childdata,
        height: 200,
        width: 350,
    }

    return (
        <div className='app-container '>
            <Button onClick={() => { handleChangeData() }}>change data</Button>
            <SimpleBarChart {...barChartProps} />
            <div style={{display: 'flex', alignItems: "center", flexDirection: !isSmallScreen? 'row' : 'column' }}>
                <SimpleBarChart {...barChartChildProps} />
                <SimplePieChart  {...pieChartProps}/>
            </div>

            <IconPopup {...iconPopupProps}>
                <IconMenu {...iconMenuProps} />
            </IconPopup>

            <InfoCard
                {...userProps}
                btn1Name='Edit'
                onClickBtn1={(btnName, data) => console.log(btnName, data)}
                btn2Name='Delete'
                onClickBtn2={(btnName, data) => console.log(btnName, data)}
            />
            <InfoForm
                {...userProps}
            />

        </div>
    );
};

export default Components;