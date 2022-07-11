import React, { Fragment } from 'react';
import { Input, Button, Menu, message, Form, Select, DatePicker, Pagination, Empty, Tooltip } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import BasicModal from '../../../../../Common/BasicModal';


import { FetchQuerySuperviseTaskList } from '../../../../../../services/motProduction';
import { FetchObjectQuery } from '../../../../../../services/sysCommon';

// 防抖
const debounce = (fn, wait) => {
  let timeout = null;
  return function (input) {
    input.persist();
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait, input);
  };
};


class SupervisorTaskLeftSearch extends React.Component {
  constructor(props) {
    super(props);
    if (props.onRef) {
      props.onRef(this);
    }
    this.state = {
      modalVisible: false,
      selectedTask: undefined,
      supervisorEvent: [],
      searchValues: {
        keyWd: '',
        // taskSt: '',
        spvsMo: undefined,
        spvsEvntLst: '',
        current: 1,
      },
      superviseTask: {
        months: [],
        monthsTask: [],
        total: 0,
      },
      menuOpenKeys: [],
    };
  }

  componentDidMount() {
    this.fetchSuperviseTaskList({ current: 1 });
    this.fetchSupervisorEvent();
  }

  refreshSuperviseTaskList = () => {
    this.fetchSuperviseTaskList(this.state.searchValues);
  };

  fetchSuperviseTaskList(payload) {
    FetchQuerySuperviseTaskList({ ...payload, paging: 1, pageSize: 10 }).then((ret = {}) => {
      const { code, records, total, current = payload.current } = ret;
      if (code > 0) {
        let months = [];
        let monthsTask = {};
        let selectedTask = undefined;
        records.forEach(item => {
          if (months.indexOf(item.spvsMo) < 0) {
            months.push(item.spvsMo);
            monthsTask[item.spvsMo] = [];
          }
          monthsTask[item.spvsMo].push(item);
          if (this.state.selectedTask && item.taskId === this.state.selectedTask.taskId) {
            selectedTask = item;
          }
        });
        if (records.length >= 1 && selectedTask === undefined) {
          selectedTask = records[0];
        }
        this.props.onClickTask && this.props.onClickTask(selectedTask);
        this.setState({
          selectedTask, superviseTask: { months, monthsTask, total },
          searchValues: { ...this.state.searchValues, current },
          menuOpenKeys: months,
        });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  }

  fetchSupervisorEvent = () => {

    const condition = {
      cols: "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
      current: 1,
      cxtj: "DIC_CL==TMOT_EVNT&&TGT_TP==3", //原先direct接口传入的条件参数    
      pageSize: 10,
      paging: 1,
      serviceid: "motDic",
      sort: "",
      total: -1
    }

    FetchObjectQuery(condition).then((ret = {}) => {
      const { code = 0, data = [] } = ret;
      if (code > 0) {
        this.setState({
          supervisorEvent: data,
        });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  };

  handleKeywordChange = event => {
    const searchValues = {
      ...this.state.searchValues, keyWd: event.target.value,
    };
    this.setState({ searchValues });
    this.fetchSuperviseTaskList({ ...searchValues, current: 1 });
  };

  handlePagerChange = pageNo => {
    this.fetchSuperviseTaskList({ ...this.state.searchValues, current: pageNo });
  };

  handleClickTask = task => {
    this.setState({
      selectedTask: task,
    });
    this.props.onClickTask && this.props.onClickTask(task);
  };

  handleOpenModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleModalOk = () => {
    const { taskSt, spvsMo, spvsEvntLst } = this.getFieldsValue();
    const searchValues = {
      ...this.state.searchValues,
      taskSt,
      spvsMo: spvsMo ? spvsMo.format('YYYYMM') : '',
      spvsEvntLst,
    };
    this.setState({
      modalVisible: false, searchValues,
    });
    this.fetchSuperviseTaskList({ ...searchValues, current: 1 });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { form: { getFieldDecorator }, dictionary } = this.props;
    this.getFieldsValue = this.props.form.getFieldsValue;

    let { SPVS_TASK_ST: spvsTaskSt = [] } = dictionary;
    const { modalVisible, supervisorEvent, superviseTask, selectedTask, searchValues, menuOpenKeys } = this.state;

    return (
      <Fragment>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', padding: '20px 5px 0 20px' }}>
            <Input.Search placeholder="搜素" onChange={debounce(this.handleKeywordChange, 800)}
              className="mot-prod-search-input"
              style={{ flex: 1 }} />
            <Button onClick={this.handleOpenModal} type="link" size="small" style={{ marginTop: '-3px' }}>
              <i className="iconfont icon-searchC" style={{ color: '#999' }} />
            </Button>
          </div>
          <Scrollbars autoHide style={{ width: '100%', flex: 1 }}>
            {superviseTask.months.length === 0 ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />) : (
              <Menu
                mode="inline"
                openKeys={menuOpenKeys}
                onOpenChange={(openKeys => {
                  this.setState({ menuOpenKeys: openKeys });
                })}
                selectedKeys={selectedTask ? [selectedTask.taskId] : []}
                style={{ paddingRight: '10px' }}
              >
                {
                  superviseTask.months.map(month => {
                    return (
                      <Menu.SubMenu
                        key={month}
                        title={(
                          <span style={{ color: '#333333', fontWeight: 'bold' }}>
                            <CalendarOutlined />
                            {month.slice(0, 4) + '年' + month.slice(4, 6) + '月'}
                          </span>
                        )}
                      >
                        {superviseTask.monthsTask[month].map(task => {
                          return (
                            <Menu.Item key={task.taskId} onClick={() => {
                              this.handleClickTask(task);
                            }}>
                              <div>
                                <Tooltip title={task.taskNm}>
                                  <div style={{
                                    display: 'inline-block', width: 'calc(100% - 60px)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}>{task.taskNm}</div>
                                </Tooltip>
                                <div style={{ float: 'right', paddingRight: '15px' }}>
                                  {task.taskStNm}
                                </div>
                              </div>
                            </Menu.Item>
                          );
                        })}
                      </Menu.SubMenu>
                    );
                  })
                }
              </Menu>
            )}

          </Scrollbars>
          <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            <Pagination simple={true} total={superviseTask.total}
              current={searchValues.current} onChange={this.handlePagerChange} />
          </div>
        </div>

        <BasicModal
          title="查询条件"
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          width="500px"
        >
          <Form style={{ marginTop: '20px' }}>
            {/* <Form.Item label="任务状态：" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('taskSt', { initialValue: searchValues.taskSt })(
                <Select>
                  <Select.Option value="">所有状态</Select.Option>
                  {
                    spvsTaskSt.map(
                      (item) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item> */}
            <Form.Item label="督导月份：" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('spvsMo', { initialValue: searchValues.spvsMo ? moment(searchValues.spvsMo, 'YYYYMM') : undefined })(
                <DatePicker.MonthPicker style={{ width: '100%' }} placeholder="请选择督导月份" />)}
            </Form.Item>
            <Form.Item label="督导事件：" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('spvsEvntLst', { initialValue: searchValues.spvsEvntLst })(
                <Select allowClear={true}
                  showSearch
                  optionFilterProp="children"
                >
                  {
                    supervisorEvent.map(
                      (item) => <Select.Option key={item['EVNT_ID']}
                        value={item['EVNT_ID']}>{item['EVNT_NM']}</Select.Option>)
                  }
                </Select>,
              )}
            </Form.Item>
          </Form>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(SupervisorTaskLeftSearch);
