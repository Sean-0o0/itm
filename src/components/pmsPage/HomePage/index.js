import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import AvatarCard from './AvatarCard';
import GuideCard from './GuideCard';
import OverviewCard from './OverviewCard';
import ShortcutCard from './ShortcutCard';
import CptBudgetCard from './CptBudgetCard';
import ToDoCard from './ToDoCard';
import ProjectCard from './ProjectCard';
import TeamCard from './TeamCard';
import SupplierCard from './SupplierCard';
import ProcessCard from './ProcessCard';

export default function HomePage(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="home-page-box">
      <div className="row-box">
        <AvatarCard />
        <GuideCard />
      </div>
      <div className="row-box">
        <OverviewCard />
        <ShortcutCard />
      </div>
      <div className="row-box">
        <div className="col-left">
          <CptBudgetCard />
          <ToDoCard />
          <ProjectCard />
        </div>
        <div className="col-right">
          <CptBudgetCard isVertical={true} />
          <TeamCard />
          <SupplierCard />
          <ProcessCard />
        </div>
      </div>
    </div>
  );
}
