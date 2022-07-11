import React from 'react';
class TodoBussiness extends React.Component {

    render() {

        return (
            <div className="sub-overview flex-c" style={{paddingBottom: '3rem'}}>
                <div className="overview-label flex1 flex-r">
                    <div>集运待办</div>
                    <div className="flex1 overview-value">1445&nbsp;<span className="unit">笔</span></div>
                </div>
                <div className="flex1 flex-r">
                    <div className="flex1 flex-r item-label">
                        <div>个人总待办业务(总部待办/分公司待办)</div>
                        <div className="flex1 item-value">
                            969&nbsp;<span className="unit">笔</span>&nbsp;/&nbsp;<span style={{ color: '#E23C39' }}>15&nbsp;<span className="unit">笔</span></span>
                        </div>
                    </div>
                </div>
                <div className="flex1 flex-r">
                    <div className="flex1 flex-r item-label">
                        <div>机构总待办业务(总部待办/分公司待办)</div>
                        <div className="flex1 item-value">
                            112&nbsp;<span className="unit">笔</span>&nbsp;/&nbsp;<span style={{ color: '#E23C39' }}>83&nbsp;<span className="unit">笔</span></span>
                        </div>
                    </div>
                </div>
                <div className="overview-label flex1 flex-r">
                    <div>网开复核待办</div>
                    <div className="flex1 overview-value">1445&nbsp;<span className="unit">笔</span></div>
                </div>
            </div>
        );
    }
}

export default TodoBussiness;