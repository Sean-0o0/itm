import React, { Component } from 'react';
import { Icon } from 'antd';

export class StatusRow extends Component {

  render() {
    const { item = {} } = this.props;
    const { data = [] } = item;
    const [ info = {} ] = data;
    const { INDEXNAME = '-', INDEXVALUE = '1' } = info;

    return (
      <div className='flex1 flex-r left-data-box'>
        <div className='flex-r left-data-sub'>
          <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
          {item.SUBGROUP ? item.SUBGROUP : '-'}
        </div>
        <div className='flex1 flex-r blue'>
          <div className='flex2 tr' style={{color: INDEXVALUE==='0'?'#00ACFF':INDEXVALUE==='2'?'rgb(247, 180, 50)':'rgb(226, 60, 57)'}}>
          {INDEXNAME}
          </div>
        </div>
      </div>
    )
  }
}

export default StatusRow
