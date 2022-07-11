import React from 'react';

class RowItem extends React.Component {
  render() {
    const { item = {} } = this.props;
    let name = '';//业务名称
    let pending = '';//待处理
    let abnormal = '';//异常
    let completed = '';//已完成
    if (item) {
      name = item.BUNINESSNM;
      pending = item.PENDINGQTY;
      abnormal = item.EXCEPTQTY;
      completed = item.COMPLQTY;

    }
    return (
      <div className='h25'>
        <div className='wid100 flex-r left-data-box2 data-style'>
          <div className='flex1 flex-r left-data-sub data-font'>
            {name}
          </div>
          <div className='tr fwb' style={{ color: '#F7B432', width: '10rem' }}><span style={{ fontSize: '1.833rem' }}>{pending}</span>笔</div>
          {/*<div className='flex1 tr fwb' style={{ color: values[1] > 0? '#E23C39':'#fff' }}>0</div>*/}
          <div className='tr fwb' style={{ color: abnormal === '0' ? '#AAAAAA' : '#E23C39', width: '10rem' }}><span style={{ fontSize: '1.833rem' }}>{abnormal}</span>笔</div>
          <div className='tr fwb' style={{ color: '#00ACFF', width: '10rem' }}><span style={{ fontSize: '1.833rem' }}>{completed}</span>笔</div>
        </div>
      </div>
    );
  }
}
export default RowItem;
