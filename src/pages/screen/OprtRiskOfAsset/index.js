import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import OprtRiskOfAsset from '../../../components/LargeScreen/OprtRiskOfAsset';

class OprtRiskOfAssetPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '兴证资管运营风险监控';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '10'/>
          <OprtRiskOfAsset/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default OprtRiskOfAssetPage;
