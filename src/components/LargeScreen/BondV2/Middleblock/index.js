import React from 'react';
import { connect } from 'dva';
import SettlementProcess from './SettlementProcess'
import ModuleTextChart from './ModuleTextChart';

class MiddleBlock extends React.Component {
  state = {

  };

  componentDidMount() {

  }


  render() {
    const {overviewData = [], sjbbData=[], indexConfig = [], moduleCharts = [], jsjdData = []} = this.props;
    return (
      <div className="flex-c h100">
        <div className="h45 flex-c pd10">
          {/*结算进度*/}
          <SettlementProcess overviewData={overviewData} jsjdData = {jsjdData}/>
        </div>
        <div className="h55 flex-r ">
          <div className="flex1 flex-c h100 pd10 ">
          {/*数据报表*/}
          {<ModuleTextChart
              records={moduleCharts[3]}
              indexConfig={indexConfig}
              tClass='title-c'
              headData={sjbbData}              
          />}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(MiddleBlock);
