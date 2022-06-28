import React from 'react';
// import { routerRedux } from 'dva/router';
// import SendMessage from '../../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/SendMessage';
// import FillServiceRecord from './FillServiceRecord';
import SystemSetting from '../../../../Biz/SystemSetting';
// import RecentlyVisited from './RecentlyVisited';
// import { FetchuserShortcutMenuConfig } from '../../../../../services/commonbase';
// import FeedBack from './Feedback';
// import VersionInformation from './VersionInformation';
import { fetchOperationLog } from '../../../../../services/basicservices/index';
import { ptlx } from '../../../../../utils/config';

class HyperLink extends React.Component {
  state = {
    isHide: true,
    // quickOperationData: [],
    // SysData: [],
  }
  componentDidMount() {
    const { name } = this.props;
    if (name) {
      this.getOption(name);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { name } = nextProps;
    if (name !== this.props.name) {
      this.getOption(name);
    }
  }
  getOption = () => { // 获取当前用户的菜单
    // FetchuserShortcutMenuConfig({
    //   fadm: name,
    // }).then((response) => {
    //   const { records = [] } = response;
    //   if (Array.isArray(records)) {
    //     const quickOperationData = [];
    //     const SysData = []; // 系统级的菜单
    //     records.forEach((item) => {
    //       const { xsmc = '', cdjb = '', url = '', kjcd = '', icon = '' } = item;
    //       if (cdjb === '1') {
    //         SysData.push({
    //           key: kjcd,
    //           path: url,
    //           title: xsmc,
    //           icon,
    //           kjcd,
    //         });
    //       }
    //       quickOperationData.push({
    //         key: kjcd,
    //         path: url,
    //         title: xsmc,
    //         icon,
    //         kjcd,
    //       });
    //     });
    //     this.setState({
    //       SysData,
    //       quickOperationData: [
    //         ...quickOperationData,
    //       ],
    //     });
    //   }
    // });
  }
  openList = () => { // 打开列表
    // 记录日志
    fetchOperationLog({
      czdx: '5022',
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: '打开:快捷导航',
      ip: '',
      ptlx,
    });
    this.setState({
      isHide: false,
    });
  }
  closeList = () => {
    this.setState({
      isHide: true,
    });
  }
  updateQuickOperationData = () => {
    // const { SysData } = this.state;
    // this.setState({
    //   quickOperationData: [
    //     ...quickOperationData,
    //     ...SysData,
    //   ],
    // });
  }
  render() {
    // const { authorities = {}, dispatch, userBusinessRole, dictionary, theme, handleThemeChange, menuTree, name = '', menuSchemeName = '' } = this.props;
    const { authorities = {}, theme, handleThemeChange, name = '' } = this.props;
    // 这里做一层权限
    const authedQuickOperationData = [];
    const quickOperationData = [{
      cdjb: '1',
      fadm: '',
      icon: 'icon-setLine',
      id: '24',
      kjcd: 'XTSZ',
      psfa: '1',
      px: '1',
      sj: '',
      tzfs: '1',
      url: 'SystemSetting',
      xsmc: '系统设置',
      yhid: '0',
    }];
    quickOperationData.forEach((item) => {
      const { path } = item;
      let authed = false;
      if (path === '/sendMessages') {
        const { msgCenter = [] } = authorities;
        if (msgCenter.includes('sendMessage')) {
          authed = true;
        }
      } else if (path === '/serviceRecord') {
        const { customerList = [] } = authorities;
        if (customerList.includes('ServiceRecord')) {
          authed = true;
        }
      } else if (path === 'workcenter') {
        authed = true;
      } else if (path === 'SystemSetting') {
        authed = true;
      } else {
        authed = true;
      }
      if (authed) {
        authedQuickOperationData.push(item);
      }
    });
    return (
      authedQuickOperationData.length > 0 && (
      <div className="m-xuanfu-handle">
        <ul className="m-handle-list" style={{ display: this.state.isHide ? 'none' : 'block' }}>
          <SystemSetting icon="icon-setLine" updateQuickOperationData={this.updateQuickOperationData} authedQuickOperationData={authedQuickOperationData} name={name} handleThemeChange={handleThemeChange} theme={theme} />
          {/* {

            authedQuickOperationData.map((item) => {
              const { title, path, icon = '', key = '' } = item;
              if (path === 'sendMessages') { // 发送消息组件
                return (
                  <li key={key} >
                    <span className="m-handle-icon"><i className="iconfont icon-newsAll" /></span>
                    <span className="m-handle-text"><SendMessage userBusinessRole={userBusinessRole} selectedRowKeys={[]} opeType={1} btnType="span" str={item.title} dictionary={dictionary} className="" /></span>
                  </li>
                );
              } else if (path === 'serviceRecord') { // 填写服务记录组件
                return (
                  <FillServiceRecord key={key} icon={icon} userBusinessRole={userBusinessRole} title={title} dictionary={dictionary} />
                );
              } else if (path === 'SystemSetting') { // 系统设置组件
                return (
                  <SystemSetting key={key} icon={icon} updateQuickOperationData={this.updateQuickOperationData} authedQuickOperationData={authedQuickOperationData} name={name} handleThemeChange={handleThemeChange} theme={theme} />
                );
              } else if (path === 'FeedBack') { // 意见反馈组件
                return (
                  <FeedBack key={key} icon={icon} name={name} menuTree={menuTree} menuSchemeName={menuSchemeName} />
                );
              } else if (path === 'RecentlyVisited') { // 历史记录组件
                return (
                  <RecentlyVisited key={key} menuTree={menuTree} icon={icon} />
                  // null
                );
              } else if (path === 'VersionInformation') { // 版本信息组件
                return (
                  <VersionInformation key={key} icon={icon} />
                );
              } else if (path) { // 需要跳转页面的组件
                return (
                  <li key={key} onClick={() => { dispatch(routerRedux.push(path)); }}>
                    <span className="m-handle-icon"><i className={`iconfont ${icon || 'icon-nearby'}`} /></span>
                    <span className="m-handle-text">{title}</span>
                  </li>
);
              }
              return (
                <li key={key}>
                  <span className="m-handle-icon"><i className={`iconfont ${icon || 'icon-nearby'}`} /></span>
                  <span className="m-handle-text">{title}</span>
                </li>
              );

            })
          } */}
        </ul>
        {!this.state.isHide && <a className="m-handle-item m-shouqi" href="#" onClick={(e) => { e.preventDefault(); this.closeList(); }}>收起</a>}
        {this.state.isHide && <a className="m-handle-item m-zhankai" href="#" onMouseEnter={this.openList} onClick={(e) => { e.preventDefault(); this.openList(); }}><u className="m-arrow" /></a>}
      </div>
      )
    );
  }
}

export default HyperLink;
