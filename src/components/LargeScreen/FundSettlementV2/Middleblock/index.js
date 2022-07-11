import React from 'react';
import { connect } from 'dva';
import SettlementOverview from './SettlementOverview'
import FundSettlement from './FundSettlement'
import BankDeposit from './BankDeposit'

class MiddleBlock extends React.Component {
  state = {

  };

  componentDidMount() {

  }


  render() {
    const {overviewData = [], fundSettlmData=[], BankDepositData = [] } = this.props;
    return (
      <div className="flex-c h100">
        <div className="h42 flex-c pd10">
          {/*交收总览*/}
          <SettlementOverview overviewData={overviewData} />
        </div>
        <div className="h58 flex-r ">
          <div className="flex1 flex-c h100 pd10 ">
          {/*资金交收情况*/}
            <FundSettlement fundSettlmData={fundSettlmData}
          />
          </div>
          <div className="flex1 flex-c h100 pd10">
            {/*银行存放比*/}
            <BankDeposit BankDepositData={BankDepositData}/>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(MiddleBlock);
