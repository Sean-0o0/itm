import React, { Component } from 'react'
import LegendGroup from './LegendGroup';
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import CoreBusIndex from './CoreBusIndex';
import RowItem from '../LeftBlock/RowItem';

export class TopBlock extends Component {
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
        const { chartConfig = [], monitorDatas = [], datas= [], moduleCharts = [], indexConfig = [], InterqueryStatestat = [], dispatch = [] } = this.props;
      const monitorDatasList = this.getAssetList(monitorDatas);
        return (
            <div className="flex-r " style={{ height:'66.7%'}}>
              <div className="wid66 flex-c h100 ">
                <LegendGroup InterqueryStatestat={InterqueryStatestat} />
                {/*核心业务监控*/}
                <CoreBusIndex chartConfig={moduleCharts[1]} data={datas}/>
              </div>
                <div className="wid34 flex-c h100">
                  <div className="h100 pd10">
                  <div className="ax-card pos-r flex-c" >
                    <div className="pos-r">
                      <div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                        {chartConfig.length && chartConfig[0].chartNote ?
                          (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                            <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                          </Tooltip>) : ''
                        }
                      </div>
                    </div>
                    <Scrollbars
                      autoHide
                      style={{ width: '100%' }}
                    >

                      <div className="flex-c" style={{ height: '100%' }}>
                        {monitorDatasList.map((item, index) => (
                          <div className="flex-c in-monitor-box">
                            <div className="in-monitor-title tc" style={{paddingBottom:'1rem'}}>{monitorDatasList[index] ? monitorDatasList[index].GROUPNAME : ''} </div>
                            <RowItem item={item.data} />
                          </div>
                        ))}
                      </div>
                    </Scrollbars>
                  </div>
                </div>
                </div>
            </div>
        )
    }
}

export default TopBlock
