import React from 'react';
import { Row, Col, message, Card } from 'antd';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import TaskOperate from '../../../../../components/WorkPlatForm/MainPage/TaskCenter/TaskOperate';
import TaskDetail from '../../../../../components/WorkPlatForm/MainPage/TaskCenter/TaskDetail';
import { FetchTaskDataReturnOperationPermission, FetchTaskMarketingServiceOperationPermission, FetchTaskCheckScenePermission, FetchTaskConfigurableSuperviseGrade } from '../../../../../services/taskcenter/index';
import { fetchObject } from '../../../../../services/sysCommon';

/**
 * 页面类型
 *  1表示分发类,2表示执行类,3表示管理
 *  执行类对应ExecuteTypePage组件
 *  管理类对应ManageTypePage组件
 * 任务分类
 *  1表示数据填报类
 *  2表示营销服务类
 */
class RemindMessageDropTaskModal extends React.Component {
  constructor(props) {
    super(props);
    const { data = '', height = '' } = props;
    const dataParse = JSON.parse(data);
    const { taskid = '', taskclid = '', qrysc = '', pagetp = '' } = dataParse;
    this.state = {
      taskDetail: {
        sceneType: parseInt(qrysc, 10), // 场景ID,场景类型
        pageType: pagetp,
        taskType: taskclid,
        taskID: taskid,
        dstrstid: '',
      },
      operationPermission: {},
      basicDrawerVisible: false, // 控制基本信息弹出栏
      historyDrawerVisible: false, // 控制历史记录弹出栏
      historykhid: '',
      historyrecordid: '',
      height,
      hasPerMission: false,
      taskConfigurableSuperviseGrade: [],
      TTC_TP: [],
      TTC_CL: [],
      LBROLE: [],
    };
  }
  componentWillMount() {
    // this.updateDimensions();
  }
  componentDidMount() {
    const { taskDetail = {} } = this.state;
    const { sceneType, pageType, taskID, taskType } = taskDetail;
    // window.addEventListener('resize', this.updateDimensions);
    this.getNecessaryData(taskID);
    this.queryTaskCheckScenePermission({ qrysc: sceneType, pagetp: pageType, taskid: taskID }, taskType);
  }
  componentWillUnmount() {
    // window.removeEventListener('resize', this.updateDimensions);
  }
  getNecessaryData = (taskID) => {
    FetchTaskConfigurableSuperviseGrade({ taskID }).then((res) => {
      const { records = [] } = res;
      if (records && Array.isArray(records)) {
        const finalResult = [];
        records.forEach((items) => {
          finalResult.push(items.orgtpid);
        });
        this.setState({ taskConfigurableSuperviseGrade: finalResult });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    this.FetchObject('TTC_TP');
    this.FetchObject('TTC_CL');
    this.FetchObject('lbRole');
  }
  FetchObject = (type) => {
    fetchObject(type).then((res) => {
      const { records = [] } = res;
      if (records && Array.isArray(records)) {
        this.setState({ [type]: records });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 校验场景权限
  queryTaskCheckScenePermission = (queryParams = {}, taskType = '') => {
    this.setState({ hasPerMission: false, operationPermission: {} });
    FetchTaskCheckScenePermission(queryParams).then((result) => {
      this.setState({ hasPerMission: true });
      if (result.code === 1 || result.code === '1') {
        // 查询操作权限
        if (taskType === '1') {
          this.queryTaskMarketingServiceOperationPermission(queryParams);
        }
        if (taskType === '2') {
          this.queryTaskDataReturnOperaPermission(queryParams);
        }
      } else {
        // 无场景权限
        message.error('您无权限查看此任务！');
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      const { onClose, rmndId } = this.props;
      if (onClose) {
        setTimeout(onClose(0, rmndId), 2000);
      }
    });
  };

  // 数据填报任务-查询操作权限
  queryTaskDataReturnOperaPermission = (queryParams = {}) => {
    FetchTaskDataReturnOperationPermission(queryParams).then((result) => {
      const { records = [] } = result;
      if (records.length !== 0) {
        this.setState({ operationPermission: records[0] });
      }
      this.setState({ basicDrawerVisible: true });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 营销服务任务-查询操作权限
  queryTaskMarketingServiceOperationPermission = (queryParams = {}) => {
    FetchTaskMarketingServiceOperationPermission(queryParams).then((result) => {
      const { records = [] } = result;
      if (records.length > 0) {
        this.setState({ operationPermission: records[0] });
      }
      this.setState({ basicDrawerVisible: true });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  executeDrawerRefresh = (taskType) => { // 刷新弹出框
    if (this.taskDetail) this.taskDetail.excuteRefreshDarw(taskType);
  }
  showBasicDrawer = () => {
    this.setState({ basicDrawerVisible: true });
  }
  closeBasicDrawer = () => {
    this.setState({ basicDrawerVisible: false });
  }
  showHistoryDrawer = (custID, custLstID) => { // 拿到id并传递给历史纪录子组件
    this.setState({ historyDrawerVisible: true, historykhid: custID, historyrecordid: custLstID });
  }
  closeHistoryDrawer = () => {
    this.setState({ historyDrawerVisible: false });
  }
  updateDimensions = () => { // 窗口大小改变的时候调整固定
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 120;
    this.setState({
      height,
    });
  }
  refreshTaskList = () => { // 删除下达任务及填报完成之后的回调
    const { onClose, rmndId } = this.props;
    if (onClose) onClose(0, rmndId);
  }

  render() {
    const { taskDetail = {}, height, taskConfigurableSuperviseGrade = [], TTC_TP, TTC_CL, LBROLE } = this.state;
    const commonSelecType = { TTC_TP, TTC_CL, LBROLE };
    const { dictionary, userBusinessRole } = this.props;
    const { basicDrawerVisible = false, historyDrawerVisible = false, historykhid, historyrecordid } = this.state;
    const drawManager = { // 抽屉相关操作  传递给子组件使用
      basicDrawerVisible,
      historyDrawerVisible,
      showBasicDrawer: this.showBasicDrawer,
      closeBasicDrawer: this.closeBasicDrawer,
      showHistoryDrawer: this.showHistoryDrawer,
      closeHistoryDrawer: this.closeHistoryDrawer,
      executeDrawerRefresh: this.executeDrawerRefresh,
    };
    let detailVisable = { display: 'none' };
    let opetaViewWidth = 24;
    let detailViewWidth = 0;
    if (basicDrawerVisible || historyDrawerVisible) {
      opetaViewWidth = 18;
      detailViewWidth = 6;
      detailVisable = null;
    }
    return (
      <Row>
        <Col xs={24} sm={24} lg={opetaViewWidth}>
          <Card className="m-card myCard theme-padding ant-card" style={{ height }}>
            {/* 此处设为null还有另外一层意义就是每次切换时将TaskOperate组件摧毁 */}
            {!this.state.hasPerMission ? <div style={{ width: '100%', height: '100%', lineHeight: height - 100, textAlign: 'center' }}>无操作权限</div> : <TaskOperate height={height} refreshTaskList={this.refreshTaskList} taskDetail={taskDetail} dictionary={dictionary} taskConfigurableSuperviseGrade={taskConfigurableSuperviseGrade} operationPermission={this.state.operationPermission} userBusinessRole={userBusinessRole} commonSelecType={commonSelecType} drawManager={drawManager} /> }
          </Card>
        </Col>
        <Col xs={24} sm={24} lg={detailViewWidth} style={{ ...detailVisable }}>
          <Card className="m-card m-card-task ant-card m-task-srcoll" style={{ height }} bodyStyle={{ height: '100%' }}>
            <Scrollbars autoHide style={{ width: '100%', height: this.state.height }}>
              <TaskDetail ref={(c) => { this.taskDetail = c; }} taskDetail={taskDetail} drawManager={drawManager} khid={historykhid} recordid={historyrecordid} height={height} commonSelecType={commonSelecType} />
            </Scrollbars>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default connect(({ global }) => ({
  authorities: global.authorities,
  dictionary: global.dictionary,
  userBusinessRole: global.userBusinessRole,
  userBasicInfo: global.userBasicInfo,
}))(RemindMessageDropTaskModal);
