import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import Fund from '../../../components/LargeScreen/Fund';

class FundPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '兴证基金监控大屏';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '7'/>
          <Fund/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default FundPage;
