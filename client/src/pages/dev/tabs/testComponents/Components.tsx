import React from 'react';
import InfoForm, { IInfoFormProps } from 'components/forms/infoForm/InfoForm';
import 'styles/global.scss'
import InfoCard from 'components/cards/infoCard/InfoCard';
import IconMenu, { IIconMenuProps } from 'components/menus/iconMenu/IconMenu';
import { IconName } from 'utils/enums'
import IconPopup, { IconPopupProps } from 'components/popups/IconPopup/IconPopup';

import TreeMenu, { ITreeMenuProps } from 'components/menus/treeMenu/TreeMenu';
import { useTreeViewApiRef } from '@mui/x-tree-view';
import DateFilter, { IDateFilterProps } from 'components/fifters/dateFilter/DateFilter';
import Flashcard, { IFlashcardProps } from 'components/cards/flashCard/FlashCard';
import TabMenu from 'components/menus/tabMenu/TabMenu';

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

    const treeMenuProps: ITreeMenuProps = {
        apiRef: useTreeViewApiRef(),
        dataTreeView: [
            {
                id: 'grid',
                label: 'Data Grid',
                children: [
                    { id: 'grid-community', label: '@mui/x-data-grid' },
                    { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
                    { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
                ],
            },
            {
                id: 'pickers',
                label: 'Date and Time Pickers',
                children: [
                    { id: 'pickers-community', label: '@mui/x-date-pickers' },
                    { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
                ],
            },
            {
                id: 'charts',
                label: 'Charts',
                children: [{ id: 'charts-community', label: '@mui/x-charts' }],
            },
            {
                id: 'tree-view',
                label: 'Tree View',
                children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
            },

        ],
        onSelectedItemsChange(itemId) {
            console.log(itemId);
        },
    }

    const dateFilterProps: IDateFilterProps = {
        onChange: (filter) => console.log(filter)
    }

    const flastCardProps: IFlashcardProps = {
        question: 'What is React?',
        answer: 'A library for building user interfaces',
    }

    return (
        <div className='app-container '>
            <TabMenu
                listItems={[
                    {
                        index: 0, label: 'flashcard',
                        item: <Flashcard {...flastCardProps} />
                    },
                    {
                        index: 1, label: 'date filter',
                        item: <DateFilter {...dateFilterProps} />
                    },
                    {
                        index: 2, label: 'tree menu',
                        item: <TreeMenu {...treeMenuProps} />
                    },
                    {
                        index: 3, label: 'icon popup',
                        item: <IconPopup {...iconPopupProps}>
                            <IconMenu {...iconMenuProps} />
                        </IconPopup>
                    },
                    {
                        index: 4, label: 'info card',
                        item: <InfoCard
                            {...userProps}
                            btn1Name='Edit'
                            onClickBtn1={(btnName, data) => console.log(btnName, data)}
                            btn2Name='Delete'
                            onClickBtn2={(btnName, data) => console.log(btnName, data)}
                        />
                    },
                    {
                        index: 5, label: 'info form',
                        item: <InfoForm
                            {...userProps}
                        />
                    },
                ]}
                // vertical = {true}
            />

        </div>
    );
};

export default Components;