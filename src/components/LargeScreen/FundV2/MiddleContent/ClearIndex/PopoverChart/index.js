import React, { Component } from 'react';
import { Progress, Popover } from 'antd';
import TaskItem from './TaskItem';
import moment from 'moment'

export class PopoverChart extends Component {
  getPercent = (data = {}) => {
    if (data.COMPLTSTEPNUM && data.GROUPSTEPNUM) {
      return ((data.COMPLTSTEPNUM / data.GROUPSTEPNUM) * 100);
    }
    return '-';
  };

  //处理完成状态和样式
  handleComplete = (data = {}) => {
    let StatusAndColor = { status: '未开始', strokeColor: { '0%': '#157EF4', '100%': '#00D8FF' }, color: '#AAA' };
    if (data.GROUPSTATUS) {
      switch (data.GROUPSTATUS) {
        case '0':
          StatusAndColor.status = '未开始';
          break;
        case '1':
          StatusAndColor.status = '进行中';
          StatusAndColor.strokeColor = { '0%': '#F7B432', '100%': '#FFE401' };
          StatusAndColor.color = "#F7B432";
          break;
        case '2':
          StatusAndColor.status = '已完成';
          StatusAndColor.color = "#00ACFF";
          break;
        case '3':
          StatusAndColor.status = '异常';
          StatusAndColor.strokeColor = { '0%': '#E10019', '100%': '#FF6C00' };
          StatusAndColor.color = "#D34643";
          break;
        default:
          break;
      }
    }
    return StatusAndColor;
  };

  //处理标题名称
  handleData = (data = {}) => {
    return (data.GROUPNAME === '' ? '-' : data.GROUPNAME);
  };

  //获取当前步骤
  getCurrent = (item = {}) => {
    const { data = [] } = item;
    let name = '-';
    for (let i = 0; i < data.length; i++) {
      const ele = data[i] || {};
      if (i === 0) {
        if (ele.SUBSTATE === '0') {
          name = ele.IDX_NM || '-';
        }
      } else if (i > 0) {
        if (ele.SUBSTATE === '1') {
          name = ele.IDX_NM || '-';
          break;
        }
        if (i === data.length - 1 || ele.SUBSTATE === '2') {
          name = ele.IDX_NM
        }
      }
    }
    return name;
  };

  render() {
    const { data: item = {} } = this.props;
    const { data = [] } = item;

    let content = <div></div>;

    let status = "未开始";

    let EXEPTTASKS = 0;
    let HANDTASKS = 0;
    let COMPLTASKS = 0;
    let NORMALTASKS = 0;
    let NOSTARTTASKS = 0;
    let current = {}, curentIndex = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].SUBSTATE === '2') {
        NORMALTASKS = NORMALTASKS + 1
      } else if (data[i].SUBSTATE === '3') {
        EXEPTTASKS = EXEPTTASKS + 1
      } else if (data[i].SUBSTATE === '1') {
        HANDTASKS = HANDTASKS + 1
      } else {
        NOSTARTTASKS = NOSTARTTASKS + 1
      }
    }

    for (let i = 0; i < data.length; i++) {
      current = data[i];
      curentIndex = i;

      if (data[i].SUBSTATE === '0' || data[i].SUBSTATE === '1' || data[i].SUBSTATE === '3') {
        break;
      }
    }

    COMPLTASKS = EXEPTTASKS + HANDTASKS + NORMALTASKS

    if (EXEPTTASKS !== 0) {
      status = "异常";
    } else if (HANDTASKS !== 0) {
      status = "进行中";
    } else if (COMPLTASKS === 0) {
      status = "未开始";
    } else {
      status = "已完成";
    }

    if (current === {} && curentIndex === 0) {
      if (status === '已完成') {//状态为已完成则当前步为最后一条
        curentIndex = data.length - 1
        current = data[curentIndex];
      } else {//状态为未开始则当前步为第一条
        curentIndex = 0
        current = data[curentIndex];
      }
    }

    if (data && Array.isArray(data)) {
      content = (
        <ul className="timeline-wrapper" style={{ marginBottom: '0' }}>
          {data.map((item, index) =>
            (<TaskItem infoItem={item} order={index} current={curentIndex} key={index} />))}
        </ul>
      );
    }

    return (
      <div className="flex1 flex-c h100" style={{ alignItems: 'center',justifyContent:'center' }}>
        <Popover placement="rightTop" content={<div style={{color: '#fff'}}>{this.getCurrent(item)}</div>}>
          <Popover content={content} title={item.GROUPNAME ? item.GROUPNAME : '-'} placement="right" trigger="click">
            <Progress type="dashboard" percent={this.getPercent(item)}
              format={() => <div style={{ color: `${this.handleComplete(item).color}`, fontWeight: 'bold', fontSize: '2.5rem' }}>{item.COMPLTSTEPNUM ? item.COMPLTSTEPNUM : '-'}/{item.GROUPSTEPNUM ? item.GROUPSTEPNUM : '-'}<br /><span
                className='fs16' style={{ fontWeight: 'normal' }}>{this.handleComplete(item).status}</span></div>}
              strokeColor={this.handleComplete(item).strokeColor} />
          </Popover>
        </Popover>
        <div className="squre pos-r" style={{ marginBottom: '1rem' }}>
          <div className="topTxt fwsize">{item.GROUPNAME ? item.GROUPNAME : '-'}</div>
          <div
            className="bottomTxt" style={{ color: "#C6E2FF" }}>{item.STARTDATE ? moment(item.STARTDATE).format('HH:mm') : '--:--'} - {item.ENDDATE ? moment(item.ENDDATE).format('HH:mm') : '--:--'}</div>
        </div>
      </div>
    )
  }
}

export default PopoverChart
