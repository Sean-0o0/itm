import React, { Component } from 'react';

class RowItem extends Component {
  handleData = (data) => {
    let zongArr = { temp: [], ranm: [] };
    if(data ) {
      data.forEach((item, index) => {
        if (index % 2) {
          zongArr.temp.push(item);
        } else {
          zongArr.ranm.push(item);
        }
      });
    }
    return zongArr;
  };

  render() {
    const { item } = this.props;
    return (
      <div className=' flex-r' >
        <div className='flex1'>
          {this.handleData(item).ranm.map((item, index) => (
          <div className='data-item flex-r wid95'  style={{  padding: '0 1rem', height: '3.5rem', marginBottom: '1rem', fontWeight:'600', lineHeight:'2rem',borderRadius: '0.5rem',boxShadow: '0 0 1rem rgba(0, 172, 255, 0.6) inset',
            border: '1px solid rgba(0, 172, 255, 0.6)',
            position: 'relative'
          }}>
            <div className='flex1' style={{ marginRight: '.3rem' }}>{item.INDEXNAME}</div>
            <div className='data-item-value' style={{ marginRight: '.3rem' }}>{item.INDEXVALUE}</div>
          </div>
            ))}
        </div>
        <div className='flex1' >
          {this.handleData(item).temp.map((item, index) => (
          <div className='data-item flex-r wid95' style={{  padding: '0 1rem', height: '3.5rem', marginBottom: '1rem', fontWeight:'600', lineHeight:'2rem',borderRadius: '0.5rem', boxShadow: '0 0 1rem rgba(0, 172, 255, 0.6) inset',
            border: '1px solid rgba(0, 172, 255, 0.6)',
            position: 'relative' }}>
            <div className='flex1' style={{ marginRight: '.3rem'}}>{item.INDEXNAME}</div>
            <div className='data-item-value tr' style={{ marginRight: '.3rem', width: '8rem' }}>{item.INDEXVALUE}</div>
          </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RowItem;
