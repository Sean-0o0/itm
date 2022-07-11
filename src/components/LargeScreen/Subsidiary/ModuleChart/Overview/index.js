import React from 'react';
class Overview extends React.Component {

    render() {
        const { NetAllCheckBusNum = "", NetDealBusNum = "",  NetPassBusNum = "",   } = this.props;
        return (
            <div className="sub-overview flex-c">
                <div className="overview-label flex1 flex-r">
                    <div>集运全部</div>
                    <div className="flex1 overview-value">1445&nbsp;<span className="unit">笔</span></div>
                </div>
                <div className="flex1 flex-r">
                    <div className="flex1 flex-r item-label">
                        <div>成功/失败</div>
                        <div className="flex1 item-value">
                            969&nbsp;<span className="unit">笔</span>&nbsp;/&nbsp;<span style={{ color: '#E23C39' }}>15&nbsp;<span className="unit">笔</span></span>
                        </div>
                    </div>
                    <div className="flex1 flex-r item-label">
                        <div>退回/撤销</div>
                        <div className="flex1 item-value">
                            969&nbsp;<span className="unit">笔</span>&nbsp;/&nbsp;15&nbsp;<span className="unit">笔</span>
                        </div>
                    </div>
                </div>
                <div className="flex1 flex-r">
                    <div className="flex1 flex-r item-label">
                        <div>处理中</div>
                        <div className="flex1 item-value">
                            57&nbsp;<span className="unit">笔</span>
                        </div>
                    </div>
                    <div className="flex1 flex-r item-label">
                        <div>受理中</div>
                        <div className="flex1 item-value">
                            55&nbsp;<span className="unit">笔</span>&nbsp;/&nbsp;2&nbsp;<span className="unit">笔</span>
                        </div>
                    </div>
                </div>
                <div className="overview-label flex1 flex-r">
                    <div>网开复核全部</div>
                    <div className="flex1 overview-value">{NetAllCheckBusNum}&nbsp;<span className="unit">笔</span></div>
                </div>
                <div className="flex1 flex-r">
                    <div className="flex1 flex-r item-label">
                        <div>处理数</div>
                        <div className="flex1 item-value">
                            {NetDealBusNum}&nbsp;<span className="unit">笔</span>
                        </div>
                    </div>
                    <div className="flex1 flex-r item-label">
                        <div>退回/撤销</div>
                        <div className="flex1 item-value">
                            112&nbsp;<span className="unit">笔</span>&nbsp;/&nbsp;20&nbsp;<span className="unit">笔</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Overview;