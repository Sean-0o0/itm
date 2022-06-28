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
                        <div className='flex1'>{data.version || '--'}</div>
                    </div>
                </div>
                <div className='fs14 advice-cont'>
                    <div>方案名称: {data.planName || '--'}</div>
                    <div className='advice-cont-desc'>归档说明: {data.remark || '--'}</div>
                    <div className='flex-r advice-top'>
                        <div className='fs14 advice-info-name flex1'>归档人员: {data.updateEmpname || '--'}</div>
                        <div className='fs14 advice-time'>{data.updateDate || '---------- --:--:--'}</div>
                    </div>
                </div>
            </Timeline.Item >
        );
    }
}
export default VersionItem;
