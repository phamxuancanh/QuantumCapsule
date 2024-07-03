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
import DrawerMenu, { IDrawerMenuProps } from 'components/menus/drawerMenu/DrawerMenu';
import { Card, CardContent, Divider } from '@mui/material';
import SelectFilter from 'components/fifters/selectFilter/SelectFilter';

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
        onChange: (filter) => console.log(filter),
        // fixedMode: DateFilterMode.DATE
    }

    const flastCardProps: IFlashcardProps = {
        question: 'What is React?',
        answer: 'A library for building user interfaces',
    }

    const drawerProps: IDrawerMenuProps = {
        width: 200,
        labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
        onClick(text: string) {
            console.log(text);
        }
    }
    return (
        <div className='app-container '>
            <TabMenu
                defaultIndex={1}
                listItems={[
                    {
                        index: 0, label: 'flashcard',
                        item: <Flashcard {...flastCardProps} />
                    },
                    {
                        index: 1, label: 'date filter',
                        item: <Card>
                            <CardContent>
                                <DateFilter {...dateFilterProps} />
                                <Divider />
                                <SelectFilter 
                                    options = {[
                                        { label: 'Option 1', value: 'option1' },
                                        { label: 'Option 2', value: 'option2' },
                                        { label: 'Option 3', value: 'option3' },
                                        { label: 'Option 4', value: 'option4' },
                                    ]}
                                    onSelected={(value) => console.log(value)}
                                />
                            </CardContent>
                        </Card>
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
                    {
                        index: 6, label: 'drawer menu',
                        item: <DrawerMenu
                            {...drawerProps}
                        />
                    },
                ]}
            // vertical = {true}
            />

        </div>
    );
};

export default Components;