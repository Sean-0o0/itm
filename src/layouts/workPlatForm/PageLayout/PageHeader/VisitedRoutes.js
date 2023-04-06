import React, { useEffect, useState, useRef } from 'react';
import { routerRedux } from 'dva/router';
import { Link } from 'umi';
import { Icon, Dropdown, Menu } from 'antd';
import { dropByCacheKey } from 'react-router-cache-route';
import styles from './visitedRoutes.less';


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
      children && children.length > 0 ? treeDataToCompressed(children, childrenName) : '';// 子级递归
    }
    return arrayData;
  };
  return treeDataToCompressed(treeData, childrenName);
}

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

  const { location: { pathname = '', search = '' } } = history;
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

  useEffect(() => {
    if (menuTree.length > 0) {
      // if (!urls.includes(newPathname) && newPathname !== homePage) {
      if (!urls.includes(newPathname)) {
        setUrls([...urls, newPathname]);
      }
    }
  }, [newPathname, menuArray, urls, menuTree, homePage]);

  useEffect(() => {
    setUrls([]);
  }, [projectName]);

  const closePage = (url) => {
    const newUrls = [...urls];
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
  const closeOthers = (url) => {
    setUrls([url]);
  };

  // 没有菜单数据时候不存在历史浏览
  if (menuTree.length === 0) {
    return null;
  }

  let tabCount = 0;

  return (
    <div style={{width: '136px', height: '100%'}} className='clearfix' id='visited-scroll'>
      {/* <div className={`cur-tabs ${styles.tagview} ${newPathname === homePage && styles.isActive}`}>
        <Link to={homePage}>
          <i className="iconfont icon-home" style={{ display: 'inline-block', height: '3.286rem' }} />
          <span style={{ margin: '0 1rem' }}>首页</span>
        </Link>
      </div> */}
      {
        urls.length > 0 && urls.map((item) => {
          let {url = '', title = ''} = menuArray.find(m => m.url === item) || {};
          if (title === '' && routerList.length > 0) {
            const listIndex = routerList.findIndex((tempItem) => {
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
            <div key={url} className={`cur-tabs ${styles.tagview} `}
              style={{ height: '100%' }}>
              <div className = {`${styles.curTabsBak} ${newPathname === url && styles.isActive}`}>
                <Link to={url}>{title}</Link>
                <i className="iconfont icon-close" style={{marginLeft: '20px'}} onClick={() => {
                  closePage(url);
                }}/>
              </div>
              {/* <Icon type="close-circle" theme="twoTone" twoToneColor="#ec6057"  /> */}
            </div>
          );
        })
      }
      {
        false && (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <a onClick={() => {
                    closeAll();
                  }}>
                    关闭全部
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => {
                    closeOthers(newPathname);
                  }}>
                    关闭其他
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <div ref={moreIconRef} className={styles.tagview} style={{
              position: 'absolute',
              left: visitedScroll,
              zIndex: 2,
              background: '#ffffff',
              borderLeft: 'none',
              height: '100%',
              padding: '0 4px'
            }}>
              <Icon type="more" style={{ fontSize:12, margin: 0, color: '#1e2536' }} />
            </div>
          </Dropdown>
        )
      }
    </div>
  );
}

export default VisitedRoutes;
