import React from 'react';
import { Checkbox, Row, Col } from 'antd';
import styles from './index.less';

class SettingContent extends React.Component {
    state={
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
            title: '中国红',
          },
          {
            key: 'orange-dark-theme',
            title: '珊瑚橘',
          },
          // {
          //   key: 'green-dark-theme',
          //   title: '青绿',
          // },
          {
            key: 'blue-dark-theme',
            title: '晴空蓝',
          },
          {
            key: 'blue-tech-theme',
            title: '科技蓝',
          },
          {
            key: 'blue-distant-theme',
            title: '远山蓝',
          },
        ],
      },
    }
    handleThemeClick = (e, key) => {
      const { theme } = this.props;
      if (theme !== key) {
        // 改变当前的选中效果
        if (this.props.handleThemeChange) {
          this.props.handleThemeChange(key);
        }
      }
      e.preventDefault();// 阻止链接跳转行为
    }
    render() {
      const { themesData: { darkSideTheme } } = this.state;
      const { theme, options = [], selectedItem = [], handleItemChange } = this.props;
      return (
        <div>
          <div className={`${styles.m_side} m-right-sidebar m-shw-rside`} style={{ width: '100%' }}>
            <div className="m-r-panel-body" style={{ width: '100%' }}>
              <Row style={{ margin: '0.866rem' }}>
                <Col span={4} style={{ padding: '.866rem 2.866rem', textAlign: 'right' }}><span>主题</span></Col>
                <Col span={20}>
                  <ul>
                    {
                      darkSideTheme.map(item => (
                        <li key={item.key}>
                          <a href="#" className={`${item.key} ${item.key === theme ? 'working' : ''}`} onClick={e => this.handleThemeClick(e, item.key)}>{item.title}</a>
                          <p className="m-theme-name">{`${item.title}`}</p>
                        </li>
                      ))
                    }
                  </ul>
                </Col>
              </Row>
              <Row style={{ margin: '0.866rem' }}>
                <Col span={4} style={{ padding: '.866rem 2.866rem', textAlign: 'right' }}><span>快捷菜单</span></Col>
                <Col span={20}>
                  {
                    options.map((item) => {
                      const { kjcd, xsmc = '', icon = '' } = item;
                      return (
                        <Col key={kjcd} span={8}>
                          <Checkbox checked={selectedItem.includes(kjcd)} onChange={(e) => { handleItemChange(e.target.checked, e.target.value); }} value={kjcd}>
                            <i className={`iconfont m-color ${icon}`} style={{ fontSize: '1.866rem', position: 'relative', top: '0.286rem', marginRight: '0.266rem' }} />
                            {xsmc}
                          </Checkbox>
                        </Col>
                      );
                    })
                  }
                </Col>
              </Row>
            </div>
          </div>
        </div>
      );
    }
}

export default SettingContent;
