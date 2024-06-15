import React from 'react';
import InfoForm from 'components/forms/infoForm/InfoForm';
import 'styles/global.scss'
import InfoCard from 'components/cards/infoCard/InfoCard';
const Components: React.FC = () => {

    const userProps = {
        image: 'https://static.vinwonders.com/production/cach-tao-dang-chup-anh-2.jpg',
        name: 'John Doe',
        masterParams: ['Age', 'Country'],
        detailParams: ['Occupation', 'Hobby'],
        data: {
          Age: '30',
          Country: 'USA',
          Occupation: 'Engineer',
          Hobby: 'Photography Photography Photography Photography Photography Photography Photography '
        }
      };

    return (
        <div className='app-container '>
            <InfoCard 
                {... userProps}
                btn1Name='Edit'
                onClickBtn1={(btnName,data) => console.log(btnName, data)}
                btn2Name='Delete'
                onClickBtn2={(btnName,data) => console.log(btnName, data)}
            />
            <InfoForm
                {... userProps}
            />

        </div>
    );
};

export default Components;