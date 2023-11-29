import React, { useRef, useLayoutEffect, useState, useMemo, useEffect } from 'react';
import { message, Calendar, Dropdown, Checkbox, Menu, Button, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import {
//   QueryMemberAttendanceRcd,
//   QueryWeekday,
// } from '../../../../../services/pmsServices';
import { throttle, debounce } from 'lodash';
import { QueryWeekday } from '../../../services/pmsServices';
import { is } from 'immutable';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(function TestPage(props) {
  const { xmid, visible = false, dictionary = {} } = props;
  const { ZYXMKQLX = [] } = dictionary;
  const [data, setData] = useState({
    selecting: [],
    attendance: [],
    attendanceHalf: [],
    leave: [],
    leaveHalf: [],
  }); //选中数据
  const [fastSlt, setFastSlt] = useState({
    workdays: false, //工作日
    normal: false, //无工时日期
    reverse: false, //反选
  }); //快速选择
  const [dropdownVisible, setDropdownVisible] = useState(false); //下拉菜单显隐
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [constData, setConstData] = useState([]); //不可修改的回显数据
  let LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user')).id);
  const [otherPrj, setOtherPrj] = useState({
    one: [],
    half: [],
  }); //其他项目的
  const [curWorkDays, setCurWorkDays] = useState([]); //当月工作日
  const [coordinate, setCoordinate] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  }); //坐标
  const [boxData, setBoxData] = useState({
    left: 0,
    top: 0,
  }); //外层盒子数据
  const [showRect, setShowRect] = useState(false); //是否显示选框
  const [singleSlt, setSinglrSlt] = useState(true); //是否单选

  //选框 宽高 坐标
  const rectWidth = useMemo(() => `${Math.abs(coordinate.endX - coordinate.startX)}px`, [
    coordinate.endX,
    coordinate.startX,
  ]);
  const rectHeight = useMemo(() => `${Math.abs(coordinate.endY - coordinate.startY)}px`, [
    coordinate.endY,
    coordinate.startY,
  ]);
  const rectLeft = useMemo(
    () => `${Math.min(coordinate.startX, coordinate.endX) - boxData.left}px`,
    [coordinate.endX, coordinate.startX, boxData.left],
  );
  const rectTop = useMemo(() => `${Math.min(coordinate.startY, coordinate.endY) - boxData.top}px`, [
    coordinate.endY,
    coordinate.startY,
    boxData.top,
  ]);

  useLayoutEffect(() => {
    let nodeBox = document.getElementsByClassName('ant-fullcalendar-tbody')[0] || {};
    let sltRect = document.createElement('tr') || { style: {} };
    sltRect.id = 'slt-rect';
    sltRect.style.width = 0;
    sltRect.style.height = 0;
    sltRect.style.left = 0;
    sltRect.style.top = 0;
    nodeBox.appendChild(sltRect);
    nodeBox.onmousedown = handleMouseDown;
    setBoxData({
      left: nodeBox.getBoundingClientRect().left,
      top: nodeBox.getBoundingClientRect().top,
    });
    getWorkdaysOfMonth(moment(), constData);
    return () => {};
  }, []);

  useEffect(() => {
    let sltRect = document.getElementById('slt-rect') || { style: {} };
    sltRect.style.width = rectWidth || 0;
    sltRect.style.height = rectHeight || 0;
    sltRect.style.left = rectLeft || 0;
    sltRect.style.top = rectTop || 0;
    // console.log('🚀 ~ file: index.js:71 ~ useLayoutEffect ~ rectHeight:', sltRect);
    return () => {};
  }, [JSON.stringify(coordinate)]);

  useEffect(() => {
    if (data.selecting.length > 0) {
      console.log('🚀 ~ file: index.js:102 ~ useEffect ~ data.selecting:', data.selecting);
      openDropdown();
    }
    return () => {};
  }, [data.selecting]);

  useEffect(() => {
    console.log('🚀 ~ attendanceHalf:', data.attendanceHalf);

    return () => {};
  }, [data.attendanceHalf]);

  //开启下拉菜单
  const openDropdown = debounce(() => {
    setDropdownVisible(true);
  }, 200);

  //工作日
  const getWorkdaysOfMonth = (currentDate = moment(), constData = []) => {
    let currentDay = currentDate.clone().startOf('month');
    QueryWeekday({
      begin: Number(currentDay.format('YYYYMMDD')),
      days: 31,
      queryType: 'ALL',
    })
      .then(res => {
        if (res?.success) {
          let arr = JSON.parse(res.result)
            .map(x => moment(String(x.GZR)))
            .filter(x => x.month() === currentDate.month())
            .filter(x => constData.findIndex(y => y.isSame(x, 'day')) === -1);
          setCurWorkDays(arr);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀QueryWeekday', e);
        message.error('工作日查询失败', 1);
        setIsSpinning(false);
      });
  };

  //无工时 反选
  const getFilteredDays = (removeArr = []) => {
    // 获取当前月份的日期数量
    const daysInMonth = moment().daysInMonth();

    // 生成本月所有日期的数组
    const allDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      allDates.push(i);
    }

    // 过滤掉数组 removeArr 中的日期
    const filteredDates = allDates.filter(date => {
      const momentDate = moment().date(date);
      return !removeArr.some(momentObj => momentDate.isSame(momentObj, 'date'));
    });

    // 生成对应的 moment 对象数组
    const momentArray = filteredDates.map(date => moment().date(date));

    return momentArray;
  };

  //鼠标左键按下方法
  const handleMouseDown = event => {
    if (event.button === 0) {
      //鼠标左键
      let divElement = document.getElementById('slt-rect');
      divElement.style.visibility = 'visible';
      setShowRect(true);
      // console.log('handleMouseDown', event.button);
      setCoordinate(p => ({
        startX: event.clientX,
        startY: event.clientY,
        endX: event.clientX,
        endY: event.clientY,
      }));
      document.body.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('mouseup', handleMouseUp);
    } else {
      event.preventDefault();
      return false;
    }
  };

  const handleMouseMove = event => {
    setCoordinate(p => ({ ...p, endX: event.clientX, endY: event.clientY }));
  };

  //鼠标左键抬起方法
  const handleMouseUp = event => {
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseup', handleMouseUp);
    let divElement = document.getElementById('slt-rect');
    divElement.style.visibility = 'hidden';
    setShowRect(false);
    handleDomSelect();
    setCoordinate({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    });
  };

  //处理选中逻辑
  const handleDomSelect = () => {
    const domMask = document.querySelector('#slt-rect');
    const rectSelect = domMask.getClientRects()[0];
    //是否包括这天
    const isInclude = (d, dArr = []) => {
      return dArr.findIndex(x => x.isSame(d, 'day')) !== -1;
    };
    // console.log('@@@handleDomSelect', data.selecting);
    document.querySelectorAll('.ant-fullcalendar-value-wrapper').forEach((node, index) => {
      const rects = node.getClientRects()[0];
      if (collide(rects, rectSelect) === true) {
        let d = moment(node.attributes.title.value);
        if (!isInclude(d, constData)) {
          setData(p => {
            if (isInclude(d, p.selecting))
              return { ...p, selecting: p.selecting.filter(x => !x.isSame(d, 'day')) };
            return { ...p, selecting: [...p.selecting, d] };
          });
        } else {
          message.warn('无法操作已经保存的日期', 1);
        }
      }
    });
  };

  // eslint-disable-next-line class-methods-use-this
  function collide(rect1, rect2) {
    const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
    const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
    const minX = Math.min(rect1.x, rect2.x);
    const minY = Math.min(rect1.y, rect2.y);
    if (maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height) {
      return true;
    } else {
      return false;
    }
  }

  //是否包括这天
  const isInclude = (d, dArr = []) => {
    return dArr.findIndex(x => x.isSame(d, 'day')) !== -1;
  };

  //菜单配置
  const menu = ({ type = 'menu', selecting = data.selecting }) => {
    const handleItemClick = key => {
      switch (key) {
        case '0':
          setData(p => ({
            selecting: [],
            attendance: p.attendance.filter(x => !isInclude(x, selecting)),
            attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, selecting)),
            leave: p.leave.filter(x => !isInclude(x, selecting)),
            leaveHalf: p.leaveHalf.filter(x => !isInclude(x, selecting)),
          }));
          break;
        case '1':
          setData(p => ({
            selecting: [],
            attendance: p.attendance.filter(x => !isInclude(x, selecting)),
            attendanceHalf: [...p.attendanceHalf, ...selecting],
            leave: p.leave.filter(x => !isInclude(x, selecting)),
            leaveHalf: p.leaveHalf.filter(x => !isInclude(x, selecting)),
          }));
          break;
        case '2':
          setData(p => ({
            selecting: [],
            attendance: p.attendance.filter(x => !isInclude(x, selecting)),
            attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, selecting)),
            leave: p.leave.filter(x => !isInclude(x, selecting)),
            leaveHalf: [...p.leaveHalf, ...selecting],
          }));
          break;
        case '3':
          setData(p => ({
            selecting: [],
            attendance: [...p.attendance, ...selecting],
            attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, selecting)),
            leave: p.leave.filter(x => !isInclude(x, selecting)),
            leaveHalf: p.leaveHalf.filter(x => !isInclude(x, selecting)),
          }));
          break;
        case '4':
          setData(p => ({
            selecting: [],
            attendance: p.attendance.filter(x => !isInclude(x, selecting)),
            attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, selecting)),
            leave: [...p.leave, ...selecting],
            leaveHalf: p.leaveHalf.filter(x => !isInclude(x, selecting)),
          }));
          break;
        default:
          break;
      }
      setFastSlt({ workdays: false, normal: false, reverse: false });
    };

    let menuData = ZYXMKQLX.filter(x => x.ibm !== '5' && x.ibm !== '6') || [];
    let sltTypes = data.selecting.reduce(
      (acc, cur) =>
        !acc.includes('3') && isInclude(cur, data.attendance)
          ? [...acc, '3']
          : !acc.includes('4') && isInclude(cur, data.leave)
          ? [...acc, '4']
          : !acc.includes('2') && isInclude(cur, data.leaveHalf)
          ? [...acc, '2']
          : !acc.includes('1') && isInclude(cur, data.attendanceHalf)
          ? [...acc, '1']
          : !acc.includes('0') &&
            !isInclude(cur, data.attendance.concat(data.attendanceHalf, data.leave, data.leaveHalf))
          ? [...acc, '0']
          : acc,
      [],
    );
    // console.log('🚀 ~ file: index.js:318 ~ menu ~ sltTypes:', sltTypes);
    if (sltTypes.length === 1) {
      if (sltTypes[0] === '0') menuData = menuData.filter(x => x.ibm !== '0');
      if (sltTypes[0] === '1') menuData = menuData.filter(x => x.ibm !== '1');
      if (sltTypes[0] === '2') menuData = menuData.filter(x => x.ibm !== '2');
      if (sltTypes[0] === '3') menuData = menuData.filter(x => x.ibm !== '3');
      if (sltTypes[0] === '4') menuData = menuData.filter(x => x.ibm !== '4');
    }
    if (type === 'radio')
      return (
        <Radio.Group onChange={e => handleItemClick(e.target.value)}>
          {menuData.map(x => (
            <Radio key={x.ibm} value={x.ibm}>
              {x.note}
            </Radio>
          ))}
        </Radio.Group>
      );
    return (
      <Menu>
        {menuData.map(x => (
          <Menu.Item key={x.ibm} onClick={() => handleItemClick(x.ibm)}>
            {x.note}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  //日期单元格
  const renderCell = d => {
    //下拉显隐
    const onVisibleChange = v =>
      isInclude(d, data.selecting) && data.selecting[data.selecting.length - 1].isSame(d, 'day')
        ? setDropdownVisible(v)
        : setDropdownVisible(v);

    //日期选择
    const handleSelecting = e => {
      if (!isInclude(d, constData)) {
        if (isInclude(d, data.selecting)) {
          setData(p => ({ ...p, selecting: p.selecting.filter(x => !x.isSame(d, 'day')) }));
          setDropdownVisible(false);
        } else {
          setData(p => ({ ...p, selecting: [...p.selecting, d] }));
          setDropdownVisible(false);
        }
      } else {
        message.warn('无法操作已经保存的日期', 1);
      }
    };

    return (
      // <Dropdown
      //   overlay={menu}
      //   trigger={['contextMenu']}
      //   visible={
      //     isInclude(d, data.selecting) && data.selecting[data.selecting.length - 1].isSame(d, 'day')
      //       ? dropdownVisible
      //       : false
      //   }
      //   onVisibleChange={onVisibleChange}
      //   disabled={!isInclude(d, data.selecting)}
      // >
      <div
        className={
          'ant-fullcalendar-date' +
          (isInclude(d, data.selecting) ? ' ant-fullcalendar-selected-day' : '')
        }
      >
        <div
          className="ant-fullcalendar-value-wrapper"
          title={d.format('YYYYMMDD')}
          style={
            isInclude(d, data.selecting)
              ? { border: '1px solid #3361ff', boxShadow: '0 0 0 1px #3361ff' }
              : { width: 24, height: 24 }
          }
        >
          <div
            className="ant-fullcalendar-value"
            // onClick={handleSelecting}
            style={{
              textAlign: 'center',
              color:
                isInclude(d, data.attendance) ||
                isInclude(d, data.leave) ||
                isInclude(d, otherPrj.one)
                  ? '#fff'
                  : '',
              backgroundColor: isInclude(d, otherPrj.one)
                ? '#d7d7d7'
                : isInclude(d, data.attendance)
                ? '#3361FF'
                : isInclude(d, data.leave)
                ? '#FF2F31'
                : 'unset',
              border: isInclude(d, data.selecting) ? '1px solid #fff' : 'unset',
              lineHeight: isInclude(d, data.selecting) ? '20px' : '21px',
              backgroundImage: isInclude(d, otherPrj.half)
                ? 'linear-gradient(to bottom, white 50%, #d7d7d7 50%)'
                : isInclude(d, data.attendanceHalf)
                ? 'linear-gradient(to bottom, white 50%, #3361FF 50%)'
                : isInclude(d, data.leaveHalf)
                ? 'linear-gradient(to bottom, white 50%, #FF2F31 50%)'
                : 'unset',
            }}
          >
            {d.date()}
          </div>
        </div>
        <div className="ant-fullcalendar-content"></div>
      </div>
      // </Dropdown>
    );
  };

  // 检查数组的每个元素是否为当前月份
  const allInCurrentMonth = (momentsArr = []) =>
    momentsArr.every(m => {
      const currentMonth = moment().month(); // 获取当前月份
      return m.month() === currentMonth;
    });

  //快速选择
  const getFastSlt = () => {
    //快速选择下拉菜单
    const FSDropdown = ({ children = null, menu }) => {
      return (
        <Dropdown overlay={menu} trigger={['click']}>
          {children}
        </Dropdown>
      );
    };

    return (
      <div className="fast-slt" style={{ height: 'unset' }}>
        <div className="legend-box">
          {/* <h3>图例</h3> */}
          <div className="legend-row">
            <div className="legend-item">
              <div className="legend-rec"></div>
              出勤
            </div>
            <div className="legend-item">
              <div className="legend-rec-red"></div>
              请假
            </div>
            <div className="legend-item">
              <div className="legend-rec-grey"></div>
              其他项目
            </div>
          </div>
        </div>
        <div className="slt-row">
          <h3>快捷选择</h3>
          <div className="check-row">
            <FSDropdown menu={() => menu({ selecting: curWorkDays })}>
              <Button type="primary">本月工作日</Button>
            </FSDropdown>
          </div>
          <div className="check-row">
            <FSDropdown
              menu={() =>
                menu({
                  selecting: getFilteredDays(
                    data.attendance.concat(
                      data.attendanceHalf,
                      data.leave,
                      data.leaveHalf,
                      constData,
                    ),
                  ),
                })
              }
            >
              <Button type="primary">本月无工时日期</Button>
            </FSDropdown>
          </div>
          {data.selecting?.length > 0 && (
            <div className="check-row">
              <FSDropdown
                menu={() => menu({ selecting: getFilteredDays([...data.selecting, ...constData]) })}
              >
                <Button type="primary">本月反选</Button>
              </FSDropdown>
            </div>
          )}
        </div>
        {data.selecting.length > 0 && (
          <div className="radio-row">
            <h3>登记选项</h3>
            {menu({ type: 'radio' })}
          </div>
        )}
      </div>
    );
  };

  //日期面板变化回调
  const onPanelChange = date => {
    getCalendarData(LOGIN_USER_ID, Number(date.format('YYYYMM')), Number(xmid), setIsSpinning);
    setData(p => ({
      ...p,
      selecting: [],
    }));
    setFastSlt({
      workdays: false, //工作日
      normal: false, //无工时日期
      reverse: false, //反选
    });
  };

  return (
    <div
      className="attendance-register-modal"
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div className="content" style={{ width: 650 }}>
        <div className="left-calendar">
          <div className="calendar-box">
            {/* {showRect && <div id="slt-rect" style={{ width: rectWidth, height: rectHeight }}></div>} */}
            <Calendar
              // onPanelChange={onPanelChange}
              fullscreen={false}
              dateFullCellRender={renderCell}
            />
          </div>
        </div>
        {getFastSlt()}
      </div>
    </div>
  );
});
