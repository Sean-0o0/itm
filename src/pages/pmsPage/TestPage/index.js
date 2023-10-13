import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Dropdown, message, Menu, Calendar, Checkbox, Row } from 'antd';
// import Calendar2 from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

export default function CalendarTest(props) {
  const [sltArr, setSltArr] = useState([]); //
  const [pFive, setPFive] = useState([]); //0.5
  const [one, setOne] = useState([]); //1
  const [fastSlt, setFastSlt] = useState({
    workdays: false,
    pFiveAtndance: false,
    pFiveLeave: false,
  }); //

  const [sltArr2, setSltArr2] = useState([]); //
  const [pFive2, setPFive2] = useState([]);  //0.5
  const [one2, setOne2] = useState([]); //1
  const [fastSlt2, setFastSlt2] = useState({
    workdays2: false,
    pFiveAtndance2: false,
    pFiveLeave2: false,
  }); //
  const [dropdownVisible, setDropdownVisible] = useState(false); //

  const renderCell = d => {
    // console.log(
    //   '🚀 ~ file: index.js:25 ~ renderCell ~ d:',
    //   sltArr.findIndex(x => x.isSame(d, 'day')) !== -1,
    // );
    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={() => {
            setPFive(p => p.filter(x => sltArr.findIndex(y => y.isSame(x, 'day')) === -1));
            setOne(p => p.filter(x => sltArr.findIndex(y => y.isSame(x, 'day')) === -1));
            setSltArr([]);
            setFastSlt({ workdays: false, pFiveAtndance: false, pFiveLeave: false });
          }}
        >
          0人天
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            setPFive(p => [...p, ...sltArr]);
            setOne(p => p.filter(x => sltArr.findIndex(y => y.isSame(x, 'day')) === -1));
            setSltArr([]);
            setFastSlt({ workdays: false, pFiveAtndance: false, pFiveLeave: false });
          }}
        >
          0.5人天
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            setPFive(p => p.filter(x => sltArr.findIndex(y => y.isSame(x, 'day')) === -1));
            setOne(p => [...p, ...sltArr]);
            setSltArr([]);
            setFastSlt({ workdays: false, pFiveAtndance: false, pFiveLeave: false });
          }}
        >
          1人天
        </Menu.Item>
      </Menu>
    );
    // 自定义单元格内容
    return (
      <Dropdown
        overlay={menu}
        trigger={['contextMenu']}
        disabled={[...sltArr].findIndex(y => y.isSame(d, 'day')) === -1}
      >
        <div
          className={
            'ant-fullcalendar-date' +
            (sltArr.findIndex(x => x.isSame(d, 'day')) !== -1
              ? ' ant-fullcalendar-selected-day'
              : '')
          }
          onClick={() => {
            if (sltArr.findIndex(x => x.isSame(d, 'day')) === -1) {
              setSltArr(p => [...p, d]);
            } else {
              setSltArr(p => p.filter(x => !x.isSame(d, 'day')));
            }
          }}
        >
          <div
            class="ant-fullcalendar-value"
            style={{
              textAlign: 'center',
              color:
                pFive.findIndex(x => x.isSame(d, 'day')) !== -1 ||
                one.findIndex(x => x.isSame(d, 'day')) !== -1 ||
                sltArr.findIndex(x => x.isSame(d, 'day')) !== -1
                  ? '#fff'
                  : '',
              backgroundColor:
                sltArr.findIndex(x => x.isSame(d, 'day')) !== -1
                  ? '#3361ff'
                  : pFive.findIndex(x => x.isSame(d, 'day')) !== -1
                  ? '#CFE6FD'
                  : one.findIndex(x => x.isSame(d, 'day')) !== -1
                  ? '#77C8F9'
                  : 'unset',
              boxShadow: 'unset',
            }}
          >
            {d.date()}
          </div>
          <div class="ant-fullcalendar-content"></div>
        </div>
      </Dropdown>
    );
  };

  const renderCell2 = d => {
    // console.log(
    //   '🚀 ~ file: index.js:25 ~ renderCell ~ d:',
    //   sltArr.findIndex(x => x.isSame(d, 'day')) !== -1,
    // );
    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={() => {
            setPFive2(p => p.filter(x => sltArr2.findIndex(y => y.isSame(x, 'day')) === -1));
            setOne2(p => p.filter(x => sltArr2.findIndex(y => y.isSame(x, 'day')) === -1));
            setSltArr2([]);
            setFastSlt2({ workdays2: false, pFiveAtndance2: false, pFiveLeave2: false });
            setDropdownVisible(false);
          }}
        >
          0人天
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            setPFive2(p => [...p, ...sltArr2]);
            setOne2(p => p.filter(x => sltArr2.findIndex(y => y.isSame(x, 'day')) === -1));
            setSltArr2([]);
            setFastSlt2({ workdays2: false, pFiveAtndance2: false, pFiveLeave2: false });
            setDropdownVisible(false);
          }}
        >
          0.5人天
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            setPFive2(p => p.filter(x => sltArr2.findIndex(y => y.isSame(x, 'day')) === -1));
            setOne2(p => [...p, ...sltArr2]);
            setSltArr2([]);
            setFastSlt2({ workdays2: false, pFiveAtndance2: false, pFiveLeave2: false });
            setDropdownVisible(false);
            console.log('llll');
          }}
        >
          1人天
        </Menu.Item>
      </Menu>
    );
    // 自定义单元格内容
    return (
      <Dropdown
        overlay={menu}
        trigger={['contextMenu']}
        visible={
          sltArr2.findIndex(x => x.isSame(d, 'day')) !== -1 &&
          sltArr2[sltArr2.length - 1].isSame(d, 'day')
            ? dropdownVisible
            : false
        }
        onVisibleChange={v =>
          sltArr2.findIndex(x => x.isSame(d, 'day')) !== -1 &&
          sltArr2[sltArr2.length - 1].isSame(d, 'day')
            ? setDropdownVisible(v)
            : {}
        }
        disabled={[...sltArr2].findIndex(y => y.isSame(d, 'day')) === -1}
      >
        <div
          className={
            'ant-fullcalendar-date' +
            (sltArr2.findIndex(x => x.isSame(d, 'day')) !== -1
              ? ' ant-fullcalendar-selected-day'
              : '')
          }
          onClick={() => {
            if (sltArr2.findIndex(x => x.isSame(d, 'day')) === -1) {
              setSltArr2(p => [...p, d]);
              setDropdownVisible(true);
            } else {
              setSltArr2(p => p.filter(x => !x.isSame(d, 'day')));
              setDropdownVisible(false);
            }
          }}
        >
          <div
            class="ant-fullcalendar-value"
            style={{
              textAlign: 'center',
              color:
                pFive2.findIndex(x => x.isSame(d, 'day')) !== -1
                  ? 'initial'
                  : one2.findIndex(x => x.isSame(d, 'day')) !== -1
                  ? '#fff'
                  : '',
              backgroundColor: one2.findIndex(x => x.isSame(d, 'day')) !== -1 ? '#77C8F9' : 'unset',
              backgroundImage:
                pFive2.findIndex(x => x.isSame(d, 'day')) !== -1
                  ? 'linear-gradient(to bottom, white 50%, #77C8F9 50%)'
                  : 'unset',
              boxShadow:
                sltArr2.findIndex(x => x.isSame(d, 'day')) !== -1 ? '0 0 0 1px #3361ff' : 'unset',
              border:
                sltArr2.findIndex(x => x.isSame(d, 'day')) !== -1 ? '1px solid #3361ff' : 'unset',
            }}
          >
            {d.date()}
          </div>
          <div class="ant-fullcalendar-content"></div>
        </div>
      </Dropdown>
    );
  };

  const getWeekdaysOfMonth = () => {
    const currentDate = moment();
    const firstDayOfMonth = currentDate.clone().startOf('month');
    const lastDayOfMonth = currentDate.clone().endOf('month');
    const weekdays = [];

    let currentDay = firstDayOfMonth;
    while (currentDay.isSameOrBefore(lastDayOfMonth)) {
      if (currentDay.day() !== 0 && currentDay.day() !== 6) {
        weekdays.push(currentDay.clone());
      }
      currentDay.add(1, 'day');
    }

    return weekdays;
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '40px 50px',
        }}
      >
        <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4, marginBottom: 16 }}>
          <Calendar fullscreen={false} dateFullCellRender={renderCell} />
        </div>
        <h2 style={{ width: 300, marginBottom: 8, lineHeight: '26px' }}>快捷选中</h2>
        <Row style={{ width: 300, marginBottom: 8 }}>
          <Checkbox
            checked={fastSlt.workdays}
            onChange={e => {
              setFastSlt({
                workdays: e.target.checked,
                pFiveAtndance: false,
                pFiveLeave: false,
              });
              // 调用函数获取本月所有工作日的 Moment 对象数组
              if (e.target.checked) {
                setSltArr(getWeekdaysOfMonth());
              } else {
                setSltArr([]);
              }
            }}
          >
            本月工作日
          </Checkbox>
        </Row>
        <Row style={{ width: 300, marginBottom: 8 }}>
          <Checkbox
            checked={fastSlt.pFiveAtndance}
            onChange={e => {
              setFastSlt({
                pFiveAtndance: e.target.checked,
                pFiveLeave: false,
                workdays: false,
              });
              // 调用函数获取本月所有工作日的 Moment 对象数组
              if (e.target.checked) {
                setSltArr(
                  [1, 7, 15, 22].map(date =>
                    moment()
                      .month(moment().month())
                      .date(date),
                  ),
                );
              } else {
                setSltArr([]);
              }
            }}
          >
            本月0.5人天出勤日（1，7，15，22）
          </Checkbox>
        </Row>
        <Row style={{ width: 300, marginBottom: 8 }}>
          <Checkbox
            checked={fastSlt.pFiveLeave}
            onChange={e => {
              setFastSlt({
                pFiveLeave: e.target.checked,
                pFiveAtndance: false,
                workdays: false,
              });
              // 调用函数获取本月所有工作日的 Moment 对象数组
              if (e.target.checked) {
                setSltArr(
                  [14, 16, 28].map(date =>
                    moment()
                      .month(moment().month())
                      .date(date),
                  ),
                );
              } else {
                setSltArr([]);
              }
            }}
          >
            本月0.5人天请假日（14，16，28）
          </Checkbox>
        </Row>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#fff',
          padding: '40px 50px',
        }}
      >
        <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4, marginBottom: 16 }}>
          <Calendar fullscreen={false} dateFullCellRender={renderCell2} />
        </div>
        <h2 style={{ width: 300, marginBottom: 8, lineHeight: '26px' }}>快捷选中</h2>
        <Row style={{ width: 300, marginBottom: 8 }}>
          <Checkbox
            checked={fastSlt2.workdays2}
            onChange={e => {
              setFastSlt2({
                workdays2: e.target.checked,
                pFiveAtndance2: false,
                pFiveLeave2: false,
              });
              // 调用函数获取本月所有工作日的 Moment 对象数组
              if (e.target.checked) {
                setSltArr2(getWeekdaysOfMonth());
                setDropdownVisible(true);
              } else {
                setSltArr2([]);
                setDropdownVisible(false);
              }
            }}
          >
            本月工作日
          </Checkbox>
        </Row>
        <Row style={{ width: 300, marginBottom: 8 }}>
          <Checkbox
            checked={fastSlt2.pFiveAtndance2}
            onChange={e => {
              setFastSlt2({
                pFiveAtndance2: e.target.checked,
                pFiveLeave2: false,
                workdays2: false,
              });
              // 调用函数获取本月所有工作日的 Moment 对象数组
              if (e.target.checked) {
                setSltArr2(
                  [1, 7, 15, 22].map(date =>
                    moment()
                      .month(moment().month())
                      .date(date),
                  ),
                );
                setDropdownVisible(true);
              } else {
                setSltArr2([]);
                setDropdownVisible(false);
              }
            }}
          >
            本月0.5人天出勤日（1，7，15，22）
          </Checkbox>
        </Row>
        <Row style={{ width: 300, marginBottom: 8 }}>
          <Checkbox
            checked={fastSlt2.pFiveLeave2}
            onChange={e => {
              setFastSlt2({
                pFiveLeave2: e.target.checked,
                pFiveAtndance2: false,
                workdays2: false,
              });
              // 调用函数获取本月所有工作日的 Moment 对象数组
              if (e.target.checked) {
                setSltArr2(
                  [14, 16, 28].map(date =>
                    moment()
                      .month(moment().month())
                      .date(date),
                  ),
                );
                setDropdownVisible(true);
              } else {
                setSltArr2([]);
                setDropdownVisible(false);
              }
            }}
          >
            本月0.5人天请假日（14，16，28）
          </Checkbox>
        </Row>
      </div>
    </div>
  );
}
