import React, { useEffect, useState } from 'react';
import InfoTable from './infoTable';
import TopConsole from './topConsole';

export default function ProjectInfo() {
    return (
        <div className='project-info-box'>
            <TopConsole />
            <InfoTable />
        </div>
    )
};