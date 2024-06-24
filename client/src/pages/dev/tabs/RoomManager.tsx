import InfoForm from 'components/forms/infoForm/InfoForm';
import ButtonMenu, { IButtonMenuProps } from 'components/menus/buttonMenu/ButtonMenu';
import React from 'react';
import { IconName } from 'utils/enums';

interface IRoomManagerProps {

}

const data = {
    times: [
        {id: 1, name: '10:00-11:00', disabled: false},
        {id: 2, name: '11:00-12:00', disabled: false},
        {id: 3, name: '12:00-13:00', disabled: true},
        {id: 4, name: '13:00-14:00', disabled: false},
        {id: 5, name: '14:00-15:00', disabled: false},
        {id: 6, name: '15:00-16:00', disabled: false},
        {id: 7, name: '16:00-17:00', disabled: false},
        {id: 8, name: '17:00-18:00', disabled: false},
        {id: 9, name: '18:00-19:00', disabled: true},
        
    ],
    price: '1000',
    status: 'available'

}

const RoomManager: React.FC<IRoomManagerProps> = (props: IRoomManagerProps) => {
    const ButtonMenuProps : IButtonMenuProps = {
        iconName: IconName.movie,
        disableIconName: IconName.block,
        dataBtn: data.times,
        handleClick: (id: any) => {
            console.log(id);
        },
        sx: {
            margin: 2,
            color: 'black',
            backgroundColor: 'cyan',
            ":hover": {
                backgroundColor: 'lightcoral'
            }
        },
        disableSx: {
            margin: 2,
            color: 'black',
            backgroundColor: 'gray',
        
        }

    }
    
    return (
        <div>
            <InfoForm 
                image='https://product.hstatic.net/200000343865/product/doraemon-tieu-thuyet_nobita-va-ban-giao-huong-dia-cau_bia_62e39c436bdc4343afb79847062df2f2_master.jpg'
                name='doremon'
                data={
                    {...data, rooms: <ButtonMenu {...ButtonMenuProps}/>}
                }
                detailParams={[]}
                masterParams={["rooms", "price", "status"]}
                imageStyle={{height: 500, width: 550}}
            />
        </div>
    );
};

export default RoomManager;