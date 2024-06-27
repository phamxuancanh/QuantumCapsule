import React from 'react';
import { IconName } from 'utils/enums';
import * as Icons from '@mui/icons-material';

interface IIconMuiProps {
    iconName: IconName
}

const IconMui: React.FC<IIconMuiProps> = (props: IIconMuiProps) => {
    // Implement your component logic here

    return (
        // JSX code for your component's UI
        <div>
            {React.createElement(Icons[props.iconName as IconName])}
        </div>
    );
};

export default IconMui;