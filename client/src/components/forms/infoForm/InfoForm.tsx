import React from 'react';
import './index.scss'

export interface IInfoFormProps {
    image: string;
    name: string;
    masterParams: string[] // names of main fields
    detailParams: string[] // names of detail fields
    data: any
    imageStyle?: React.CSSProperties
}

const InfoForm: React.FC<IInfoFormProps> = (props: IInfoFormProps) => {
    const { image, name, masterParams, detailParams, data, imageStyle} = props;
    const convertTitle = (title: string) => {
        // updatedDate => Updated Date
        return title.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase());
    }
    return (
        <div className="info-form">
            <div className="info-header">
                <div className="image-container" style={imageStyle}>
                    <img src={image} alt={`${name}'s avatar`}/>
                </div>
                <div className="main-info">
                    <h1>{name}</h1>
                    <ul>
                        {masterParams.map((param, index) => (
                            <li key={index}>
                                <strong>{convertTitle(param)}: </strong>{data[param]}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="details-section">
                <ul>
                    {detailParams.map((param, index) => (
                        <li key={index}>
                            <strong>{convertTitle(param)}: </strong>{data[param]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InfoForm;