import React, { useEffect, useRef, useState } from 'react';
import CapitalBudget from './CapitalBudget';
import ContrastStatistic from './ContrastStatistic';
import DigitalClassStatistic from './DigitalClassStatistic';
import NonCapitalBudget from './NonCapitalBudget';
import ProjectOverView from './ProjectOverView';
import SupplierStatistic from './SupplierStatistic';
import TeamStatistic from './TeamStatistic';
import Personnelstatic from './PersonnelStatistic';
import { QueryContrastStatisticInfo } from '../../../services/pmsServices';


export default function StatisticAnalysis() {
  const [constrastData, setConstrastData] = useState({});

  useEffect(() => {
    QueryContrastStatisticInfo({
      year: 2022
    }).then(res=>{
      if(res.code===1){
        setConstrastData(p=>res.record[0]);
        console.log(res.record[0]);
      }
    })
    return () => {
    }
  }, []);



  return (
    <div className='statistic-analysis-box'>
      <ContrastStatistic constrastData={constrastData} />
      <DigitalClassStatistic />
      <ProjectOverView constrastData={constrastData} />
      <div className='budget-box'>
        <CapitalBudget />
        <NonCapitalBudget />
      </div>
      <TeamStatistic constrastData={constrastData}/>
      <SupplierStatistic />
      <Personnelstatic />
    </div>
  )
}