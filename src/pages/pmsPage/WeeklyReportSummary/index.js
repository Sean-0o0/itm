import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import WeeklyReportSummaryTabs
  from '../../../components/pmsPage/WeeklyReportSummary/index';
class WeeklyReportSummary extends Component {
    render() {
        return (
            <React.Fragment>
              <WeeklyReportSummaryTabs />
            </React.Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(WeeklyReportSummary);
