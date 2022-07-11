import React from 'react';
import Provision from './Provision'
import EventReport from '../../ClearingPlace/EventReport';
import RiskWarning from './RiskWarning'

class RightBlock extends React.Component {
  render() {
    const { ProvData = [], errOrImpRpt = [], riskIndex = []}  = this.props;
    return (
      <div className="flex-c h100">
        <div className="h42 pd10">
          {/*备付金尚未支付*/}
          < Provision ProvData={ProvData}/>
        </div>
        <div className="h27 pd10">
          {/*风险提示*/}
          <RiskWarning riskIndex={riskIndex}/>
        </div>
        <div className="h31 pd10">
          {/*异常或重大事项报告*/}
          <EventReport errOrImpRpt={errOrImpRpt} />
        </div>
      </div>

    );
  }
}
export default RightBlock;
