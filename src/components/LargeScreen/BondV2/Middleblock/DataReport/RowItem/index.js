import React from 'react';

class RowItem extends React.Component {
  render() {
    const { item = [], left = 0 } = this.props;
    let padding = '0';
    if(!left){
      padding = '0 1rem 0 0';
    }
    let name = '';
    let optState = '';
    let icon = 'icon_nostart.png';
    let pClass = 'flex1 fm-side-title';
    if (item) {
      optState = item.INDEXSTATUSN;
      name = item.INDEXNAME;
    }
    switch (optState) {
      case '未发生':
        icon = 'icon_nostart.png';
        break;
      case '未完成':
        icon = 'icon_underway.png';
        break;
      case '已完成':
        icon = 'icon_completed.png';
        break;
      case '异常':
        icon = 'icon_abnormal.png';
        pClass = pClass + ' red';
        break;
      default:
        break;
    }
    return (
      <div className='h14' style={{ width: '50%', padding: padding }}>
        <div className='flex1 flex-r left-data-box2 ' style={{padding: '0 0'}}>
          <div className='flex-r flex1 data-font data-style' >
            {name}
          </div>
          <img className="data-item-img" src={[require("../../../../../../image/" + icon)]} alt="" />
        </div>
      </div>
    );
  }

};
export default RowItem;
