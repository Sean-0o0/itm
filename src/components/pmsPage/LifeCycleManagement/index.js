import {Collapse, Row, Col, Menu, Dropdown,Tooltip} from 'antd';
import React from 'react';
import OperationList from './OperationList';
import ProjectRisk from './ProjectRisk';
import ProjectProgress from './ProjectProgress';
import icon_normal from '../../../image/pms/icon_milepost_normal.png';
import icon_wrong from '../../../image/pms/icon_milepost_wrong.png';
import icon_waiting from '../../../image/pms/icon_milepost_waiting.png';
const { Panel } = Collapse;
class LifeCycleManagementTabs extends React.Component {
  state = {
    showMore: false,
    extend1:false,
    extend2:false,
    extend3:true,
    extend4:false,
    extend5:false,
  };

  componentDidMount() {
  }

  onChange = (key) => {
    console.log(key);
  };


  text = ()=>{
    return <div style={{
      fontSize: '14px',
      fontWeight: 400,
      color: '#666666',
      lineHeight: '20px'}}>
      <span style={{color:'rgba(102, 102, 102, 1)'}}>项目进度&nbsp;&nbsp;<span style={{color:'rgba(63, 170, 255, 1)'}}>正常</span></span>
      <span style={{paddingLeft:'4rem',color:'rgba(102, 102, 102, 1)'}}>时间范围&nbsp;&nbsp;<span style={{color:'rgba(63, 170, 255, 1)'}}>2022.05.10-2022.06.15</span></span>
      <span style={{paddingLeft:'4rem',paddingRight:'4rem',color:'rgba(102, 102, 102, 1)'}}>项目风险&nbsp;&nbsp;<span style={{color:'rgba(63, 170, 255, 1)'}}>暂无</span></span>
    </div>;
  }

  extend1 = () =>{
    this.setState({
      extend1:!this.state.extend1,
    })
  }
  extend2 = () =>{
    this.setState({
      extend2:!this.state.extend2,
    })
  }
  extend3 = () =>{
    this.setState({
      extend3:!this.state.extend3,
    })
  }
  extend4 = () =>{
    this.setState({
      extend4:!this.state.extend4,
    })
  }
  extend5 = () =>{
    this.setState({
      extend5:!this.state.extend5,
    })
  }

  handleMore = (showMore) =>{
    console.log("showMoreshowMoreshowMore",this.state.showMore)
    this.setState({
      showMore: showMore,
    })
    console.log("showMoreshowMoreshowMore",this.state.showMore)
  }
  render() {
    const {showMore,extend1,extend2,extend3,extend4,extend5 } = this.state;
    let height1 = '8rem';
    let height2 = '8rem';
    let height3 = '8rem';
    let height4 = '8rem';
    let height5 = '8rem';
    if(extend1){
      height1 = '70rem';
    }
    if(extend2){
      height2 = '70rem';
    }
    if(extend3){
      height3 = '70rem';
    }
    if(extend4){
      height4 = '70rem';
    }
    if(extend5){
      height5 = '70rem';
    }
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
        <Col span={24} style={{height:'8%',margin:'2rem 0'}}>
          <OperationList/>
        </Col>
        <Col span={24} style={{height:'92%'}}>
          <div className='LifeCycleManage' style={{height:height1}}>
            <div className='head'>
              <img src={icon_wrong} alt="" className='head-img'/>
              <i className={extend1?'iconfont icon-down-solid-arrow head-icon':'iconfont icon-right head-icon'} onClick={this.extend1}/>&nbsp;
              <div className='head1'>
                1.需求及市场调研
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"逾期"}/>
              </div>
              <div className='head3'>
                时间范围：<div style={{color:'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"存在"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='LifeCycleManage' style={{height:height2}}>
            <div className='head'>
              <img src={icon_normal} alt="" className='head-img'/>
              <i className={extend2?'iconfont icon-down-solid-arrow head-icon':'iconfont icon-right head-icon'} onClick={this.extend2}/>&nbsp;
              <div className='head1'>
                2.需求评审
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"已完成"}/>
              </div>
              <div className='head3'>
                时间范围：<div style={{color:'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='LifeCycleManage' style={{height:height3}}>
            <div className='head'>
              <img src={icon_normal} alt="" className='head-img'/>
              <i className={extend3?'iconfont icon-down-solid-arrow head-icon':'iconfont icon-right head-icon'} onClick={this.extend3}/>&nbsp;
              <div className='head1'>
                3.项目立项
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"进行中"}/>
              </div>
              <div className='head3'>
                时间范围：<div style={{color:'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
            {
              extend3?<Row style={{height:'80%',width:'100%',padding: '0 8rem'}} className='card'>
                  <Col span={24} style={{width:'100%',padding: '3rem'}} className='cont'>
                    <Col span={8}>
                      <div className='cont-col'>
                        <div className='cont-col1'>
                          <div className='right'>
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              信息录入
                            </Col>
                            <Col span={3}>
                              <Tooltip title="信息录入">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-file-fillout"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              信息录入
                            </Col>
                            <Col span={3}>
                              <Tooltip title="信息录入">
                               <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-file-fillout"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              信息录入
                            </Col>
                            <Col span={3}>
                              <Tooltip title="信息录入">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-file-fillout"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="上传">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-upload"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            标前会议(2/6)
                          </div>
                        </div>
                        <div style={{padding: '1.5rem 0'}}>
                          <Row className='cont-row'>
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                            <Col span={17} style={{display:'flex'}}>
                              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3}>
                              <Tooltip title="修改">
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                              </Tooltip>
                            </Col>
                            <Col span={3}>
                              <Dropdown overlay={menu}>
                                <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-more">
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
                :''
            }
          </div>
          <div className='LifeCycleManage' style={{height:height4}}>
            <div className='head'>
              <img src={icon_waiting} alt="" className='head-img'/>
              <i className={extend4?'iconfont icon-down-solid-arrow head-icon':'iconfont icon-right head-icon'} onClick={this.extend4}/>&nbsp;
              <div className='head1'>
                4.项目招标
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"未开始"}/>
              </div>
              <div className='head3'>
                时间范围：<div style={{color:'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='LifeCycleManage' style={{height:height5}}>
            <div className='head'>
              <img src={icon_waiting} alt="" className='head-img'/>
              <i className={extend5?'iconfont icon-down-solid-arrow head-icon':'iconfont icon-right head-icon'} onClick={this.extend5}/>&nbsp;
              <div className='head1'>
                5.项目计划
              </div>
              <div className='head2'>
                项目进度：<ProjectProgress state={"未开始"}/>
              </div>
              <div className='head3'>
                时间范围：<div style={{color:'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>
              </div>
              <div className='head4'>
                项目风险：<ProjectRisk state={"暂无"}/>
              </div>
              <div className='head5'>
                <div className='head5-title'>
                  <div className='head5-cont'>
                    <i style={{marginLeft: '0.6rem',color:'rgba(51, 97, 255, 1)'}} className="iconfont icon-edit"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default LifeCycleManagementTabs;
