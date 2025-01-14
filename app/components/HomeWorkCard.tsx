import React from 'react'
import './HomeWorkCard.css';


type props = {
    homeWorkName: string;
    homeWorkDescription: string;
}

export default function HomeWorkCard({ homeWorkName, homeWorkDescription }: props) {
    return (
        <div className='homework-card '>
            <div className='headline'>
                <h3>{homeWorkName}</h3>
            </div>
            <div className='description'>
                {homeWorkDescription}
            </div>
        </div>
    )
}
