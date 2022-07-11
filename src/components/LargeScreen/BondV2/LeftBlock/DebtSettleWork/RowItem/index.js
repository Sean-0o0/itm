import React from 'react';

class RowItem extends React.Component {
  render() {
    const { item = {} } = this.props;
    let name = '';//业务名称
    let incomplete = '';//未完成
    let anomalous = '';//异常
    let manual = '';//手工结算
    let complete = '';//已完成
    
    if (item) {
      name = item.NAME;
      incomplete = item.INCOMPLETE;
      anomalous = item.ANOMALOUS;
      manual = item.MANUAL;
      complete = item.COMPLETE;

    }
    return (
      <div className='h25'>
        <div className='wid100 flex-r left-data-box2 data-style'>
          <div className='flex1 flex-r left-data-sub data-font'>
          {name}
          </div>
          <div className='tr fwb' style={{ color: incomplete === '0' ? '#AAAAAA' : '#F7B432', width: '9rem' }}><span style={{ fontSize: '1.833rem' }}>{incomplete}</span>笔</div>
          <div className='tr fwb' style={{ color: anomalous === '0' ? '#AAAAAA' : '#E23C39', width: '9rem' }}><span style={{ fontSize: '1.833rem' }}>{anomalous}</span>笔</div>
          <div className='tr fwb' style={{ color: manual === '0' ? '#AAAAAA' : '#00ACFF', width: '11rem' }}><span style={{ fontSize: '1.833rem' }}>{manual}</span>笔</div>
          <div className='tr fwb' style={{ color: complete === '0' ? '#AAAAAA' : '#00ACFF', width: '9rem' }}><span style={{ fontSize: '1.833rem' }}>{complete}</span>笔</div>
        </div>
      </div>
    );
  }
}
export default RowItem;
