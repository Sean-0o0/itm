import React from 'react';
import EventReport from '../../ClearingPlace/EventReport';
import OprtIndicators from './OprtIndicators';

class RightBlock extends React.Component {
  render() {
    const { OptIndictData = [], errOrImpRpt = [] }  = this.props;
    return (
      <div className="flex-c h100">
        <div className="h64 pd10">
          {/*运营指标*/}
          < OprtIndicators OptIndictData={OptIndictData}/>
        </div>
        <div className="h36 pd10">
          {/*异常或重大事项报告*/}
          <EventReport errOrImpRpt={errOrImpRpt} />
        </div>
      </div>

    );
  }
}
export default RightBlock;
