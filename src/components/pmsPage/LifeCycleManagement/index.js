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

  headText = ()=>{
    return <span style={{
      fontSize: '16px',
      fontWeight: 500,
      color: '#333333'}}>
      2.项目立项
    </span>;
  }
  headText2 = ()=>{
    return <span style={{
      fontSize: '16px',
      fontWeight: 500,
      color: '#333333'}}>
      1.需求及市场调研
    </span>;
  }
  headText3 = ()=>{
    return <span style={{
      fontSize: '16px',
      fontWeight: 500,
      color: '#333333'}}>
      3.项目招标
    </span>;
  }

  render() {
    const { num } = this.state;
    const headText = this.headText();
    const headText2 = this.headText2();
    const headText3 = this.headText3();
    const text = this.text();
    return (
      <Row style={{height: 'calc(100% - 4.5rem)'}}>
        <Col span={24} style={{height:'8%'}}>
          <OperationList/>
        </Col>
        <Col span={24} style={{height:'92%'}}>
          <div className='LifeCycleManage'>
            <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
              <Panel header={headText} key="1" extra={text}>
                <Col className='card'>
                  <Col span={1} className='title'>
                    {num ===2?'':<CaretLeftOutlined className='right' onClick={this.handleClickLeft}/>}
                  </Col>
                  <Col span={22} className='cont'>
                      {num === 2?<Col span={8}>
                        <div className='cont-col'>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 2||num === 3?<Col span={8}>
                        <div className='cont-col'>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 2||num === 3||num === 4?<Col span={8}>
                        <div className='cont-col'>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 3||num === 4?<Col span={8}>
                        <div className='cont-col'>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 4||num === 5?<Col span={8}>
                        <div className='cont-col'>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                        </div>
                      </Col>:''}
                      {num === 5?<Col span={8}>
                        <div className='cont-col'>
                          <div className='cont-col1'>
                            <div className='left'>
                            </div>
                            <div className='right'>
                              标前会议
                            </div>
                          </div>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{color:'rgba(63, 170, 255, 1)'}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              下载
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              详情
                            </Col>
                            <div className='cont-row1'>
                              <div className='left'>
                                2022.06.17上传
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
                          </Row>
                          <Row className='cont-row'>
                            <Col span={15} style={{}}>
                              标前会议纪要扫描件
                            </Col>
                            <Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>
                              上传
                            </Col>
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  下载*/}
                            {/*</Col>*/}
                            {/*<Col span={3} style={{color:'rgba(63, 170, 255, 1)'}}>*/}
                            {/*  详情*/}
                            {/*</Col>*/}
                            <div className='cont-row1'>
                              <div className='left'>
                                {/*2022.06.17上传*/}
                              </div>
                              <div className='center'>
                              </div>
                              <div className='right'>

                              </div>
                            </div>
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
              <Panel header={headText2} key="1">
                <Empty></Empty>
              </Panel>
            </Collapse>
          </div>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={[]} onChange={this.onChange}>
              <Panel header={headText3} key="1">
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
