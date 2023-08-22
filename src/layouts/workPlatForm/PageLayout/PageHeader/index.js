import React from 'react';
import { Input, message, Tooltip } from 'antd';
// import SwitchTheme from './switchTheme';
import UserDrop from './userDrop';
import VisitedRoutes from './VisitedRoutes';
import SearchModal from './SearchModal';
import MessagesDrop from './messagesDrop';
import { Scrollbars } from 'react-custom-scrollbars';
import SwitchMenu from './SwitchMenu';
import styles from './index.less';
import LocalPathUtils from '../../../../utils/localPathUtils';
import { GlobalSearch, QueryUnreadInfo, QueryUserRole } from '../../../../services/pmsServices';
import MsgNoticeDrawer from './msgNoticeDrawer';

const { Search } = Input;
export default class PageHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchModalVisible: false,
      newMsgNum: 0,
    };
  }
  componentDidMount() {
    if (
      this.props.authorities?.TGYS_GYSRYQX === undefined &&
      this.props.authorities?.V_GYSRYQX === undefined &&
      this.props.authorities?.V_RYKQ === undefined
    ) {
      this.getUnreadNum();
      this.interval = setInterval(this.getUnreadNum, 30000);
    }
  }

  componentWillUnmount() {
    LocalPathUtils.cleanRouterList();
    if (
      this.props.authorities?.TGYS_GYSRYQX === undefined &&
      this.props.authorities?.V_GYSRYQX === undefined &&
      this.props.authorities?.V_RYKQ === undefined
    ) {
      clearInterval(this.interval);
    }
  }

  getUnreadNum = () => {
    QueryUnreadInfo({ id: this.props.authUserInfo?.id })
      .then(res => {
        if (res?.success) {
          this.setState({
            newMsgNum: res.count,
          });
        }
      })
      .catch(e => {
        console.error('🚀新通知信息', e);
        message.error('新通知信息获取失败', 1);
      });
  };

  render() {
    const { searchModalVisible, newMsgNum } = this.state;
    const {
      menuTree,
      authorities = {},
      history,
      dispatch,
      location,
      userBasicInfo,
      authUserInfo,
      fetchMenuDatas,
      messageDrop,
      dictionary,
      userTodoWorkflowNum = 0,
      projectName,
      theme,
    } = this.props;
    const { globalSearch, TGYS_GYSRYQX, V_GYSRYQX, V_RYKQ } = authorities;

    // 引导
    const guidesRecords = [
      {
        key: '1',
        containerId: 'guideTrigger_userDrop',
        content: '您在这里可以‘更换头像’、‘修改密码’、‘切换岗位用户’、‘退出’系统。',
      },
      {
        key: '2',
        containerId: 'guideTrigger_globalSearch',
        content: '您在这里可以进行‘全局搜索’（菜单、客户、产品）。',
      },
      { key: '3', containerId: 'guideTrigger_switchMenu', content: '您在这里可以‘切换菜单方案’。' },
      {
        key: '4',
        containerId: 'guideTrigger_messageDrop',
        content: '您在这里可以查看‘消息提醒’。',
      },
    ];
    const routerList = LocalPathUtils.getRoutesHaveName();
    const sysName = localStorage.getItem('sysName');
    return (
      <div className="zj-header" style={{ width: '100%', height: '100%' }}>
        <div style={{ width: '200px', borderBottom: '1px solid #eeeff1', textAlign: 'center' }}>
          <span>
            <img
              className="logo"
              style={{ width: '118px' }}
              src={require('../../../../assets/apex-logo.png')}
              alt=""
            />
          </span>
        </div>
        {/*菜单栏*/}
        <div
          id="visited_routes_container"
          style={{ flex: 1, overflow: 'hidden', backgroundColor: 'white' }}
          className={`${styles.historyContainer}`}
        >
          <span>
            <VisitedRoutes
              history={history}
              dispatch={dispatch}
              menuTree={menuTree}
              routerList={routerList}
              projectName={projectName}
              authorities={authorities}
            />
          </span>
        </div>
        {/*搜索框 */}
        <div
          style={{
            display: TGYS_GYSRYQX || V_GYSRYQX || V_RYKQ ? 'none' : 'flex',
            borderBottom: '1px solid rgb(238, 239, 241)',
            alignItems: 'center',
          }}
        >
          {searchModalVisible && (
            <SearchModal
              closeModal={() => {
                this.setState({
                  searchModalVisible: false,
                });
              }}
              visible={searchModalVisible}
            />
          )}
          <div className="pobtop">
            <Input
              type="text"
              suffix={<i className="iconfont icon-search-name icon-personal" />}
              onFocus={() =>
                this.setState({
                  searchModalVisible: true,
                })
              }
              placeholder="可查询项目、预算、文档、供应商、人员"
            />
          </div>
        </div>
        {/* 全局消息通知 */}
        {TGYS_GYSRYQX === undefined && V_GYSRYQX === undefined && V_RYKQ === undefined && (
          <MsgNoticeDrawer
            dataProps={{ authorities, newMsgNum }}
            funcProps={{ getUnreadNum: this.getUnreadNum }}
          />
        )}
        {/*用户名*/}
        <div
          id="fma_opertion_drops"
          className="dis-fx"
          style={{ width: 'auto', borderBottom: '1px solid #eeeff1' }}
        >
          {Object.keys(authorities).includes('remindBell') && (
            <div id="guideTrigger_messageDrop">
              <MessagesDrop {...messageDrop} dictionary={dictionary} dispatch={dispatch} />
            </div>
          )}
          {
            <div id="guideTrigger_switchMenu">
              <SwitchMenu location={location} fetchMenuDatas={fetchMenuDatas} />
            </div>
          }
          {Object.keys(authorities).includes('globalSearch') && (
            <div id="guideTrigger_globalSearch" style={{ margin: '0 1rem' }}>
              <SearchInput menuTree={menuTree} searchAuth={globalSearch} />
            </div>
          )}
          <div id="guideTrigger_userDrop">
            <UserDrop
              theme={theme}
              dispatch={dispatch}
              userBasicInfo={userBasicInfo}
              authUserInfo={authUserInfo}
            />
          </div>
        </div>
      </div>
    );
  }
}
