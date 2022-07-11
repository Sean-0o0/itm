import React from 'react';
import ImplFund from './ImplFund';
import Instruction from './Instruction';

class LeftBlock extends React.Component {
    render() {
        const { ImplFundData = [], zdInstrtData= []}  = this.props;
        return (
          <div className="flex-c h100">
            <div className="h42 flex-c wid100 pd10">
              <ImplFund ImplFundData={ImplFundData}/>
            </div>
            <div className="h58 flex-c wid100 pd10">
              <Instruction zdInstrtData={zdInstrtData}/>
            </div>
          </div>

        );
    }
}
export default LeftBlock;
