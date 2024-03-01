import React, { useEffect, useState, useRef } from 'react';
import { routerRedux } from 'dva/router';
import { Link } from 'umi';
import { Icon, Dropdown, Menu, Divider, Tabs } from 'antd';
import { dropByCacheKey } from 'react-router-cache-route';
import styles from './visitedRoutes.less';
import './visitedRoutes.less';
import { specialMenus } from '../../../../utils/recentlyVisiteUtils';
import { get } from 'lodash';

/**
 * 把树型结构数据转成扁平数据
 * @param source
 */
function treeToArrayData(treeData, childrenName) {
  const arrayData = [];
  const treeDataToCompressed = (source, childrenName) => {
    for (const i in source) {
      const { [childrenName]: children = [], ...primaryData } = source[i];
      arrayData.push(primaryData);
      children && children.length > 0 ? treeDataToCompressed(children, childrenName) : ''; // 子级递归
    }
    return arrayData;
  };
  return treeDataToCompressed(treeData, childrenName);
}
const { TabPane } = Tabs;
function VisitedRoutes(props) {
  // props
  const { menuTree, history, routerList = [], projectName, authorities } = props;
  // state
  const [urls, setUrls] = useState([]);
  // const [isFixedMore, setIsFixedMore] = useState(false);
  // const [operationDropsWidth, setOperationDropsWidth] = useState(0);
  const [visitedScroll, setVisitedScroll] = useState(0);

  const moreIconRef = useRef(null);

  // 将树状结构转化为数组结构方便查找name
  const menuArray = treeToArrayData(menuTree, 'children');

  const {
    location: { pathname = '', search = '' },
  } = history;
  let newPathname = pathname + search;
  if (pathname && pathname.includes('/pms/manage/LifeCycleManagement')) {
    newPathname = '/pms/manage/LifeCycleManagement';
  }

  const calclateMoreIconPosition = () => {
    const visitedRoutes = document.getElementsByClassName('cur-tabs') || [];
    let totalWidth = 0;
    for (let i = 0; i < visitedRoutes.length; i++) {
      totalWidth += visitedRoutes[i].offsetWidth;
    }
    setVisitedScroll(totalWidth + 2);
  };

  useEffect(() => {
    setTimeout(calclateMoreIconPosition);
  }, [newPathname]);

  useEffect(calclateMoreIconPosition, [urls]);

  // 获取第一个菜单作为首页
  const homePage = '/index';

  // useEffect(() => {
  //   if (menuTree.length > 0) {
  //     // if (!urls.includes(newPathname) && newPathname !== homePage) {
  //     if (!urls.includes(newPathname)) {
  //       setUrls([...urls, newPathname]);
  //     }
  //   }
  // }, [newPathname, menuArray, urls, menuTree, homePage]);
  useEffect(() => {
    if (menuTree.length > 0) {
      let urlArr = [...urls];
      const parts = newPathname.split('/');
      const finalPathname = parts.slice(0, 4).join('/'); //取pms/manage/xx
      // console.log('🚀 ~ urlArr, newPathname:', urlArr, newPathname, finalPathname);
      // const index = urlArr.findIndex(x => x.includes(finalPathname) || finalPathname.includes(x));
      const index = urlArr.findIndex(x => x.includes(finalPathname));
      // console.log("🚀 ~ file: VisitedRoutes.js:82 ~ useEffect ~ index:", index)
      if (index !== -1) {
        urlArr.splice(index, 1, newPathname); //若有相同的pms/manage/xx，则原位替换，只保留一个
        setUrls([...urlArr]);
      } else {
        setUrls([...urls, newPathname]);
      }
    }
  }, [newPathname, menuTree]);

  useEffect(() => {
    setUrls([]);
  }, [projectName]);

  const closePage = url => {
    const newUrls = handleUrls(urls);
    const index = newUrls.indexOf(url);
    newUrls.splice(index, 1);
    if (url === newPathname) {
      let jumpPage = homePage;
      if (index > 0) {
        jumpPage = newUrls[index - 1];
      }
      props.dispatch(routerRedux.push(jumpPage));
    }
    setUrls(newUrls);
    dropByCacheKey(url); // 清除缓存
  };

  // 关闭所有页面
  const closeAll = () => {
    setUrls([]);
    props.dispatch(routerRedux.push(homePage));
  };

  // 关闭其他页面
  const closeOthers = url => {
    setUrls([url]);
  };

  // 没有菜单数据时候不存在历史浏览
  if (menuTree.length === 0) {
    return null;
  }
  const handleUrls = (urls = []) => {
    let arr = [...urls];
    // console.log('🚀 ~ file: VisitedRoutes.js:121 ~ handleUrls ~ arr:', arr);
    const matchFilter = regExp => {
      const matches = arr.filter(x => regExp.test(x));
      matches.forEach((m, i) => {
        if (i !== matches.length - 1) {
          arr = arr.filter(x => x !== m);
        }
      });
    };
    //尾部有带参数的页面需要配置
    let regExpArr = [
      /^\/pms\/manage\/ProjectInfo/,
      /^\/pms\/manage\/ProjectDetail/,
      /^\/pms\/manage\/staffDetail/,
      /^\/pms\/manage\/labelDetail/,
      /^\/pms\/manage\/attachLibrary/,
      /^\/pms\/manage\/SupplierDetail/,
      /^\/pms\/manage\/DemandDetail/,
      /^\/pms\/manage\/DemandInfo/,
      /^\/pms\/manage\/MemberInfo/,
      /^\/pms\/manage\/MemberDetail/,
      /^\/pms\/manage\/ResumeDistribution/,
      /^\/pms\/manage\/SupplierDmInfo/,
      /^\/pms\/manage\/ExpenseInfo/,
      /^\/pms\/manage\/CustomRptManagement/,
      /^\/pms\/manage\/CustomRptInfo/,
      /^\/pms\/manage\/CustomReportDetail/,
      /^\/pms\/manage\/CustomReportInfo/,
      /^\/pms\/manage\/BudgetStatistic/,
      /^\/pms\/manage\/AttendanceStatistic/,
      /^\/pms\/manage\/XwhExamine/,
      /^\/pms\/manage\/ProjectStatisticsInfo/,
      /^\/pms\/manage\/IntelProperty/,
      /^\/pms\/manage\/AwardHonor/,
      /^\/pms\/manage\/InnovationContract/,
      /^\/pms\/manage\/InnovationContractEdit/,
      /^\/pms\/manage\/InnovationContractView/,
      /^\/pms\/manage\/BudgetSubmit/,
      /^\/pms\/manage\/Carryover/,
    ];
    regExpArr.forEach(regExp => {
      matchFilter(regExp);
    });
    return arr;
  };

  let tabCount = 0;
  const { TGYS_GYSRYQX, V_GYSRYQX, V_RYKQ } = authorities;

  return (
    <div className={'clearfix top-tabs-box'} id="visited-scroll">
      <Tabs
        type="editable-card"
        hideAdd={true}
        onEdit={(targetKey, action) => {
          if (action === 'remove') closePage(targetKey);
        }}
        activeKey={newPathname}
      >
        {TGYS_GYSRYQX === undefined && V_GYSRYQX === undefined && V_RYKQ === undefined ? (
          <TabPane
            tab={<Link to="/pms/manage/HomePage">个人工作台</Link>}
            closable={false}
            key="/pms/manage/HomePage"
          ></TabPane>
        ) : V_RYKQ === undefined ? (
          <TabPane
            tab={<Link to="/pms/manage/SupplierDmInfo">外包需求列表</Link>}
            closable={false}
            key="/pms/manage/SupplierDmInfo"
          ></TabPane>
        ) : (
          <TabPane
            tab={<Link to="/UIProcessor?Table=V_RYKQ&hideTitlebar=true">考勤打卡</Link>}
            closable={false}
            key="/UIProcessor?Table=V_RYKQ&hideTitlebar=true"
          ></TabPane>
        )}
        {handleUrls(urls).length > 0 &&
          handleUrls(urls).map(item => {
            let { url = '', title = '' } = menuArray.find(m => m.url === item) || {};
            //尾部有带参数的页面需要配置
            //有菜单，但带有参数的页面
            let urlArr = [
              {
                title: [{ text: '项目列表' }],
                url: 'ProjectInfo',
              },
              {
                title: [{ text: '文档列表' }],
                url: 'attachLibrary',
              },
              {
                title: [{ text: '需求列表' }],
                url: 'DemandInfo',
              },
              {
                title: [{ text: '人员列表' }],
                url: 'MemberInfo',
              },
              {
                title: [{ text: '费用列表' }],
                url: 'ExpenseInfo',
              },
              {
                title: [{ text: '自定义报告' }],
                url: 'CustomReportInfo',
              },
              {
                title: [{ text: '预算统计' }],
                url: 'BudgetStatistic',
              },
              {
                title: [{ text: '考勤统计' }],
                url: 'AttendanceStatistic',
              },
              {
                title: [{ text: '信委会议案上会审批' }],
                url: 'XwhExamine',
              },
              {
                title: [{ text: '知识产权列表' }],
                url: 'IntelProperty',
              },
              {
                title: [{ text: '获奖荣誉列表' }],
                url: 'AwardHonor',
              },
              {
                title: [{ text: '合同列表' }],
                url: 'InnovationContract',
              },
              {
                title: [{ text: '人员评价' }],
                url: 'MutualEvaluation',
              },
              {
                title: [{ text: '人员评价统计' }],
                url: 'MutualEvaluationSituation',
              },
              {
                title: [{ text: '预算管理' }],
                url: 'BudgetInput',
              },
              {
                title: [{ text: '预算结转' }],
                url: 'BudgetCarryover',
              },
              ...specialMenus,
            ];
            urlArr.forEach(x => {
              if (item.includes(x.url)) {
                url = item;
                title = get(x, 'title[0].text', '');
              }
            });
            if (item.includes('/pms/manage/HomePage')) {
              return null;
            }
            if (V_RYKQ) {
              // url = item;
              // if (item.includes('/UIProcessor?Table=V_RYKQ&hideTitlebar=true')) title = '考勤打卡';
              // else return null;
              return null;
            }
            if (
              (TGYS_GYSRYQX || V_GYSRYQX) &&
              V_RYKQ === undefined &&
              item.includes('/pms/manage/SupplierDmInfo')
            ) {
              return null;
            }
            if (title === '' && routerList.length > 0) {
              const listIndex = routerList.findIndex(tempItem => {
                return item.indexOf(tempItem.path) > -1;
              });
              title = listIndex >= 0 ? routerList[listIndex].note : '';
              url = item;
            }
            if (title === '') {
              return null;
            }
            tabCount++;
            return (
              <TabPane
                className={`${styles.curTabsBak} ${newPathname === url && styles.isActive}`}
                tab={<Link to={url}>{title}</Link>}
                closable={true}
                key={url}
              ></TabPane>
            );
          })}
        {false && (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <a
                    onClick={() => {
                      closeAll();
                    }}
                  >
                    关闭全部
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a
                    onClick={() => {
                      closeOthers(newPathname);
                    }}
                  >
                    关闭其他
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <div
              ref={moreIconRef}
              className={styles.tagview}
              style={{
                position: 'absolute',
                left: visitedScroll,
                zIndex: 2,
                background: '#ffffff',
                borderLeft: 'none',
                height: '100%',
                padding: '0 4px',
              }}
            >
              <Icon type="more" style={{ fontSize: 12, margin: 0, color: '#1e2536' }} />
            </div>
          </Dropdown>
        )}
      </Tabs>
    </div>
  );
}

export default VisitedRoutes;
