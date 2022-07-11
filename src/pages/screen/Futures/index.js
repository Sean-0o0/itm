import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import Futures from '../../../components/LargeScreen/Futures';

class FuturesPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '兴证期货监控大屏';
    return (
      <div className="xy-body" >
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '9'/>
          <Futures/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default FuturesPage;
