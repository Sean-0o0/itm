import React from 'react';
import { Row, Col, message } from 'antd';
import styles from './navigationDrop.less';
import DropdownBox from '../../../../components/Common/DropdownBox';
import { FetchMenu } from '../../../../services/amslb/user';

class NavigationDrop extends React.PureComponent {
  state = {
    menuTreeData: [],
    dropDownVisible: false,
  }
  componentDidMount() {
    FetchMenu({
      project: 'C5Base',
    }).then((ret = {}) => {
      const { code = 0, data = [] } = ret;
      if (code > 0) {
        this.setState({
          menuTreeData: data.menuTree,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  getDropdownBoxTitle = () => {
    return (
      <a
        href="#"
        onClick={() => { this.changeVisible(!this.state.dropDownVisible); }}
        style={{ display: 'inline-block', width: '100%', height: '100%' }}
      >
        <span className="hide-menu">导航</span>
        <i className="iconfont icon-more" style={{ fontSize: '1.2rem', top: '0.083rem', position: 'relative' }} />
      </a>
    );
  }
  getDropbox = () => {
    const { menuTreeData } = this.state;
    const menuTree = (menuTreeData ? menuTreeData.menu : []) ? (menuTreeData ? menuTreeData.menu : []) : []; // eslint-disable-line
    const fItem = menuTree.item ? menuTree.item : [];
    return (
      <Row className="m-row-noPadding m-row-margin" style={{ marginLeft: '6.25rem' }}>
        <div>
          {
            fItem.map((item, index) => {
              /* if (item.object === 'home') {
                return true;
              } */
              const subitem = item.menu ? (item.menu.item ? item.menu.item : []) : []; // eslint-disable-line
              const tmplValue1 = item ? (item.title[0] ? item.title[0].text : '--') : '--'; // eslint-disable-line
              const tmplValue2 = item ? (item.title[0] ? item.title[0].text : '--') : '--'; // eslint-disable-line
              const tmplValue3 = si ? (si.title[0] ? si.title[0].text : '--') : '--'; // eslint-disable-line
              const tmplValue4 = si ? (si.title[0] ? si.title[0].text : '--') : '--'; // eslint-disable-line
              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={3} key={index} >
                  <div className="m-tabs-menu">
                    {
                      item.windowType === 1 ? (
                        <a href={item.url} target="blank" onClick={() => { this.changeVisible(false); }}>
                          <div className="m-tabs-menu-head">
                            <i className="m-circular ml10" />
                            <div className="m-tabs-menu-title">{tmplValue1}</div>
                          </div>
                        </a>
                      ) : (
                        <a href={`/#${item.url}`} >
                          <div className="m-tabs-menu-head" onClick={() => { this.changeVisible(false); }}>
                            <i className="m-circular ml10" />
                            <div className="m-tabs-menu-title">{tmplValue2}</div>
                          </div>
                        </a>
                      )
                    }
                    <ul className="m-tabs-menu-body">
                      {
                        subitem.map((si, sindex) => {
                          if (si.windowType === 1) {
                            return (
                              <li className=" pt10 pb10 pl4 pr4" key={sindex}>
                                <a href={si.url} target="blank" className="lightgrey-02" onClick={() => { this.changeVisible(false); }}>
                                  <span>{tmplValue3}</span>
                                </a>
                              </li>
                            );
                          }
                          return (
                            <li className=" pt10 pb10 pl4 pr4" key={sindex}>
                              <a href={`/#${si.url}`} className="lightgrey-02" onClick={() => { this.changeVisible(false); }}>
                                <span>{tmplValue4}</span>
                              </a>
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                </Col>
              );
            })
          }
        </div>
      </Row>
    );
  }
  changeVisible = (flag = false) => {
    this.setState({
      dropDownVisible: flag,
    });
  }
  render() {
    const dropdownBoxProps = {
      id: 'navigation',
      title: this.getDropdownBoxTitle(),
      dropbox: this.getDropbox(),
    };
    return (
      <DropdownBox
        className={styles.navigationDrop}
        closeOnClickMenu
        {...dropdownBoxProps}
      />
    );
  }
}

export default NavigationDrop;
