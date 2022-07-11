import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import Futures from '../../../components/LargeScreen/FuturesV2';
class FuturesPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }
  render() {
    const title = '兴证期货运营监控大屏';
    return (
      <div className="xy-body" style={{ height: 'calc(175vh - 10.166rem)' }}>
        <div className="flex-c" style={{ height: '100%' }}>
          <PageHeader title={title} page='11' />
          <Futures />
          <PageFooter />
        </div>
      </div>
    );
  }
}

export default FuturesPage;
