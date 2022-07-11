import React from 'react';
import DebtSettleWork from './DebtSettleWork';
import ClearSettleWork from './ClearSettleWork';

class LeftBlock extends React.Component {
    render() {
        const { zdzData = [], sqsData= [], jsjdData = []}  = this.props;
        return (
          <div className="flex-c h100">
            <div className="h45 flex-c wid100 pd10">
              {/*中债登结算业务 */}
              <DebtSettleWork zdzData={zdzData}/>
            </div>
            <div className="h55 flex-c wid100 pd10">
              {/*上清所结算业务 */}
              <ClearSettleWork sqsData={sqsData} jsjdData = {jsjdData}/>
            </div>
          </div>

        );
    }
}
export default LeftBlock;
