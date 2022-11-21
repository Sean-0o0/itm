import React, { useEffect, useRef } from 'react';
import CapitalBudget from './CapitalBudget';
import ContrastStatistic from './ContrastStatistic';
import DigitalClassStatistic from './DigitalClassStatistic';
import NonCapitalBudget from './NonCapitalBudget';
import ProjectOverView from './ProjectOverView';
import SupplierStatistic from './SupplierStatistic';
import TeamStatistic from './TeamStatistic';
import Personnelstatic from './PersonnelStatistic';

export default function StatisticAnalysis() {

  return (
    <div className='statistic-analysis-box'>
      <ContrastStatistic/>
      <DigitalClassStatistic/>
      <ProjectOverView/>
      <div className='budget-box'>
        <CapitalBudget/>
        <NonCapitalBudget/>
      </div>
      <TeamStatistic/>
      <SupplierStatistic/>
      <Personnelstatic/>
    </div>
  )
}