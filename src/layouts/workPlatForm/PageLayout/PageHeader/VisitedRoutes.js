import React, { useEffect, useState, useRef } from 'react';
import { routerRedux } from 'dva/router';
import { Link } from 'umi';
import { Icon, Dropdown, Menu, Divider, Tabs } from 'antd';
import { dropByCacheKey } from 'react-router-cache-route';
import styles from './visitedRoutes.less';
import './visitedRoutes.less';

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
  const { menuTree, history, routerList = [], projectName } = props;
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
      if (!urls.includes(newPathname)) {
        setUrls([...urls, newPathname]);
      } else {
        setUrls([...urls.filter(x => x !== newPathname), newPathname]);
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
    const matchFilter = regExp => {
      const matches = arr.filter(x => regExp.test(x));
      matches.forEach((m, i) => {
        if (i !== matches.length - 1) {
          arr = arr.filter(x => x !== m);
        }
      });
    };
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
      /^\/pms\/manage\/ResumeDistribution/,
      /^\/pms\/manage\/SupplierDmInfo/,
    ];
    regExpArr.forEach(regExp => {
      matchFilter(regExp);
    });
    return arr;
  };

  let tabCount = 0;

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
        <TabPane
          tab={<Link to="/pms/manage/HomePage">个人工作台</Link>}
          closable={false}
          key="/pms/manage/HomePage"
        ></TabPane>
        {handleUrls(urls).length > 0 &&
          handleUrls(urls).map(item => {
            let { url = '', title = '' } = menuArray.find(m => m.url === item) || {};
            let urlEndArr = [
              {
                title: '项目详情',
                urlEnd: 'ProjectDetail',
              },
              {
                title: '项目列表',
                urlEnd: 'ProjectInfo',
              },
              {
                title: '人员详情',
                urlEnd: 'staffDetail',
              },
              {
                title: '标签详情',
                urlEnd: 'labelDetail',
              },
              {
                title: '文档列表',
                urlEnd: 'attachLibrary',
              },
              {
                title: '供应商详情',
                urlEnd: 'SupplierDetail',
              },
              {
                title: '项目建设情况',
                urlEnd: 'projectBuilding',
              },
              {
                title: '部门人员情况',
                urlEnd: 'departmentOverview',
              },
              {
                title: '预算执行情况',
                urlEnd: 'BudgetExcute',
              },
              {
                title: '供应商情况',
                urlEnd: 'SupplierSituation',
              },
              {
                title: '需求详情',
                urlEnd: 'DemandDetail',
              },
              {
                title: '需求列表',
                urlEnd: 'DemandInfo',
              },
              {
                title: '人员列表',
                urlEnd: 'MemberInfo',
              },
              {
                title: '简历分发',
                urlEnd: 'ResumeDistribution',
              },
              {
                title: '供应商需求',
                urlEnd: 'SupplierDmInfo',
              },
            ];
            urlEndArr.forEach(x => {
              if (item.includes('/pms/manage/' + x.urlEnd)) {
                url = item;
                title = x.title;
              }
            });
            if (item.includes('/pms/manage/HomePage')) {
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
