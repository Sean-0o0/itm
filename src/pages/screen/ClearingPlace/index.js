import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import ClearingPlace from '../../../components/LargeScreen/ClearingPlace';

class ClearingPlacePage extends React.Component {
  state = {
    optIdxData: [], //运作类指标状态
  };
  

  render() {
    const title = '总部清算业务监控';

    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '1'/>
          <ClearingPlace />
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default ClearingPlacePage;
