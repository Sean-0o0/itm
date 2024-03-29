import React, { useState } from 'react';
import { Calendar, Spin, Tabs, Dropdown, Menu } from 'antd';
import moment from 'moment';
// import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';
// import 'tippy.js/themes/light.css';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';

const { TabPane } = Tabs;

export default function AttendanceInfo(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { prjData = {}, xmid, daysData = {}, routes = [] } = dataProps;
  const { getCalendarData, getAttendanceData, setDaysData } = funcProps;
  const { attendance = [], prjBasic = {} } = prjData;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态

  //左侧选择器
  const getLeftSelector = ({ attendanceDays = '--', overTimeDays = '--', leaveDays = '--' }) => {
    //天数
    const getTopItem = (label = '--', value = '--') => (
      <div className="top-item" key={label}>
        {label}
        <div className="days-num">{value}</div>
      </div>
    );

    //个人考勤数据
    const getAttendanceItem = ({
      name = '--',
      attendance = '--',
      overTime = '--',
      leave = '--',
      key,
      leftDays = '--',
    }) => {
      const getDaysItem = (label, bgColor, value) => (
        <div className="days-item" key={label}>
          <div
            className="item-label"
            style={daysData.activeId === key ? {} : { backgroundColor: bgColor }}
          >
            {label}
          </div>
          {value}
        </div>
      );
      const handleClick = () => {
        if (daysData.activeId !== key) {
          getCalendarData(key, Number(daysData.curMonth), Number(xmid), p => setIsSpinning(p));
          // setTimeout(() => {
          // tippy('.ant-fullcalendar-value-diy-tooltip', {
          //   interactive: true,
          //   allowHTML: true,
          //   content: ``,
          //   placement: 'bottom',
          //   arrow: false,
          //   offset: [0, 5],
          //   theme: 'light',
          // });
          // }, 200);
        }
      };
      return (
        <div
          className={'item' + (daysData.activeId === key ? ' item-active' : '')}
          key={key}
          onClick={handleClick}
        >
          <div className="staff-name">
            {name}
            <span>工作日剩余{leftDays}天</span>
          </div>
          <div className="days-row">
            {getDaysItem('班', '#3361ff', attendance)}
            {getDaysItem('假', '#FF2F31', leave)}
            {getDaysItem('加', '#86E0FF', overTime)}
          </div>
        </div>
      );
    };

    return (
      <div className="left-selector">
        <div className="top-row">
          {getTopItem('出勤天数', attendanceDays)}
          {getTopItem('加班天数', overTimeDays)}
          {getTopItem('请假天数', leaveDays)}
        </div>
        <div className="bottom-box">
          {attendance.map((x, i) =>
            getAttendanceItem({
              name: x.RYMC,
              key: x.RYID,
              attendance: x.CQTS,
              leave: x.QJTS,
              overTime: x.JBTS,
              leftDays: x.SYGZR || 0,
            }),
          )}
          <i style={{ width: '32%' }}></i>
          <i style={{ width: '32%' }}></i>
          <i style={{ width: '32%' }}></i>
        </div>
      </div>
    );
  };

  //右侧日历
  const getRightCalendar = () => {
    //是否包括这天
    const isInclude = (d, dArr = []) => {
      return dArr.findIndex(x => x.isSame(d, 'day')) !== -1;
    };

    const renderCell = d => {
      // 自定义单元格内容
      return (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={9878}>
                <Link
                  to={{
                    pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                      JSON.stringify({
                        xmid: daysData.otherPrjDays
                          .concat(daysData.otherPrjHalfDays)
                          .find(x => x.RQ.isSame(d, 'day'))?.XMMC,
                      }),
                    )}`,
                    state: {
                      routes,
                    },
                  }}
                  style={{
                    maxWidth: 380,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    color: '#3361ff',
                  }}
                >
                  {
                    daysData.otherPrjDays
                      .concat(daysData.otherPrjHalfDays)
                      .find(x => x.RQ.isSame(d, 'day'))?.XM
                  }
                </Link>
              </Menu.Item>
            </Menu>
          }
          trigger={['hover']}
          disabled={
            !isInclude(
              d,
              daysData.otherPrjDays.concat(daysData.otherPrjHalfDays).map(x => x.RQ),
            )
          }
        >
          <div className="ant-fullcalendar-date">
            <div
              className="ant-fullcalendar-value"
              style={{
                textAlign: 'center',
                color:
                  isInclude(d, daysData.attendanceDays) ||
                  isInclude(d, daysData.leaveDays) ||
                  isInclude(d, daysData.overTimeDays)
                    ? '#fff'
                    : '',
                backgroundColor: isInclude(d, daysData.attendanceDays)
                  ? '#3361ff'
                  : isInclude(d, daysData.leaveDays)
                  ? '#FF2F31'
                  : isInclude(d, daysData.overTimeDays)
                  ? '#86E0FF'
                  : isInclude(
                      d,
                      daysData.otherPrjDays.map(x => x.RQ),
                    )
                  ? '#D8D8D7'
                  : 'unset',
                backgroundImage: isInclude(d, daysData.attendanceHalfDays)
                  ? 'linear-gradient(to bottom, white 50%, #3361ff 50%)'
                  : isInclude(d, daysData.leaveHalfDays)
                  ? 'linear-gradient(to bottom, white 50%, #FF2F31 50%)'
                  : isInclude(d, daysData.overTimeHalfDays)
                  ? 'linear-gradient(to bottom, white 50%, #86E0FF 50%)'
                  : isInclude(
                      d,
                      daysData.otherPrjHalfDays.map(x => x.RQ),
                    )
                  ? 'linear-gradient(to bottom, white 50%, #D8D8D7 50%)'
                  : 'unset',
              }}
            >
              {d.date()}
            </div>
            <div className="ant-fullcalendar-content"></div>
          </div>
        </Dropdown>
      );
    };

    return (
      <div className="calendar-box">
        <Calendar
          value={moment(daysData.curMonth)}
          headerRender={() => null}
          fullscreen={false}
          dateFullCellRender={renderCell}
        />
      </div>
    );
  };

  //处理月份显示
  const handleMonthShow = monthstr => {
    // if (moment(monthstr).year() === moment(String(prjBasic.CJRQ)).year())
    //   return moment(monthstr).format('M月');
    return moment(monthstr).format('YYYY年M月');
  };

  const handleTabsChange = key => {
    getAttendanceData(Number(key), Number(xmid), p => setIsSpinning(p));
  };

  if (daysData.monthData?.length === 0) return null;

  return (
    <div className="attendance-info-box">
      <div className="top-title">考勤信息</div>
      <Spin spinning={isSpinning} tip="加载中">
        <div className="content">
          <Tabs activeKey={daysData.curMonth} onChange={handleTabsChange}>
            {daysData.monthData?.map(x => (
              <TabPane tab={handleMonthShow(x)} key={x}>
                {getLeftSelector({
                  attendanceDays: attendance.reduce((acc, cur) => acc + cur.CQTS, 0),
                  overTimeDays: attendance.reduce((acc, cur) => acc + cur.JBTS, 0),
                  leaveDays: attendance.reduce((acc, cur) => acc + cur.QJTS, 0),
                })}
                {getRightCalendar()}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Spin>
    </div>
  );
}
