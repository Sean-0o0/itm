import React from 'react';

class RowItem extends React.Component {
  render() {
    const { item = {} } = this.props;
    let name = '';//名
    let untreated = '';//未处理
    let processed = '';//已处理
    let nohappen = '';//未发生
    if (item) {
      name = item.INSTRTNM;
      untreated = item.NOOCCURRED==="1"?"-":item.PENDINGQTY;
      processed = item.NOOCCURRED==="1"?"-":item.PROCSSQTY;
      nohappen = item.NOOCCURRED==="1"?"未发生":'';
    }
    return (
      <div className='h14'>
        <div className='flex-r left-data-box2 data-style wid100 fwb'>
        <div className='flex1 data-font'>{name}</div>
          <div className='tr' style={{ width: '10rem', color: '#F7B432' }}>{untreated}</div>
          <div className='tr' style={{ width: '10rem', color: '#00ACFF' }}>{processed}</div>
          <div className='tr' style={{ width: '10rem', color: '#AAAAAA' }}>{nohappen}</div>
          
        </div>
      </div>
    );
  }
}

export default RowItem;
