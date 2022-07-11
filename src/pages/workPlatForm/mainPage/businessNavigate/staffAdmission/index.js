import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Spin, Card, Tabs, BackTop, Collapse, Icon, Input } from 'antd';
import TreeUtils from '../../../../../utils/treeUtils';
import StaffManagementTab from './staffManagementTab';
import { fetchOperationLog } from '../../../../../services/basicservices/index';
import { ptlx } from '../../../../../utils/config';
const { Panel } = Collapse;
const { Search } = Input;
class StaffAdmission extends React.PureComponent {

  state = {
    userUnreadNoticeMsgNum: 0,
    userTodoWorkflowNum: 0,
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  handleButtonClick = (e, item) => {
    const { ljdz = '' } = item;
    if (ljdz !== '') {
      window.location.href = `/#${ljdz}`;
    }
  }
  handleUnreadClick = (url, name) => {
    // 记录日志
    let czdx;
    if (name === '流程中心') {
      czdx = '5256';
    } else if (name === '消息中心') {
      czdx = '5257';
    } else if (name === '知会信息') {
      czdx = '5258';
    }
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    fetchOperationLog({
      czdx,
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: `从|管理中心|业务管理|统一业务办理|进入:${name}`,
      ip,
      ptlx,
    });
    if (url !== '') {
      window.location.href = `/#${url}`;
    }
  }
  handleRefresh = () => {
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 设置定时器,避免一次性多次触发(liveBos相关的bug?)
    this.timer = setTimeout(() => {
      this.getNum();
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'mainPage/fetchMessageNoticeNum',
          payload: {},
        });
      }
    }, 200);
  }
  // 记录日志
  handleTabsChange = (key) => {
    let tabName;
    let czdx;
    if (key === '12') {
      tabName = '人事管理';
      czdx = '5054';
    } else if (key === '20') {
      tabName = '关系管理';
      czdx = '5055';
    } else if (key === '5') {
      tabName = '客户管理';
      czdx = '5056';
    } else if (key === '91') {
      tabName = '客户服务';
      czdx = '5515';
    } else if (key === '90') {
      tabName = '产品管理';
      czdx = '5516';
    }
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    fetchOperationLog({
      czdx,
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: `查看：管理中心|业务管理|统一业务办理|${tabName}`,
      ip,
      ptlx,
    });
  }

  callbackForHead = (e) => {
    this.setState({
      key: e.target.value,
    });
  }

  render() {
    const { authorities, dataLoaded = false, workFlowData = [] } = this.props;
    const { key = '' } = this.state
    let data = [];
    //将二级指标且指标名字不包含关键字过滤
    data = workFlowData.filter(item => !(item.xsmc.indexOf(key) === -1 && item.grade === '2'));
    if (!dataLoaded) {
      return <Spin size="large" style={{ width: '100%', margin: '40px 0' }} />;
    }
    // 获取有权限的节点信息
    // const authedWorkFlowData = data.filter((item) => {
    //   const { type = '', qxbm = '' } = item;
    //   if (type === '2' && !this.isContains(authorities, qxbm)) { // 筛选掉没有权限的
    //     return false;
    //   }
    //   return true;
    // });

    const workFlowTree = TreeUtils.toTreeData(data, { keyName: 'id', pKeyName: 'fid', titleName: 'xsmc' }, false) || [];
    // 获取符合条件的数据
    const workFlowTreeData = ((workFlowTree[0] || {}).children || []).filter(((item) => {
      const { children = [] } = item;
      if (!children || children.length === 0) {
        return false;
      }
      return children.some(child => child.children && child.children.length > 0);
    }));
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };
    let defaultActiveKey = [];
    for (let i = 0; i < workFlowTreeData.length; i++) {
      defaultActiveKey.push(workFlowTreeData[i].id)
    }
    return (
      <Fragment>
        <div className='flex-c'
          style={{
            minHeight: '10rem',
            padding: '0px 18px 0px 18px',
            margin: '20px 20px 20px',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <div style={{ justifyContent: 'center' }}>
            <Search
              placeholder='请输入搜索条件'
              onChange={value => this.callbackForHead(value)}
              style={{ width: 200 }}
            />
          </div>
        </div>
        <Card className="bn-body m-card default ant-card" style={{ minHeight: 'calc(100vh - 18rem)', padding: '6px 18px 24px 18px', margin: '0px 20px 20px' }}>
          {
            workFlowTreeData.length > 0 && (
              <Collapse className="ant-collapse-header m-tabs-underline m-tabs-underline-small ant-collapse-content" onChange={this.handleTabsChange}
                expandIcon={({ isActive }) => <Icon type="caret-right" style={{ fontSize: '2rem' }} rotate={isActive ? 90 : 0} />}
                style={{ background: "white", fontSize: '2rem', color: '#54a9df', border: 'none' }}
                defaultActiveKey={defaultActiveKey}>
                {
                  workFlowTreeData.map((item) => {
                    const { id, xsmc = '--', children = [] } = item;
                    return (
                      // <Tabs.TabPane tab={xsmc} key={id}>
                      //   <StaffManagementTab onRefresh={this.handleRefresh} wfData={children} authorities={authorities} />
                      // </Tabs.TabPane>
                      <Panel header={xsmc} key={id}>
                        <StaffManagementTab onRefresh={this.handleRefresh} wfData={children} authorities={authorities} />
                      </Panel>
                    );
                  })
                }
              </Collapse>
            )
          }
        </Card>
        <BackTop visibilityHeight={40} />
      </Fragment>
    );
  }
}
export default connect(({ global, staffAdmission }) => ({
  authorities: global.authsOrOpert,
  ...staffAdmission,
}))(StaffAdmission);
