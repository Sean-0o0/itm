import React from 'react';
import {Input, Tooltip} from 'antd';
// import SwitchTheme from './switchTheme';
import UserDrop from './userDrop';
import VisitedRoutes from './VisitedRoutes';
import SearchModal from './SearchModal';
import MessagesDrop from './messagesDrop';
import { Scrollbars } from 'react-custom-scrollbars';
import SwitchMenu from './SwitchMenu';
import styles from './index.less';
import LocalPathUtils from '../../../../utils/localPathUtils';

const {Search} = Input;
export default class PageHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchModalVisible: false,
    }
  }

  componentWillUnmount() {
    LocalPathUtils.cleanRouterList();
  }

  render() {
    const {searchModalVisible} = this.state
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
    const { globalSearch } = authorities;
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
        <div style={{ width: '200px', borderBottom: '1px solid #eeeff1' }}>
          <span>
            <img
              className="logo"
              style={{ width: '26px' }}
              src={require('../../../../assets/apex-logo-zszq-left.png')}
              alt=""
            />
          </span>
          <span
            style={{
              fontSize: '15px',
              color: '#333',
              fontWeight: 'bold',
              letterSpacing: '1.68px',
              verticalAlign: 'middle',
            }}
          >
            {'信息技术综合管理平台'}
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
            />
          </span>
        </div>
        {/*搜索框*/}
        <div>
          {
            searchModalVisible && <SearchModal closeModal={() => {
              this.setState({
                searchModalVisible: false,
              })
            }} visible={searchModalVisible}/>
          }
          <div className='pobtop'>
            <Input type="text" suffix={<i className="iconfont icon-search-name icon-personal"/>}
                   onFocus={() => this.setState({
                     searchModalVisible: true,
                   })} placeholder='请输入项目/供应商/人员'/>
          </div>
        </div>
        {/*用户名*/}
        <div
          id="fma_opertion_drops"
          className="dis-fx"
          style={{width: 'auto', borderBottom: '1px solid #eeeff1'}}
        >
          {Object.keys(authorities).includes('remindBell') && (
            <div id="guideTrigger_messageDrop">
              <MessagesDrop {...messageDrop} dictionary={dictionary} dispatch={dispatch}/>
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
