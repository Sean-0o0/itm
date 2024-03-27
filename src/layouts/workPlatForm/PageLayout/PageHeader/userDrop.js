import React, { Fragment } from 'react';
import { Card, Row, Col, Button, List, Tag, Spin, Modal, message } from 'antd';
import { Link } from 'dva/router';
import lodash from 'lodash';
import { FetchTokenAuth } from '../../../../services/token';
import { AES } from '../../../../utils/aes_utils';
import { APP_SECRET, CLIENTID } from '../../../../utils/config';
import styles from './userDrop.less';
import avatorPng from '../../../../assets/headSculpture/cust-default-avater.png';
import DropdownBox from '../../../../components/Common/DropdownBox';
import ChangePwd from './ChangePwd';
// import { SysVersionNum } from '../../../../../services/login'; // 查询当前版本 -废掉
import BasicModal from '../../../../components/Common/BasicModal';
import VersionInfoList from './versionInfoList';
import Avator from './Avator';
import { FetchQueryOtherUsers } from '../../../../services/commonbase';
import { fetchUserBasicInfo } from '../../../../services/commonbase/userBasicInfo';
// import { QuerySubAccountPub } from '../../../../services/commonbase/sysParam';
// import VersionInfoList from './versionInfoList';
import OtherUser from './OtherUser';
import { FetchAes } from '../../../../services/tool';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_female.png';
import { QueryUserRole } from '../../../../services/pmsServices/index';
import { connect } from 'dva';

const { confirm } = Modal;

export default connect(({ global, login }) => ({
  roleData: global.roleData,
}))(
  class UserDrop extends React.Component {
    constructor(props) {
      super(props);
      const { authUserInfo } = props;
      const { photo = '' } = authUserInfo;
      const showPic = photo ? `data:image/png;base64,${photo}` : avatorPng;
      this.state = {
        // sysVersionNum: {
        //   bbh: '',
        //   xqqx: '',
        // },
        logoutData: [
          {
            key: 'logout',
            title: '退出登录',
            icon: 'icon-getOut',
          },
        ],
        visible: false,
        roleVisible: false,
        otherusers: [], // 带条件查出来的其它用户
        allotherusers: [], // 登陆用户的可切换用户
        total: 0, // 带条件查询的用户总数
        allTotal: 0, // 登陆查询的用户总数
        loading: false, // 切换用户弹窗
        userId: '',
        avatorShowPic: showPic,
      };
    }

    componentDidMount() {
      const { userBasicInfo = {} } = this.props;
      const { loading } = userBasicInfo;
      if (loading === false && Object.keys(userBasicInfo).length > 1) {
        this.getAES();
      }
    }
    componentWillReceiveProps(nextProps) {
      const { userBasicInfo: newUserBasicInfo = {} } = nextProps;
      const { loading: newloading } = newUserBasicInfo;
      let newIsEnd = false;
      if (newloading === false && Object.keys(newUserBasicInfo).length > 1) {
        newIsEnd = true;
      }

      const { userBasicInfo = {} } = this.props;
      const { loading } = userBasicInfo;
      let IsEnd = false;
      if (loading === false && Object.keys(userBasicInfo).length > 1) {
        IsEnd = true;
      }
      // IsEnd|newIsEnd true 表示数据加载完毕
      if (!IsEnd && newIsEnd) {
        this.getAES();
      }

      this.forceRender();
    }

    getAES = () => {
      // const userId = localStorage.getItem('firstUserID') || '';
      const { authUserInfo = {} } = this.props;
      const userId = lodash.get(authUserInfo, 'extAttr.OWNER', '');
      const isSwitchUser = localStorage.getItem('isSwitchUser') || '';
      if (isSwitchUser === 'false') {
        return;
      }
      FetchAes({
        optType: 'encode',
        content: userId,
      }).then(ret => {
        const { code = 0, note = '', data = '' } = ret;
        if (code > 0) {
          // this.setState({ userId: data }, () => this.getOtherUsers({}));
        } else {
          message.error(note);
        }
      });
    };
    // getOtherUsers = ({ userInfo = '', current = 1 }) => {
    //   this.setState({ loading: true });
    //   const { userId } = this.state;
    //   FetchQueryOtherUsers({
    //     userId,
    //     paging: 1,
    //     userInfo: userInfo || '',
    //     pageSize: 5,
    //     current,
    //     sort: '',
    //     total: -1,
    //   }).then((response) => {
    //     const { records = [], total = 0 } = response;
    //     const arr = records.map((it) => {
    //       const { roleName } = it;
    //       const arrroleName = JSON.parse(roleName);
    //       return { ...it, roleName: arrroleName };
    //     });
    //     if (!userInfo) {
    //       this.setState({ allotherusers: arr, allTotal: total });
    //     }
    //     this.setState({ otherusers: arr, total, loading: false });
    //   }).catch((error) => {
    //     this.setState({ loading: false });
    //     message.error(!error.success ? error.message : error.note);
    //   });
    // }

    // showConfirm = () => {
    //   // const userId = localStorage.getItem('firstUserID') || '';
    //   const { authUserInfo = {}, theme } = this.props;
    //   let userName = lodash.get(authUserInfo, 'extAttr.OWNER', '');
    //   let userInfo = '';
    //   let userId = '';
    //   if(userName){
    //     // aas-aes加密
    //     AES.setSecret(APP_SECRET);
    //     userId = AES.encryptBase64(userName);
    //     // 请求返回账户的详细信息
    //     QuerySubAccountPub({
    //       userInfo: userName || '',
    //       userId,
    //     }).then(res => {
    //       const { code, records = [] } = res || {};
    //       if(code > 0){
    //         records.forEach(item => {
    //           const { loginName = '', orgName = '', roleName = '' } = item;
    //           if(loginName === userName){
    //             userInfo = `${orgName}-${loginName}-${roleName}`;
    //           }
    //         });
    //         confirm({
    //           className: theme,
    //           title: '提示：',
    //           content: `是否切回初始用户:{${userInfo}}？`,
    //           okText: '确定',
    //           cancelText: '取消',
    //           okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
    //           cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
    //           onOk() {
    //             const obj = { timestamp: new Date().getTime(), target: userName };
    //             let objJson = '{}';
    //             try {
    //               objJson = JSON.stringify(obj);
    //             } catch (e) {
    //             // do not
    //             }
    //             AES.setSecret(APP_SECRET);
    //             const config = {
    //               headers: { 'X-Auth-Token': AES.encryptBase64(objJson) },
    //             };
    //             FetchTokenAuth({
    //               CLIENTID,
    //             }, config).then((result) => {
    //               const { code = -1 } = result;
    //               if (code) {
    //                 window.location.href = '';
    //               }
    //             }).catch((error) => {
    //               message.error(!error.success ? error.message : error.note);
    //             });
    //           },
    //           onCancel() { },
    //         });
    //       }
    //     }).catch((error) => {
    //       message.error(!error.success ? error.message : error.note);
    //     });
    //   }
    // }
    // componentDidMount() {
    //   SysVersionNum({}).then((ret = {}) => {
    //     const { records = [] } = ret;
    //     let data = {};
    //     if (records && records.length > 0) {
    //       [data] = records;
    //       const { bbh = '', xqqx = '' } = data;
    //       this.setState({
    //         sysVersionNum: {
    //           bbh,
    //           xqqx,
    //         },
    //       });
    //     }
    //   }).catch((error) => {
    //     message.error(!error.success ? error.message : error.note);
    //   });
    // }
    getDropdownBoxTitle = (authUserInfo, userBasicInfo, showPic) => {
      const { name = '' } = authUserInfo || {};
      const { roleData = {} } = this.props;
      const { gender } = roleData;
      return (
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
          }}
          style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}
        >
          <img
            style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden' }}
            src={gender === '' ? avatorPng : gender === '男' ? avatarMale : avatarFemale}
            alt=""
          />
          <span style={{ paddingLeft: '8px' }}>
            <span className="name">{name}</span>
            <i className="iconfont icon-fill-down" />
          </span>
        </a>
      );
    };
    getDropbox = (dispatch, userBasicInfo, otherusers = [], showPic) => {
      // 注意 这里的userBasicInfo是this.props.authUserInfo
      // loginName 为当前登陆人
      const { name = '', loginName = '' } = userBasicInfo || {};
      const { allotherusers = [] } = this.state;
      let arr = [];
      otherusers.every(it => {
        if (it.loginName === loginName) {
          arr = it.roleName;
          return false;
        }
        return true;
      });
      const lastlogin = lodash.get(userBasicInfo, 'extAttr.LAST_LOGIN', '--');
      const loginmethod = lodash.get(userBasicInfo, 'extAttr.LOGIN_METHOD', '');
      lastlogin.replace(/-/g, '.');
      // const userId = localStorage.getItem('firstUserID') || '';
      const userId = lodash.get(userBasicInfo, 'extAttr.OWNER', '');
      let span = 24;
      if (allotherusers.length > 0 && loginName !== userId) {
        span = 8;
      } else if (allotherusers.length === 0 && loginName === userId) {
        span = 24;
      } else {
        span = 12;
      }
      return (
        <Card className="m-card m-user">
          <Row>
            <Col span={24}>
              {/* <div className="m-panel-img" style={{ paddingLeft: '0.583rem', paddingRight: '0.583rem' }}>
              <Avator dispatch={dispatch} avatorShowPic={showPic} userBasicInfo={userBasicInfo} forceRender={this.forceRender} />
            </div> */}
              <div className="m-panel-introduce">
                <div className="m-panel-name">{name}</div>
                <div className="m-panel-id">
                  上次登录时间
                  <div>{lastlogin.replace(/-/g, '.')}</div>
                </div>
                {loginmethod !== '1' && (
                  <React.Fragment>
                    <Button
                      className="m-btn m-btn-small m-btn-headColor"
                      onClick={() => {
                        return this.cpForm && this.cpForm.showModal();
                      }}
                    >
                      <span>修改密码</span>
                    </Button>
                    <ChangePwd
                      ref={node => {
                        this.cpForm = node;
                      }}
                      userBasicInfo={this.props.userBasicInfo}
                    />
                  </React.Fragment>
                )}
              </div>
            </Col>
          </Row>
          {arr.length > 0 && (
            <div
              className="clearfix"
              style={{ padding: '0.833rem 1rem', borderTop: '1px solid #ecedee' }}
            >
              <span style={{ float: 'left' }}>当前角色：</span>
              {arr.map((it, index) => {
                return (
                  <Tag style={{ float: 'left', marginBottom: '0.2rem' }} key={index} color="blue">
                    {it}
                  </Tag>
                );
              })}
            </div>
          )}
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
                {/* {
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
              } */}
                {/* {
                (userId && loginName !== userId) && (
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
              } */}
                {/* <Col span={24}>
                <Link to={`/UIProcessor?Table=V_XMBQ_GRBQ&hideTitlebar=true`}>
                  <List.Item
                    style={{ borderBottom: 'none' }}
                  >
                    <List.Item.Meta
                      avatar={<i className='iconfont icon-follow' />}
                      title={<span>个人配置</span>}
                      style={{ alignItems: 'center' }}
                    />
                  </List.Item>
                </Link>
              </Col> */}
                <Col span={12}>
                  <List.Item style={{ borderBottom: 'none' }}>
                    <List.Item.Meta
                      onClick={() => this.handleLogout(dispatch)}
                      avatar={<i className={`iconfont ${item.icon}`} />}
                      title={<span>{item.title}</span>}
                      style={{ alignItems: 'center' }}
                    />
                  </List.Item>
                </Col>
              </Row>
            )}
          />
        </Card>
      );
    };
    showDefaultImgError = e => {
      e.target.src = avatorPng;
    };
    handleLogout = dispatch => {
      dispatch({ type: 'login/fetOperationLogOut' });
      dispatch({ type: 'global/logout' });
      //登出调用单点登录的登出
      window.location.href = '/api/cas/logout';
    };

    showRoleModal = () => {
      const { allotherusers = [], allTotal = 0 } = this.state;
      this.setState({
        roleVisible: true,
        otherusers: allotherusers,
        total: allTotal,
      });
    };

    closeRoleModal = () => {
      this.setState({
        roleVisible: false,
      });
    };

    showModal = () => {
      this.setState({
        visible: true,
      });
    };
    closeModal = () => {
      this.setState({
        visible: false,
      });
    };

    // 强制重新渲染
    forceRender = () => {
      fetchUserBasicInfo({})
        .then((ret = {}) => {
          const { code = 0, records = [] } = ret;
          if (code > 0) {
            const photo = records[0].extAttr.profileBase64;
            const showPic = photo ? `data:image/png;base64,${photo}` : avatorPng;
            let userInfoAvatorImg = document.getElementById('userInfoAvatorImg');
            if (userInfoAvatorImg) {
              userInfoAvatorImg.setAttribute('src', showPic); // userInfo的头像
            }
            this.setState({ avatorShowPic: showPic });
          }
        })
        .catch(error => {
          message.error(!error.success ? error.message : error.note);
        });
    };

    render() {
      const {
        otherusers = [],
        loading = false,
        total = 0,
        avatorShowPic: showPic = '',
      } = this.state;
      const { authUserInfo, userBasicInfo = {}, dispatch } = this.props;
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
              style={{ float: 'right', width: 'auto', marginRight: '24px' }}
              {...dropdownBoxProps}
            />
            <BasicModal
              visible={this.state.visible}
              onCancel={this.closeModal}
              style={
                {
                  /* height: '20rem' */
                }
              }
              footer={null}
              width="403px"
              title="版本信息"
            >
              <VersionInfoList />
            </BasicModal>
            {/* <BasicModal
            visible={this.state.roleVisible}
            onCancel={this.closeRoleModal}
            footer={null}
            width="403px"
            title="切换用户"
          >
            <OtherUser total={total} getOtherUserloading={loading} getOtherUsers={this.getOtherUsers} dispatch={dispatch} closeRoleModal={this.closeRoleModal} otherusers={otherusers} userBasicInfo={authUserInfo} />
          </BasicModal> */}
          </Spin>
        </Fragment>
      );
    }
  },
);
