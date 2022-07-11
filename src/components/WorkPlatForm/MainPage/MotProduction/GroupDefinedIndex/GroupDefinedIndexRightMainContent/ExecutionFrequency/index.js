/* eslint-disable no-shadow */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import moment from 'moment';
import { Row, message, Radio, Checkbox, Select, TimePicker, Form, Button } from 'antd';
import { FetchqueryScheduleDescription, FetchscheduleInfoMaintenance } from '../../../../../../../services/motProduction';

class ExecutionFrequency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonParams: '', // json入参
      inputTip: '', // 输入框的频率提示
      editTipInfo: '', // 编辑模式的提示信息
      type: 'month', // 左侧选择的时间类型
      visible: false,
      tipInfo: {
        month: {
          defaultRadioValue: '1', // 默认的单选的值
          checkArr: '', // 多选数据
        },
        week: {
          defaultRadioValue: '1', // 默认的单选的值
          checkArr: '', // 多选数据
          first: '1', // 单选数据   第几个
          second: '1', // 单选数据  星期几


        },
        day: {
          defaultRadioValue: '1', // 默认的单选的值
          checkArr: '', // 多选数据
        },
        time: '',
        begin: '',
        end: '',

      },
    };
  }

  componentDidMount() {
    // this.structTipInfo(this.props.selectedItem)
    // this.fetchTipInfo(this.props.selectedItem.schdInf, "1")
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedItem.grpId !== this.props.selectedItem.grpId || nextProps.selectedItem.schdInf !== this.props.selectedItem.schdInf) {
      if (nextProps.selectedItem.grpId !== this.props.selectedItem.grpId) {
        this.setState({
          tipInfo: {
            month: {
              defaultRadioValue: '1', // 默认的单选的值
              checkArr: '', // 多选数据
            },
            week: {
              defaultRadioValue: '1', // 默认的单选的值
              checkArr: '', // 多选数据
              first: '1', // 单选数据   第几个
              second: '1', // 单选数据  星期几


            },
            day: {
              defaultRadioValue: '1', // 默认的单选的值
              checkArr: '', // 多选数据
            },
            time: '',
            begin: '',
            end: '',

          },
        }, () => {
          this.structTipInfo(nextProps.selectedItem);
          this.fetchTipInfo(nextProps.selectedItem.schdInf, '1');
          this.setState({
            visible: false,
            type: 'month',
          }, () => {
            this.onTimeClick('month', 1);
          });
        });
      } else {
        this.structTipInfo(nextProps.selectedItem);
        this.fetchTipInfo(nextProps.selectedItem.schdInf, '1');
        this.setState({
          visible: false,
          type: 'month',
        }, () => {
          this.onTimeClick('month', 1);
        });
      }
    }
  }

  // 获取调度信息描述   type=1 全部存储  type=2 编辑框提示存储
  fetchTipInfo = (schdInf = '', type = '') => {
    // const { schdInf = '' } = selectedItem
    FetchqueryScheduleDescription({ schdInfo: schdInf }).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        const tip = records[0].ruledesc;
        if (type === '1') {
          this.setState({
            inputTip: tip,
            editTipInfo: tip,
          });
        } else if (type === '2') {
          this.setState({
            editTipInfo: tip,
          });
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 解析执行频率 数据 用于渲染初始数据
  structTipInfo = (selectedItem = {}) => {
    // 获取解析初始值
    const { tipInfo = {} } = this.state;
    // const { selectedItem } = this.props;
    const monthData = {
      defaultRadioValue: '',
      checkArr: [],
    };
    if (selectedItem.schdInf) {
      const json = JSON.parse(selectedItem.schdInf);
      // 解析月
      const month = json.MONTH;
      if (month === '?') {
        monthData.defaultRadioValue = 1;
      } else {
        monthData.defaultRadioValue = 2;
        if (month.indexOf('-') !== -1) {
          const tempArr = month.split('-');
          const min = tempArr[0];
          const max = tempArr[1];
          for (let index = min; index <= max; index++) {
            monthData.checkArr.push(`${index}`);
          }
        } else {
          monthData.checkArr = month.split(',');
        }
      }
      tipInfo.month = monthData;


      // 解析周
      const weekData = {
        defaultRadioValue: '', // 默认的单选的值
        checkArr: [], // 多选数据
        first: '', // 单选数据
        second: '', // 单选数据
      };
      const week = json.WEEK;
      if (week === '?') {
        weekData.defaultRadioValue = 1;
      } else if (week.indexOf('#') !== -1) {
        weekData.defaultRadioValue = 2;
        const tempArr = week.split('#');
        weekData.first = tempArr[1];
        weekData.second = tempArr[0];
      } else {
        weekData.defaultRadioValue = 3;
        if (week.indexOf('-') !== -1) {
          const tempArr = week.split('-');
          const min = tempArr[0];
          const max = tempArr[1];
          for (let index = min; index <= max; index++) {
            weekData.checkArr.push(`${index}`);
          }
        } else {
          weekData.checkArr = week.split(',');
        }
      }

      tipInfo.week = weekData;

      // 解析 天
      const dayData = {
        defaultRadioValue: '', // 默认的单选的值
        checkArr: [], // 多选数据
      };
      const day = json.DAY;
      if (day === '?') {
        dayData.defaultRadioValue = 1;
      } else if (day === 'wd') {
        dayData.defaultRadioValue = 2;
      } else if (day === 'fwd') {
        dayData.defaultRadioValue = 3;
      } else if (day === 'lwd') {
        dayData.defaultRadioValue = 4;
      } else {
        dayData.defaultRadioValue = 5;

        if (day.indexOf('-') !== -1) {
          const tempArr = day.split('-');
          const min = tempArr[0];
          const max = tempArr[1];
          for (let index = min; index <= max; index++) {
            dayData.checkArr.push(`${index}`);
          }
        } else {
          dayData.checkArr = day.split(',');
        }
      }

      tipInfo.day = dayData;
      // 解析时间
      const { cmptMode } = selectedItem;
      if (cmptMode === '1') {
        tipInfo.time = json.TIME;
      } else if (cmptMode === '2') {
        tipInfo.begin = json.STARTTIME;
        tipInfo.end = json.ENDTIME;
      }

      this.setState({
        tipInfo,
      }, () => {
        // this.structTipInfo(tipInfo, '1')

      });
    }
  }

  // 根据存储的 tipInfo数据  构造json入参
  structJsonParams = (tipInfo = {}, cmptMode = '') => {
    // 解析 月的 入参
    const { month = {} } = tipInfo;
    let monthParam = '';
    if (Number(month.defaultRadioValue) === 1) {
      monthParam = '?';
    } else if (Number(month.defaultRadioValue) === 2) {
      const { checkArr = [] } = month;
      if (checkArr.length > 2) {
        // 判断数组是否连续  因为 数组 已排好序
        const min = checkArr[0];
        const max = checkArr[checkArr.length - 1];
        if ((max - min + 1) === checkArr.length) {
          monthParam = `${min}-${max}`;
        } else {
          // 不连续
          monthParam = checkArr.join(',');
        }
      } else if (checkArr.length > 0 && checkArr.length <= 2) {
        monthParam = checkArr.join(',');
      } else {
        monthParam = '';
      }
    }

    //    解析周
    const { week = {} } = tipInfo;
    let weekParam = '';
    if (Number(week.defaultRadioValue) === 1) {
      weekParam = '?';
    }
    if (Number(week.defaultRadioValue) === 2) {
      if (week.second === '' && week.first === '') {
        weekParam = '1#1';
      } else {
        weekParam = `${week.second}#${week.first}`;
      }
    }
    if (Number(week.defaultRadioValue) === 3) {
      const { checkArr = [] } = week;
      if (checkArr.length > 2) {
        // 判断数组是否连续  因为 数组 已排好序
        const min = checkArr[0];
        const max = checkArr[checkArr.length - 1];
        if ((max - min + 1) === checkArr.length) {
          weekParam = `${min}-${max}`;
        } else {
          // 不连续
          weekParam = checkArr.join(',');
        }
      } else if (checkArr.length === 0) {
        weekParam = '';
      } else {
        weekParam = checkArr.join(',');
      }
    }

    // 解析天
    const { day = {} } = tipInfo;
    let dayParam = '';
    if (Number(day.defaultRadioValue) === 1) {
      dayParam = '?';
    }
    if (Number(day.defaultRadioValue) === 2) {
      dayParam = 'wd';
    }
    if (Number(day.defaultRadioValue) === 3) {
      dayParam = 'fwd';
    }
    if (Number(day.defaultRadioValue) === 4) {
      dayParam = 'lwd';
    }
    if (Number(day.defaultRadioValue) === 5) {
      const { checkArr = [] } = day;
      // 没有勾选   每个月最后一天
      if (checkArr[checkArr.length - 1] !== 32) {
        if (checkArr.length > 2) {
          // 判断数组是否连续  因为 数组 已排好序
          const min = checkArr[0];
          const max = checkArr[checkArr.length - 1];
          if ((max - min + 1) === checkArr.length) {
            dayParam = `${min}-${max}`;
          } else {
            // 不连续
            dayParam = checkArr.join(',');
          }
        } else if (checkArr.length === 0) {
          dayParam = '';
        } else {
          dayParam = checkArr.join(',');
        }
      } else {
        dayParam = checkArr.join(',').replace('32', 'L');
      }
    }
    // 解析时间
    if (cmptMode === '1') {
      const { time = {} } = tipInfo;
      const obj = {
        MONTH: monthParam,
        WEEK: weekParam,
        DAY: dayParam,
        TIME: time,
      };
      return JSON.stringify(obj);

      // this.setState({
      //     jsonParams: JSON.stringify(obj)
      // })
      // this.fetchTipInfo(JSON.stringify(obj), "2")
    }
    const { begin = {} } = tipInfo;
    const { end = {} } = tipInfo;

    const obj = {
      MONTH: monthParam,
      WEEK: weekParam,
      DAY: dayParam,
      STARTTIME: begin,
      ENDTIME: end,
    };
    return JSON.stringify(obj);
    // this.setState({
    //     jsonParams: JSON.stringify(obj)
    // })
    // this.fetchTipInfo(JSON.stringify(obj), "2")
  }


  // 点击编辑图标
  onEditClick = () => {
    this.setState({
      visible: !this.state.visible,

    }, () => {
      if (this.state.visible === true) {
        // this.getTipInfo(this.props.selectedItem)
      }
    });
  }

  // 左边时间类型选择
  onTimeClick = (type = '') => {
    //   先删除选中样式
    const ele = document.querySelectorAll('ul[name="timeList"]');
    const nodeList = ele[0].childNodes;
    if(Array.isArray(nodeList)){
      nodeList.forEach((item) => {
        item.classList.remove('sel');
      });
    }
    // nodeList[0].classList.remove('sel');
    // nodeList[1].classList.remove('sel');
    // nodeList[2].classList.remove('sel');
    // nodeList[3].classList.remove('sel');

    // ele[0].childNodes.map(item => {
    //     item.classList.remove('sel')
    // })

    const e = document.querySelectorAll(`li[id=${type}]`);


    e[0].classList.add('sel');

    this.setState({
      type,
    });
    // ele.classList.add('sel')
  }

  // 月 模块内容改变
  onMonthChange = (value, type) => {
    const { setFieldsValue } = this.props.form;

    const { tipInfo = {} } = this.state;
    if (type === 'radio') {
      tipInfo.month.defaultRadioValue = value;
      if (value === 1) {
        tipInfo.month.checkArr = '';
        setFieldsValue({ monthCheck: [] });
      }

      this.setState({
        tipInfo,
      });
    } else if (type === 'check') {
      tipInfo.month.defaultRadioValue = 2;
      tipInfo.month.checkArr = value;
      this.setState({
        tipInfo,
      });
    }
    const jsonParams = this.structJsonParams(tipInfo, this.props.selectedItem.cmptMode);
    this.fetchTipInfo(jsonParams, '2');
  }

  // 周 模块内容改变
  onWeekChange = (value, type) => {
    const { setFieldsValue } = this.props.form;


    const { tipInfo = {} } = this.state;
    if (type === 'radio') {
      tipInfo.week.defaultRadioValue = value;
      if (value !== 3) {
        tipInfo.week.checkArr = '';
        setFieldsValue({ weekCheck: [] });
      }
      if (value !== 2) {
        tipInfo.week.first = '';
        tipInfo.week.second = '';
      }
      this.setState({
        tipInfo,
      });
    } else if (type === 'check') {
      tipInfo.week.defaultRadioValue = 3;
      tipInfo.week.checkArr = value;
      this.setState({
        tipInfo,
      });
    } else if (type === 'select1') {
      tipInfo.week.first = value;
      this.setState({
        tipInfo,
      });
    } else if (type === 'select2') {
      tipInfo.week.second = value;
      this.setState({
        tipInfo,
      });
    }

    const jsonParams = this.structJsonParams(tipInfo, this.props.selectedItem.cmptMode);
    this.fetchTipInfo(jsonParams, '2');
  }

  // 天 模块内容改变
  onDayChange = (value, type) => {
    const { setFieldsValue } = this.props.form;

    const { tipInfo = {} } = this.state;
    if (type === 'radio') {
      tipInfo.day.defaultRadioValue = value;
      if (value !== 5) {
        tipInfo.day.checkArr = '';
        setFieldsValue({ dayCheck: [] });
      }

      this.setState({
        tipInfo,
      });
    } else if (type === 'check') {
      tipInfo.day.checkArr = value;
      this.setState({
        tipInfo,
      });
    }
    const jsonParams = this.structJsonParams(tipInfo, this.props.selectedItem.cmptMode);
    this.fetchTipInfo(jsonParams, '2');
  }

  // 时间 模块内容改变
  onTimeChange = (value, type) => {
    const { tipInfo = {} } = this.state;
    tipInfo[type] = value;
    this.setState({
      tipInfo,
    });

    const jsonParams = this.structJsonParams(tipInfo, this.props.selectedItem.cmptMode);
    this.fetchTipInfo(jsonParams, '2');
  }

  // 月 模块的HTML
  renderMonthHtml = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;


    // 获取修改值
    const { tipInfo: { month = {} } } = this.state;
    const editRadioValue = month.defaultRadioValue;
    const editCheckArr = month.checkArr;
    // const {tipInfo:{month}}=this.state

    const options = [
      { label: '一月', value: '1' },
      { label: '二月', value: '2' },
      { label: '三月', value: '3' },
      { label: '四月', value: '4' },
      { label: '五月', value: '5' },
      { label: '六月', value: '6' },
      { label: '七月', value: '7' },
      { label: '八月', value: '8' },
      { label: '九月', value: '9' },
      { label: '十月', value: '10' },
      { label: '十一月', value: '11' },
      { label: '十二月', value: '12' },
    ];


    const monthHtml = (
      <div>
        <Form.Item style={{ marginBottom: '0' }}>
          {
            getFieldDecorator('monthRadio', {
              initialValue: Number(editRadioValue),
            })(<Radio.Group className="mot-radio" name="radiogroup" style={{ width: '20%', padding: '1rem' }} onChange={(e) => { this.onMonthChange(e.target.value, 'radio'); }}>
              <Radio value={1}>不指定</Radio>
              <Radio value={2}>在</Radio>
            </Radio.Group>)
          }

        </Form.Item>
        <Form.Item style={{ marginBottom: '0' }}>
          {
            getFieldDecorator('monthCheck', {
              initialValue: editCheckArr,
            })(<Checkbox.Group
              style={{ padding: '0 3rem' }}
              options={options}
              disabled={getFieldValue('monthRadio') !== 2}
              // defaultValue={arr}
              onChange={(value) => { this.onMonthChange(value, 'check'); }}
            />)
          }

        </Form.Item>
        {/* <div >
                <Checkbox.Group
                    style={{ padding: '0 1rem' }}
                    options={options}
                    defaultValue={arr}
                />
            </div> */}
      </div>
    );
    return monthHtml;
  }

  // 周模块的 HTML
  renderWeekHtml = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;


    // 获取修改值
    const { tipInfo: { week = {} } } = this.state;
    const editRadioValue = week.defaultRadioValue;
    const editCheckArr = week.checkArr;
    const firstSelect = week.first;
    const secondSelect = week.second;

    const options = [
      { label: '星期一', value: '1' },
      { label: '星期二', value: '2' },
      { label: '星期三', value: '3' },
      { label: '星期四', value: '4' },
      { label: '星期五', value: '5' },
      { label: '星期六', value: '6' },
      { label: '星期日', value: '7' },

    ];
    const weekHtml = (
      <div>
        <Form.Item style={{ marginBottom: '0' }}>
          {
            getFieldDecorator('weekRadio', {
              initialValue: Number(editRadioValue),
            })(<Radio.Group className="mot-radio" name="radiogroup" style={{ width: '20%', padding: '1rem' }} onChange={(e) => { this.onWeekChange(e.target.value, 'radio'); }}>
              <Radio value={1}>不指定</Radio>
              <Radio value={2}>
                在
                <Select
                  defaultValue={firstSelect === '' ? '1' : firstSelect}
                  style={{ width: '70px' }}
                  ref={select => this.Select1 = select}
                  onChange={(value) => { this.onWeekChange(value, 'select1'); }}
                  disabled={getFieldValue('weekRadio') !== 2}
                >
                  <Select.Option key={1} value="1">第一</Select.Option>
                  <Select.Option key={2} value="2">第二</Select.Option>
                  <Select.Option key={3} value="3">第三</Select.Option>
                  <Select.Option key={4} value="4">第四</Select.Option>
                </Select>
                <span style={{ padding: '0 0.5rem' }}>于</span>
                <Select
                  defaultValue={secondSelect === '' ? '1' : secondSelect}
                  style={{ width: '90px' }}
                  ref={select => this.Select2 = select}
                  onChange={(value) => { this.onWeekChange(value, 'select2'); }}
                  disabled={getFieldValue('weekRadio') !== 2}
                >
                  <Select.Option key={1} value="1">星期一</Select.Option>
                  <Select.Option key={2} value="2">星期二</Select.Option>
                  <Select.Option key={3} value="3">星期三</Select.Option>
                  <Select.Option key={4} value="4">星期四</Select.Option>
                  <Select.Option key={5} value="5">星期五</Select.Option>
                  <Select.Option key={6} value="6">星期六</Select.Option>
                  <Select.Option key={7} value="7">星期日</Select.Option>
                </Select>
              </Radio>
              <Radio value={3}>
                在
              </Radio>

            </Radio.Group>)
          }
        </Form.Item>
        <div >


          <Form.Item style={{ marginBottom: '0' }}>
            {
              getFieldDecorator('weekCheck', {
                initialValue: editCheckArr,

              })(<Checkbox.Group
                style={{ padding: '0 3rem' }}
                options={options}
                disabled={getFieldValue('weekRadio') !== 3}
                // defaultValue={arr}
                onChange={(value) => { this.onWeekChange(value, 'check'); }}
              />)
            }

          </Form.Item>

          {/* <Checkbox.Group
                        style={{ padding: '0 1rem' }}
                        options={options}
                        defaultValue={[]}
                    /> */}
        </div>
      </div>);
    return weekHtml;
  }

  // 天 模块的HTML
  renderDayHtml = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const options = [];
    for (let index = 1; index <= 31; index++) {
      const obj = {
        label: index,
        value: index,
      };
      options.push(obj);
    }
    options.push({
      label: '每个月最后一天',
      value: 'L',
    });


    // 获取修改值
    const { tipInfo: { day = {} } } = this.state;
    const editRadioValue = day.defaultRadioValue;
    const editCheckArr = day.checkArr;

    const dayHtml = (
      <div>
        <Form.Item style={{ marginBottom: '0' }}>
          {
            getFieldDecorator('dayRadio', {
              initialValue: Number(editRadioValue),

            })(<Radio.Group className="mot-radio" name="radiogroup" style={{ width: '20%', padding: '1rem' }} onChange={(e) => { this.onDayChange(e.target.value, 'radio'); }}>
              <Radio value={1}>不指定</Radio>
              <Radio value={2}>工作日 </Radio>
              <Radio value={3}>第一个工作日 </Radio>
              <Radio value={4}>最后一个工作日 </Radio>
              <Radio value={5}>在 </Radio>
            </Radio.Group>)
          }

        </Form.Item>

        <div >
          <Form.Item style={{ marginBottom: '0' }}>
            {
              getFieldDecorator('dayCheck', {
                initialValue: editCheckArr,
              })(<Checkbox.Group
                style={{ padding: '0 3rem' }}
                options={options}
                disabled={getFieldValue('dayRadio') !== 5}
                // defaultValue={arr}
                onChange={(value) => { this.onDayChange(value, 'check'); }}
              />)
            }

          </Form.Item>
          {/* <Checkbox.Group
                        style={{ padding: '0 1rem' }}
                        options={options}
                        defaultValue={arr}
                    /> */}
        </div>
      </div>);

    return dayHtml;
  }

  // 执行时间 开始时间  结束时间  模块的HTML
  renderTimeHtml = (type) => {
    const { getFieldDecorator } = this.props.form;
    const { tipInfo = {} } = this.state;

    let time = '';

    // const json = JSON.parse(selectedItem.schdInf);

    let label = '';
    switch (type) {
      case 'time': label = '执行时间'; time = tipInfo.time; break;
      case 'begin': label = '开始时间'; time = tipInfo.begin; break;
      case 'end': label = '结束时间'; time = tipInfo.end; break;
      default: label = '执行时间'; time = tipInfo.time;
    }
    if (time === '') {
      const timeHtml = (
        // <div style={{padding:' 1rem'}}><span style={{padding:'0 0.5rem'}}>:</span>


        <Form.Item style={{ marginBottom: '0', padding: '1rem 0 0 ' }} label={label} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
          {
            getFieldDecorator(type, {
              // initialValue: moment(time === '' ? '00:00:00' : time, 'HH:mm:ss'),
              rules: [{ required: true, message: '请选择' + label }]
            })(<TimePicker onChange={(time, timeString) => { this.onTimeChange(timeString, type); }} />)
          }

        </Form.Item>


        // </div>
      );
      return timeHtml;
    }
    const timeHtml = (
      // <div style={{padding:' 1rem'}}><span style={{padding:'0 0.5rem'}}>:</span>
      <Form.Item style={{ marginBottom: '0', padding: '1rem 0 0 ' }} label={label} labelCol={{ span: 3 }} wrapperCol={{ span: 12 }}>
        {
          getFieldDecorator(type, {
            initialValue: moment(time === '' ? '00:00:00' : time, 'HH:mm:ss'),
            rules: [{ required: true, message: '请选择' + label }]
          })(<TimePicker onChange={(time, timeString) => { this.onTimeChange(timeString, type); }} />)
        }

      </Form.Item>
      // </div>
    );
    return timeHtml;
  }

  // 根据时间类型 渲染不同的选择样式
  renderHtml = (type = 'month') => {
    let rightAllHtml = '';
    switch (type) {
      case 'month': rightAllHtml = this.renderMonthHtml(); break;
      case 'week': rightAllHtml = this.renderWeekHtml(); break;
      case 'day': rightAllHtml = this.renderDayHtml(); break;
      case 'time': rightAllHtml = this.renderTimeHtml(type); break;
      case 'begin': rightAllHtml = this.renderTimeHtml(type); break;
      case 'end': rightAllHtml = this.renderTimeHtml(type); break;
      default: rightAllHtml = this.renderMonthHtml(); break;
    }

    return rightAllHtml;
  }

  // 保存
  onSave = () => {
    const { tipInfo = {} } = this.state;
    const jsonParams = this.structJsonParams(tipInfo, this.props.selectedItem.cmptMode);
    const { selectedItem: { grpId = '', cmptMode }, fetchCompanyName, tgtTp } = this.props;
    if (cmptMode === '1') {
      if (tipInfo.time === undefined || tipInfo.time === '') {
        message.error("请设置执行时间");
        return;
      }
    } else if (cmptMode === '2') {
      if (tipInfo.begin === undefined || tipInfo.begin === ''
        || tipInfo.end === undefined || tipInfo.end === '') {
        message.error("请设置开始时间和结束时间");
        return;
      }
    }

    const payload = {
      grpId,
      grpSchdInfo: jsonParams,
    };

    FetchscheduleInfoMaintenance(payload).then((res) => {
      const { code = 0 } = res;
      if (code > 0) {
        fetchCompanyName && fetchCompanyName(tgtTp, '');
        this.setState({
          visible: false,
          type: 'month',
        });
      }
    }).catch((error) => {
      fetchCompanyName && fetchCompanyName(tgtTp, '');
      this.setState({
        visible: false,
        type: 'month',
      });
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { selectedItem } = this.props;
    const { cmptMode } = selectedItem;


    const { visible, type = '', inputTip = '', editTipInfo = '' } = this.state;


    return (
      <Fragment>
        <Row style={{ padding: '0 25px' }}>
          <div style={{ color: '#333333', fontSize: '16px', fontWeight: 'bold' }}>执行频率</div>
          <div className="mot-group-zxpl-box">
            <div className=" mot-group-jbxx-syfw-box mot-group-pos-r">
              <div className=" mot-group-zxpl-text"><span>执行频率：</span><span >{inputTip}</span></div>
              <div className=" mot-group-zxpl-right btnRateBox" onClick={() => { this.onEditClick(); }}><i className="iconfont icon-setLine mot-icon" /></div>
            </div>
          </div>

          <div style={{ display: visible ? 'block' : 'none' }} className="mot-group-reset-box">
            <div style={{ float: 'right', cursor: 'pointer' }} onClick={() => { this.onSave(); }}>
              <Button className=" factor-bottom m-btn-border-headColor" style={{ marginLeft: '15px' }}>确认</Button>
            </div>
            <div className="mot-group-tips-info" style={{ padding: '3rem 0 0 0' }}><span>提示信息：</span><span className="tipInfo">{editTipInfo}</span></div>

            <div className="mot-group-reset-time-box" style={{ width: '85%', display: 'flex' }}>
              <div style={{ width: '15%' }} >
                <ul className="mot-group-reset-left-list" name="timeList">
                  <li className="sel" id="month" onClick={() => { this.onTimeClick('month', 1); }}><a href="javascript:void(0);">月</a></li>
                  <li className=" " id="week" onClick={() => { this.onTimeClick('week', 2); }}><a href="javascript:void(0);">周</a></li>
                  <li className="" id="day" onClick={() => { this.onTimeClick('day', 3); }}><a href="javascript:void(0);">日</a></li>
                  {
                    cmptMode === '1' && <li className="" id="time" onClick={() => { this.onTimeClick('time', 4); }}><a href="javascript:void(0);">执行时间</a></li>
                  }
                  {
                    cmptMode === '2' && <li className="" id="begin" onClick={() => { this.onTimeClick('begin', 5); }}><a href="javascript:void(0);">开始时间</a></li>

                  }
                  {
                    cmptMode === '2' && <li className="" id="end" onClick={() => { this.onTimeClick('end', 6); }}><a href="javascript:void(0);">结束时间</a></li>

                  }

                </ul>
              </div>

              <div style={{ width: '85%' }}>
                {this.renderHtml(type)}
              </div>
            </div>
          </div>


        </Row>
      </Fragment >
    );
  }
}
export default Form.create()(ExecutionFrequency);
