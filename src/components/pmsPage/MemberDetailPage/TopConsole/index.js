import React, {Component} from 'react';
import {Link} from 'dva/router';
import {Breadcrumb, Button, Dropdown, message, Menu, Tooltip} from 'antd';
import boyImg from '../../../../assets/staffDetail/img_boy.png';
import girlImg from '../../../../assets/staffDetail/img_girl.png';
import fqImg from '../../../../assets/staffDetail/img_fq.png';
import cyImg from '../../../../assets/staffDetail/img_cy.png';
import zbImg from '../../../../assets/staffDetail/img_zb.png';
import ktImg from '../../../../assets/staffDetail/img_kt.png';
import EditMemberInfoModel from "../EditMemberInfoModel";
import BridgeModal from "../../../Common/BasicModal/BridgeModel";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

class ToConsole extends Component {
  state = {
    editMemberInfoVisible: false,
  };

  handleEditMemberInfo = (type) => {
    const {zyrole} = this.props;
    if (zyrole === "外包项目对接人") {
      //type 编辑详情还是编辑试用期考核情况
      console.log("------编辑外包人员信息----")
      this.setState({
        editMemberInfoVisible: true,
        operateType: type,
      })
    } else {
      message.warn("只有外包项目对接人可编辑!");
    }
  }

  modPwd = () => {
    const {zyrole} = this.props;
    if (zyrole === "外包项目对接人") {
      //type 编辑详情还是编辑试用期考核情况
      console.log("------修改密码----")
      this.setState({
        changePwdVisible: true
      })
    } else {
      message.warn("只有外包项目对接人可修改密码!");
    }
  }

  closeModal = () => {
    this.setState({
      editMemberInfoVisible: false,
    })
  }

  successCallBack = () => {
    const {refreshPages} = this.props;
    this.setState({
      editMemberInfoVisible: false,
    })
    //刷新页面
    refreshPages();
  }

  render() {
    const {editMemberInfoVisible = false, operateType, changePwdVisible = false} = this.state;
    const {
      routes = [],
      ryid = "",
      zyrole = "",
      data: {
        XB = "",
        GYSMC = "",
        RYMC = "",
        RYGW = "",
        DJ = "",
        XMMC = "",
        SYKHID = "",
        RYZT = "",
      },
    } = this.props;

    const btnMoreContent = (
      <Menu>
        {/**/}
        <Menu.Item onClick={this.modPwd}>修改密码</Menu.Item>
        <Menu.Item onClick={() => this.handleEditMemberInfo("syqkh")}>试用期考核</Menu.Item>
      </Menu>
    );

    const editMessageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '40%',
      height: '250px',
      title: '修改密码',
      style: {top: '40px'},
      visible: changePwdVisible,
      footer: null,
    };

    const changePwdUrl = `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=V_RYXX_MODPASSWORD&Table=V_RYXX&RYID=${ryid}`;

    return (
      <div className="top-console">
        {/*修改密码*/}
        {
          changePwdVisible &&
          <BridgeModel
            modalProps={editMessageModalProps}
            onSucess={() => this.onSuccess('修改密码')}
            onCancel={() => this.setState({
              changePwdVisible: false
            })}
            src={changePwdUrl}
          />
        }
        {
          editMemberInfoVisible &&
          <EditMemberInfoModel visible={editMemberInfoVisible} data={this.props.data} ryid={ryid}
                               operateType={operateType} closeModal={this.closeModal}
                               successCallBack={this.successCallBack}/>
        }
        <div className="back-img">
          <Breadcrumb separator=">">
            {routes.map((item, index) => {
              const {name = item, pathname = ''} = item;
              const historyRoutes = routes.slice(0, index + 1);
              return (
                <Breadcrumb.Item key={index}>
                  {index === routes.length - 1 ? (
                    <>{name}</>
                  ) : (
                    <Link to={{pathname: pathname, state: {routes: historyRoutes}}}>
                      {name}
                    </Link>
                  )}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <div className="member-detail-header flex-r">
            <div className="header-left flex-r">
              <img src={XB === '1' ? boyImg : XB === '2' ? girlImg : boyImg} className="staff-img"/>
              <div className="member-detail-cont flex-c">
                <div className="member-detail-line-import">
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
                  <span style={{color: '#C0C4CC'}}>|</span>
                  <span className="member-detail-label">&nbsp;</span>
                  <Tooltip title={RYGW || '-'}>
                  <span
                    className="member-detail-value"
                    style={{
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: '2',
                    }}
                  >
                    {RYGW || '-'}&nbsp;&nbsp;&nbsp;
                  </span>
                  </Tooltip>
                  <span className="member-detail-label">所属项目：</span>
                  <span className="member-detail-value">{XMMC || '-'}</span>
                </div>
              </div>
            </div>
            <div className="header-right flex-r flex1">
              <Button className="btn-edit" onClick={() => this.handleEditMemberInfo("bjxq")}>
                编辑
              </Button>
              <Dropdown overlay={btnMoreContent} overlayClassName="tc-btn-more-content-dropdown">
                <Button className="btn-more">
                  <i className="iconfont icon-more"/>
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ToConsole;
