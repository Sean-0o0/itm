import React, { Component } from 'react';
import { Icon } from 'antd';

export class RowHalfItem extends Component {
  render() {
    const { pos = 0, data = {} } = this.props;
    const { INDEXNAME = '-', INDEXSTATUS = '0' } = data;
    let icon = "icon_nostart.png"
    switch (INDEXSTATUS) {
      case '0':
        icon = "icon_nostart.png";
        break;
      case '1':
        icon = "icon_underway.png";
        break;
      case '2':
        icon = "icon_completed.png";
        break;
      case '3':
        icon = "icon_abnormal.png";
        break;
      default:
        break;
    }

    return (
      <div className='flex1 flex-r left-data-box pos-r' style={{ paddingLeft: '1rem', marginRight: pos ? '.5rem' : '0' }}>
        <div className='flex-r flex1' style={{fontSize: '1.5rem'}}>
          {INDEXNAME}
        </div>
        <div className='flex-r pos-a' style={{ right: '0' }}>
          <img className="data-item-img" src={[require("../../../../../../../image/" + icon)]} alt="" />
        </div>
      </div>
    )
  }
}

export default RowHalfItem
