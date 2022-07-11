/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { Button, Form, Select, Input, Table, Spin, message, Icon } from 'antd';
import moment from 'moment';
import {
  FetchQueryScheduleGroupTaskList,
  FetchQueryScheduleCheck,
  FetchStartTaskTask,
  FetchStopTask,
} from '../../../../../services/motProduction';
import BasicModal from '../../../../Common/BasicModal';
import TaskOpen from './TaskOpen';
import LogModel from './LogModal';

class ScheduleGroupTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ScheduleGroup: [], // 任务列表
      logModel: false, // 日志弹框
      openTask: false, // 分时日期弹框
      currentTask: {}, // 当前操作任务
      spinning: false, // 加载状态
    };
  }


  componentDidMount() {
    const { grpId, zt } = this.props;
    const ScheduleGroupTaskPayload = {
      grpId,
      keyword: '',
      schdSt: zt,
    };
    this.queryScheduleGroupTaskList(ScheduleGroupTaskPayload);
  }

  // 查询任务列表
  queryScheduleGroupTaskList = (payload) => {
    FetchQueryScheduleGroupTaskList(payload).then((response) => {
      const { records = [], code } = response;
      if (code > 0) {
        this.setState({
          ScheduleGroup: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  validateForm = () => {
    const { grpId } = this.props;
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        const ScheduleGroupTaskPayload = {
          grpId,
          keyword: values.keyWord,
          schdSt: values.zt,
        };
        this.queryScheduleGroupTaskList(ScheduleGroupTaskPayload);
      }
    });
  }

  handleChange = (e) => {
    const { validateFields } = this.props.form;
    let zt = '';
    validateFields((err, values) => {
      zt = values.zt;
    });
    const { value } = e.target;
    const { grpId } = this.props;
    const ScheduleGroupTaskPayload = {
      grpId,
      keyword: value,
      schdSt: zt,
    };
    this.queryScheduleGroupTaskList(ScheduleGroupTaskPayload);
  }

  // 关闭定时任务弹框
  openTaskHandleCancel = () => {
    this.setState({
      openTask: false,
    });
  }

  // 获取日志
  showLogModal = (records = {}) => {
    this.setState({
      currentTask: records,
      logModel: true,
    });
  };

  handleLogModalCancel = () => {
    this.setState({
      logModel: false,
    });
  };

  // 加载状态
  loading= (bool) => {
    this.setState({
      spinning: bool,
    });
  }

  // 点击启动/停止
  changeSchdSt = (records = {}) => {
    // 仅为定时启动动作时打开弹框
    if (records.cmptMode === '1' && records.schdSt !== '1') {
      this.setState({
        openTask: true,
        currentTask: records,
      });
    } else {
      // 非定时直接验证修改
      const params = {
        schdSt: records.schdSt === '1' ? '0' : '1',
        grpId: records.grpId,
        redoState: '1',
        taskId: records.taskId,
        streamId: records.qryId,
      };
      this.checkTask(params);
    }
  }

  // 校验任务(启动/停止入口)
  checkTask = (params = {}) => {
    this.loading(true);
    const { schdSt, grpId = '', rq = moment().locale('zh-cn').format('YYYYMMDD'), taskId = '', redoState = '1', streamId = '' } = params;
    const checkPayload = {
      grpId,
      rq,
      schdSt,
      taskId,
    };
    FetchQueryScheduleCheck(checkPayload).then((response) => {
      const { code } = response;
      if (code > 0) {
        if (schdSt === '1') {
          const startPayload = {
            date: rq,
            groupId: grpId,
            redoState,
            taskId,
          };
          this.startTasks(startPayload);
        } else if (schdSt === '0') {
          const stopPayload = {
            groupId: grpId,
            taskId,
            streamId,
          };
          this.stopGroupTasks(stopPayload);
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.loading(false);
    });
  }

  // 单任务启动
  startTasks = (startPayload) => {
    FetchStartTaskTask(startPayload).then((response) => {
      const { code } = response;
      if (code > 0) {
        message.success('任务启动成功');
        this.loading(false);
        // 重新获取任务列表
        const { getFieldsValue } = this.props.form;
        const { grpId } = this.props;
        const { zt = '', keyWord = '' } = getFieldsValue(['zt', 'keyWord']);
        const ScheduleGroupTaskPayload = {
          grpId,
          keyword: keyWord,
          schdSt: zt,
        };
        this.queryScheduleGroupTaskList(ScheduleGroupTaskPayload);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.loading(false);
    });
  }

  // 单任务停止
  stopGroupTasks = (stopPayload) => {
    FetchStopTask(stopPayload).then((response) => {
      const { code } = response;
      if (code > 0) {
        message.success('任务停止成功');
        this.loading(false);
        const { getFieldsValue } = this.props.form;
        const { grpId } = this.props;
        const { zt = '', keyWord = '' } = getFieldsValue(['zt', 'keyWord']);
        // 重新获取任务列表
        const ScheduleGroupTaskPayload = {
          grpId,
          keyword: keyWord,
          schdSt: zt,
        };
        this.queryScheduleGroupTaskList(ScheduleGroupTaskPayload);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.loading(false);
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { ScheduleGroup, currentTask, spinning } = this.state;
    const { schdSt, zt, grpTp, tgtTp } = this.props;
    let columns = [];
    if (grpTp === '1') {
      columns = [
        {
          title: '事件名称',
          dataIndex: 'evntNm',
          key: 'evntNm',
          align: 'center',
        },
        {
          title: '所属阶段',
          dataIndex: 'sbrdStg',
          key: 'sbrdStg',
          align: 'center',
        },
        {
          title: '重要程度',
          dataIndex: 'impt',
          key: 'impt',
          align: 'center',
        },
        {
          title: '分发范围',
          dataIndex: 'dstrRng',
          key: 'dstrRng',
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'schdStName',
          key: 'schdStName',
          align: 'center',
        },
        {
          title: '上次开始时间',
          dataIndex: 'lastSchdOrigTm',
          key: 'lastSchdOrigTm',
          align: 'center',

        },
        {
          title: '上次结束时间',
          dataIndex: 'lastSchdEndTm',
          key: 'lastSchdEndTm',
          align: 'center',
        },
        {
          title: '事件流水',
          dataIndex: 'evntFlowNum',
          key: 'evntFlowNum',
          align: 'center',
        },
        {
          title: '任务数',
          dataIndex: 'taskNum',
          key: 'taskNum',
          align: 'center',
        },
        {
          title: '消息数 ',
          dataIndex: 'rmndNum',
          key: 'rmndNum',
          align: 'center',
        },
      ];
    } else if (grpTp === '2') {
      columns = [
        {
          title: '任务名称',
          dataIndex: 'evntNm',
          key: 'evntNm',
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'schdStName',
          key: 'schdStName',
          align: 'center',
        },
        {
          title: '上次开始时间',
          dataIndex: 'lastSchdOrigTm',
          key: 'lastSchdOrigTm',
          align: 'center',

        },
        {
          title: '上次结束时间',
          dataIndex: 'lastSchdEndTm',
          key: 'lastSchdEndTm',
          align: 'center',
        },
      ];
    }
    columns.push({
      title: '操作 ',
      dataIndex: 'IP',
      key: 'IP',
      align: 'center',
      width: 200,
      render: (text, records) => {
        return (
          <div>
            {records.schdSt === '1' ? <Button className="disBlueBtn" style={{ marginLeft: '1rem' }} onClick={() => this.changeSchdSt(records)}>停止</Button> :
            <Button className="disBlueBtn" onClick={() => this.changeSchdSt(records)}>启动</Button>
          }
            {/* {tgtTp !== '3' && <Button className="disYellowBtn" style={{ marginLeft: '1rem' }} onClick={() => this.showLogModal(records)}>日志</Button>} */}
          </div>
        );
      },
    });
    return (
      <React.Fragment>
        <Form layout="inline" style={{ paddingLeft: '20px', paddingTop: '10px' }}>
          <Form.Item>
            {getFieldDecorator('zt', { initialValue: zt })(<Select size="large " style={{ width: '100px' }} onSelect={this.validateForm}>
              <Select.Option value="" >所有状态</Select.Option>
              {
                  schdSt.map(item => <Select.Option key={item.ibm} value={item.ibm} >{item.note}</Select.Option>)
                }
                                                           </Select>)}
          </Form.Item>
          <Form.Item >
            {getFieldDecorator('keyWord', { initialValue: '' })(<Input prefix={<Icon type="search" />} onChange={this.handleChange} />)}
          </Form.Item>
        </Form>
        <Spin tip={currentTask.schdSt === '1' ? '停止中，请稍后' : '启动中，请稍后'} spinning={spinning}>
          <Table dataSource={ScheduleGroup} columns={columns} scroll={{ y: 500 }} pagination={false} style={{ padding: '30px 20px' }} />
        </Spin>
        <BasicModal
          title="MOT日志"
          visible={this.state.logModel}
          onCancel={this.handleLogModalCancel}
          footer={null}
          width="90%"
        >
          <LogModel scheduleitem={currentTask} />
        </BasicModal>
        <BasicModal
          title="启动定时任务"
          visible={this.state.openTask}
          onCancel={this.openTaskHandleCancel}
          footer={null}
          width="40%"
        >
          <TaskOpen scheduleitem={currentTask} cancelThis={this.openTaskHandleCancel} checkGroupTasks={this.checkTask} />
        </BasicModal>
      </React.Fragment>
    );
  }
}
export default Form.create()(ScheduleGroupTask);
