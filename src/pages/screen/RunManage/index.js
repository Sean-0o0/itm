import React from 'react';
import { connect } from 'dva';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import RunManage from '../../../components/LargeScreen/RunManage';

class RunManagePage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '总部运行管理业务监控';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '6'/>
          <RunManage/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default RunManagePage;
