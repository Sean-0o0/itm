import {Collapse, Row, Col, Menu, Dropdown,Tooltip} from 'antd';
import React from 'react';
import OperationList from './OperationList';
import ProjectRisk from './ProjectRisk';
import ProjectProgress from './ProjectProgress';
import icon_normal from '../../../image/pms/icon_milepost_normal.png';
import icon_wrong from '../../../image/pms/icon_milepost_wrong.png';
import icon_waiting from '../../../image/pms/icon_milepost_waiting.png';
import BridgeModel from "../../Common/BasicModal/BridgeModel";
const { Panel } = Collapse;
class LifeCycleManagementTabs extends React.Component {
  state = {
    //上传弹窗
    uploadVisible: false,
    //上传url
    uploadUrl: '/OperateProcessor?operate=TWD_XM_SMZQSC&Table=TWD_XM&XMMC2=5&LCBMC2=14&WDLX2=53&WDMB2=7&ParamAction=true',
    //立项流程发起弹窗
    sendVisible: false,
    //立项流程发起url
    sendUrl: '/OperateProcessor?operate=TLC_LCFQ_LXSQLCFQ&Table=TLC_LCFQ&GLXM=5&ParamAction=true',
    extend1: false,
    extend2: false,
    extend3: true,
    extend4: false,
    extend5: false,
  };

  componentDidMount() {
  }

  onChange = (key) => {
    console.log(key);
  };


  text = () => {
    return <div style={{
      fontSize: '14px',
      fontWeight: 400,
      color: '#666666',
      lineHeight: '20px'
    }}>
      <span style={{color: 'rgba(102, 102, 102, 1)'}}>项目进度&nbsp;&nbsp;<span
        style={{color: 'rgba(63, 170, 255, 1)'}}>正常</span></span>
      <span style={{paddingLeft: '4rem', color: 'rgba(102, 102, 102, 1)'}}>时间范围&nbsp;&nbsp;<span
        style={{color: 'rgba(63, 170, 255, 1)'}}>2022.05.10-2022.06.15</span></span>
      <span style={{paddingLeft: '4rem', paddingRight: '4rem', color: 'rgba(102, 102, 102, 1)'}}>项目风险&nbsp;&nbsp;<span
        style={{color: 'rgba(63, 170, 255, 1)'}}>暂无</span></span>
    </div>;
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
  extend4 = () => {
    this.setState({
      extend4: !this.state.extend4,
    })
  }
  extend5 = () => {
    this.setState({
      extend5: !this.state.extend5,
    })
  }

  handleUpload = () => {
    this.setState({
      uploadVisible: true,
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

  closeSendModal = () => {
    this.setState({
      sendVisible: false,
    });
  };

  //成功回调
  onSuccess = () => {

  }

  render() {
    const {uploadVisible,sendVisible, uploadUrl,sendUrl, extend1, extend2, extend3, extend4, extend5} = this.state;
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '上传',
      style: {top: '30rem'},
      visible: uploadVisible,
      footer: null,
    };
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '发起流程',
      style: {top: '30rem'},
      visible: sendVisible,
      footer: null,
    };
    const src_upload = localStorage.getItem('livebos') + uploadUrl;
    const src_send = localStorage.getItem('livebos') + sendUrl;
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
    return (
      <Row style={{height: 'calc(100% - 4.5rem)'}}>
        {/*上传弹窗*/}
        {uploadVisible &&
        <BridgeModel modalProps={uploadModalProps} onSucess={this.onSuccess} onCancel={this.closeUploadModal}
                     src={src_upload} />}
        {/*立项流程发起弹窗*/}
        {sendVisible &&
        <BridgeModel modalProps={sendModalProps} onSucess={this.onSuccess} onCancel={this.closeSendModal}
                     src={src_send} />}
        <Col span={24} style={{height: '8%', margin: '2rem 0'}}>
          <OperationList/>
        </Col>
        <Col span={24} style={{height: '92%'}}>
          <div className='LifeCycleManage'>
            <div className='head'>
              <img src={icon_wrong} alt="" className='head-img'/>
              <i className={extend1 ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                 onClick={this.extend1}/>&nbsp;
              <div className='head1'>
                1.需求及市场调研
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"逾期"}/>
              </div>
              <div className='head3'>
                时间范围：
                <div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"存在"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
            {
              extend1 ? <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                  <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            物料(1/2)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              调研报告
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                              可执行方案
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
          <div className='LifeCycleManage' >
            <div className='head'>
              <img src={icon_normal} alt="" className='head-img'/>
              <i className={extend3 ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                 onClick={this.extend3}/>&nbsp;
              <div className='head1'>
                2.项目立项
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"进行中"}/>
              </div>
              <div className='head3'>
                时间范围：
                <div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
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
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                              关于对福建顶点软件公司合作迭...
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
                              信委会会议纪要
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
              <img src={icon_waiting} alt="" className='head-img'/>
              <i className={extend4 ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                 onClick={this.extend4}/>&nbsp;
              <div className='head1'>
                3.项目招标
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"未开始"}/>
              </div>
              <div className='head3'>
                时间范围：
                <div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
            {
              extend4 ? <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                  <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            物料(1/3)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              评标报告
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                              用印版合同
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                              中标公告
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                            事项(1/5)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              合同签署流程
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
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              合同信息录入
                            </Col>
                            <Col span={3}>
                              <Tooltip title="填写">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-file-fillout" onClick={this.handleSend}/>
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
                              招标方式变更
                            </Col>
                            <Col span={3}>
                              <Tooltip title="执行">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-file-fillout"/>
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
                              付款流程
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
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              招标信息录入
                            </Col>
                            <Col span={3}>
                              <Tooltip title="填写">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-file-fillout" onClick={this.handleSend}/>
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
              <img src={icon_waiting} alt="" className='head-img'/>
              <i className={extend5 ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                 onClick={this.extend5}/>&nbsp;
              <div className='head1'>
                4.项目开始
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"未开始"}/>
              </div>
              <div className='head3'>
                时间范围：
                <div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
            {
              extend5 ? <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                  <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            事项(1/3)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display: 'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              申请账号
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
                              申请设备
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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
                              申请餐券
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                   className="iconfont icon-upload" onClick={this.handleUpload}/>
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

export default LifeCycleManagementTabs;
