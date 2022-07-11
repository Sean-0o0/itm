import React, { Component } from 'react';

export class ClearItem extends Component {

    getStatusW = (status = '0') => {
        if (status === '1') {
            return '进行中';
        } else if (status === '2') {
            return '已完成';
        } else if (status === '3') {
            return '异常';
        } else {
            return '未开始';
        }
    }

    getIcon = (status = '0') => {
        if (status === '1') {
            return 'icon_underway.png';
        } else if (status === '2') {
            return 'icon_completed.png';
        } else if (status === '3') {
            return 'icon_abnormal.png';
        } else {
            return 'icon_nostart.png';
        }
    }

    getColor = (status = '0') => {
        if (status === '1') {
            return '#F7B432';
        } else if (status === '2') {
            return '#00ACFF';
        } else if (status === '3') {
            return '#E23C39';
        } else {
            return '#AAAAAA';
        }
    }

    getRGBColor = (status = '0') => {
        if (status === '1') {
            return 'linear-gradient(90deg, #F7B230 1%, #FFE401 100%)';
        } else if (status === '2') {
            return 'linear-gradient(90deg, #02D3FF 1%, #007EFF 100%)';
        } else if (status === '3') {
            return 'linear-gradient(90deg, #E23C39 0%, #FF6A00 100%)';
        } else {
            return 'linear-gradient(90deg, #02D3FF 1%, #007EFF 100%)';
        }
    }

    getPercent = ( data ) =>{
        const { COMPLTSTEPNUM, GROUPSTEPNUM } = data;
        const percent = COMPLTSTEPNUM/GROUPSTEPNUM;
        return percent.toFixed(2)*100+'%';
    }

    render() {
        const { item = {} } = this.props;

        return (
            <div className='flex1 clear-content flex-c h100' style={{ padding: '0 1rem', fontSize: '1.633rem' }}>
                <div className="h50 flex-r">
                    <div className="flex1 content-item flex-r">
                        <div className="flex1 flex-r">
                            <div className="item-title" style={{ fontSize: '1.733rem', fontWeight: 'bold', lineHeight: '1.1' }}>{item.GROUPNAME?item.GROUPNAME : '-'}</div>
                        </div>
                        <div className="flex-r" style={{ width: '8rem' }}>
                            <img className="data-item-img" src={[require("../../../../../../image/" + this.getIcon(item.GROUPSTATUS))]} alt="" />
                            <div className="item-title-state" style={{ fontSize: '1.633rem', color: this.getColor(item.GROUPSTATUS) }}>{this.getStatusW(item.GROUPSTATUS)}</div>
                        </div>
                    </div>
                </div>
                <div className="h50 flex-c">
                    <div className="flex-r" style={{ width: '100%' }}>
                        <div className="flex1"></div>
                        <div>{item.COMPLTSTEPNUM?item.COMPLTSTEPNUM : '-'}/{item.GROUPSTEPNUM?item.GROUPSTEPNUM : '-'}</div>
                    </div>
                    <div className="flex1 flex-r" style={{ alignItems: 'center' }}>
                        <div className="clear-process pos-r" style={{ alignItems: 'center', background: '#383F5F' }}>
                            <div className="clear-process-data" style={{ backgroundColor: this.getRGBColor(status), width: this.getPercent(item) }}></div>
                            <div className="pos-a clear-process-dot" style={{ left: 'calc(' + this.getPercent(item) + ' - 1rem)', borderColor: this.getColor(status) }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ClearItem
