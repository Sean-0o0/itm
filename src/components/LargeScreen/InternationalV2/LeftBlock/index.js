import React, { Component } from 'react';
import { Tooltip } from 'antd';
import RowItem from './RowItem'
import IndexItem from '../TopBlock/CoreBusIndex/IndexItem';
import ModuleChart from '../../ClearingPlace/ModuleChart';

class LeftBlock extends Component {
  getAssetList = (arr) => {
    let map = {};
    let myArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (!map[arr[i].GROUPNAME]) {
        myArr.push({
          GROUPNAME: arr[i].GROUPNAME,
          data: [arr[i]]
        });
        map[arr[i].GROUPNAME] = arr[i]
      } else {
        for (let j = 0; j < myArr.length; j++) {
          if (arr[i].GROUPNAME === myArr[j].GROUPNAME) {
            myArr[j].data.push(arr[i]);
            break
          }
        }
      }
    }
    return myArr
  }
  render() {
    const { chartConfig = [], monitorDatas = [], moduleCharts = [], indexConfig = [], dispatch = [] } = this.props;
    return (
      <div className="wid33 h100">
        <div className="h50 pd10">
          <ModuleChart
            records={moduleCharts[3]}
            indexConfig={indexConfig}
            tClass='title-l'
            dispatch={dispatch}
          />
        </div>
        <div className="h50 pd10">
          <ModuleChart
            records={moduleCharts[9]}
            indexConfig={indexConfig}
            tClass='title-l'
            dispatch={dispatch}
          />
        </div>

      </div>
    )
  }
}

export default LeftBlock
