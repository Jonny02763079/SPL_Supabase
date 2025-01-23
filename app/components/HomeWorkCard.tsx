import React from 'react'
import './HomeWorkCard.css';
import { Button } from '@mui/material';


type HomeWorkCardProps = {
    homeWorkName: string;
    homeWorkDescription: string;
    onDelete: () => void;
};

export default function HomeWorkCard({ homeWorkName, homeWorkDescription, onDelete }: HomeWorkCardProps) {
    return (
        <div className='homework-card '>
            <div className='headline'>
                <h3>{homeWorkName}</h3>
            </div>
            <div className='description'>
                {homeWorkDescription}
            </div>
            <div>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onDelete}
                    style={{ marginTop: "16px" }}
                >
                    Löschen
                </Button>
            </div>
        </div>
    )
}
