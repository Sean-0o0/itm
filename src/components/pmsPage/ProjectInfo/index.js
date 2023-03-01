import React, { useEffect, useState } from 'react';
import InfoTable from './infoTable';
import TopConsole from './topConsole';

export default function ProjectInfo(props) {
    useEffect(() => {
        console.log('ProjectInfo(props)', props);
        return () => {
        }
    }, []);
    return (
        <div className='project-info-box'>
            <TopConsole />
            <InfoTable />
        </div>
    )
};