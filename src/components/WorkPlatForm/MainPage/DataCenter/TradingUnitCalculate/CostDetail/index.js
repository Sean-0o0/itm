import React from 'react';
import { Descriptions } from 'antd'

class TradingUnitCalculate extends React.Component {
    state = {

    }

    render() {
        const { selectedRow = {} } = this.props;
        console.log('sele', selectedRow)

        return (
            <div className='cost-detail'>
                <div className='cost-card flex-c'>
                    <div className='cost-header'>
                        <div style={{ fontWeight: 'bold', marginBottom: '2rem' }}>深交所流量费</div>
                        <div style={{ lineHeight: '1.5' }}>
                            深交所流量费=  (当月交易类收费笔数-当月交易类免收费笔数-(席位数*30000/12))*0.10+(当月非交易类收费笔数-当月非交易类免收费笔数-(席位数*30000/12))*0.01
                        </div>
                    </div>
                    <div className='cost-cont flex-c'>
                        <div className='flex1 flex-r'>
                            <div className='flex-r cost-cont-label' style={{ width: '60%' }}>当月交易类收费笔数</div>
                            <div className='flex-r cost-cont-item' style={{ width: '60%' }}>100000</div>
                        </div>
                        <div className='flex1 flex-r'>
                            <div className='flex-r cost-cont-label' style={{ width: '60%' }}>当月交易类收费笔数</div>
                            <div className='flex-r cost-cont-item' style={{ width: '60%' }}>100000</div>
                        </div>
                        <div className='flex1 flex-r'>
                            <div className='flex-r cost-cont-label' style={{ width: '60%' }}>当月交易类收费笔数</div>
                            <div className='flex-r cost-cont-item' style={{ width: '60%' }}>100000</div>
                        </div>
                        <div className='flex1 flex-r'>
                            <div className='flex-r cost-cont-label' style={{ width: '60%' }}>当月交易类收费笔数</div>
                            <div className='flex-r cost-cont-item' style={{ width: '60%' }}>100000</div>
                        </div>
                        <div className='flex1 flex-r'>
                            <div className='flex-r cost-cont-label' style={{ width: '60%' }}>当月交易类收费笔数</div>
                            <div className='flex-r cost-cont-item' style={{ width: '60%' }}>100000</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TradingUnitCalculate;
