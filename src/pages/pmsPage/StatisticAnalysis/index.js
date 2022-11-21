import React from 'react';
import { connect } from 'dva';
import StatisticAnalysisTab from '../../../components/pmsPage/StatisticAnalysis/index';

const StatisticAnalysis = () => {
  return (
    <StatisticAnalysisTab></StatisticAnalysisTab>
  )
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(StatisticAnalysis);