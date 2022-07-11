import React from 'react';
import { Menu, Badge, Card, Tabs, Input, Progress, Row, Col } from 'antd';
import styles from './notices.less';

export default class Notices extends React.Component {
  state = {
    openKeys: [],
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  // 一级菜单的key
  rootSubmenuKeys = ['bell', 'mot', 'scheme', 'navigation']
  handleInputBlur = () => {
    this.timer = setTimeout(() => {
      this.setState({
        openKeys: [],
      });
    }, 200);
  }
  handleInputFocus = () => {
    clearTimeout(this.timer);
  }
  handleMenuClick = () => {
    clearTimeout(this.timer);
    this.input.focus();
  }
  handleMenuOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  handleSubMenuTitleClick = () => {
    this.input.focus();
  }
  handleTabClick = () => {
    this.input.focus();
  }
  render() {
    return (
      <span>
        <Input
          ref={(node) => { this.input = node; }}
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
          style={{ width: 0, padding: 0, margin: 0, border: 0 }}
        />
        <Menu
          className="m-menu-horizontal"
          theme="dark"
          mode="inline"
          inlineIndent="0"
          selectedKeys={[]}
          openKeys={this.state.openKeys}
          onOpenChange={this.handleMenuOpenChange}
          onClick={this.handleMenuClick}
        >
          <Menu.SubMenu
            key="bell"
            onTitleClick={this.handleSubMenuTitleClick}
            title={<Badge status="processing" text={<i className="iconfont icon-bell" />} />}
          >
            <Menu.Item key="bellContent">
              <a className="gray" style={{ textAlign: 'center', display: 'block', padding: '1rem 0' }}>
                <span>暂无数据</span>
              </a>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="mot"
            onTitleClick={this.handleSubMenuTitleClick}
            title={<Badge status="processing" text={<i className="iconfont icon-mot" />} />}
          >
            <Menu.Item key="motContent">
              <Card
                className="m-card default"
              >
                <Tabs className="m-tabs-arrow" defaultActiveKey="all" onTabClick={this.handleTabClick}>
                  <Tabs.TabPane tab="全部" key="all">
                    <div style={{ padding: '1rem' }}>
                      <div className="m-progress-warp">
                        <div className="m-progress-name clearfix">
                          <span className="m-progress-name-left">客户拜访任务</span>
                          <span className="m-progress-name-right">20%已完成</span>
                        </div>
                        <Progress className="m-progress ant-progress-status-active" percent={20} showInfo={false} status="success" />
                      </div>
                      <div className="m-progress-warp">
                        <div className="m-progress-name clearfix">
                          <span className="m-progress-name-left">周周乐活动准备</span>
                          <span className="m-progress-name-right">40%已完成</span>
                        </div>
                        <Progress className="m-progress ant-progress-status-orange" percent={40} showInfo={false} status="active" />
                      </div>
                      <div className="m-progress-warp">
                        <div className="m-progress-name clearfix">
                          <span className="m-progress-name-left">元旦活动主题策划</span>
                          <span className="m-progress-name-right">30%已完成</span>
                        </div>
                        <Progress className="m-progress ant-progress-status-active" percent={30} showInfo={false} status="active" />
                      </div>
                      <div className="m-progress-warp">
                        <div className="m-progress-name clearfix">
                          <span className="m-progress-name-left">客户拜访任务2</span>
                          <span className="m-progress-name-right">40%已完成</span>
                        </div>
                        <Progress className="m-progress ant-progress-status-active" percent={40} showInfo={false} status="exception" />
                      </div>
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="选做" key="choose">
                    <div style={{ padding: '1rem' }}>
                      选做
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="必做" key="must">
                    <div style={{ padding: '1rem' }}>
                      必做
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="提醒" key="notice">
                    <div style={{ padding: '1rem' }}>
                      提醒
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="scheme"
            onTitleClick={this.handleSubMenuTitleClick}
            title={(
              <span>
                <span className="hide-menu">方案</span>
                <i className="iconfont icon-diwn-solid-arrow" style={{ fontSize: '1rem', paddingLeft: '0.5rem' }} />
              </span>
              // <span>
              //   <i className="iconfont icon-bell" />
              //   <span className="ant-badge-status-dot ant-badge-status-processing" />
              // </span>
            )}
          >
            <Menu.Item key="schemeContent">
              <a className="gray" style={{ textAlign: 'center', display: 'block', padding: '1rem 0' }}>
                <span>暂无数据</span>
              </a>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="navigation"
            className={styles.navigationDrop}
            onTitleClick={this.handleSubMenuTitleClick}
            title={(
              <span>
                <span className="hide-menu">导航</span>
                <i className="iconfont icon-more" style={{ fontSize: '1.2rem', top: '0.083rem', position: 'relative' }} />
              </span>
              // <span>
              //   <i className="iconfont icon-bell" />
              //   <span className="ant-badge-status-dot ant-badge-status-processing" />
              // </span>
            )}
          >
            <Menu.Item key="navigationContent" style={{ width: '100%' }}>
              <Row className="m-row-noPadding m-row-margin" style={{ marginLeft: '6.25rem' }}>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={3} >
                  <div className="m-tabs-menu">
                    <div className="m-tabs-menu-head">
                      <i className="m-circular ml10" />
                      <div className="m-tabs-menu-title">最近访问</div>
                    </div>
                    <ul className="m-tabs-menu-body">
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的客户</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的mot</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>我的产品</span></a></li>
                      <li className=" pt10 pb10 pl4 pr4"><a href="#" className="lightgrey-02"><span>辅导工作总结报告公告</span></a></li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </span>
    );
  }
}
