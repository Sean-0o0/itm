import React from 'react';
import RowItem from './RowItem';

class DebtSettleWork extends React.Component {

  render() {
    const { zdzData = [] } = this.props;
    return (
      <div className='ax-card flex-c left-cont'>
        <div className='pos-r'>
          <div className='card-title title-l'>中债登结算业务</div>
        </div>
        {zdzData.length === 0 ?
          (<React.Fragment>
            <div className='evrt-bg evrt-bgimg'></div>
            <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
          </React.Fragment>) :
          (<div style={{ height: 'calc(100% - 3.66rem)', padding: '1.5rem 2rem 0 2rem', fontSize: '1.633rem' }}>
            <div className='flex-c h100'>
              <div className='flex-c h16'>
                <div className='bg_table table_style flex-r fwb' style={{ padding: '0rem 2rem' }}>
                  <div className='flex1 '>业务</div>
                  <div className='tr' style={{ width: '9rem' }}>未完成</div>
                  <div className='tr' style={{ width: '9rem' }}>异常</div>
                  <div className='tr' style={{ width: '11rem' }}>手工结算</div>
                  <div className='tr' style={{ width: '9rem' }}>成功</div>
                </div>
              </div>
              <div className='flex-c' style={{ height: '80%' }}>
                <div className='flex-c h100'>
                  {zdzData.map((item, index) => (
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

export default DebtSettleWork;
