import {Row, Col, Tooltip, Dropdown, Menu,} from 'antd';
import React from 'react';
import icon_wrong from "../../../../image/pms/icon_milepost_wrong.png";
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProjectRisk from "../../LifeCycleManagement/ProjectRisk";
import icon_normal from "../../../../image/pms/icon_milepost_normal.png";
import icon_waiting from "../../../../image/pms/icon_milepost_waiting.png";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

class ProjectSchedule extends React.Component {
  state = {
    //上传弹窗
    uploadVisible: false,
    //上传url
    uploadUrl: '',
    //修改弹窗
    editVisible: false,
    //修改url
    editUrl: '',
    //立项流程发起弹窗
    sendVisible: false,
    //立项流程发起url
    sendUrl: '/OperateProcessor?operate=TLC_LCFQ_LXSQLCFQ&Table=TLC_LCFQ&GLXM=5&ParamAction=true',
    extend1: true,
    extend2: false,
    extend3: false,
  };

  componentDidMount() {
  }

  handleUpload = (name) => {
    let uploadUrl = "";
    switch (name) {
      case "标前会议纪要扫描件":
        uploadUrl = "";
        break;
      case "信委会议案原稿":
        uploadUrl = "/OperateProcessor?operate=TWD_XM_XWHYG&Table=TWD_XM";
        break;
      case "信委会议案电子稿":
        uploadUrl = "/OperateProcessor?operate=TWD_XM_SMZQSC&Table=TWD_XM";
        break;
      case "总办会原稿":
        uploadUrl = "/OperateProcessor?operate=TWD_XM_ZBHYG&Table=TWD_XM";
        break;
      case "总办会提案":
        uploadUrl = "/OperateProcessor?operate=TWD_XM_ZBHTA&Table=TWD_XM";
        break;
      case "招标文件":
        uploadUrl = "";
        break;
    }
    this.setState({
      uploadUrl: uploadUrl
    })
    this.setState({
      uploadVisible: true,
    });
  };

  handleEdit = (name) => {
    let editUrl = "";
    switch (name) {
      case "信委会会议纪要":
        editUrl = "/OperateProcessor?operate=TWD_XM_XWHJY&Table=TWD_XM";
        break;
      case "总办会会议纪要":
        editUrl = "/OperateProcessor?operate=TWD_XM_ZBHJY&Table=TWD_XM";
        break;
    }
    this.setState({
      editUrl: editUrl
    })
    this.setState({
      editVisible: true,
    });
  };

  handleSend = () => {
    this.setState({
      sendVisible: true,
    });
  };

  closeUploadModal = () => {
    this.setState({
      uploadVisible: false,
    });
  };

  closeEditModal = () => {
    this.setState({
      editVisible: false,
    });
  };

  closeSendModal = () => {
    this.setState({
      sendVisible: false,
    });
  };

  //成功回调
  onSuccess = () => {

  }

  extend1 = () => {
    this.setState({
      extend1: !this.state.extend1,
    })
  }
  extend2 = () => {
    this.setState({
      extend2: !this.state.extend2,
    })
  }
  extend3 = () => {
    this.setState({
      extend3: !this.state.extend3,
    })
  }

  render() {
    const {
      uploadVisible,
      editVisible,
      sendVisible,
      uploadUrl,
      editUrl,
      sendUrl,
      extend1,
      extend2,
      extend3,
      extend4,
      extend5
    } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.baidu.com/">
            下载文件
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.baidu.com/">
            历史记录
          </a>
        </Menu.Item>
      </Menu>
    );
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '上传',
      style: {top: '20rem'},
      visible: uploadVisible,
      footer: null,
    };
    const editModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '68rem',
      title: '修改',
      style: {top: '20rem'},
      visible: editVisible,
      footer: null,
    };
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '100rem',
      title: '发起流程',
      style: {top: '10rem'},
      visible: sendVisible,
      footer: null,
    };
    const src_upload = localStorage.getItem('livebos') + uploadUrl;
    const src_edit = localStorage.getItem('livebos') + editUrl;
    const src_send = localStorage.getItem('livebos') + sendUrl;
    return (
      <Row className='workBench' style={{height: 'calc(100% - 4.5rem)', margin: '3rem'}}>
        {/*上传弹窗*/}
        {uploadVisible &&
        <BridgeModel modalProps={uploadModalProps} onSucess={this.onSuccess} onCancel={this.closeUploadModal}
                     src={src_upload}/>}
        {/*修改弹窗*/}
        {editVisible &&
        <BridgeModel modalProps={editModalProps} onSucess={this.onSuccess} onCancel={this.closeEditModal}
                     src={src_edit}/>}
        {/*立项流程发起弹窗*/}
        {sendVisible &&
        <BridgeModel modalProps={sendModalProps} onSucess={this.onSuccess} onCancel={this.closeSendModal}
                     src={src_send}/>}
        <Col span={24} style={{height: '92%'}}>
          <div className='LifeCycleManage'>
            <div className='head'>
              {/*<img src={icon_wrong} alt="" className='head-img'/>*/}
              <i className={extend1 ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                 onClick={this.extend1}/>&nbsp;
              <div className='head1'>
                {/*pms/manage/LifeCycleManagement*/}
                <a onClick={() => {
                  window.location.href = `/#/pms/manage/LifeCycleManagement`
                }}>项目信息管理系统</a>
              </div>
              <div className='head3'>
                {/*时间范围：*/}
                {/*<div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>*/}
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"逾期"}/>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"存在"}/>
              </div>
              {/*<div className='head5'>*/}
              {/*  <div className='head5-title'>*/}
              {/*    <div className='head5-cont'>*/}
              {/*      <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            {
              extend1 ? <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                  <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                    <div className='head'>
                      {/*<img src={icon_wrong} alt="" className='head-img'/>*/}
                      <div className='head1'>
                        里程碑阶段：
                        <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                           className="iconfont icon-fill-flag"/>&nbsp;
                        <span style={{color: 'rgba(48, 49, 51, 1)'}}>项目立项</span>
                      </div>
                      <div className='head2'>
                        里程碑时间：
                        <div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
                      </div>
                    </div>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            标前会议(0/1)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("标前会议纪要扫描件")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                        <div className='cont-col1'>
                          <div className='right'>
                            立项申请(1/2)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              招标文件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("招标文件招标文件")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              立项申请流程
                            </Col>
                            <Col span={3}>
                              <Tooltip title="发起">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-send" onClick={this.handleSend}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            信委会(1/3)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              信委会议案原稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("信委会议案原稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              信委会议案电子稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("信委会议案电子稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              信委会会议纪要
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit" onClick={() => this.handleEdit("信委会会议纪要")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            总办会(1/3)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              总办会提案
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("总办会提案")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              总办会原稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("总办会原稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              总办会会议纪要
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit" onClick={() => this.handleEdit("总办会会议纪要")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Col>
                </Row>
                : ''
            }
          </div>
          <div className='LifeCycleManage'>
            <div className='head'>
              {/*<img src={icon_normal} alt="" className='head-img'/>*/}
              <i className={extend2 ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                 onClick={this.extend2}/>&nbsp;
              <div className='head1'>
                企划平台
              </div>
              <div className='head3'>
                {/*时间范围：*/}
                {/*<div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>*/}
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"进行中"}/>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              {/*<div className='head5'>*/}
              {/*  <div className='head5-title'>*/}
              {/*    <div className='head5-cont'>*/}
              {/*      <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            {
              extend2 ? <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                  <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("标前会议纪要扫描件")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                        <div className='cont-col1'>
                          <div className='right'>
                            立项申请(2/4)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              招标文件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("招标文件")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              立项申请流程
                            </Col>
                            <Col span={3}>
                              <Tooltip title="发起">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-send" onClick={this.handleSend}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            信委会(1/2)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              信委会议案原稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("信委会议案原稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              信委会议案电子稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("信委会议案电子稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              信委会会议纪要
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit" onClick={() => this.handleEdit("信委会会议纪要")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            总办会(1/2)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              总办会提案
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("总办会提案")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              总办会原稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("总办会原稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              总办会会议纪要
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit" onClick={() => this.handleEdit("总办会会议纪要")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Col>
                </Row>
                : ''
            }
          </div>
          <div className='LifeCycleManage'>
            <div className='head'>
              {/*<img src={icon_normal} alt="" className='head-img'/>*/}
              <i className={extend3 ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                 onClick={this.extend3}/>&nbsp;
              <div className='head1'>
                产品信息管理系统
              </div>
              <div className='head3'>
                {/*时间范围：*/}
                {/*<div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>*/}
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"进行中"}/>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              {/*<div className='head5'>*/}
              {/*  <div className='head5-title'>*/}
              {/*    <div className='head5-cont'>*/}
              {/*      <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            {
              extend3 ? <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                  <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("标前会议纪要扫描件")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                        <div className='cont-col1'>
                          <div className='right'>
                            立项申请(2/4)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              招标文件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("招标文件")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              立项申请流程
                            </Col>
                            <Col span={3}>
                              <Tooltip title="发起">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-send" onClick={this.handleSend}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            信委会(1/2)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              信委会议案原稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("信委会议案原稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              信委会议案电子稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("信委会议案电子稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              信委会会议纪要
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit" onClick={() => this.handleEdit("信委会会议纪要")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            总办会(1/2)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              总办会提案
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("总办会提案")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              总办会原稿
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={() => this.handleUpload("总办会原稿")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              总办会会议纪要
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-edit" onClick={() => this.handleEdit("总办会会议纪要")}/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-more">
                                </i>
                              </Dropdown>
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                            </div>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Col>
                </Row>
                : ''
            }
          </div>
        </Col>
      </Row>
    );
  }
}

export default ProjectSchedule;
