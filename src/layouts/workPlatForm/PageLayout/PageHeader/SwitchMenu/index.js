import React from 'react';
import { connect } from 'dva';
import { Dropdown, Menu, message } from 'antd';
import { FetcUserMenuProject, FetCuserProjectUpdate } from '../../../../../services/commonbase';
import { FetchAes } from '../../../../../services/tool';
import { clearCache } from 'react-router-cache-route';

class SwitchMenu extends React.PureComponent {
  state = {
    isHide: true,
    names: [],
    describes: [],
    notes: [],
    selectMenu: '',
  }
  componentDidMount() {
    this.fetchProject();
  }
  fetchProject = async () => {
    // 获取默认菜单方案
    await FetcUserMenuProject().then((response1) => {
      const { records: records1 = [] } = response1 || {};
      if (Array.isArray(records1)) {
        const names = [];
        const describes = [];
        const notes = [];
        records1.forEach((item) => {
          const { name = '', describe = '', note } = item;
          // if (name === 'IRAA') {
          //   names.splice(0, 0, name);
          //   describes.splice(0, 0, describe);
          //   notes.splice(0, 0, note);
          // }
          // if (name === 'C5FinanceManagementAgent') {
          //   names.splice(1, 0, name);
          //   describes.splice(1, 0, describe);
          //   notes.splice(1, 0, note);
          // }
          if (name === 'IRAA' || name === 'C5FinanceManagementAgent') {
            names.push(name);
            describes.push(describe);
            notes.push(note);
          }
          // if (name && describe) {
          //   names.push(name);
          //   describes.push(describe);
          //   notes.push(note);
          // }
        });
        const { location: { pathname, search } } = this.props;
        this.handleChange(names[0], pathname.concat(search), notes[0]);
        this.setState({
          names,
          describes,
          notes,
          selectMenu: names[0] || '',
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleClick = () => {
    this.setState({
      isHide: !this.state.isHide,
    });
  }
  handleChange = async (name, path = '', note = '') => {
    clearCache(); // 切换方案时, 清除所有缓存
    const { fetchMenuDatas } = this.props;
    if (note !== '') {
      const linkObj = JSON.parse(note);
      const { WINDOWTYPE = 'SELF', URL = '', ISAUTH = '1' } = linkObj; // WINDOWTYPE 弹窗类型 SELF：当前页面打开|PAGE:新页面打开 ISAUTH 是否需要auth认证 0:需要|1:不需要
      const { host, protocol } = window.location;
      if (URL !== `${protocol}//${host}` && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        await FetCuserProjectUpdate({
          zjfa: name,
        }).then((res) => {
          const { code } = res;
          if (code > 0) {
            if (WINDOWTYPE === 'SELF') {
              if (ISAUTH === '0') {
                this.getUrl(URL, WINDOWTYPE);
              } else {
                window.location.href = URL;
              }
            } else if (ISAUTH === '0') {
              this.getUrl(URL, WINDOWTYPE);
            } else {
              window.open(URL);
            }
          }
        });
        return;
      }
    }
    this.setState({
      selectMenu: name,
    });
    FetCuserProjectUpdate({
      zjfa: name,
    });
    // fetchMenuDatas(name, true);
    if (path) {
      fetchMenuDatas(name, false, path); // 从别的地址刷新页面
    } else {
      fetchMenuDatas(name, true); // 从登陆页面进入菜单
    }
  }
  getUrl = async (url, urlType) => {
    const { userBasicInfo = {} } = this.props;
    await FetchAes({
      optType: 'encode',
      content: JSON.stringify({ userName: userBasicInfo.userid || '', timestamp: new Date().getTime() }),
    }).then((ret) => {
      const { code = 0, note = '', data = '' } = ret;
      if (code > 0) {
        if (urlType === 'SELF') {
          window.location.href = `${url}&token=${data}`;
        } else {
          window.open(`${url}&token=${data}`);
        }
      } else {
        message.error(note);
      }
    });
  }
  render() {
    const { names, notes, describes, isHide, selectMenu } = this.state;
    const len = names.length;
    return (
      <div>
        {
          names.length > 1 ? (
            <Dropdown
              trigger={['hover']}
              onClick={this.handleClick}
              overlay={
                <Menu
                  onSelect={this.handleChange}
                  style={{ columnCount: len > 20 ? 3 : len > 10 ? 2 : 1, padding: '.5rem 1rem' }}
                >
                  {
                    names.map((name, index) => {
                      return (
                        <Menu.Item key={`${name}-${index}`} className={this.state.selectMenu === name ? 'current' : ''} style={{ height: '100%', overflow: 'auto' }}>
                          {/* <li className={`${this.state.selectMenu === name ? 'active' : ''} ant-menu-item`}> */}
                          <a className="gray" onClick={(e) => { e.preventDefault(); this.handleChange(name, '', notes[index]); }} style={{ textAlign: 'center', display: 'block', padding: '1rem 0' }}>
                            <span>{describes[index]}</span>
                          </a>
                          {/* </li> */}
                        </Menu.Item>
                      );
                    })
                  }
                </Menu>
              }
            >
              <ul className="m-menu-horizontal ant-menu ant-menu-dark ant-menu-root ant-menu-inline" style={{ padding: 0, background: 'transparent', width: 'auto' }}>
                <li className="ant-menu-submenu ant-menu-submenu-inline" style={{padding: '0 0.5rem'}}>
                  <div className="ant-menu-submenu-title" style={{ padding: ' 0 1rem' }}>
                    <span style={{ color: '#666' }}>
                      <span className="hide-menu">{describes[names.findIndex((temp) => { return temp === selectMenu; })] || '方案选择'}</span>
                      <i className={`iconfont ${isHide ? 'icon-down-solid-arrow' : 'icon-up-solid-arrow'}`} style={{ fontSize: '1rem', paddingLeft: '0.5rem' }} />
                    </span><div className="m-waves-ripple" />
                  </div>
                </li>
              </ul>
            </Dropdown>
          ) : ''
        }
      </div>
    );
  }
}
export default connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
}))(SwitchMenu);
