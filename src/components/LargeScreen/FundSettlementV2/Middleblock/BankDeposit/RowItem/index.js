import React from 'react';


class RowItem extends React.Component {
  render() {
    const { item = [] } = this.props;
    let name = '';//银行名称
    let margin = '';//保证金
    let storage = '';//实际存放比
    let change = '';//变化
    let icon = ''; //图标
    let fontColor = ''; //字体颜色
    if (item) {
      name = item.BANKNM;
      margin = item.BOND;
      storage = item.ACTUALSTRATIO;
      change = item.CHANGEN;
    }
    switch (change) {
      case '增长':
        icon = require("../../../../../../image/icon_up.png");
        fontColor = '#E23C39';
        break;
      case '减少':
        icon = require("../../../../../../image/icon_down.png");
        fontColor = '#3CAB64';
        break;
      case '持平':
        fontColor = '#00ACFF';
        break;
      default:
        break;
    }
    return (
      <div className='flex-r left-data-box data-style'>
        <div className='flex1 flex-r left-data-sub data-font '>{name}</div>
        <div className='tr fwb' style={{ color: '#00ACFF', width: '13rem' }}>{margin}</div>
        <div className='tr fwb' style={{ color: '#D34643', width: '13rem' }}>
          <span className='flex1 tc fwb' style={{ color: fontColor, width: '33%' }}>{storage}</span>
          <img className="arrow-icon" src={[icon]} alt="" />
        </div>
        {/* <div className='flex-r left-data-sub data-font ' style={{ width: '34%' }}>
          {name}
        </div>
        <div className='flex1 flex-r data-font'>
          <div className='flex1 tc fwb ' style={{ color: '#00ACFF', width: '33%' }}>{margin}</div>
          <div>
            <span className='flex1 tc fwb' style={{ color: fontColor, width: '33%' }}>{storage}</span>
            <img className="arrow-icon" src={[icon]} alt="" />
          </div>
        </div> */}
      </div>
    );
  }
}

export default RowItem;
