import React from 'react';
import RowItem from './RowItem';
import RowWholeItem from './RowWholeItem';
import ModuleChart from '../../../ClearingPlace/ModuleChart';

class DataReport extends React.Component {
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
    const { datas = [], moduleCharts = [], indexConfig = [] } = this.state;
    const { dispatch } = this.props;
    return (
      <div className='ax-card flex-c left-cont FundSettlement'>
        <div className='pos-r'>
          <div className='card-title title-c'>数据报表</div>
        </div>
        {fundSettlmData.length === 0 ?
          (<React.Fragment>
            <div className='evrt-bg evrt-bgimg'></div>
            <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
          </React.Fragment>) :
          (<div style={{ height: 'calc(100% - 3.66rem)', padding: '1.5rem 2rem 0 2rem', fontSize: '1.633rem' }}>
            <div className='flex-c h100'>
              {<ModuleChart
                  records={moduleCharts[3]}
                  indexConfig={indexConfig}
                  tClass='title-l'
                  headData={datas}
                  dispatch={dispatch}
              />}
            </div>
          </div>)}
      </div>
    );
  }

};

export default DataReport;
