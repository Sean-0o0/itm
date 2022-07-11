import React from 'react';

class RowItem extends React.Component {
  render() {
    const { item = {} } = this.props;
    let name = ''; //账户名称
    let available = ''; //可用余额
    let unpaid = ''; //未支付金额
    let alarmc = 0;
    if (item) {
      name = item.BANKACCT;
      available = item.AVLAMOUNT;
      unpaid = item.UNDELVAMOUNT;
      alarmc = Number.parseInt(item.ALARMC);
    }

    return (
      <div className='flex-r left-data-box data-style'>
        <div className='flex1 flex-r left-data-sub data-font '>{name}</div>
        <div className='tr fwb' style={{ color: '#00ACFF', width: '10rem' }}>{available}</div>
        <div className='tr fwb' style={{ color: alarmc>0?'#D34643':'#00ACFF', width: '10rem' }}>{unpaid}</div>
        {/* <div className='flex1 flex-r data-font'>
            <div className='flex1 tr fwb' style={{ color: '#00ACFF', width:'20%' }}>{available}</div>
              <div className='flex1 tr fwb' style={{ color: '#D34643', width:'30%' }}>{unpaid}</div>
          </div> */}
      </div>
    );
  }
}

export default RowItem;
