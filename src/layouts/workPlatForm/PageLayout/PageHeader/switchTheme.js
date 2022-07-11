import React from 'react';
import { Link } from 'umi';
import { Button, List } from 'antd';
import SendMessage from '../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/SendMessage';
import ServiceRecord from '../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/ServiceRecord';
import styles from './switchTheme.less';

export default class SwitchTheme extends React.Component {
  state={
    showSideBar: false,
    themesData: {
      fullColorTheme: [
        {
          key: 'default-theme',
          title: '默认',
        },
        {
          key: 'green-theme',
          title: '青绿',
        },
        {
          key: 'yellow-theme',
          title: '米黄',
        },
      ],
      darkSideTheme: [
        {
          key: 'default-dark-theme',
          title: '默认',
        },
        {
          key: 'green-dark-theme',
          title: '青绿',
        },
        {
          key: 'blue-dark-theme',
          title: '蓝色',
        },
      ],
    },
    quickMenuData: {
      commonMenuData: [
        {
          key: 'myCustomer',
          auths: ['myCustomer'],
          title: '我的客户',
          path: '/myCustomer',
        },
        {
          key: 'sendMessages',
          auths: ['msgCenter'],
          title: '消息中心',
          path: '/msgCenter',
        },
        {
          key: 'leadGeneration',
          auths: ['customerDevelop'],
          title: '客户开发',
          path: '/customerDevelop',
        },
        {
          key: 'workcenter',
          auths: ['workcenter'],
          title: '流程中心',
          path: '/UIProcessor?Table=WORKFLOW_TOTASKS',
        },
      ],
      quickOperationData: [
        {
          key: 'sendMessages',
          title: '消息发送',
          path: '',
          onClick: () => {

          },
        },
        {
          key: 'serviceRecord',
          title: '填写服务记录',
          path: '',
          onClick: () => {

          },
        },
        // {
        //   key: 'workcenter',
        //   title: '流程中心',
        //   path: '/UIProcessor?Table=WORKFLOW_TOTASKS',
        //   onClick: () => {

        //   },
        // },
      ],
    },
  }
  onClose = () => {
    this.setState({ showSideBar: false });
  }
  handleButtonClick = () => {
    this.setState({ showSideBar: true });
  }
  handleCloseClick = (e) => {
    this.setState({ showSideBar: false });
    e.preventDefault();// 阻止链接跳转行为
  }
  handleThemeClick = (e, key) => {
    const { theme } = this.props;
    if (theme !== key) {
      // 改变当前的选中效果
      if (this.props.handleThemeChange) {
        this.props.handleThemeChange(key);
      }
    }
    this.setState({ showSideBar: false });
    e.preventDefault();// 阻止链接跳转行为
  }
  render() {
    const { showSideBar, themesData: { fullColorTheme, darkSideTheme }, quickMenuData: { commonMenuData, quickOperationData } } = this.state; // eslint-disable-line
    const { location, theme, authorities = {}, dictionary, userBusinessRole } = this.props;
    const authedCommonMenuData = [];
    commonMenuData.forEach((item) => {
      const { auths } = item;
      let authed = false;
      // 判断是否有权限
      if (auths.some(authKey => Object.hasOwnProperty.call(authorities, authKey))) {
        authed = true;
      }
      if (authed) {
        authedCommonMenuData.push(item);
      }
    });
    const authedQuickOperationData = [];
    quickOperationData.forEach((item) => {
      const { key } = item;
      let authed = false;
      if (key === 'sendMessages') {
        const { msgCenter = [] } = authorities;
        if (msgCenter.includes('sendMessage')) {
          authed = true;
        }
      } else if (key === 'serviceRecord') {
        const { customerList = [] } = authorities;
        if (customerList.includes('ServiceRecord')) {
          authed = true;
        }
      } else if (key === 'workcenter') {
        authed = true;
      }
      if (authed) {
        authedQuickOperationData.push(item);
      }
    });
    return (
      <div>
        <div className="m-position" style={{ top: '8.5rem', right: '0.5rem' }}>
          <Button className="set-box" shape="circle" onClick={this.handleButtonClick}>
            <i className="iconfont icon-set" />
          </Button>
        </div>
        {
            showSideBar && (
              <div className="m-right-sidebar m-shw-rside" style={{ width: '22rem' }}>
                <div className="m-rpanel-title" style={{ padding: '0 1.7rem' }}>
                  工具栏
                  <span>
                    <a href="#" onClick={this.handleCloseClick} style={{ color: '#fff' }}><i className="iconfont icon-close" /></a>
                  </span>
                </div>
                <div className="m-r-panel-body">
                  <ul>
                    <li style={{ display: 'block', lineHeight: '1.166rem' }}>主题</li>
                    {
                      darkSideTheme.map(item => (
                        <li key={item.key}>
                          <a href="#" className={`${item.key} ${item.key === theme ? 'working' : ''}`} onClick={e => this.handleThemeClick(e, item.key)}>{item.title}</a>
                        </li>
                      ))
                    }
                  </ul>
                  <List
                    size="small"
                    className={`m-list-icon-small ${styles.list}`}
                    header={<h3 style={{ marginBottom: '0.333rem', fontSize: '1.166rem', border: 'none' }}>常用菜单</h3>}
                    dataSource={authedCommonMenuData}
                    renderItem={item => (
                      <List.Item key={item.key} style={{ padding: '0.25rem 0' }}>
                        <List.Item.Meta
                          style={{ paddingLeft: '1.25rem' }}
                          title={(
                            <Link
                              to={item.path}
                              target={item.target}
                              replace={item.path === location.pathname}
                            >
                              <span onClick={this.onClose}>{item.title}</span>
                            </Link>
                          )}
                        />
                      </List.Item>
                    )}
                  />
                  <List
                    size="small"
                    className={`m-list-icon-small ${styles.list}`}
                    header={<h3 style={{ marginBottom: '0.333rem', fontSize: '1.166rem', border: 'none' }}>快捷操作</h3>}
                    dataSource={authedQuickOperationData}
                    renderItem={(item) => {
                      const { path, key = '' } = item;
                      let node = <div />;
                      if (path) {
                        node = (
                          <Link
                            to={item.path}
                            target={item.target}
                            replace={item.path === location.pathname}
                          >
                            <span onClick={item.onClick}>{item.title}</span>
                          </Link>
                        );
                      } else if (key === 'sendMessages') {
                        node = <SendMessage userBusinessRole={userBusinessRole} selectedRowKeys={[]} opeType={1} btnType="span" str={item.title} dictionary={dictionary} callBackFunc={this.onClose} className="" />;
                      } else if (key === 'serviceRecord') {
                        node = <ServiceRecord userBusinessRole={userBusinessRole} selectedRowKeys={[]} opeType={1} btnType="span" str={item.title} dictionary={dictionary} className="" />;
                      }
                      return (
                        <List.Item style={{ padding: '0.25rem 0' }}>
                          <List.Item.Meta
                            style={{ paddingLeft: '1.25rem' }}
                            title={node}
                          />
                        </List.Item>
                      );
                    }}
                  />
                </div>
              </div>
            )
          }
      </div>
    );
  }
}
