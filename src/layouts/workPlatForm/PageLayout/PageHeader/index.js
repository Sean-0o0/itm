import React from 'react';
import { Divider,Badge } from 'antd';
// import SwitchTheme from './switchTheme';
import UserDrop from './userDrop';
import VisitedRoutes from './VisitedRoutes';
import MessagesDrop from './messagesDrop';
import { Scrollbars } from 'react-custom-scrollbars';
import SwitchMenu from './SwitchMenu';
import styles from './index.less';
import LocalPathUtils from '../../../../utils/localPathUtils';

export default class PageHeader extends React.PureComponent {

  componentWillUnmount() {
    LocalPathUtils.cleanRouterList();
  }
  render() {
    const { menuTree, authorities = {}, history, dispatch, location, userBasicInfo, authUserInfo, fetchMenuDatas, messageDrop, dictionary, userTodoWorkflowNum = 0, projectName, theme } = this.props;
    const { globalSearch } = authorities;
    // 引导
    const guidesRecords = [
      { key: '1', containerId: 'guideTrigger_userDrop', content: '您在这里可以‘更换头像’、‘修改密码’、‘切换岗位用户’、‘退出’系统。' },
      { key: '2', containerId: 'guideTrigger_globalSearch', content: '您在这里可以进行‘全局搜索’（菜单、客户、产品）。' },
      { key: '3', containerId: 'guideTrigger_switchMenu', content: '您在这里可以‘切换菜单方案’。' },
      { key: '4', containerId: 'guideTrigger_messageDrop', content: '您在这里可以查看‘消息提醒’。' },
    ];
    const routerList = LocalPathUtils.getRoutesHaveName();
    const sysName = localStorage.getItem('sysName');
    return (
      <div style={{ width: '100%' }}>
        {/* <GuideCover data={guidesRecords} /> */}
        <div className="zj-header">
          <span><img className="logo" src={[require("../../../../assets/apex-logo-zszq-login.png")]} alt="" />
          <Divider style={{height:'3rem'}} type="vertical" />
            </span>
          <span style={{fontSize:'2.333rem',color:'#333',fontWeight:'bold',padding:'0 3rem 0 0'}}>{"项目信息综合管理系统【测】"}</span>
          <div id="visited_routes_container" style={{ flex: 1, overflow: 'hidden' }} className={`${styles.historyContainer}`} >
            <span><Scrollbars
              autoHide
              style={{width: '100%'}}
            >
              <VisitedRoutes history={history} dispatch={dispatch} menuTree={menuTree} routerList={routerList}
                             projectName={projectName}/>
            </Scrollbars>
              </span>
          </div>
          <div id="fma_opertion_drops" className="dis-fx">
            <div style={{width: '4rem'}}></div>
            {/*{<div id="guideTrigger_switchMenu" className="ant-menu-item" style={{position: 'relative', top: '8px'}}>*/}
            {/*  <a onClick={() => {*/}
            {/*    window.location.href = `/#/UIProcessor?Table=WORKFLOW_TOTASKS`;*/}
            {/*  }}><Badge count={userTodoWorkflowNum} showZero><i className='iconfont icon-message'*/}
            {/*                                                    style={{fontSize: '3.6rem'}}/></Badge></a>*/}
            {/*</div>}*/}
            {/*{<div id="guideTrigger_switchMenu" className="ant-menu-item" style={{position: 'relative', top: '8px'}}>*/}
            {/*  <Badge count={userTodoWorkflowNum} showZero><i className='iconfont icon-work'*/}
            {/*                                                 style={{fontSize: '3.6rem'}}/></Badge>*/}
            {/*</div>}*/}
            {
              Object.keys(authorities).includes('remindBell') && (
                <div id="guideTrigger_messageDrop">
                  <MessagesDrop {...messageDrop} dictionary={dictionary} dispatch={dispatch}/>
                </div>
              )
            }
            {<div id="guideTrigger_switchMenu">
              <SwitchMenu location={location} fetchMenuDatas={fetchMenuDatas}/>
            </div>}
             {
              Object.keys(authorities).includes('globalSearch') && (
                <div id="guideTrigger_globalSearch" style={{ margin: '0 1rem' }}>
                  <SearchInput menuTree={menuTree} searchAuth={globalSearch} />
                </div>
              )
            }

            <div id="guideTrigger_userDrop">
              <UserDrop theme={theme} dispatch={dispatch} userBasicInfo={userBasicInfo} authUserInfo={authUserInfo} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
