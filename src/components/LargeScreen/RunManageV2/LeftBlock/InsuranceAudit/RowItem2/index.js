import React from 'react';

class RowItem2 extends React.Component {
  handleStatus = (data) => {
    let IconAndpClass = { icon: 'icon_nostart.png', pClass: 'flex1 in-side-sub-item' };
    if (data.INDEXSTATUS) {
      switch (data.INDEXSTATUS) {
        case '0':
          IconAndpClass.icon = 'icon_nostart.png';
          break;
        case '1':
          IconAndpClass.icon = 'icon_underway.png';
          // IconAndpClass.bgcolor = '#F7B432'
          break;
        case '2':
          IconAndpClass.icon = 'icon_completed.png';
          break;
        case '3':
          IconAndpClass.icon = 'icon_abnormal.png';
          IconAndpClass.pClass += ' red';
          break;
        default:
          IconAndpClass.icon = 'icon_nostart.png';
          break;
      }
    }
    return IconAndpClass;
  };

  render() {
    const { item = {}, current = -1, order = -1, last = -1 } = this.props;
    let boldClass = "";
    let timeClass = "line";
    if (current !== -1 && current === order) {
      boldClass = `${boldClass} boldClass`;
      timeClass = `${timeClass} timeClass`;
    }
    return (
      <div className='flex1' style={{ position:'relative' }}>
        <React.Fragment>
          <li className={boldClass} style={{fontSize:'3rem'}}>
            <div className='timeClass' style={{
              width: current !== -1 && current === order ? '1.3rem' :'1rem',
              height: current !== -1 && current === order ? '1.3rem' :'1rem',
              position: 'absolute',
              background: '#fff',
              borderRadius: '100%',
              top: '0.5rem',
              left: current !== -1 && current === order ? '-0.4rem' :'-0.2rem'}}> </div>
            <div className="flex-r" style={{paddingLeft: '1.333rem',
              fontSize: '1.4rem',
              color: '#fff',justifyContent:'center',alignItems:'center'}}>
              {
                current !== order ? "" :
                  (<div className="left">
                    <img className="fd-img" src={[require("../../../../../../image/icon_jt@3x.png")]} alt=""  />
                  </div>)
              }
              <div style={{ paddingLeft:current !== order ? '2rem' :'',paddingRight: '1.068rem' }} className='cont'>
                  <img className='jk-side-img' src={[require('../../../../../../image/' + `${this.handleStatus(item).icon}`)]}
                       alt='' />
              </div>
              <div className='flex1 flex-r h100' style={{
                width: '24.49rem',
                padding: '.2rem',
                color:'#C6E2FF',
                fontWeight: '600', lineHeight: '2rem', paddingLeft: '1.068rem',
                alignItems: 'center',fontSize:'1.725rem'
                // background: this.handleStatus(item).bgcolor,
              }}>{item.INDEXNAME}
                </div>
            </div>
          </li>
        </React.Fragment>
      </div>
     );
  }

}

export default RowItem2;
