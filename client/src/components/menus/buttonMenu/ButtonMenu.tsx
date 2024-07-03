import { Box, Card, SxProps } from '@mui/material';
import Iconbtn from 'components/buttons/iconBtn/Iconbtn';
import React from 'react';
import { IconName } from 'utils/enums';
export interface IButtonMenuProps {
    dataBtn: { id: any, name: string, disabled?: boolean }[]
    iconName: IconName;
    disableIconName?: IconName;
    sx?: SxProps;
    sx1?: SxProps;
    iconNameSx1?: IconName;
    listIdSx1?: any[];
    disableSx?: SxProps;
    // position?: 'left' | 'right'| 'center';
    onBtnClick: (id: any) => void
}

const ButtonMenu: React.FC<IButtonMenuProps> = (props: IButtonMenuProps) => {
    const { 
        iconName, disableIconName, dataBtn, onBtnClick, sx, disableSx,
        sx1, iconNameSx1, listIdSx1
    } = props;
    const handleClick = (id: any) => {
        console.log(listIdSx1);
        
        onBtnClick(id);
    }
    const listBtn = dataBtn.map((btn) => {
        return (
            <Iconbtn
                iconName={
                    btn.disabled ? disableIconName || IconName.block
                    : listIdSx1?.find(id=>btn.id===id) ? iconNameSx1 || IconName.radio : iconName
                }
                key={btn.id}
                name={btn.name}
                onClick={()=>handleClick(btn.id)}
                sx={
                    btn.disabled ? 
                    disableSx 
                    : listIdSx1?.find(id=>btn.id===id) ? sx1 : sx
                }
                disabled={btn.disabled}
            />
        );
    })
    return (
        <Box sx={{display: 'flex',  flexWrap: 'wrap',justifyContent: `center` }}>
        <Card sx={{margin: '5px'}}>
            { listBtn }
        </Card>

        </Box>
    );
};

export default ButtonMenu;