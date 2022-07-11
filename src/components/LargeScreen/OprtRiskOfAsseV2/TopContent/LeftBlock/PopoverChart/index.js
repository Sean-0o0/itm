import React, { Component } from 'react';
import { Progress, Popover, Tooltip } from 'antd';
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
        if (ele.SUBSTATE === '0' || ele.SUBSTATE === '1' || ele.SUBSTATE === '3') {
          name = ele.IDX_NM || '-';
          break;
        } else if (ele.SUBSTATE === '2' && data.length === 1) {
          name = ele.IDX_NM || '-';
          break;
        }
      } else if (i > 0) {
        if (ele.SUBSTATE === '1' || ele.SUBSTATE === '3') {
          name = ele.IDX_NM || '-';

          break;
        } else if (i === data.length - 1 && ele.SUBSTATE === '2') {
          name = ele.IDX_NM;
        }
      }
    }
    return name;
  };

  //获取当前步骤
  getCurrentIndex = (item = {}) => {
    let curentIndex = 0;
    const { data = [] } = item;
    for (let i = 0; i < data.length; i++) {
      const ele = data[i] || {};
      if (i === 0) {
        if (ele.SUBSTATE === '0' || ele.SUBSTATE === '1' || ele.SUBSTATE === '3') {
          curentIndex = 0;//状态为未开始则当前步为第一条
          break;
        } else if (ele.SUBSTATE === '2' && data.length === 1) {
          curentIndex = 0;//状态为未开始则当前步为第一条
          break;
        }
      } else if (i > 0) {
        if (ele.SUBSTATE === '1' || ele.SUBSTATE === '3') {
          curentIndex = i;//状态进行中，获取当前步
          break;
        } else if (i === data.length - 1 && ele.SUBSTATE === '2') {
          curentIndex = data.length - 1;//状态为已完成则当前步为最后一条
        }
      }
    }
    return curentIndex;
  };

  render() {
    const { data = {} } = this.props;
    let content = <div></div>;

    if (data.data && Array.isArray(data.data)) {
      content = (
        <ul className="timeline-wrapper" style={{ marginBottom: '0' }}>
          {data.data.map((item, index) =>
            (<TaskItem infoItem={item} order={index} current={this.getCurrentIndex(data)} key={index} />)
          )
          }
        </ul>
      );
    }

    return (
      <div className="flex1 flex-c h100" style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* <Popover placement="rightTop" content={<div style={{ color: '#fff' }}>{this.getCurrent(data)}</div>}> */}
          <Popover content={content} title={data.GROUPNAME ? data.GROUPNAME : '-'} placement="right" trigger="click">
            <Progress type="dashboard" percent={this.getPercent(data)}
              format={() => <div style={{ color: `${this.handleComplete(data).color}`, fontWeight: 'bold', fontSize: '2.5rem' }}>{data.COMPLTSTEPNUM ? data.COMPLTSTEPNUM : '-'}/{data.GROUPSTEPNUM ? data.GROUPSTEPNUM : '-'}<br /><span
                className='fs16' style={{ fontWeight: 'normal' }}>{this.handleComplete(data).status}</span></div>}
              strokeColor={this.handleComplete(data).strokeColor} />
          </Popover>
        {/* </Popover> */}
        <div className="squre pos-r">
          <div className="topTxt fwsize">{data.GROUPNAME ? data.GROUPNAME : '-'}</div>
          <div
            className="bottomTxt" style={{ color: "#C6E2FF" }}>{data.STARTDATE ? moment(data.STARTDATE).format('HH:mm') : '--:--'} - {data.ENDDATE ? moment(data.ENDDATE).format('HH:mm') : '--:--'}</div>
        </div>
      </div>
    )
  }
}

export default PopoverChart
