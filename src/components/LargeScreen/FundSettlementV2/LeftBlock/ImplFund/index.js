import React from 'react';
import { Icon } from 'antd';
import RowItem from './RowItem';

class ImplFund extends React.Component {

  render() {
    const { ImplFundData = [] } = this.props;
    return (
      <div className='ax-card flex-c left-cont FundSettlement'>
        <div className='pos-r'>
          <div className='card-title title-l'>资金划付执行情况</div>
        </div>
        {ImplFundData.length === 0 ?
          (<React.Fragment>
            <div className='evrt-bg evrt-bgimg'></div>
            <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
          </React.Fragment>) :
          (<div style={{ height: 'calc(100% - 3.66rem)', padding: '1.5rem 2rem 0 2rem', fontSize: '1.633rem' }}>
            <div className='flex-c h100'>
              <div className='flex-c h16'>
                <div className='bg_table table_style flex-r fwb' style={{ padding: '0rem 2rem' }}>
                  <div className='flex1 '>业务</div>
                  <div className='tr' style={{ width: '10rem' }}>待处理</div>
                  <div className='tr' style={{ width: '10rem' }}>异常</div>
                  <div className='tr' style={{ width: '10rem' }}>已完成</div>
                </div>
              </div>
              <div className='flex-c' style={{ height: '80%' }}>
                <div className='flex-c h100'>
                  {ImplFundData.map((item, index) => (
                    <RowItem item={item} key={index}/>
                  ))}
                </div>
              </div>
            </div>
          </div>)}
      </div>
    );
  }
};

export default ImplFund;
