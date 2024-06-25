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
const Components: React.FC = () => {

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



    return (
        <div className='app-container '>
           

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