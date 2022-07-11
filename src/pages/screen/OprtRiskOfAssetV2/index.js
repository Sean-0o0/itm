import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import OprtRiskOfAsset from '../../../components/LargeScreen/OprtRiskOfAsseV2';

class OprtRiskOfAssetPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '兴证资管运营监控大屏';
    return (
      // <div className="xy-body" style={{height: 'calc(180vh - 18.166rem)'}}>
      <div className="oprt-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '13'/>
          <OprtRiskOfAsset/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default OprtRiskOfAssetPage;
