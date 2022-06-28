import React from 'react';
import lodash from 'lodash';
import { Link } from 'dva/router';
import { Menu, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import { FetchQueryHrPrfmStsSchd, FetchqueryExamTotal } from '../../../../../services/EsaServices/assessmentEvaluation';
import { FetchSysCommonTable } from '../../../../../services/sysCommon';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
  FetchQueryAssessPlanWfList,
  FetchQueryOptionRela,
  FetchQueryBusResponWfList,
  FetchQueryBusResponOptionRela,
} from '../../../../../services/planning/planning';

// 用于生成uuid
const S4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
};
const guid = () => {
  return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
};
class LeftContent extends React.Component {
  state = {
    openKeys: [],
    num: 0,
    examParams: {
      orgId: '1',//组织机构
      yr: moment().add(-1, 'y').year().toString(), //年度
      pgmId: '',
    },
    numTotal: 0,
    numProcess: 0,//考核管理-考核审批待办条数
    numAdvice:0,//考核管理-意见反馈待办条数
    numProcess1:0,//经营计划-考核审批待办条数
    numAdvice1:0,//经营计划-意见反馈待办条数
  }
  componentDidMount() {
    //添加setItemEvent监听事件
    window.addEventListener("setItemEvent", this.addEvent);
  }
  addEvent = (e) => {
    if (e.key === 'examTotal') {
      let oldValue = localStorage.getItem("examTotal")
      if (oldValue !== e.newValue && e.newValue !== null) {
        this.setState({ numTotal: e.newValue });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const { selectedMenuKeys: preMenuKeys = ['']} = this.props;
    const { selectedMenuKeys: aftMenuKeys = [''], collapsed,subMenuTree = [] } = nextProps;
    if (preMenuKeys[0] !== aftMenuKeys[0]) {
      this.setState({
        openKeys: collapsed ? [] : [aftMenuKeys[1]],
      });
    }
    if (nextProps.location.pathname !== this.props.location.pathname && nextProps.location.pathname === "/esa/evaluation/v2/assessmentList") {
      this.fetchQueryHrPrfmStsSchd();
    }
    if (nextProps.location.pathname !== this.props.location.pathname && this.props.location.pathname === "/esa/evaluation/v2/leaderEvaluate") {
      this.fetchqueryExamTota();
    }
    if (subMenuTree !== this.props.subMenuTree) {
      subMenuTree.map((item) => {
        const tempSubMenuTree = lodash.get(item, 'menu.item', []);
        tempSubMenuTree.map((temp) => {
          if (temp.object === "BasicScoring") { // 基础打分
            this.fetchQueryHrPrfmStsSchd();
          }
          if (temp.object === "LeadersInChargeScore") { // 考评汇总
            if (!window.removeExamTotal && window.removeExamTotal !== null) {
              window.removeExamTotal = new Event("removeItemEvent");
            }
            this.fetchProgramme();
          }
          if (temp.object === "assessPlanWorkflow") { // 考核方案审批
            this.fetchQueryAssessPlanWfList();
          }
          if (temp.object === "adviceFeedback") { // 考核方案意见反馈
            this.fetchQueryOptionRela();
          }
          if (temp.object === "busResponWorkflow") { // 经营责任状审批
            this.fetchQueryBusResponWfList();
          }
          if (temp.object === "busResponOption") { // 经营责任状意见反馈
            this.fetchQueryBusResponOptionRela();
          }
        })
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener('setItemEvent', this.addEvent);
  }
  //获取考核方案审批待办数据
  fetchQueryAssessPlanWfList = () => {
    FetchQueryAssessPlanWfList(
      {
        "wfType": 1
      }
    ).then(
      res => {
        const { records, code } = res
        if (code > 0) {
          this.setState({
            numProcess: records.length,
          })
        }

      }
    ).catch()
  }
  //经营责任状审批待办条数
  fetchQueryBusResponWfList = () => {
    FetchQueryBusResponWfList(
      {
        "wfType": 1
      }
    ).then(
      res => {
        const { records, code } = res
        if (code > 0) {
          this.setState({
            numProcess1: records.length,
          })
        }

      }
    ).catch()
  }
  //获取考核方案意见反馈待办数据
  fetchQueryOptionRela = () => {
    let myDate = new Date();
    let year = myDate.getFullYear();
    FetchQueryOptionRela({
      year
    }).then(res => {
      const { code = 0,note = ""} = res;
      if (code > 0) {
        this.setState({
          numAdvice: parseInt(note),
        })
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    })
  }
  //经营责任状意见反馈待办条数
  fetchQueryBusResponOptionRela = () => {
    let myDate = new Date();
    let year = myDate.getFullYear();
    FetchQueryBusResponOptionRela({
      year
    }).then(res => {
      const { code = 0, note = ""} = res;
      if (code > 0) {
        this.setState({ numAdvice1: parseInt(note), });
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    })
  }
  fetchQueryHrPrfmStsSchd = (yr = moment().add(-1, 'y').year()) => {
    FetchQueryHrPrfmStsSchd({ yr }).then(res => {
      const { code, note, records } = res;
      if (code > 0) {
        const numList = records.filter((item) => item.status !== '2' );
        this.setState({ num: numList.length });
      } else {
        message.error(note);
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    })
  }

  //获取考核方案
  fetchProgramme = () => {
    const { examParams } = this.state;
    FetchSysCommonTable({ objectName: 'TPRFM_PGM' }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0 && records.length > 0) {
        this.setState({
          examParams: {
            ...examParams,
            pgmId: records[0].PGM_NO,
          }
        }, () => { this.fetchqueryExamTota(); });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
  }
  fetchqueryExamTota = () => {
    const { examParams } = this.state;
    const params = {
      paging: 0,
      current: 1,
      pageSize: 99,
      total: -1,
      sort: '',
      ...examParams,
    }
    FetchqueryExamTotal(params).then(res => {
      const { records = [], code = 0 } = res;
      if (code > 0 && records.length > 0) {
        const numList = records.filter((item) => item.flag === '1' );
        this.setState({ numTotal: numList.length });
        window.removeEventListener('removeItemEvent', this.addEvent);
      }
    }).catch(e => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  handleExclude = (pathname = '') => {
    const includes = ['/UIProcessor', '/OperateProcessor', '/ShowWorkflow'];
    let flag = true;
    includes.forEach((item) => {
      if (pathname.startsWith(item)) {
        flag = false;
      }
    });
    return flag;
  }

  getSubMenu = (subMenuTree = []) => {
    const { menuLangKey, collapsed = false, subMenuTree: propsTree = [] } = this.props;
    return (
      subMenuTree.map((item) => {
        const tempSubMenuTree = lodash.get(item, 'menu.item', []);
        let path = lodash.get(item, 'url', '');
        let fiframeUrl = '';
        if (path.startsWith('{') && path.endsWith('}')) {
          fiframeUrl = JSON.parse(path);
          const custType = fiframeUrl.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
          fiframeUrl = fiframeUrl.url || '';
          if (custType === 'ifm') {
            if (fiframeUrl.startsWith('http')) {
              fiframeUrl = `/iframe/${fiframeUrl}`;
            } else {
              fiframeUrl = `/iframe${fiframeUrl}`;
            }
          }
        }
        const hasChild = tempSubMenuTree.length !== 0;
        const name = menuLangKey(item);
        const toLinkObjMain = {
          pathname: fiframeUrl || path,
        };
        if (hasChild) {
          return (
            <Menu.SubMenu
              key={name}
              title={
                <span>
                  <i className={`iconfont ${lodash.get(item, 'iconUrl') || 'icon-productK'}`} style={{ fontSize: collapsed ? '1.833rem' : '' }} />
                  {(!collapsed || (collapsed && JSON.stringify(propsTree) !== JSON.stringify(subMenuTree))) && <span className="hide-menu">{name}</span>}
                </span>
              }
              style={{ paddingLeft: JSON.stringify(propsTree) !== JSON.stringify(subMenuTree) && '.5rem' }}
            >
              {
                tempSubMenuTree.map((temp) => {
                  const subName = menuLangKey(temp);
                  let itemPath = lodash.get(temp, 'url', '');
                  let toLinkObj = {
                    pathname: itemPath,
                  };
                  let iframeUrl = '';
                  if (itemPath.startsWith('{') && itemPath.endsWith('}')) {
                    iframeUrl = JSON.parse(itemPath);
                    const custType = iframeUrl.type; // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
                    iframeUrl = iframeUrl.url || '';
                    if (custType === 'ifm') {
                      if (iframeUrl.startsWith('http')) {
                        iframeUrl = `/iframe/${iframeUrl}`;
                      } else {
                        iframeUrl = `/iframe${iframeUrl}`;
                      }
                    }
                  } else {
                    toLinkObj = { pathname: itemPath };
                  }
                  // 递归
                  const circleMenu = lodash.get(temp, 'menu.item', []);
                  if (circleMenu.length > 0) {
                    return (
                      <Menu.SubMenu
                        popupClassName="default-dark-theme popup-menu"
                        className={JSON.stringify(propsTree) === JSON.stringify(subMenuTree) && styles.moreSubMenu}
                        key={subName}
                        title={
                          <span>
                            <i className={`iconfont ${lodash.get(item, 'iconUrl') || 'icon-productK'}`} style={{ fontSize: collapsed ? '1.833rem' : '' }} />
                            <span className="hide-menu">{subName}</span>
                          </span>
                        }
                        style={{ paddingLeft: '.5rem' }}
                      >
                        {this.getSubMenu(circleMenu)}
                      </Menu.SubMenu>
                    );
                  }
                  let otherUrl = '';
                  if (this.handleExclude(itemPath)) {
                    otherUrl = itemPath;
                  } else {
                    otherUrl = toLinkObj;
                  }
                  return (
                    <Menu.Item key={subName}>
                      <Link
                        key={guid()}
                        to={iframeUrl || otherUrl}
                        target={lodash.get(temp, 'windowType', '0') === 1 ? 'blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
                        replace={itemPath === this.props.location.pathname}
                        title={lodash.get(temp, 'title[0].text', '')}
                      >
                        <i className={`iconfont ${lodash.get(item, 'iconUrl') || 'icon-productK'}`} style={{ fontSize: collapsed ? '1.833rem' : '' }} />&nbsp;&nbsp;
                        <span>
                          {lodash.get(temp, 'title[0].text', '')}
                          {itemPath === '/esa/evaluation/v2/assessmentList' &&
                          <i className={`${styles.m_icon_msg}`} >
                            <span>{this.state.num}</span>
                          </i>}
                          {itemPath === '/esa/evaluation/v2/leaderEvaluate' &&
                          <i className={`${styles.m_icon_msg}`} >
                            <span>{this.state.numTotal}</span>
                          </i>}
                          {itemPath === '/esa/planning/ApprovalProcess' &&
                          <i className={`${styles.m_icon_msg}`} >
                            <span>{this.state.numProcess}</span>
                          </i>}
                          {itemPath === '/esa/planning/adviceFeedback' &&
                          <i className={`${styles.m_icon_msg}`} >
                            <span>{this.state.numAdvice}</span>
                          </i>}
                          {itemPath === '/esa/planning/BusApprovalProcess' &&
                          <i className={`${styles.m_icon_msg}`} >
                            <span>{this.state.numProcess1}</span>
                          </i>}
                          {itemPath === '/esa/planning/busAdviceFeedback' &&
                          <i className={`${styles.m_icon_msg}`} >
                            <span>{this.state.numAdvice1}</span>
                          </i>}
                        </span>
                      </Link>
                    </Menu.Item>
                  );
                })
              }
            </Menu.SubMenu>
          );
        }

        //
        let nowUrl = '';
        let nowIcon = <i className={`iconfont ${lodash.get(item, 'iconUrl') || 'icon-productK'}`} style={{ fontSize: collapsed ? '1.833rem' : '' }} />;
        if (this.handleExclude(path)) {
          nowUrl = fiframeUrl ? `${fiframeUrl}` : path;
        } else {
          nowUrl = toLinkObjMain;
          nowIcon = (
            <i aria-label="图标: desktop" className="anticon anticon-desktop">
              {nowIcon}
            </i>
          );
        }
        return (
          <Menu.Item key={name} >
            <span>
              {nowIcon}
              {(!collapsed || (collapsed && JSON.stringify(propsTree) !== JSON.stringify(subMenuTree))) && <span className="hide-menu">{name}</span>}
            </span>
            <Link
              key={guid()}
              title={lodash.get(item, 'title[0].text', '')}
              to={nowUrl}
              target={lodash.get(item, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式-
              replace={path === this.props.location.pathname}
            >
              <span>{lodash.get(item, 'title[0].text', '')}</span>
            </Link>
          </Menu.Item>
        );
      })
    );
  }

  render() {
    const { subMenuTree = [], selectedMenuKeys, collapsed, toggleCollapsed } = this.props;
    return (
      <React.Fragment>
        <div className="m-sider-top" style={{ display: subMenuTree.length === 0 ? 'none' : '' }}>
          <Scrollbars
            autoHide
            style={{ width: '100%', height: '100%' }}
          >
            <Menu
              className={`${styles.m_menu} m-menu m-menu-xin`}
              selectedKeys={[selectedMenuKeys[selectedMenuKeys.length - 1]]}
              openKeys={this.state.openKeys}
              mode="inline"
              theme="dark"
              onOpenChange={(value) => { this.setState({ openKeys: value }); }}
              inlineCollapsed={collapsed}
            >
              {this.getSubMenu(subMenuTree)}
            </Menu>
          </Scrollbars>
        </div>
        <div className="m-sider m-sider-xin" style={{ overflow: 'hidden', display: subMenuTree.length === 0 ? 'none' : '' }} onClick={toggleCollapsed}>
          <div className="m-sider-head">
            <h3>
              <span>
                <i className="iconfont icon-menu" />
              </span>
            </h3>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default LeftContent;
