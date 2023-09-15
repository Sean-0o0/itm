import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Form,
  message,
  Modal,
  Spin,
  DatePicker,
  Input,
  Popconfirm,
  Calendar,
  Dropdown,
  Checkbox,
  Row,
  Menu,
} from 'antd';
import moment from 'moment';
import {
  InsertProjectAttendanceRcd,
  InsertProjectUpdateInfo,
  QueryMemberAttendanceRcd,
  QueryWeekday,
} from '../../../../../services/pmsServices';
const { TextArea } = Input;

export default function AttendanceRegister(props) {
  const { xmid, visible = false, setVisible, ZYXMKQLX = [], handlePromiseAll } = props;
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

  useEffect(() => {
    if (visible) {
      getCalendarData(
        LOGIN_USER_ID,
        Number(moment().format('YYYYMM')),
        Number(xmid),
        setIsSpinning,
      );
    }
    return () => {};
  }, [visible]);

  // 获取考勤信息
  const getCalendarData = async (memberId, month, projectId, fn = () => {}) => {
    try {
      fn(true);
      const atdCalendarResult = await QueryMemberAttendanceRcd({
        memberId,
        month,
        projectId,
        queryType: 'XQ',
      });
      if (atdCalendarResult.success) {
        const atdCalendarArr = JSON.parse(atdCalendarResult.result);
        const attendanceDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 3 || x.KQLX === 5)
          .map(x => moment(String(x.RQ)));
        const attendanceHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 1 || x.KQLX === 6)
          .map(x => moment(String(x.RQ)));
        const leaveDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 4)
          .map(x => moment(String(x.RQ)));
        const leaveHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 2)
          .map(x => moment(String(x.RQ)));
        const otherPrjArr = atdCalendarArr
          .filter(x => Number(x.XMMC) !== Number(xmid) && [3, 5, 4].includes(x.KQLX))
          .map(x => moment(String(x.RQ)));
        const otherPrjHalfArr = atdCalendarArr
          .filter(x => Number(x.XMMC) !== Number(xmid) && [1, 6, 2].includes(x.KQLX))
          .map(x => moment(String(x.RQ)));
        setOtherPrj({
          one: otherPrjArr,
          half: otherPrjHalfArr,
        });
        setConstData(
          attendanceDaysArr.concat(attendanceHalfDaysArr, leaveDaysArr, leaveHalfDaysArr),
        );
        getWorkdaysOfMonth(
          moment(String(month)),
          attendanceDaysArr.concat(attendanceHalfDaysArr, leaveDaysArr, leaveHalfDaysArr),
        );
        setData(p => ({
          ...p,
          attendance: attendanceDaysArr,
          attendanceHalf: attendanceHalfDaysArr,
          leave: leaveDaysArr,
          leaveHalf: leaveHalfDaysArr,
        }));
        fn(false);
      }
    } catch (e) {
      message.error('考勤信息获取失败', 1);
      console.error('获取考勤信息', e);
      fn(false);
    }
  };

  //提交数据
  const handleOk = () => {
    Modal.confirm({
      title: '提示',
      content: '该操作后数据将不能修改，是否确定保存？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setIsSpinning(true);
        const isInclude = (d, dArr = []) => {
          return dArr.findIndex(x => x.isSame(d, 'day')) !== -1;
        };
        let arr1 = data.attendance
          .filter(x => !isInclude(x, constData))
          .map(x => ({
            ID: '-1',
            YF: x.format('YYYYMM'),
            RQ: x.format('YYYYMMDD'),
            GS: '1',
            KQLX: isInclude(x, curWorkDays) ? '3' : '5', //加班
          }));
        let arr2 = data.attendanceHalf
          .filter(x => !isInclude(x, constData))
          .map(x => ({
            ID: '-1',
            YF: x.format('YYYYMM'),
            RQ: x.format('YYYYMMDD'),
            GS: '0.5',
            KQLX: isInclude(x, curWorkDays) ? '1' : '6', //加班
          }));
        let arr3 = data.leave
          .filter(x => !isInclude(x, constData))
          .map(x => ({
            ID: '-1',
            YF: x.format('YYYYMM'),
            RQ: x.format('YYYYMMDD'),
            GS: '0',
            KQLX: '4',
          }));
        let arr4 = data.leaveHalf
          .filter(x => !isInclude(x, constData))
          .map(x => ({
            ID: '-1',
            YF: x.format('YYYYMM'),
            RQ: x.format('YYYYMMDD'),
            GS: '0.5',
            KQLX: '2',
          }));
        const finalArr = arr1.concat(arr2, arr3, arr4);
        InsertProjectAttendanceRcd({
          count: finalArr.length,
          member: LOGIN_USER_ID,
          projectId: Number(xmid),
          records: JSON.stringify(finalArr),
        })
          .then(res => {
            if (res?.success) {
              message.success('操作成功', 1);
              handlePromiseAll();
              setIsSpinning(false);
              setVisible(false);
            }
          })
          .catch(e => {
            console.error('🚀InsertProjectUpdateInfo', e);
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
      },
    });
  };

  //取消
  const handleCancel = () => {
    setVisible(false);
    setData({
      selecting: [],
      attendance: [],
      attendanceHalf: [],
      leave: [],
      leaveHalf: [],
    });
    setFastSlt({
      workdays: false, //工作日
      normal: false, //无工时日期
      reverse: false, //反选
    });
  };

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
          console.log('🚀 ~ file: index.js:211 ~ getWorkdaysOfMonth', arr);
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

  //日期单元格
  const renderCell = d => {
    //是否包括这天
    const isInclude = (d, dArr = []) => {
      return dArr.findIndex(x => x.isSame(d, 'day')) !== -1;
    };

    //菜单配置
    const menu = () => {
      const handleItemClick = key => {
        //     attendance: [],
        // attendanceHalf: [],
        // leave: [],
        // leaveHalf: [],
        switch (key) {
          case '0':
            setData(p => ({
              selecting: [],
              attendance: p.attendance.filter(x => !isInclude(x, p.selecting)),
              attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, p.selecting)),
              leave: p.leave.filter(x => !isInclude(x, p.selecting)),
              leaveHalf: p.leaveHalf.filter(x => !isInclude(x, p.selecting)),
            }));
            break;
          case '1':
            setData(p => ({
              selecting: [],
              attendance: p.attendance.filter(x => !isInclude(x, p.selecting)),
              attendanceHalf: [...p.attendanceHalf, ...p.selecting],
              leave: p.leave.filter(x => !isInclude(x, p.selecting)),
              leaveHalf: p.leaveHalf.filter(x => !isInclude(x, p.selecting)),
            }));
            break;
          case '2':
            setData(p => ({
              selecting: [],
              attendance: p.attendance.filter(x => !isInclude(x, p.selecting)),
              attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, p.selecting)),
              leave: p.leave.filter(x => !isInclude(x, p.selecting)),
              leaveHalf: [...p.leaveHalf, ...p.selecting],
            }));
            break;
          case '3':
            setData(p => ({
              selecting: [],
              attendance: [...p.attendance, ...p.selecting],
              attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, p.selecting)),
              leave: p.leave.filter(x => !isInclude(x, p.selecting)),
              leaveHalf: p.leaveHalf.filter(x => !isInclude(x, p.selecting)),
            }));
            break;
          case '4':
            setData(p => ({
              selecting: [],
              attendance: p.attendance.filter(x => !isInclude(x, p.selecting)),
              attendanceHalf: p.attendanceHalf.filter(x => !isInclude(x, p.selecting)),
              leave: [...p.leave, ...p.selecting],
              leaveHalf: p.leaveHalf.filter(x => !isInclude(x, p.selecting)),
            }));
            break;
          default:
            break;
        }
        setFastSlt({ workdays: false, normal: false, reverse: false });
        setDropdownVisible(false);
      };
      let menuData = ZYXMKQLX.filter(x => x.ibm !== '5' && x.ibm !== '6') || [];
      if (
        !isInclude(
          d,
          data.attendance.concat(data.attendanceHalf, data.leave, data.leaveHalf, constData),
        )
      )
        menuData = menuData.filter(x => x.ibm !== '0');
      if (isInclude(d, data.attendanceHalf.concat(constData)))
        menuData = menuData.filter(x => x.ibm !== '1');
      if (isInclude(d, data.leaveHalf.concat(constData)))
        menuData = menuData.filter(x => x.ibm !== '2');
      if (isInclude(d, data.attendance.concat(constData)))
        menuData = menuData.filter(x => x.ibm !== '3');
      if (isInclude(d, data.leave.concat(constData)))
        menuData = menuData.filter(x => x.ibm !== '4');
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

    //下拉显隐
    const onVisibleChange = v =>
      isInclude(d, data.selecting) && data.selecting[data.selecting.length - 1].isSame(d, 'day')
        ? setDropdownVisible(v)
        : setDropdownVisible(v);

    //日期选择
    const handleSelecting = () => {
      if (!isInclude(d, constData)) {
        if (isInclude(d, data.selecting)) {
          setData(p => ({ ...p, selecting: p.selecting.filter(x => !x.isSame(d, 'day')) }));
          setDropdownVisible(false);
        } else {
          setData(p => ({ ...p, selecting: [...p.selecting, d] }));
          setDropdownVisible(true);
        }
      } else {
        message.warn('无法操作已经保存的日期', 1);
      }
    };

    return (
      <Dropdown
        overlay={menu}
        trigger={['contextMenu']}
        visible={
          isInclude(d, data.selecting) && data.selecting[data.selecting.length - 1].isSame(d, 'day')
            ? dropdownVisible
            : false
        }
        onVisibleChange={onVisibleChange}
        disabled={!isInclude(d, data.selecting)}
      >
        <div
          className={
            'ant-fullcalendar-date' +
            (isInclude(d, data.selecting) ? ' ant-fullcalendar-selected-day' : '')
          }
          onClick={handleSelecting}
        >
          <div
            className="ant-fullcalendar-value"
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
            {isInclude(d, data.selecting) && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: '#3361ff',
                  margin: '2px auto',
                }}
              ></div>
            )}
          </div>
          <div className="ant-fullcalendar-content"></div>
        </div>
      </Dropdown>
    );
  };

  //快速选择
  const getFastSlt = () => {
    return (
      <div className="fast-slt">
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
            <Checkbox
              checked={fastSlt.workdays}
              onChange={e => {
                setFastSlt({
                  workdays: e.target.checked,
                  normal: false,
                  reverse: false,
                });
                // 调用函数获取本月所有工作日的 Moment 对象数组
                if (e.target.checked) {
                  setData(p => ({ ...p, selecting: curWorkDays }));
                  setDropdownVisible(true);
                } else {
                  setData(p => ({ ...p, selecting: [] }));
                  setDropdownVisible(false);
                }
              }}
            >
              本月工作日
            </Checkbox>
          </div>
          <div className="check-row">
            <Checkbox
              checked={fastSlt.normal}
              onChange={e => {
                setFastSlt({
                  workdays: false,
                  normal: e.target.checked,
                  reverse: false,
                });
                // 调用函数获取本月所有工作日的 Moment 对象数组
                if (e.target.checked) {
                  setData(p => ({
                    ...p,
                    selecting: getFilteredDays(
                      data.attendance.concat(
                        data.attendanceHalf,
                        data.leave,
                        data.leaveHalf,
                        constData,
                      ),
                    ),
                  }));
                  setDropdownVisible(true);
                } else {
                  setData(p => ({ ...p, selecting: [] }));
                  setDropdownVisible(false);
                }
              }}
            >
              本月无工时日期
            </Checkbox>
          </div>
          {data.selecting?.length > 0 && (
            <div className="check-row">
              <Checkbox
                checked={fastSlt.reverse}
                onChange={e => {
                  setFastSlt({
                    workdays: false,
                    normal: false,
                    reverse: e.target.checked,
                  });
                  // 调用函数获取本月所有工作日的 Moment 对象数组
                  if (e.target.checked) {
                    setData(p => ({
                      ...p,
                      selecting: getFilteredDays([...p.selecting, ...constData]),
                    }));
                    setDropdownVisible(true);
                  } else {
                    setData(p => ({ ...p, selecting: [] }));
                    setDropdownVisible(false);
                  }
                }}
              >
                本月反选
              </Checkbox>
            </div>
          )}
        </div>
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
    <Modal
      wrapClassName="editMessage-modify attendance-register-modal"
      width={600}
      maskClosable={false}
      style={{ top: 10 }}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      title={null}
      visible={visible}
      destroyOnClose={true}
      onCancel={handleCancel}
      footer={
        <div className="modal-footer">
          <Button className="btn-default" onClick={handleCancel}>
            取消
          </Button>
          <Button loading={isSpinning} className="btn-primary" type="primary" onClick={handleOk}>
            {constData.length > 0 ? '更新' : '保存'}
          </Button>
        </div>
      }
    >
      <div className="body-title-box">
        <strong>考勤登记</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <div className="content">
          <div className="left-calendar">
            <div className="calendar-box">
              <Calendar
                onPanelChange={onPanelChange}
                fullscreen={false}
                dateFullCellRender={renderCell}
              />
            </div>
          </div>
          {getFastSlt()}
        </div>
      </Spin>
    </Modal>
  );
}
