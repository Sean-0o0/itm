import React from 'react';
import FundTransferWork from './FundTransferWork'
import EventReport from '../../ClearingPlace/EventReport';
import Information from './Information'

class RightBlock extends React.Component {
  render() {
    const { zjhbData = [], errOrImpRpt = [], fxtsData = [], jsjdData = []}  = this.props;
    return (
      <div className="flex-c h100">
        <div className="h45 pd10">
          {/*资金划拨业务*/}
          < FundTransferWork zjhbData={zjhbData} jsjdData = {jsjdData}/>
        </div>
        <div className="h25 pd10">
          {/*综合信息*/}
          <Information fxtsData={fxtsData}/>
        </div>
        <div className="h30 pd10">
          {/*异常或重大事项报告*/}
          <EventReport errOrImpRpt={errOrImpRpt} />
        </div>
      </div>

    );
  }
}
export default RightBlock;
