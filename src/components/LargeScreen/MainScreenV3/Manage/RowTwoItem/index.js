import React, { Component } from 'react';
import { Icon } from 'antd';

export class RowTwoItem extends Component {

  getEle = (data) => {
    const arr = [0, 0, 0];
    data.forEach((element = {}) => {
      if (element.INDEXNAME && element.INDEXNAME === '待处理') {
        if(element.INDEXVALUE){
          arr[0] = element.INDEXVALUE
        }
      } else if (element.INDEXNAME && element.INDEXNAME === '已审核') {
        if(element.INDEXVALUE){
          arr[1] = element.INDEXVALUE
        }
      } else if (element.INDEXNAME && element.INDEXNAME === '已完成') {
        if(element.INDEXVALUE){
          arr[2] = element.INDEXVALUE
        }
      }
    });
    return arr;
  }

  render() {
    const { item = {} } = this.props;
    const { data = [] } = item;
    const values = this.getEle(data);

    return (
      <div className='flex1 flex-r left-data-box'>
        <div className='flex-r left-data-sub'>
          <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
          {item.SUBGROUP ? item.SUBGROUP : '-'}
        </div>
        <div className='flex1 flex-r blue'>
          <div className='flex1 tr fwb fs21' style={{ color: '#F7B432' }}>{values[0]}</div>
          <div className='flex2 tr' style={{color: '#00ACFF'}}>
            已审核 <span className='fwb fs21'>{values[1]}</span> ;
            已完成 <span className='fwb fs21'>{values[2]}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default RowTwoItem
