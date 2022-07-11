import React from 'react';
import { Col, Card, Row, Button, Spin, message, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import BasicModal from '../../../../Common/BasicModal';
import ScheduleGroupTask from './ScheduleGroupTask';
import TaskOpen from './TaskOpen';
import LogModel from './LogModal';
import {
  FetchQueryScheduleCheck,
  //FetchStartGroupTasks,
  FetchManualUpdateStatus,
  //FetchStopGroupTasks,
  FetchOracleScheduleCompute,
  FetchStopMotSchd,
} from '../../../../../services/motProduction';

import { getDictKey } from '../../../../../utils/dictUtils';

class TaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 组详情显示
      zt: '', // 点击状态
      openTask: false, // 定时启动弹框显示
      spinning: false, // 加载状态
      logModel: false, // 分组日志弹框
      loadingState: '', // 加载信息状态 -1校验;0|停止;1|启动;2|更新
    };
  }

  showModal = (value) => {
    this.setState({
      visible: true,
      zt: value,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 点击启动/停止
  changeSchdSt = () => {
    const { scheduleitem = {} } = this.props;
    // 仅为定时启动动作时打开弹框
    if (scheduleitem.cmptMode === '1' && scheduleitem.schdSt !== '1') {
      this.setState({
        openTask: true,
      });
    } else {
      // 非定时直接验证修改
      const params = {
        schdSt: scheduleitem.schdSt === '1' ? '0' : '1',
        grpId: scheduleitem.grpId,
        redoState: '1',
        tgtTp: scheduleitem.tgtTp,
      };
      this.checkGroupTasks(params);
    }
  }

  // 关闭定时任务弹框
  openTaskHandleCancel = () => {
    this.setState({
      openTask: false,
    });
  }

  // 加载状态
  loading= (bool) => {
    this.setState({
      spinning: bool,
    });
  }

  // 校验任务(启动/停止入口)
  checkGroupTasks = (params = {}) => {
    const { schdSt, grpId = '', rq = moment().locale('zh-cn').format('YYYYMMDD'), taskId = '', redoState = '1', tgtTp = '' } = params;
    // 这里的schdSt为操作启动类型
    this.setState({
      spinning: true,
      // loadingState: schdSt,
      loadingState: '-1',
    });
    const checkPayload = {
      grpId,
      rq,
      schdSt,
      taskId:taskId===""?null:taskId,
    };
    FetchQueryScheduleCheck(checkPayload).then((response) => {
      const { code } = response;
      if (code > 0) {
        if (schdSt === '1' || tgtTp === '3') {
          // if (tgtTp === '3') {
            const startPayload = {
              grpId:Number(grpId),
              tjrq: Number(rq),
              wthrRedo: redoState,
            };
            this.startGroupTasks(startPayload, FetchOracleScheduleCompute, grpId);
          // } else {
          //   const startPayload = {
          //     date: rq,
          //     groupId: grpId,
          //     redoState,
          //   };
          //   this.startGroupTasks(startPayload, FetchStartGroupTasks, grpId);
          // }
        } else if (schdSt === '0') {
          const stopPayload = {
            grpId: grpId,
          };
          this.stopGroupTasks(stopPayload);
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.loading(false);
    });
  }

  // 分组启动
  startGroupTasks = (startPayload, doStartFuction, grpId) => {
    this.setState({
      loadingState: '1',
    });
    doStartFuction(startPayload).then((response) => {
      const { code, note } = response;
      if (code > 0) {
        // 再调用更新分组状态接口（/motbase/v1/manualUpdateStatus）。
        const payload = {
          engSt: 1,
          grpId,
        };
        message.info(note);
        this.manualUpdateStatus(payload);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.props.taskChange();
      setTimeout(this.loading(false), 1000);
    });
  }

  // 分组停止
  stopGroupTasks = (stopPayload) => {
    this.setState({
      loadingState: '0',
    });
    const { grpId } = stopPayload;
    FetchStopMotSchd(stopPayload).then((response) => {
      const { code, note } = response;
      if (code > 0) {
        // 再调用更新分组状态接口（/motbase/v1/manualUpdateStatus）。
        const updatePayload = {
          engSt: 0,
          grpId: Number(grpId),
        };
        message.info(note);
        this.manualUpdateStatus(updatePayload);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      // 分组启动失败状态也会改变需重新获取列表
      this.props.taskChange();
      setTimeout(this.loading(false), 1000);
    });
  }

  // 更新状态
  manualUpdateStatus = (updatePayload) => {
    this.setState({
      loadingState: '2',
    });
    FetchManualUpdateStatus(updatePayload).then((response) => {
      const { code } = response;
      if (code > 0) {
        // 更新任务组列表
        this.props.taskChange();
        setTimeout(this.loading(false), 1000);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.props.taskChange();
      setTimeout(this.loading(false), 1000);
    });
  }

  // 分组日志弹框
  showLogModal = () => {
    this.setState({
      logModel: true,
    });
  };

  handleLogModalCancel = () => {
    this.setState({
      logModel: false,
    });
  };

  // 获取按钮操作显示
  getBtnState = () => {
    const { spinning } = this.state;
    if (spinning) {
      const { loadingState } = this.state;
      return loadingState === '0' ? '停止' : '启动';
    }
    const { scheduleitem = {} } = this.props;
    return scheduleitem.schdSt === '1' && scheduleitem.tgtTp !== '3' ? '停止' : '启动';
  }
  // 模式标签背景色
  getModeColor = (value) => {
    let bgColor = '';
    switch (value) {
      case '1':
        break;
      case '2':
        bgColor = '#F7BD64';
        break;
      case '4':
        bgColor = '#EE7E7A';
        break;
      default:
        break;
    }
    return bgColor;
  }
  loadingMessage = (loadingState = '') => {
    let loadingMessage = '';
    switch (loadingState) {
      case '-1':
        loadingMessage = '校验中，请稍后';
        break;
      case '0':
        loadingMessage = '停止中，请稍后';
        break;
      case '1':
        loadingMessage = '启动中，请稍后';
        break;
      case '2':
        loadingMessage = '正在更新分组状态，请稍后';
        break;
      default:
        break;
    }
    return loadingMessage;
  }
  getSchdStColor = (schdStNm = '') => {
    let color = '';
    switch (schdStNm) {
      case '计算失败':
      case '分发失败':
        color = '#f20000';
        break;
      case '未运行':
        color = '#ff9100';
        break;
      default:
        break;
    }
    return color;
  }

  render() {
    const { scheduleitem, dictionary = {}, taskChange } = this.props;
    const { zt, spinning, loadingState } = this.state;
    const { [getDictKey('motSchdSt')]: schdSt = [] } = dictionary; // MOT任务要求字典
    return (
      <React.Fragment>
        <Col span={6} style={{ paddingTop: '2rem' }}>
          <Card bordered={false}>
            {/* <Spin tip={loadingState === "0" ? "停止中，请稍后" : "启动中，请稍后"} spinning={spinning}> */}
            <Spin tip={this.loadingMessage(loadingState)} spinning={spinning}>
              <span className={(scheduleitem.cmptMode==='1'?'mot-bg-color':'') + ' ddtkCardRank'} style={{ backgroundColor: this.getModeColor(scheduleitem.cmptMode) }}>{scheduleitem.cmptModeName}</span>
              <Tooltip title={scheduleitem.grpNm}>
                <div className="cardTopText1">{scheduleitem.grpNm}</div>
              </Tooltip>
              <div className={(scheduleitem.schdStNm==='计算完成'||scheduleitem.schdStNm==='运行中'?'mot-font-color':'') + ' cardTopText2'} style={{ color: this.getSchdStColor(scheduleitem.schdStNm) }}>{scheduleitem.schdStNm}</div>
              <div className="cardTopText3">{scheduleitem.lastSchdTm}</div>
              {scheduleitem.grpTp === '1' && scheduleitem.cmptMode === '1' ? (
                <Row>
                  <Col span={8} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '')}>
                    <div className="taskData mot-font-color">{scheduleitem.allTask}</div>
                    <div className="taskName">任务总数</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '0')}>
                    <div className="taskData mot-font-color">{scheduleitem.waitTask}</div>
                    <div className="taskName">未执行</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '2')}>
                    <div className="taskData mot-font-color">{scheduleitem.cmptDoneTask}</div>
                    <div className="taskName">计算完成</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '4')}>
                    <div className="taskData mot-font-color">{scheduleitem.dstrDoneTask}</div>
                    <div className="taskName">分发完成</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '-1')}>
                    <div className={`taskData ${scheduleitem.cmptFailTask === '0' ? 'mot-font-color' : 'mot-red'}`} >{scheduleitem.cmptFailTask}</div>
                    <div className="taskName">计算异常</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '-2')}>
                    <div className={`taskData ${scheduleitem.dstrFailTask === '0' ? 'mot-font-color' : 'mot-red'}`}>{scheduleitem.dstrFailTask}</div>
                    <div className="taskName">分发异常</div>
                  </Col>
                </Row>
) : (
  scheduleitem.grpTp === '1' && scheduleitem.cmptMode === '2' ? (
    <Row>
    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '')}>
      <div className="taskData mot-font-color">{scheduleitem.allTask}</div>
      <div className="taskName">任务总数</div>
    </Col>

    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '1')}>
      <div className="taskData mot-font-color">{scheduleitem.normTask}</div>
      <div className="taskName">正常运行</div>
    </Col>
    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '0')}>
      <div className="taskData mot-font-color">{scheduleitem.waitTask}</div>
      <div className="taskName">未执行</div>
    </Col>
    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '-1')}>
      <div className={`taskData ${scheduleitem.cmptFailTask === '0' ? 'mot-font-color' : 'mot-red'}`}>{scheduleitem.cmptFailTask}</div>
      <div className="taskName">计算异常</div>
    </Col>
  </Row>
  ):(
    <Row>
    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '')}>
      <div className="taskData mot-font-color">{scheduleitem.allTask}</div>
      <div className="taskName">任务总数</div>
    </Col>

    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '1')}>
      <div className="taskData mot-font-color">{scheduleitem.normTask}</div>
      <div className="taskName">正常运行</div>
    </Col>
    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '0')}>
      <div className="taskData mot-font-color">{scheduleitem.waitTask}</div>
      <div className="taskName">未执行</div>
    </Col>
    <Col span={12} style={{ textAlign: 'center', paddingTop: '1rem', cursor: 'pointer' }} onClick={this.showModal.bind(this, '-2')}>
      <div className={`taskData ${scheduleitem.dstrFailTask === '0' ? 'mot-font-color' : 'mot-red'}`}>{scheduleitem.dstrFailTask}</div>
      <div className="taskName">分发异常</div>
    </Col>
  </Row>
  )
)}
              {
              scheduleitem.schdSt === '1' && scheduleitem.tgtTp !== '3' ?
                <Button type="primary" className="mot-stop-grouptask-btn" size="large" shape="round" style={{ width: '80%', margin: '6% 10%' }} onClick={this.changeSchdSt.bind(this)}>停止</Button>
              :
                <Button type="primary" className="mot-start-grouptask-btn" size="large" shape="round" style={{ width: '80%', margin: '6% 10%' }} onClick={this.changeSchdSt.bind(this)}>启动</Button>
            }
              {/* { scheduleitem.tgtTp !== '3' ? <div className="cardLink" onClick={() => this.showLogModal(scheduleitem)}>运行日志</div> : <div className="cardLink" style={{ minHeight: '20px' }} /> } */}
            </Spin>
          </Card>
        </Col>
        <BasicModal
          title="MOT任务"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width="90%"
        >
          <ScheduleGroupTask grpId={scheduleitem.grpId} grpTp={scheduleitem.grpTp} schdSt={schdSt} zt={zt} tgtTp={scheduleitem.tgtTp} />
        </BasicModal>
        <BasicModal
          title="启动定时任务"
          visible={this.state.openTask}
          onCancel={this.openTaskHandleCancel}
          footer={null}
          width="40%"
        >
          <TaskOpen scheduleitem={scheduleitem} taskChange={taskChange} cancelThis={this.openTaskHandleCancel} checkGroupTasks={this.checkGroupTasks} />
        </BasicModal>
        <BasicModal
          title="MOT日志"
          visible={this.state.logModel}
          onCancel={this.handleLogModalCancel}
          footer={null}
          width="90%"
        >
          <LogModel scheduleitem={scheduleitem} />
        </BasicModal>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(TaskItem);

