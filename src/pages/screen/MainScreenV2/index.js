import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import MainScreen from '../../../components/LargeScreen/MainScreenV3';

class MainScreenPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '兴业证券集团运营一体化监控大屏';
    return (
      <div className='xy-body'>
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '13'/>
          <MainScreen/>
        </div>
      </div>
    );
  }
}

export default MainScreenPage;
