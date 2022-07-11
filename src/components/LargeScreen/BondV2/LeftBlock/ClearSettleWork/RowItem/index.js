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
      <div className='h16'>
        <div className='flex-r left-data-box2 data-style wid100 fwb'>
        <div className='flex1 data-font'>{name}</div>
          <div className='tr' style={{ width: '9rem', color: incomplete === '0' ? '#AAAAAA' : '#F7B432' }}><span style={{ fontSize: '1.833rem' }}>{incomplete}</span>笔</div>
          <div className='tr' style={{ width: '9rem', color: anomalous === '0' ? '#AAAAAA' : '#E23C39' }}><span style={{ fontSize: '1.833rem' }}>{anomalous}</span>笔</div>
          <div className='tr' style={{ width: '11rem', color: manual === '0' ? '#AAAAAA' : '#00ACFF' }}><span style={{ fontSize: '1.833rem' }}>{manual}</span>笔</div>
          <div className='tr' style={{ width: '9rem', color: complete === '0' ? '#AAAAAA' : '#00ACFF' }}><span style={{ fontSize: '1.833rem' }}>{complete}</span>笔</div>
        </div>
      </div>
    );
  }
}

export default RowItem;
