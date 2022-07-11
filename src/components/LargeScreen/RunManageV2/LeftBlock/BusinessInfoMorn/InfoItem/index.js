import React from 'react';

class InfoItem extends React.Component {
  render() {
    const { infoItem = {} } = this.props;
    let name = '';
    let optState = '';
    let icon = 'icon_nostart.png';
    let color = '';
    let pClass = 'flex1 pClass';
    if (infoItem) {
      optState = infoItem.STATE;
      name = infoItem.IDX_NM || '';
    }
    switch (optState) {
      case '0':
        icon = 'icon_nostart.png';
        color = 'rgb(170, 170, 170)'
        break;
      case '1':
        icon = 'icon_underway.png';
        color = 'rgb(247, 180, 50)';
        break;
      case '2':
        icon = 'icon_completed.png';
        color = 'rgb(211, 70, 67)'
        break;
      case '3':
        icon = 'icon_abnormal.png';
        pClass = pClass + ' red';
        break;
      default:
        icon = 'icon_nostart.png';
        color = 'rgb(170, 170, 170)';
        break;
    }

    return (
      <div className='flex1 in-side-sub-item' style={{ padding: '1.5rem 0rem' }}>
        <React.Fragment>
          <div style={{ paddingRight: '1.068rem', paddingTop: '.45rem' }}>
            <img className='jk-side-img' src={[require('../../../../../../image/' + icon)]} alt='' />
          </div>
          <div className='flex1 flex-r h100' style={{
            width: '24.49rem',
            padding: '.2rem',
            fontWeight: '800', lineHeight: '2rem', paddingLeft: '1.068rem',
            alignItems: 'center',
            color:{color}
            // background: this.handleStatus(item).bgcolor,
          }}>{name}
          </div>
        </React.Fragment>
      </div>

      // <React.Fragment>
      //     <div className={pClass}>
      //         {name === '' ? '' :
      //             (<React.Fragment><img className="jk-side-img" src={[require("../../../../../../image/" + icon)]} alt="" />两融担保证券导入监控</React.Fragment>)
      //         }
      //
      //     </div>
      // </React.Fragment>
    );
  }
}

export default InfoItem;
