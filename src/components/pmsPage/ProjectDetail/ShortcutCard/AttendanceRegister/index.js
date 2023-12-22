import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  Button,
  message,
  Modal,
  Spin,
  Input,
  Popconfirm,
  Checkbox,
  Icon,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd';
import moment from 'moment';
import {
  InsertProjectAttendanceRcd,
  QueryMemberAttendanceRcd,
  QueryWeekday,
} from '../../../../../services/pmsServices';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid'; // for dayGridMonth view
import locale from '@fullcalendar/core/locales/zh-cn'; //for Chinese local
import RadioSltModal from './RadioSltModal';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'moment/locale/zh-cn';

export default function AttendanceRegister(props) {
  const { xmid, visible = false, setVisible, ZYXMKQLX = [], handlePromiseAll } = props;
  const [data, setData] = useState({
    selecting: [],
    attendance: [],
    attendanceHalf: [],
    leave: [],
    leaveHalf: [],
    overtime: [],
    overtimeHalf: [],
    otherPrj: [],
    otherPrjHalf: [],
  }); //选中数据
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [constData, setConstData] = useState([]); //不可修改的回显数据
  let LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user')).id);
  const [fastSlting, setFastSlting] = useState([]); //快速选中的，不连续的
  const [curWorkDays, setCurWorkDays] = useState([]); //当月工作日
  const [curNonWorkDays, setCurNonWorkDays] = useState([]); //当月非工作日
  const [curAllDays, setCurAllDays] = useState([]); //当月所有
  const [modalVisible, setModalVisible] = useState(false); //登记内容弹窗显隐
  const [radioValue, setRadioValue] = useState({
    type: 1,
    time: 1,
  }); //登记内容单选情况
  const calendarRef = useRef(null);
  const [fullAtdData, setFullAtdData] = useState({
    checked: false,
    originData: {},
  }); //一键全勤
  const selectedData = useMemo(
    () =>
      data.attendance.concat(
        data.attendanceHalf,
        data.leave,
        data.leaveHalf,
        data.overtime,
        data.overtimeHalf,
      ),
    [JSON.stringify(data)],
  ); // 已选择的数据

  useEffect(() => {
    if (visible) {
      setIsSpinning(true);
      getCalendarData(LOGIN_USER_ID, Number(moment().format('YYYYMM')), Number(xmid), () => {});
    }
    if (calendarRef !== null && visible) {
      setTimeout(() => {
        calendarRef.current?.getApi().updateSize();
        setIsSpinning(false);
      }, 500);
    }
    return () => {};
  }, [visible, calendarRef]);

  useEffect(() => {
    if (calendarRef !== null && !modalVisible) {
      calendarRef.current?.getApi().unselect();
    }
    return () => {};
  }, [modalVisible, calendarRef]);

  // 获取考勤信息 - 初始化数据
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
        const constDataArr = atdCalendarArr.map(x => moment(String(x.RQ)).format('YYYY-MM-DD'));
        // console.log('🚀 ~ file: index.js:145 ~ getCalendarData ~ constDataArr:', constDataArr);
        const attendanceDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 3 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)).format('YYYY-MM-DD'));
        const attendanceHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 1 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)).format('YYYY-MM-DD'));
        const leaveDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 4 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)).format('YYYY-MM-DD'));
        const leaveHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 2 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)).format('YYYY-MM-DD'));
        const overtimeDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 5 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)).format('YYYY-MM-DD'));
        const overtimeHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 6 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)).format('YYYY-MM-DD'));
        const otherPrjArr = atdCalendarArr
          .filter(x => Number(x.XMMC) !== Number(xmid) && [3, 5, 4].includes(x.KQLX))
          .map(x => ({ ...x, RQ: moment(String(x.RQ)).format('YYYY-MM-DD') }));
        const otherPrjHalfArr = atdCalendarArr
          .filter(x => Number(x.XMMC) !== Number(xmid) && [1, 6, 2].includes(x.KQLX))
          .map(x => ({ ...x, RQ: moment(String(x.RQ)).format('YYYY-MM-DD') }));

        setConstData(constDataArr);
        getWorkdaysOfMonth(moment(String(month)), constDataArr, fn);
        setData(p => ({
          ...p,
          attendance: attendanceDaysArr,
          attendanceHalf: attendanceHalfDaysArr,
          leave: leaveDaysArr,
          leaveHalf: leaveHalfDaysArr,
          overtime: overtimeDaysArr,
          overtimeHalf: overtimeHalfDaysArr,
          otherPrj: otherPrjArr,
          otherPrjHalf: otherPrjHalfArr,
        }));
      }
    } catch (e) {
      message.error('考勤信息获取失败', 1);
      console.error('获取考勤信息', e);
      setIsSpinning(false);
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
        const getMonth = x => {
          return moment(x, 'YYYY-MM-DD').format('YYYYMM');
        };
        const getDate = x => {
          return moment(x, 'YYYY-MM-DD').format('YYYYMMDD');
        };
        let arr1 = data.attendance
          .filter(x => !constData.includes(x))
          .map(x => ({
            ID: '-1',
            YF: getMonth(x),
            RQ: getDate(x),
            GS: '1',
            KQLX: '3',
          }));
        let arr2 = data.attendanceHalf
          .filter(x => !constData.includes(x))
          .map(x => ({
            ID: '-1',
            YF: getMonth(x),
            RQ: getDate(x),
            GS: '0.5',
            KQLX: '1',
          }));
        let arr3 = data.leave
          .filter(x => !constData.includes(x))
          .map(x => ({
            ID: '-1',
            YF: getMonth(x),
            RQ: getDate(x),
            GS: '0',
            KQLX: '4',
          }));
        let arr4 = data.leaveHalf
          .filter(x => !constData.includes(x))
          .map(x => ({
            ID: '-1',
            YF: getMonth(x),
            RQ: getDate(x),
            GS: '0.5',
            KQLX: '2',
          }));
        let arr5 = data.overtime
          .filter(x => !constData.includes(x))
          .map(x => ({
            ID: '-1',
            YF: getMonth(x),
            RQ: getDate(x),
            GS: '1',
            KQLX: '5', //加班
          }));
        let arr6 = data.overtimeHalf
          .filter(x => !constData.includes(x))
          .map(x => ({
            ID: '-1',
            YF: getMonth(x),
            RQ: getDate(x),
            GS: '0.5',
            KQLX: '6', //加班
          }));
        const finalArr = arr1.concat(arr2, arr3, arr4, arr5, arr6);
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
              handleCancel();
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
      overtime: [],
      overtimeHalf: [],
      otherPrj: [],
      otherPrjHalf: [],
    });
    setFullAtdData({
      checked: false,
      originData: {},
    });
  };

  //当月工作日、当月非工作日、当月所有
  const getWorkdaysOfMonth = (currentDate = moment(), constData = [], fn = () => {}) => {
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
            .map(x => moment(x).format('YYYY-MM-DD'))
            .filter(x => !constData.includes(x));
          const numDays = currentDay.daysInMonth();
          const allDays = [];
          for (let i = 0; i < numDays; i++) {
            allDays[i] = currentDay
              .clone()
              .add(i, 'days')
              .format('YYYY-MM-DD');
          }
          setCurWorkDays(arr);
          setCurAllDays(allDays.filter(x => !constData.includes(x)));
          setCurNonWorkDays(
            allDays.filter(x => !arr.includes(x)).filter(x => !constData.includes(x)),
          );
          fn(false);
        }
      })
      .catch(e => {
        console.error('🚀QueryWeekday', e);
        message.error('工作日查询失败', 1);
        setIsSpinning(false);
      });
  };

  //日期面板变化回调
  const onPanelChange = date => {
    getCalendarData(LOGIN_USER_ID, Number(date.format('YYYYMM')), Number(xmid), setIsSpinning);
    setData(p => ({
      ...p,
      selecting: [],
    }));
    setFullAtdData({
      checked: false,
      originData: {},
    });
  };

  //不同情况的显示
  const events = useMemo(
    () => [
      ...data.attendance.map(x => ({
        title: '出勤',
        start: x,
        display: 'background',
        className: 'attendance' + (constData.includes(x) ? ' const-lock' : ''),
      })),
      ...data.attendanceHalf.map(x => ({
        title: '出勤半天',
        start: x,
        display: 'background',
        className: 'attendance-half' + (constData.includes(x) ? ' const-lock' : ''),
      })),
      ...data.leave.map(x => ({
        title: '请假',
        start: x,
        display: 'background',
        className: 'leave' + (constData.includes(x) ? ' const-lock' : ''),
      })),
      ...data.leaveHalf.map(x => ({
        title: '请假半天',
        start: x,
        display: 'background',
        className: 'leave-half' + (constData.includes(x) ? ' const-lock' : ''),
      })),
      ...data.overtime.map(x => ({
        title: '加班',
        start: x,
        display: 'background',
        className: 'overtime' + (constData.includes(x) ? ' const-lock' : ''),
      })),
      ...data.overtimeHalf.map(x => ({
        title: '加班半天',
        start: x,
        display: 'background',
        className: 'overtime-half' + (constData.includes(x) ? ' const-lock' : ''),
      })),
      ...data.otherPrj.map(x => ({
        title: '其他项目',
        start: x.RQ,
        display: 'background',
        className: 'other-prj' + (constData.includes(x.RQ) ? ' const-lock' : ''),
        extendedProps: {
          ...x,
        },
      })),
      ...data.otherPrjHalf.map(x => ({
        title: '其他项目',
        start: x.RQ,
        display: 'background',
        className: 'other-prj-half' + (constData.includes(x.RQ) ? ' const-lock' : ''),
        extendedProps: {
          ...x,
          half: true,
        },
      })),
      //模拟选中
      ...fastSlting.map(x => ({
        title: '',
        start: x,
        display: 'background',
        className: 'fc-highlight',
      })),
    ],
    [
      JSON.stringify(data),
      JSON.stringify(fastSlting),
      JSON.stringify(constData),
      JSON.stringify(fastSlting),
    ],
  );

  //模拟选中事件
  const handleFastSlting = (dateArr = []) => {
    setFastSlting(dateArr);
    setData(p => ({ ...p, selecting: dateArr }));
    setModalVisible(true);
  };

  //筛选日期下拉框
  const menu = (
    <Menu>
      <Menu.Item
        key="剩余工作日"
        onClick={() => {
          handleFastSlting(curWorkDays.filter(x => !selectedData.includes(x)));
        }}
        disabled={curWorkDays.filter(x => !selectedData.includes(x)).length === 0}
      >
        剩余工作日
      </Menu.Item>
      <Menu.Item
        key="剩余非工作日"
        onClick={() => {
          handleFastSlting(curNonWorkDays.filter(x => !selectedData.includes(x)));
        }}
        disabled={curNonWorkDays.filter(x => !selectedData.includes(x)).length === 0}
      >
        剩余非工作日
      </Menu.Item>
      <Menu.Item
        key="剩余日期全选"
        onClick={() => {
          handleFastSlting(curAllDays.filter(x => !selectedData.includes(x)));
        }}
        disabled={curAllDays.filter(x => !selectedData.includes(x)).length === 0}
      >
        剩余日期全选
      </Menu.Item>
    </Menu>
  );

  //选中事件
  const onCalendarSlt = useCallback(
    async info => {
      const startDate = moment(info.startStr, 'YYYY-MM-DD');
      const endDate = moment(info.endStr, 'YYYY-MM-DD');
      const diff = endDate.diff(startDate, 'days'); // 计算天数差
      const dateArr = []; // 日期数组，初始为空
      for (let i = 0; i < diff; i++) {
        const currentDate = startDate
          .clone()
          .add(i, 'days')
          .format('YYYY-MM-DD');
        dateArr.push(currentDate);
      }
      //包含已经保存的日期、其他项目
      if (dateArr.findIndex(x => constData.includes(x)) !== -1) {
        message.warn('无法操作已经保存的日期', 1);
        calendarRef.current?.getApi().unselect();
      } else {
        setData(p => ({ ...p, selecting: dateArr }));
        setModalVisible(true);
      }
    },
    [constData],
  );

  //日期文本
  const renderDayCell = useCallback(arg => {
    const day = moment(arg.date);
    if (day.date() === 1) return day.format('M月D日');
    return day.date();
  }, []);

  //清空
  const handleClearAll = () => {
    getCalendarData(
      LOGIN_USER_ID,
      Number(moment(calendarRef.current?.getApi().getDate()).format('YYYYMM')),
      Number(xmid),
      setIsSpinning,
    );
  };

  //一键全勤
  const handleQuickFullAtd = e => {
    const handleDataSave = dateArr => {
      setData(p => {
        for (var key in p) {
          if (key !== 'selecting') {
            p[key] = p[key].filter(x => !dateArr.includes(x));
          }
        }
        return {
          ...p,
          selecting: [],
          attendance: [...p.attendance, ...dateArr],
        };
      });
    };
    if (e.target.checked) {
      //未被选择地本月工作日
      const dateArr = curWorkDays.filter(x => !selectedData.includes(x));
      setFullAtdData({
        checked: e.target.checked,
        originData: JSON.parse(JSON.stringify(data)), //用于恢复之前状态
      });
      handleDataSave(dateArr);
    } else {
      setData(fullAtdData.originData);
      setFullAtdData(p => ({
        ...p,
        checked: e.target.checked,
      }));
    }
  };

  //自定义切换月份的按钮
  const customButtons = useMemo(
    () => ({
      customPre: {
        text: '',
        icon: 'chevron-left',
        click: () => {
          calendarRef.current?.getApi().prev();
          const curDate = moment(calendarRef.current?.getApi().getDate());
          onPanelChange(curDate);
        },
      },
      customNext: {
        text: 'custom!',
        icon: 'chevron-right',
        click: () => {
          calendarRef.current?.getApi().next();
          const curDate = moment(calendarRef.current?.getApi().getDate());
          onPanelChange(curDate);
        },
      },
    }),
    [calendarRef.current],
  );

  //eventMouseEnter
  const eventMouseEnter = useCallback(info => {
    if (info.el._tippy === undefined && JSON.stringify(info.event.extendedProps) !== '{}') {
      tippy(info.el, {
        interactive: true,
        allowHTML: true,
        content: info.event.extendedProps.XM,
        placement: 'bottom',
        arrow: false,
        offset: [0, info.event.extendedProps.half ? -20 : 0],
        theme: 'light',
      });
    }
  }, []);

  return (
    <Fragment>
      <Modal
        wrapClassName="attendance-register-modal"
        width={620}
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
            <Checkbox checked={fullAtdData.checked} onChange={handleQuickFullAtd}>
              一键全勤
              <Tooltip title="勾选后，本月剩余工作日全勤自动填充" overlayStyle={{ maxWidth: 260 }}>
                <Icon type="question-circle" className="footer-question-circle" />
              </Tooltip>
            </Checkbox>
            <Button className="cancel-btn" onClick={handleCancel}>
              取消
            </Button>
            {selectedData.findIndex(x => !constData.includes(x)) !== -1 && (
              <Popconfirm title="确定清空吗？" onConfirm={handleClearAll}>
                <Button className="clearall-btn">清空</Button>
              </Popconfirm>
            )}
            <Button loading={isSpinning} className="confirm-btn" type="primary" onClick={handleOk}>
              {constData.length > 0 ? '更新' : '提交'}
            </Button>
          </div>
        }
      >
        <div className="body-title-box">
          <strong>考勤登记</strong>
          <Dropdown overlay={menu}>
            <Button className="date-filter-dropdown-btn">
              筛选日期 <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <div className="content">
            <FullCalendar
              ref={calendarRef}
              firstDay={0}
              selectable={true}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={locale}
              unselectAuto={modalVisible}
              customButtons={customButtons}
              headerToolbar={{
                start: 'customPre,customNext,title',
                center: null,
                end: null,
              }}
              select={onCalendarSlt}
              dayCellContent={renderDayCell}
              events={events}
              eventMouseEnter={eventMouseEnter}
              showNonCurrentDates={false}
            />
          </div>
        </Spin>
      </Modal>
      <RadioSltModal
        dataProps={{
          visible: modalVisible,
          radioValue,
          data,
          fullAtdData,
        }}
        funcProps={{
          setVisible: setModalVisible,
          setRadioValue,
          setData,
          setFastSlting,
          setFullAtdData,
        }}
      />
    </Fragment>
  );
}
