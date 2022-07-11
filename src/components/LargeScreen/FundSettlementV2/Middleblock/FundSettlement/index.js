import React from 'react';
import { Icon } from 'antd';

import RowItem from './RowItem';
import RowWholeItem from './RowWholeItem';

class FundSettlement extends React.Component {
  state = {
    completed: 0, //已完成
    undone: 0, //未完成
    nohappen: 0, //未发生
  };
  //计算三种状态下的数目
  calculate = (arr) => {
    let myArr = [0, 0, 0];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].INDEXSTATUSN) {
        if (arr[i].INDEXSTATUSN === '已完成') {
          myArr[0] = myArr[0] + 1;
        } else if (arr[i].INDEXSTATUSN === '未完成') {
          myArr[1] = myArr[1] + 1;
        } else if (arr[i].INDEXSTATUSN === '未发生') {
          myArr[2] = myArr[2] + 1;
        }
      }
    }
    return myArr;
  };

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
    const { fundSettlmData = [] } = this.props;
    const data = this.calculate(fundSettlmData);
    const data1 = this.sortArr(fundSettlmData);
    const data2 = this.sortLongArr(fundSettlmData);
    return (
      <div className='ax-card flex-c left-cont FundSettlement'>
        <div className='pos-r'>
          <div className='card-title title-c'>资金交收执行情况</div>
        </div>
        {fundSettlmData.length === 0 ?
          (<React.Fragment>
            <div className='evrt-bg evrt-bgimg'></div>
            <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
          </React.Fragment>) :
          (<div style={{ height: 'calc(100% - 3.66rem)', padding: '1.5rem 2rem 0 2rem', fontSize: '1.633rem' }}>
            <div className='flex-c h100'>
              <div className='flex-c h13'>
                <div className='flex-r fwb bg_table table_style h100'>
                  <div className='flex1 tc'>
                    <span style={{ paddingBottom: '.2rem' }}>
                      <img src={[require('../../../../../image/icon_completed.png')]} className='icon-size'
                        alt='' />
                    </span>
                    <span style={{ paddingLeft: '.8rem', color: '#00ACFF' }}>已完成 </span>
                    <span>{data[0]}</span>
                  </div>
                  <div className='flex1 tc'>
                    <span style={{ paddingBottom: '.2rem' }}>
                      <img src={[require('../../../../../image/icon_underway.png')]} className='icon-size' alt='' />
                    </span>
                    <span style={{ paddingLeft: '.8rem', color: '#F7B432' }}>
                      未完成 </span>
                    <span>{data[1]}</span>
                  </div>
                  <div className='flex1 tc'>
                    <span style={{ paddingBottom: '.2rem' }}>
                      <img src={[require('../../../../../image/icon_nostart.png')]} className='icon-size' alt='' />
                    </span>
                    <span style={{ paddingLeft: '.8rem', color: '#AAAAAA' }}>
                      未发生 </span>
                    <span>
                      {data[2]}
                    </span></div>
                </div>
              </div>
              {fundSettlmData.length % 2 === 0 ? (
                <div className='flex-c h84'>
                  <div className='flex-r h100' style={{ flexWrap: 'wrap' }}>
                    {fundSettlmData.map((item, index) => (
                      <RowItem item={item} key={index} left={index%2}/>))}
                  </div>
                </div>)
                :
                (<div className='flex-c h84'>
                  <div className='h100'>
                    <div className='flex-r h100' style={{ flexWrap: 'wrap' }}>
                      {data2.map((item,index) => (
                        <RowItem item={item} key={index} left={index%2}/>
                      ))}
                      <RowWholeItem item={data1[0]} />
                    </div>
                  </div>
                </div>)}
              <div className='flex-c h1'>
                <div className='flex-c h100'></div>
              </div>
            </div>
          </div>)}
      </div>
    );
  }

};

export default FundSettlement;
