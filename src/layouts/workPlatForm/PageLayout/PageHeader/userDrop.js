import React, { Fragment } from 'react';
import { Card, Row, Col, Button, List, Tag, Spin, Modal, message } from 'antd';
import lodash from 'lodash';
import styles from './userDrop.less';
import avatorPng from '../../../../assets/blank.jpg';
import DropdownBox from '../../../../components/Common/DropdownBox';
import ChangePwd from './ChangePwd';
// import { SysVersionNum } from '../../../../../services/login'; // 查询当前版本 -废掉
import BasicModal from '../../../../components/Common/BasicModal';
import VersionInfoList from './versionInfoList';
import Avator from './Avator';
// import VersionInfoList from './versionInfoList';

export default class UserDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // sysVersionNum: {
      //   bbh: '',
      //   xqqx: '',
      // },
      logoutData: [
        {
          key: 'logout',
          title: '登出',
          icon: 'icon-getOut',
        },
      ],
      visible: false,
      roleVisible: false,
      otherusers: [], // 带条件查出来的其它用户
      allotherusers: [], // 登陆用户的可切换用户
      total: 0, // 用户总数
      loading: false, // 切换用户弹窗
      userId: '',
    };
  }

  getDropdownBoxTitle = (authUserInfo, userBasicInfo, showPic) => {
    const { name = '' } = authUserInfo || {};
    return (
      <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ display: 'inline-block', width: '100%', height: '100%' }}>
        <img className="m-avatar" src={showPic} title="头像" alt="avator" onError={this.showDefaultImgError} />
        <span style={{ paddingLeft: '0.5rem' }}>
          <span className="name">{name}</span>
          <i className="iconfont icon-down-solid-arrow" style={{ fontSize: '1rem', paddingLeft: '0.5rem' }} />
        </span>
      </a>
    );
  }
  getDropbox = (dispatch, userBasicInfo, otherusers = [], showPic) => {
    // 注意 这里的userBasicInfo是this.props.authUserInfo
    // loginName 为当前登陆人
    const { name = '', loginName = '' } = userBasicInfo || {};
    const { allotherusers = [] } = this.state;
    let arr = [];
    otherusers.every((it) => {
      if (it.loginName === loginName) {
        arr = it.roleName;
        return false;
      }
      return true;
    });
    const lastlogin = lodash.get(userBasicInfo, 'extAttr.LAST_LOGIN', '--');
    const loginmethod = lodash.get(userBasicInfo, 'extAttr.LOGIN_METHOD', '');
    lastlogin.replace(/-/g, '.');
    const userId = localStorage.getItem('firstUserID') || '';
    let span = 24;
    if (allotherusers.length > 0 && loginName !== userId) {
      span = 8;
    } else if (allotherusers.length === 0 && loginName === userId) {
      span = 24;
    } else {
      span = 12;
    }
    return (
      <Card
        className="m-card m-user"
      >
        <Row>
          <Col span={24}>
            <div className="m-panel-img" style={{ paddingLeft: '0.583rem', paddingRight: '0.583rem' }}>
              <Avator dispatch={dispatch} avatorShowPic={showPic} userBasicInfo={userBasicInfo} forceRender={this.forceRender} />
            </div>
            <div className="m-panel-introduce" style={{ float: 'unset' }}>
              <div className="m-panel-name">{name}</div>
              <div className="m-panel-id">上次登录时间 {lastlogin.replace(/-/g, '.')}</div>
              {
                loginmethod !== '1' &&
                (
                  <React.Fragment>
                    <Button className="m-btn m-btn-small m-btn-headColor" onClick={() => { return this.cpForm && this.cpForm.showModal(); }}>
                      <span>修改密码</span>
                    </Button>
                    <ChangePwd ref={(node) => { this.cpForm = node; }} />
                  </React.Fragment>
                )
              }
            </div>
          </Col>
        </Row>
        {
          arr.length > 0 && (
            <div className="clearfix" style={{ padding: '0.833rem 1rem', borderTop: '1px solid #ecedee' }}>
              <span style={{ float: 'left' }}>当前角色：</span>
              {
                arr.map((it, index) => {
                  return <Tag style={{ float: 'left', marginBottom: '0.2rem' }} key={index} color="blue">{it}</Tag>;
                })
              }
            </div>
          )
        }
        {/* <List
          className="m-list-icon-small"
          itemLayout="horizontal"
          style={{ padding: '0.833rem 0', marginTop: '0.833rem' }}
          dataSource={listData}
          renderItem={item => (
            <List.Item
              style={{ borderBottom: 'none' }}
            >
              <List.Item.Meta
                avatar={<i className={`iconfont ${item.icon}`} />}
                title={<span>{item.title}</span>}
              />
            </List.Item>
          )}
        /> */}
                <List
          className="m-list-icon-small"
          itemLayout="horizontal"
          style={{ padding: '0.833rem 0', marginTop: '0.833rem' }}
          dataSource={this.state.logoutData}
          renderItem={item => (
            <Row>
              {
                allotherusers.length > 0 && (
                  <Col span={span}>
                    <List.Item
                      style={{ borderBottom: 'none' }}
                    >
                      <List.Item.Meta
                        onClick={() => this.showRoleModal()}
                        avatar={<i className="iconfont icon-groupLine" />}
                        title={<span>用户切换</span>}
                      />
                    </List.Item>
                  </Col>
                )
              }
              {
                loginName !== userId && (
                  <Col span={span}>
                    <List.Item
                      style={{ borderBottom: 'none' }}
                    >
                      <List.Item.Meta
                        onClick={() => this.showConfirm()}
                        avatar={<i className="iconfont icon-addressee" />}
                        title={<span>退出切换</span>}
                      />
                    </List.Item>
                  </Col>
                )
              }
              <Col span={span}>
                <List.Item
                  style={{ borderBottom: 'none' }}
                >
                  <List.Item.Meta
                    onClick={() => this.handleLogout(dispatch)}
                    avatar={<i className={`iconfont ${item.icon}`} />}
                    title={<span>{item.title}</span>}
                  />
                </List.Item>
              </Col>
            </Row>
          )}
        />
      </Card>
    );
  }
  checkPhoto = (photo) => {
    if (photo === '') {
      return avatorPng;
    }
    return `${localStorage.getItem('livebos') || ''}${photo}`;
  }
  showDefaultImgError = (e) => {
    e.target.src = avatorPng;
  }
  handleLogout = (dispatch) => {
    dispatch({ type: 'login/fetOperationLogOut' });
    dispatch({ type: 'global/logout' });
  }

  showRoleModal = () => {
    const { allotherusers = [] } = this.state;
    this.setState({
      roleVisible: true,
      otherusers: allotherusers,
    });
  }

  closeRoleModal = () => {
    this.setState({
      roleVisible: false,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  closeModal = () => {
    this.setState({
      visible: false,
    });
  }

  // 强制重新渲染
  forceRender = () => {
    const { userBasicInfo } = this.props;
    const { photo = '' } = userBasicInfo || {};
    const showPic = photo ? `${localStorage.getItem('livebos') || ''}${photo}&t=${new Date().getTime()}` : avatorPng;
    const userInfoAvatorImg = document.getElementById('userInfoAvatorImg');
    if (userInfoAvatorImg) {
      userInfoAvatorImg.src = showPic; // userInfo的头像
    }
    this.setState({ avatorShowPic: showPic }); // eslint-disable-line
  }

  render() {
    const { otherusers = [], loading = false, total = 0 } = this.state;
    const { authUserInfo, userBasicInfo = {}, dispatch } = this.props;
    const { photo = '' } = userBasicInfo;
    const showPic = photo ? `${localStorage.getItem('livebos') || ''}${photo}&t=${new Date().getTime()}` : avatorPng;
    // const { sysVersionNum = {} } = this.state;
    // const { bbh = '', xqqx = '' } = sysVersionNum;
    // const listData = [
    //   {
    //     key: 'changePwd',
    //     title: '修改密码',
    //     icon: 'icon-lock',
    //   },
    //   {
    //     key: 'processEntrust',
    //     title: <Link to={{ pathname: '/linkToLBFrame', search: '/UIProcessor?Table=lbSurrogate' }}>流程委托</Link>,
    //     icon: 'icon-flow',
    //   },
    //   {
    //     key: 'setting',
    //     title: '系统设置',
    //     icon: 'icon-setLine',
    //   },
    //   {
    //     key: 'currentVersion',
    //     title: <div onClick={this.showModal}>{xqqx === '1' ? <span>当前版本</span> : '当前版本'}<span style={{ fontWeight: '400', color: '#8d9ea7' }}>&nbsp;&nbsp;{bbh || ''}</span></div>,
    //     icon: 'icon-about1',
    //   },
    // ];
    const dropdownBoxProps = {
      id: 'user',
      title: this.getDropdownBoxTitle(authUserInfo, userBasicInfo, showPic),
      dropbox: this.getDropbox(dispatch, authUserInfo, otherusers, showPic),
    };
    return (
      <Fragment>
        <Spin spinning={loading}>
          <DropdownBox
            className={styles.userDrop}
            style={{ float: 'right', width: 'auto' }}
            {...dropdownBoxProps}
          />
          <BasicModal
            visible={this.state.visible}
            onCancel={this.closeModal}
            style={{ /* height: '20rem' */ }}
            footer={null}
            width="60rem"
            title="版本信息"
          >
            <VersionInfoList />
          </BasicModal>
        </Spin>
      </Fragment>
    );
  }
}
