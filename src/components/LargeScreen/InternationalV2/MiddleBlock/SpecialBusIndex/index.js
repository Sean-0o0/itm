import React, { Component } from 'react';
import { Tooltip } from 'antd';
import RowItem from './RowItem';
import { Scrollbars } from 'react-custom-scrollbars';
import RowWholeItem from './RowWholeItem';
class SpecialBusIndex extends React.Component {

  //如果是单数条数的指标，根据数据条数取出最后一条数据
  sortArr = (arr) => {
    let myArr = [];
    if (arr.length % 2 !== 0) {
      myArr[0] = arr[arr.length - 1];
    }
    return myArr;
  };

  //如果是单数条数的指标，取出除了最后一条以外的数据
  sortLongArr = (arr) => {
    let myArr = [];
    if (arr.length % 2 !== 0) {
      for (let i = 0; i < arr.length - 1; i++)
        myArr[i] = arr[i];
    }
    return myArr;
  };
  render() {
    const { specialDatas = [], chartConfig = [] } = this.props;
    const data1 = this.sortArr(specialDatas);
    const data2 = this.sortLongArr(specialDatas);
    return (
      <div className='ax-card pos-r flex-c in-sp-index'>
        <div className='pos-r'>
          <div className='card-title title-l'>
            {chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
            {chartConfig.length && chartConfig[0].chartNote ?
              (<Tooltip placement='top' title={<div>{chartConfig[0].chartNote.split('\n').map((item, index) => {
                return <span key={index}>{item}<br /></span>;
              })}</div>}>
                <img className='title-tip' src={[require('../../../../../image/icon_tip.png')]} alt='' />
              </Tooltip>) : ''
            }
          </div>
        </div>
        <Scrollbars
          autoHide
          style={{ width: '100%' }}
        >
          {specialDatas.length % 2 === 0 ? (<div className='flex-r' style={{ padding: '1rem 2rem', flexWrap: 'wrap' }}>

            {specialDatas.map((item, index) => (
              <RowItem item={item} />))}
          </div>)
            :
            (<div className='flex-r ' style={{ padding: '1rem 2rem', flexWrap: 'wrap' }}>
              {data2.map((item) => (
                <RowItem item={item} />
              ))}
              <RowWholeItem item={data1[0]} />
            </div>)}
        </Scrollbars>
      </div>
    );
  }
}

export default SpecialBusIndex;
