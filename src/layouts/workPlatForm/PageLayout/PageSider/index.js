import React from 'react';
import { Link } from 'umi';
import { Menu } from 'antd';
import _, { lt } from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import defaultLogo from '../../../../assets/loginImg/LOGO.png';

const { SubMenu } = Menu;

export default class PageSider extends React.Component {
  state = {
    openKeys: [],
    mouseOverStyle: '',
    selectedKeys: [],

  };

  componentDidUpdate(prevProps, prevState) {
    const {history} = this.props;
    const {location: {pathname = '', search = ''}} = history;
    const oldPathname = prevState.selectedKeys[0] || '';
    const newPathname = pathname + search;
    if (oldPathname !== newPathname) {
      this.setState({
        selectedKeys: [newPathname],
      });
    }

  }

  onOpenChange = (openKeys) => {
    sessionStorage.setItem('openKeys', JSON.stringify(openKeys));
    this.setState({
      openKeys,
    });
  };

  componentDidMount() {
    let openKeys = JSON.parse(sessionStorage.getItem('openKeys'));
    this.setState({
      openKeys: openKeys || [],
    });
  }

  render() {
    const {menuTree = [], collapsed} = this.props;
    const {selectedKeys = [], openKeys = []} = this.state;
    const sysName = localStorage.getItem('sysName');
    // const arr = [];
    // for (let i = 0; i < 25; i++) {
    //   arr.push({
    //     "url": "/UIProcessor?Table=YWSPRBZGSQGL&ObjDescribe=gc8E9gMTrRZdAx4FSHnzdcCZiKbwC58Li*p3laW3kdIuLF3HllK9mQ..&hideTitlebar=true",
    //     "title": "审批人不在岗授权管理",
    //     "openType": "_self",
    //     "fid": "0bc72e20-d73c-bb4c-f354-c0e130f0c2d5",
    //     "root": "6b6620e2-503f-39fc-f1f8-2653301fbcd0",
    //     "icon": "",
    //     "children": []
    //   });
    // }

    return (
      <React.Fragment>
        {/*{*/}
        {/*  collapsed ? (*/}
        {/*    <div className="zj-sub-logo">*/}
        {/*      <img src={defaultLogo} />*/}
        {/*    </div>*/}
        {/*  ) : (*/}
        {/*    <div className="zj-sub-eplogo" style={{ whiteSpace: 'nowrap', position: 'relative'}}>*/}
        {/*      <img src={defaultLogo} />*/}
        {/*      <div>*/}
        {/*        <p className="zj-sub-epname" style={{position: 'absolute', top: '9rem',width: '100%', textAlign: 'center'}}>{sysName}</p>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  )*/}
        {/*}*/}
        <Scrollbars
          autoHide
          style={{width: '100%', height: 'calc(100% - 19rem)'}}
        >
          <Menu
            theme='light'
            selectedKeys={selectedKeys}
            mode='inline'

            openKeys={openKeys}
            onOpenChange={this.onOpenChange}
            // style={{ background: '#000' }}
            className={`${styles.m_menu} m-menu ${collapsed && styles.collapsedMenu}`}
          >
            {
              menuTree.map(item => {
                const {children = [], url = ''} = item;
                if (children.length > 0) {
                  return (
                    <SubMenu
                      key={item.title}
                      popupClassName = 'ant-menu-submenu-title-sub'
                      // key={item.url}
                      title={
                        collapsed ?
                          (
                            <div style={{textAlign: 'center', lineHeight: '1.3', margin: '2rem 0',}}>
                              <i className={`zj-submenu-ico iconfont ${item.icon || ' icon-productK'}`}></i>
                              {/*<div className='zj-submenu-txt'>{item.title}</div>*/}
                            </div>
                          )
                          :
                          (
                            <span >
                              <i className={`iconfont ${item.icon || ' icon-productK'}`}></i>
                              <span>{item.title}</span>
                            </span>
                          )
                      }
                    >
                      {
                        children.map(element => {
                          const {children: menus = []} = element;
                          if (menus.length > 0) {
                            return (
                              <SubMenu
                                key={element.title}
                                // key={element.url}
                                title={
                                  <span>
                                    {/*<span><i className={`iconfont ${element.icon || ' icon-productK'}`}></i></span>*/}
                                    <span>{element.title}</span>
                                  </span>
                                }
                              >
                                {/*第三级菜单*/}
                                {
                                  menus.map(item => {
                                    const {children = [], url = ''} = item;
                                    // 四级菜单数量
                                    if (children.length > 0) {
                                      return (
                                        <SubMenu
                                          key={item.title}
                                          // key={item.url}
                                          className={children.length > 10 ? children.length > 20 ? children.length > 30 ? 'third-sub-menu-fourline' : 'third-sub-menu-threeline' : 'third-sub-menu-line' : ''}
                                          title={
                                            <span>
                                              {/*<i className={`iconfont ${item.icon || ' icon-productK'}`}></i>*/}
                                              <span>{item.title}</span>
                                            </span>
                                          }
                                        >
                                          {
                                            children.map(element => {
                                              const {children: menus = []} = element;
                                              if (menus.length > 0) {
                                                return (
                                                  <SubMenu
                                                    key={element.title}
                                                    // key={element.url}
                                                    title={
                                                      <span>
                                                        {/*<span><i className={`iconfont ${element.icon || ' icon-productK'}`}></i></span>*/}
                                                        <span>{element.title}</span>
                                                      </span>
                                                    }
                                                  >
                                                    {
                                                      menus.map(menu => {
                                                        return <Menu.Item key={menu.url}><Link target={menu.openType}
                                                                                               to={menu.url}>
                                                          {/*<i className={`iconfont ${menu.icon || ' icon-productK'}`}/>*/}
                                                          {menu.title}
                                                        </Link></Menu.Item>;
                                                      })
                                                    }
                                                  </SubMenu>
                                                );
                                              }
                                              if (_.toString(element.url).slice(0, 1) !== '/') {
                                                return <Menu.Item key={element.url}><a target={element.openType}
                                                                                       href={element.url}>
                                                  {/*<i className={`iconfont ${element.icon || ' icon-productK'}`}/>*/}
                                                  {element.title}
                                                </a></Menu.Item>;
                                              }
                                              return <Menu.Item key={element.url}><Link target={element.openType}
                                                                                        to={element.url}>
                                                {/*<i className={`iconfont ${element.icon || ' icon-productK'}`}/>*/}
                                                {element.title}
                                              </Link></Menu.Item>;
                                            })
                                          }
                                        </SubMenu>
                                      );
                                    }
                                    //没有四级菜单,三级菜单的展示
                                    if (_.toString(item.url).slice(0, 1) !== '/') {
                                      return <Menu.Item key={item.url}><a target={item.openType} href={item.url}>
                                        {/*<i className={`iconfont ${item.icon || ' icon-productK'}`}/>*/}
                                        {item.title}
                                      </a></Menu.Item>;
                                    }
                                    return <Menu.Item key={item.url}><Link target={item.openType} to={item.url}>
                                      {/*<i className={`iconfont ${item.icon || ' icon-productK'}`}/>*/}
                                      {item.title}
                                    </Link></Menu.Item>;
                                  })
                                }
                              </SubMenu>
                            );
                          }
                          if (_.toString(element.url).slice(0, 1) !== '/') {
                            return <Menu.Item key={item.url}><a target={element.openType} href={element.url}>
                              {/*<i className={`iconfont ${element.icon || ' icon-productK'}`}/>*/}
                              {element.title}
                            </a></Menu.Item>;
                          }
                          return <Menu.Item key={element.url}><Link target={element.openType} to={element.url}>
                            {/*<i className={`iconfont ${element.icon || ' icon-productK'}`}/>*/}
                            {element.title}
                          </Link></Menu.Item>;
                        })
                      }
                    </SubMenu>
                  );
                }
                return url !== '/noTabsPage' ? <Menu.Item key={item.url}><Link target={item.openType} to={item.url}><i
                  className={`zj-submenu-ico iconfont ${item.icon || ' icon-time'}`}/>
                  {collapsed ?'':<span className='zj-submenu-txt'>{item.title}</span>}
                </Link></Menu.Item> : null;
              })
            }
          </Menu>
        </Scrollbars>
      </React.Fragment>
    );
  }
}
