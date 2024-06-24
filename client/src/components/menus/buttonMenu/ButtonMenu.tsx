import { SxProps } from '@mui/material';
import Iconbtn from 'components/buttons/iconBtn/Iconbtn';
import React from 'react';
import { IconName } from 'utils/enums';
export interface IButtonMenuProps {
    dataBtn: { id: any, name: string, disabled?: boolean }[]
    iconName: IconName;
    disableIconName?: IconName;
    sx?: SxProps;
    disableSx?: SxProps;
    handleClick: (id: any) => void
}

const ButtonMenu: React.FC<IButtonMenuProps> = (props: IButtonMenuProps) => {
    const { iconName, disableIconName, dataBtn, handleClick, sx, disableSx } = props;
    const listBtn = dataBtn.map((btn) => {
        return (
            <Iconbtn
                iconName={btn.disabled ? disableIconName || IconName.block : iconName}
                key={btn.id}
                name={btn.name}
                onClick={() => handleClick(btn.id)}
                sx={btn.disabled ? disableSx : sx}
                disabled={btn.disabled}
            />
        );
    })
    return (
        <div>
            { listBtn }

        </div>
    );
};

export default ButtonMenu;