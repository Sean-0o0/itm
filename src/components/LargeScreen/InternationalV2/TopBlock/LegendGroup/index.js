import React from 'react';

class LegendGroup extends React.Component {
  handleRed = (e) => {
    let color = '';
    if (e.EXEPTTASKS) {
      if (e.EXEPTTASKS === 0) {
        color = '#fff';
      } else if (e.EXEPTTASKS > 0) {
        color = '#D34643';
      }
    }

  };

  render() {
    const { InterqueryStatestat = [] } = this.props;
    return (
      <div className=' data-list-wrap'>
        <ul className=' clearfix data-list'>
          <li style={{width:`${100/6}%`}}>
            <div className=' flex-r data-item'>
              {/*<div className=' data-item-left'></div>*/}
              <div className=' flex-r flex1 data-item-right-gj'>
                <div className='flex1'><img className='data-item-img'
                                            src={[require('../../../../../image/total.png')]} alt='' />总任务数
                </div>
                < div className='fwb pl5'>{InterqueryStatestat[0] ? InterqueryStatestat[0].TOTALTASKS : 0}</div>
              </div>
            </div>
          </li>
          <li style={{width:`${100/6}%`}}>
            <div className=' flex-r data-item' >
              {/*<div className=' data-item-left'></div>*/}
              <div className=' flex-r flex1 data-item-right-gj'>
                <div className='flex1 '><img className='data-item-img'
                                             src={[require('../../../../../image/icon_completed.png')]} alt='' />已完成
                </div>
                <div className='fwb pl5'>{InterqueryStatestat[0] ? InterqueryStatestat[0].COMPLTASKS : 0}</div>
              </div>
            </div>
          </li>
          <li  style={{width:`${100/6}%`}}>
            <div className=' flex-r data-item'>
              {/*<div className=' data-item-left'></div>*/}
              <div className=' flex-r flex1 data-item-right-gj'>
                {InterqueryStatestat.length !== 0 &&
                InterqueryStatestat[0].EXEPTTASKS > 0 ?
                  <div className='flex1 ' style={{ color: '#D34643'}}><img className='data-item-img'
                                                  src={[require('../../../../../image/icon_abnormal.png')]} alt='' />异常
                  </div>
                  : <div className='flex1'><img className='data-item-img'
                                                src={[require('../../../../../image/icon_abnormal.png')]} alt='' />异常
                  </div>
                }
                <div className='fwb pl5'>{InterqueryStatestat[0] ? InterqueryStatestat[0].EXEPTTASKS : 0}</div>

              </div>
            </div>
          </li>
          <li style={{width:`${100/6}%`}}>
            <div className=' flex-r data-item'>
              {/*<div className=' data-item-left'></div>*/}
              <div className=' flex-r flex1 data-item-right-gj'>
                <div className='flex1 '><img className='data-item-img'
                                             src={[require('../../../../../image/icon_underway.png')]} alt='' />进行中
                </div>
                <div className='fwb pl5'>{InterqueryStatestat[0] ? InterqueryStatestat[0].HANDTASKS : 0}</div>
              </div>
            </div>
          </li>
          <li  style={{width:`${100/6}%`}}>
            <div className=' flex-r data-item'>
              {/*<div className=' data-item-left'></div>*/}
              <div className=' flex-r flex1 data-item-right-gj'>
                <div className='flex1'><img className='data-item-img'
                                            src={[require('../../../../../image/icon_nostart.png')]} alt='' />未开始
                </div>
                <div className='fwb pl5'>{InterqueryStatestat[0] ? InterqueryStatestat[0].NOTSTARTTASKS : 0}</div>
              </div>
            </div>
          </li>
          <li style={{width:`${100/6}%`}}>
            <div className=' flex-r data-item' >
              {/*<div className=' data-item-left'></div>*/}
              <div className=' flex-r flex1 data-item-right-gj'>
                <div className='flex1' ><img className='data-item-img' style={{color:'rgba(170, 170, 170, 1)'}}
                                            src={[require('../../../../../image/icon_nohappen.png')]} alt='' />未发生
                </div>
                <div className='fwb pl5'>{InterqueryStatestat[0] ? InterqueryStatestat[0].OUTSTTASKS : 0}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default LegendGroup;
