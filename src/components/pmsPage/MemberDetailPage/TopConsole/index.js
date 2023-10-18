import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Breadcrumb, Button, Dropdown, message, Menu, Tooltip } from 'antd';
import boyImg from '../../../../assets/staffDetail/img_boy.png';
import girlImg from '../../../../assets/staffDetail/img_girl.png';
import fqImg from '../../../../assets/staffDetail/img_fq.png';
import cyImg from '../../../../assets/staffDetail/img_cy.png';
import zbImg from '../../../../assets/staffDetail/img_zb.png';
import ktImg from '../../../../assets/staffDetail/img_kt.png';
import EditMemberInfoModel from '../EditMemberInfoModel';
import BridgeModal from '../../../Common/BasicModal/BridgeModel';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { CreateOperateHyperLink } from '../../../../services/pmsServices';

class ToConsole extends Component {
  state = {
    editMemberInfoVisible: false,
    changePwdVisible: false,
    changePwdUrl: '',
  };

  handleEditMemberInfo = type => {
    const {
      zyrole,
      data: { XMJLID },
    } = this.props;
    const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
    if (zyrole === '外包项目对接人' || String(LOGIN_USER_INFO.id) === XMJLID) {
      //type 编辑详情还是编辑试用期考核情况
      console.log('------编辑外包人员信息----');
      this.setState({
        editMemberInfoVisible: true,
        operateType: type,
      });
    } else {
      message.warn('只有项目经理或外包项目对接人可编辑!');
    }
  };

  modPwd = () => {
    const { zyrole } = this.props;
    if (zyrole === '外包项目对接人') {
      //type 编辑详情还是编辑试用期考核情况
      console.log('------修改密码----');
      this.getChangePwdUrlUrl();
    } else {
      message.warn('只有外包项目对接人可修改密码!');
    }
  };

  closeModal = () => {
    this.setState({
      editMemberInfoVisible: false,
    });
  };

  successCallBack = () => {
    const { refreshPages } = this.props;
    this.setState({
      editMemberInfoVisible: false,
    });
    //刷新页面
    refreshPages();
  };

  getChangePwdUrlUrl = id => {
    const {
      ryid = '',
      data: { XTZH = '' },
    } = this.props;
    const params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_RYXX',
      operateName: 'V_RYXX_MODPASSWORD',
      parameter: [
        {
          name: 'RYID',
          value: ryid,
        },
        {
          name: 'WBRY',
          value: ryid,
        },
      ],
      userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
    };
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          this.setState({
            changePwdUrl: url,
            changePwdVisible: true,
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  render() {
    const {
      editMemberInfoVisible = false,
      operateType,
      changePwdVisible = false,
      changePwdUrl = '',
    } = this.state;
    let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
    const {
      routes = [],
      ryid = '',
      zyrole = '',
      data: {
        XB = '',
        GYSMC = '',
        RYMC = '',
        RYGW = '',
        DJ = '',
        XMMC = '',
        SYKHID = '',
        RYZT = '',
        XMJLID = '',
        XTZH = '',
        FQRID = '',
      },
    } = this.props;
    const isDock = zyrole === '外包项目对接人';
    const isXmjl = String(LOGIN_USER_INFO.id) === XMJLID;
    const isFqr = String(LOGIN_USER_INFO.id) === FQRID;

    const btnMoreContent = (
      <Menu>
        {/**/}
        <Menu.Item onClick={this.modPwd}>修改密码</Menu.Item>
        <Menu.Item onClick={() => this.handleEditMemberInfo('syqkh')}>试用期考核</Menu.Item>
      </Menu>
    );

    const editMessageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '40%',
      height: '300px',
      title: '修改密码',
      style: { top: '40px' },
      visible: changePwdVisible,
      footer: null,
    };

    return (
      <div className="top-console">
        {/*修改密码*/}
        {changePwdVisible && (
          <BridgeModel
            modalProps={editMessageModalProps}
            onSucess={() => {
              message.info('修改密码成功！');
              this.setState({
                changePwdVisible: false,
              });
            }}
            onCancel={() =>
              this.setState({
                changePwdVisible: false,
              })
            }
            src={changePwdUrl}
          />
        )}
        {editMemberInfoVisible && (
          <EditMemberInfoModel
            visible={editMemberInfoVisible}
            data={this.props.data}
            ryid={ryid}
            operateType={operateType}
            closeModal={this.closeModal}
            successCallBack={this.successCallBack}
            isDock={isDock}
          />
        )}
        <div className="back-img">
          <Breadcrumb separator=">">
            {routes.map((item, index) => {
              const { name = item, pathname = '' } = item;
              const historyRoutes = routes.slice(0, index + 1);
              return (
                <Breadcrumb.Item key={index}>
                  {index === routes.length - 1 ? (
                    <>{name}</>
                  ) : (
                    <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>
                      {name}
                    </Link>
                  )}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <div className="member-detail-header flex-r">
            <div className="header-left flex-r">
              <img
                src={XB === '1' ? boyImg : XB === '2' ? girlImg : boyImg}
                className="staff-img"
              />
              <div className="member-detail-cont flex-c">
                <div className="member-detail-line-import" style={{ paddingBottom: '12px' }}>
                  <span className="member-detail-name">{RYMC || '-'}</span>
                  {/*<span className="staff-experience">&nbsp;已加入浙商证券{jrts}天</span>*/}
                </div>
                <div className="member-detail-line flex1 flex-r">
                  <span className="member-detail-label">公司：</span>
                  <span className="member-detail-value">{GYSMC || '-'}</span>
                </div>
                {/*<div className="member-detail-line flex1 flex-r">*/}
                {/*  <span className="member-detail-label">所属项目：</span>*/}
                {/*  <span className="member-detail-value">{XMMC || '-'}</span>*/}
                {/*</div>*/}
                <div className="member-detail-line flex1 flex-r">
                  <span className="member-detail-label">岗位：</span>
                  <span className="member-detail-value">{DJ || '-'}</span>
                  <span className="member-detail-label">&nbsp;</span>
                  <span style={{ color: '#C0C4CC' }}>|</span>
                  <span className="member-detail-label">&nbsp;</span>
                  <Tooltip title={RYGW || '-'}>
                    <span
                      className="member-detail-value"
                      style={{
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                      }}
                    >
                      {RYGW || '-'}
                    </span>
                  </Tooltip>
                  <span className="member-detail-label" style={{ paddingLeft: '24px' }}>
                    所属项目：
                  </span>
                  <span className="member-detail-value">{XMMC || '-'}</span>
                </div>
              </div>
            </div>
            {!isDock && (isXmjl || isFqr) && (
              <div className="header-right flex-r flex1">
                <Button className="btn-edit" onClick={() => this.handleEditMemberInfo('syqkh')}>
                  试用期考核
                </Button>
              </div>
            )}
            {isDock && (
              <div className="header-right flex-r flex1">
                <Button className="btn-edit" onClick={() => this.handleEditMemberInfo('bjxq')}>
                  编辑
                </Button>
                <Dropdown overlay={btnMoreContent} overlayClassName="tc-btn-more-content-dropdown">
                  <Button className="btn-more">
                    <i className="iconfont icon-more" />
                  </Button>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ToConsole;
