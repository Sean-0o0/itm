import React from 'react';
import InfoItem from './InfoItem';

class Fund extends React.Component {
    render() {
        const { fundBus = [], chartTitle = '--' } = this.props;
        const fundSettlementAmount = fundBus[8] ? fundBus[8].STATE : "-";
        return (
            <div className="h100 flex-c zb-data-item">
                <div className="card-title-sec">{chartTitle}</div>
                <div className="flex-c zjyw-cont">
                    <div className="fs16 lh20 tc h10">资金结算金额</div>
                    <div className="tc zjyw-num h10">{fundSettlementAmount}&nbsp;<span className="fs16 fwn">亿元</span></div>
                    <ul className="h80 flex1 clearfix qs-yw-list">
                        {[1, 5, 2, 6, 3, 7, 4, 8].map(i => (
                            <InfoItem
                                key={i}
                                infoItem={fundBus[i - 1]}
                            />))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Fund;
