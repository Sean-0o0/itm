import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import MainScreen from '../../../components/LargeScreen/MainScreen';

class MainScreenPage extends React.Component {
  render() {
    const title = '兴业证券集团运营一体化监控大屏';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '0'/>
          <MainScreen />
          <PageFooter />
        </div>
      </div>
    );
  }
}

export default MainScreenPage;
