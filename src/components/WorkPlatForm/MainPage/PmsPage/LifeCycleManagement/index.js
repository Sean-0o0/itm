import {Collapse, Row, Col, Icon, Empty} from 'antd';
import React from 'react';
import OperationList from './OperationList';
import { CaretLeftOutlined,CaretRightOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
class LifeCycleManagementTabs extends React.Component {
  state = {
    num:2,
  };

  componentDidMount() {
  }

  onChange = (key) => {
    console.log(key);
  };

  handleClickLeft =()=>{
    console.log('左左左左');
    this.setState({
      num:this.state.num-1,
    })
  }

  handleClickRight =()=>{
    console.log('右右右右');
    this.setState({
      num:this.state.num+1,
    })
  }

  text = ()=>{
    return <div>
      <span style={{color:'rgba(102, 102, 102, 1)'}}>项目进度&nbsp;&nbsp;<span style={{color:'rgba(63, 170, 255, 1)'}}>正常</span></span>
      <span style={{paddingLeft:'4rem',color:'rgba(102, 102, 102, 1)'}}>时间范围&nbsp;&nbsp;<span style={{color:'rgba(63, 170, 255, 1)'}}>2022.05.10-2022.06.15</span></span>
      <span style={{paddingLeft:'4rem',paddingRight:'4rem',color:'rgba(102, 102, 102, 1)'}}>项目风险&nbsp;&nbsp;<span style={{color:'rgba(63, 170, 255, 1)'}}>暂无</span></span>
    </div>;
  }

  render() {
    const { num } = this.state;
    const text = this.text();
    return (
      <Row style={{height:'100%'}}>
        <Col span={24} style={{height:'8%'}}>
          <OperationList/>
        </Col>
        <Col span={24} style={{height:'92%'}}>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
              <Panel header="2.项目立项" key="1" extra={text}>
                <Col style={{display:'flex',}}>
                  <Col span={1} style={{width:'1%',display:'flex',alignItems: 'center',}}>
                    {num ===2?'':<CaretLeftOutlined style={{display:'flex',alignItems: 'center',}} onClick={this.handleClickLeft}/>}
                  </Col>
                  <Col span={22} style={{width:'98%',display:'flex'}}>
                      {num === 2?<Col span={8}>
                        <div style={{marginLeft:'2rem',height:'30rem',overflowY:'scroll'}}>
                          <div style={{display:'flex',alignItems: 'center',height:'2rem',margin:'0 0 1rem 0'}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{height:'4rem',padding: '0 1.3rem',margin:'0 0 1rem 0'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <Row style={{height:'4rem',padding: '0 1.3rem',margin:'0 0 1rem 0'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <Row style={{height:'4rem',padding: '0 1.3rem',margin:'0 0 1rem 0'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>*/}
                            {/*  <div style={{paddingRight: '1rem'}}>*/}
                            {/*    2022.06.17上传*/}
                            {/*  </div>*/}
                            {/*  <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>*/}
                            {/*  </div>*/}
                            {/*  <div style={{paddingLeft: '1rem'}}>*/}
                            {/*    来自项目信息管理系统*/}
                            {/*  </div>*/}
                            {/*</div>*/}
                          </Row>
                          <Row style={{height:'4rem',padding: '0 1.3rem',margin:'0 0 1rem 0'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>*/}
                            {/*  <div style={{paddingRight: '1rem'}}>*/}
                            {/*    2022.06.17上传*/}
                            {/*  </div>*/}
                            {/*  <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>*/}
                            {/*  </div>*/}
                            {/*  <div style={{paddingLeft: '1rem'}}>*/}
                            {/*    来自项目信息管理系统*/}
                            {/*  </div>*/}
                            {/*</div>*/}
                          </Row>
                          <Row style={{height:'4rem',padding: '0 1.3rem',margin:'0 0 1rem 0'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{height:'4rem',padding: '0 1.3rem',margin:'0 0 1rem 0'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <Row style={{height:'4rem',padding: '0 1.3rem',margin:'0 0 1rem 0'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 2||num === 3?<Col span={8}>
                        <div style={{marginLeft:'2rem',height:'30rem',overflowY:'scroll'}}>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 2||num === 3||num === 4?<Col span={8}>
                        <div style={{marginLeft:'2rem',height:'30rem',overflowY:'scroll'}}>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 3||num === 4?<Col span={8}>
                        <div style={{marginLeft:'2rem',height:'30rem',overflowY:'scroll'}}>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 4||num === 5?<Col span={8}>
                        <div style={{marginLeft:'2rem',height:'30rem',overflowY:'scroll'}}>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 5?<Col span={8}>
                        <div style={{marginLeft:'2rem',height:'30rem',overflowY:'scroll'}}>
                          <div style={{display:'flex',alignItems: 'center',}}>
                            <div style={{width:'.3rem',height:'1.5rem',backgroundColor: 'red'}}>
                            </div>
                            <div style={{paddingLeft: '1rem'}}>
                              标前会议
                            </div>
                          </div>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={4} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div style={{display:'inline-flex',alignItems:'center',color:'rgba(153, 153, 153, 1)'}}>
                              <div style={{paddingRight: '1rem'}}>
                                2022.06.17上传
                              </div>
                              <div style={{width:'.2rem',height:'1.5rem',backgroundColor: 'rgba(153, 153, 153, 1)'}}>
                              </div>
                              <div style={{paddingLeft: '1rem'}}>
                                来自项目信息管理系统
                              </div>
                            </div>
                          </Row>
                          <Row style={{padding: '1rem 1rem 1rem 1.3rem'}}>
                            <Col span={12} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={12} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                          </Row>
                        </div>
                      </Col>:''}
                    </Col>
                  <Col span={1} style={{width:'1%',display:'flex',alignItems: 'center',}}>
                    {num ===5?'':<CaretRightOutlined style={{display:'flex',alignItems: 'center'}}onClick={this.handleClickRight}/>}
                  </Col>
                </Col>
              </Panel>
            </Collapse>
          </div>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={[]} onChange={this.onChange}>
              <Panel header="1.需求及市场调研" key="1">
                <Empty></Empty>
              </Panel>
            </Collapse>
          </div>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={[]} onChange={this.onChange}>
              <Panel header="3.项目招标" key="1">
                <Empty></Empty>
              </Panel>
            </Collapse>
          </div>
        </Col>
      </Row>
    );
  }
}

export default LifeCycleManagementTabs;
