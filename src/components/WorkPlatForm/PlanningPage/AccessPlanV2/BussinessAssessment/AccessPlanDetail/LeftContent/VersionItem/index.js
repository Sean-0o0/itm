import React from 'react';
import { Timeline } from 'antd';

class VersionItem extends React.Component {
    state = {
    };

    render() {
        const { data = [] } = this.props;
        return (
            <Timeline.Item color='blue'>
                <div className='flex-r advice-top'>
                    <div className='flex1 flex-r fwb advice-info'>
                        <div className='flex1'>{data.stepName || '--'}</div>
                    </div>
                </div>
                <div className='fs14 advice-cont'>
                    <div>审批动作: {data.actionName || '--'}</div>
                    <div className='advice-cont-desc'>审批意见: {data.actionNote || '--'}</div>
                    <div className='flex-r advice-top'>
                        <div className='fs14 advice-info-name flex1'>审批人员: {data.auditEmp || '--'}</div>
                        <div className='fs14 advice-time'>审批时间：{data.actionTime || '---------- --:--:--'}</div>
                    </div>
                </div>
            </Timeline.Item >
        );
    }
}
export default VersionItem;
