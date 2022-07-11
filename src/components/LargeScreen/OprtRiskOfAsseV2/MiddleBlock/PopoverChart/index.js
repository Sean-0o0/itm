import React, { Component } from 'react';
import { Progress, Popover, Tooltip } from 'antd';
import TaskItem from './TaskItem';
import moment from 'moment'

export class PopoverChart extends Component {
  render () {
    const { data = {} } = this.props;
    let content = <div></div>;

    let status = "未开始";
    let color = "#00ACFF";
    let num = '-';

    let EXEPTTASKS = 0;
    let HANDTASKS = 0;
    let COMPLTASKS = 0;
    let NORMALTASKS = 0;
    let NOSTARTTASKS = 0;
    let TOTALTASKS = 0;
    // if(data.data && Array.isArray(data.data)){
    //     TOTALTASKS = data.data.length
    //     for ( let i =0; i < data.data.length; i++){
    //         if (data.data[i].SUBSTATE === '1'){
    //             NORMALTASKS = NORMALTASKS + 1
    //         }else if (data.data[i].SUBSTATE === '2'){
    //             EXEPTTASKS = EXEPTTASKS + 1
    //         }else if (data.data[i].SUBSTATE === '3'){
    //             HANDTASKS = HANDTASKS + 1
    //         }else {
    //             NOSTARTTASKS = NOSTARTTASKS + 1
    //         }
    //     }
    // }
    let current = {}, curentIndex = 0
    TOTALTASKS = data.data.length
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].SUBSTATE === '2') {
        NORMALTASKS = NORMALTASKS + 1
      } else if (data.data[i].SUBSTATE === '3') {
        EXEPTTASKS = EXEPTTASKS + 1
      } else if (data.data[i].SUBSTATE === '1') {
        HANDTASKS = HANDTASKS + 1
      } else {
        NOSTARTTASKS = NOSTARTTASKS + 1
      }
    }

    for (let i = 0; i < data.data.length; i++) {
      current = data.data[i];
      curentIndex = i;

      if (data.data[i].SUBSTATE === '0' || data.data[i].SUBSTATE === '1' || data.data[i].SUBSTATE === '3') {
        break;
      }
    }

    COMPLTASKS = EXEPTTASKS + HANDTASKS + NORMALTASKS

    if (EXEPTTASKS !== 0) {
      status = "异常";
      color = "#E23C39";
      num = EXEPTTASKS;
    } else if (HANDTASKS !== 0) {
      status = "进行中";
      color = "#F7B432";
      num = HANDTASKS
    } else if (COMPLTASKS === 0) {
      status = "未开始";
      color = "#00ACFF";
      num = 0;
    } else {
      status = "已完成";
      color = "#00ACFF";
      num = NORMALTASKS
    }

    if (current === {} && curentIndex === 0) {
      if (status === '已完成') {//状态为已完成则当前步为最后一条
        curentIndex = data.data.length - 1
        current = data.data[curentIndex];
      } else {//状态为未开始则当前步为第一条
        curentIndex = 0
        current = data.data[curentIndex];
      }
    }

    if (data.data && Array.isArray(data.data)) {
      content = (
        <ul className="timeline-wrapper" style={{ marginBottom: '0' }}>
          {data.data.map((item, index) =>
            (<TaskItem infoItem={item} order={index} current={curentIndex} key={index} />))}
        </ul>
      );
    }

    const content2 = (
      <React.Fragment>
        <li className={'boldClass'}>
          <div className={'timeClass'} style={{bottom: '1rem'}}></div>
            <div style={{color:'white'}}>{current.IDX_NM ? current.IDX_NM : ""}</div>
        </li>
      </React.Fragment>
    )

    return (
      <div className="flex1 flex-c h100" style={{ alignItems: 'center' }}>
        <Popover placement="rightTop" content={content2}>
          <Popover content={content} title={data.GROUPNAME ? data.GROUPNAME : '-'} placement="right" trigger="click">
            <Progress type="dashboard" percent={100 * num / TOTALTASKS}
                      format={() => <div style={{ color: `${color}`,fontSize:'3rem' }}>{num} / {TOTALTASKS}<br /><span
                        className="pgsTxt">{status}</span></div>}
                      strokeColor={color} />
          </Popover>
        </Popover>
        <div className="squre pos-r" style={{marginBottom: '1rem'}}>
          <div className="topTxt">{data.GROUPNAME ? data.GROUPNAME : '-'}</div>
          <div
            className="bottomTxt">{data.STARTDATE ? moment(data.STARTDATE).format('HH:mm:ss') : '--:--:--'} - {data.ENDDATE ? moment(data.ENDDATE).format('HH:mm:ss') : '--:--:--'}</div>
        </div>
      </div>
    )
  }
}

export default PopoverChart
