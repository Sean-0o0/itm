import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import WeeklyReportTableDetail
  from '../../../components/pmsPage/WeeklyReportTableDetail/index';
class WeeklyReportTable extends Component {
  render() {
    return (
      <React.Fragment>
        <WeeklyReportTableDetail />
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(WeeklyReportTable);
