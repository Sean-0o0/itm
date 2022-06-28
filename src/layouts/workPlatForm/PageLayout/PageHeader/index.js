import React from 'react';
import { Layout, Row, Col } from 'antd';
import UserDrop from './userDrop';
import TopMenu from './TopMenu';
import SwitchMenu from './SwitchMenu';
import HyperLink from '../../../../components/WorkPlatForm/MainPage/HomePage/HyperLink';

export default class PageHeader extends React.PureComponent {
  render() {
    const { menuLangKey, menuTree, style = {}, authorities = {}, logo, userBusinessRole, location, theme, handleThemeChange, dispatch, userBasicInfo, dictionary, authUserInfo, fetchMenuDatas, name = '', menuSchemeName = '' } = this.props;
    return (
      <Layout.Header className="m-header" style={{ width: '100%', ...style }}>
        <Row>
          <Col>
            <div className="m-logo">
              <a href="/" className="m-logo-link" style={{ lineHeight: '5rem' }}>
                <img src={logo} alt="logo" />
              </a>
            </div>
          </Col>
          <Col className="left">
            <TopMenu location={location} dispatch={dispatch} menuLangKey={menuLangKey} menuTree={menuTree} />
          </Col>
          <Col className="right">
            <UserDrop dispatch={dispatch} userBasicInfo={userBasicInfo} authUserInfo={authUserInfo} />
          </Col>
          <Col className="right">
            <SwitchMenu location={location} fetchMenuDatas={fetchMenuDatas} />
          </Col>
          <HyperLink name={name} menuTree={menuTree} handleThemeChange={handleThemeChange} theme={theme} userBusinessRole={userBusinessRole} dictionary={dictionary} dispatch={dispatch} authorities={authorities} menuSchemeName={menuSchemeName} />
        </Row>
      </Layout.Header>
    );
  }
}
