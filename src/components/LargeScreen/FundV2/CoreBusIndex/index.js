import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import IndexItem from './IndexItem';

export class CoreBusIndex extends Component {
  render() {
    const { chartConfig = [], dataList = [] } = this.props;

    let list1 = [], list2 = [], list7 = [], list8 = [];
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i]) {
        if (dataList[i].SUBGROUP === '估值资金划拨监控') {
          list1.push(dataList[i]);
        } else if (dataList[i].SUBGROUP === '估值场外交易监控') {
          list2.push(dataList[i]);
        } else if (dataList[i].SUBGROUP === '估值核算监控') {
          list7.push(dataList[i]);
        } else {
          list8.push(dataList[i]);
        }
      }
    }

    return (
      <div className='h74 pd10'>
        <div className='ax-card flex-c'>
          <div className='pos-r'>
            <div
              className='card-title title-l'>{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
              {chartConfig.length && chartConfig[0].chartNote ?
                (<Tooltip placement='top' title={<div>{chartConfig[0].chartNote.split('\n').map((item, index) => {
                  return <span key={index}>{item}<br /></span>;
                })}</div>}>
                  <img className='title-tip' src={[require('../../../../image/icon_tip.png')]} alt='' />
                </Tooltip>) : '估值指标监控'
              }
            </div>
          </div>
          {dataList.length === 0 ?
            (<React.Fragment>
              <div className="evrt-bg evrt-bgimg"></div>
              <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
            </React.Fragment>) :
            (
              <Scrollbars
                autoHide
                style={{ width: '100%' }}>
                <div className='flex-r' style={{ padding: '3rem 0 1rem 3rem' }}>
                  <div className='in-side-sub flex-c'
                    style={{ height: '100%', width: '30%' }}
                  >
                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list7[0] ? list7[0].SUBGROUP : ''}</div>
                    {list7.map(i => (
                      <IndexItem itemData={i} />))}
                  </div>
                  <div className='in-side-sub flex-c'
                    style={{ height: '100%', width: '30%', paddingLeft: '8rem' }}>
                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list8[0] ? list8[0].SUBGROUP : ''}
                    </div>
                    {list8.map(i => (
                      <IndexItem itemData={i} />))}
                  </div>
                  <div className='in-side-sub flex-c'
                    style={{ height: '100%', width: '30%', paddingLeft: '8rem' }}>
                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list2[0] ? list2[0].SUBGROUP : ''}</div>
                    {list2.map(i => (
                      <IndexItem itemData={i} />))}
                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '1.5rem 0 1.5rem 0' }}>{list1[0] ? list1[0].SUBGROUP : ''}</div>
                    {list1.map(i => (
                      <IndexItem itemData={i} />))}
                  </div>
                </div>
              </Scrollbars>
            )}

        </div>
      </div>

    );
  }
}

export default CoreBusIndex;
