import React, { useEffect, useState } from 'react';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';

export default function ProjectDetail(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="prj-detail-box">
      <TopConsole />
      <MileStone />
      <div className="detail-row">
          <InfoDisplay />
        <div className="col-right">
          <PrjMember />
          <PrjMessage />
        </div>
      </div>
    </div>
  );
}
