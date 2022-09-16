import {Row, Col, Card, Divider, Pagination, message} from 'antd';
import React from 'react';
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProgressStatus from "../ProgressStatus";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import {FetchQueryLiftcycleMilestone, FetchQueryOwnerWorkflow} from "../../../../services/pmsServices";
import {Link} from "dva/router";
import Points from "../../LifeCycleManagement/Points";
class ProcessSituation extends React.Component {
  state = {
    seeVisible: false,
    seeUrl: '',
  };

  componentDidMount() {
  }

  handleSee = (url) => {
    window.open("www.baidu.com");
  };

  closeSeeModal = () => {
    this.setState({
      seeVisible: false,
    });
  };

  handPageChange = (page) => {
    const {fetchQueryOwnerWorkflow} = this.props;
    fetchQueryOwnerWorkflow(page)
  }


  //成功回调
  onSuccess = () => {

  }

  handleColorChange = (e) => {
    this.setState({
      color: e,
    })
  }

  render() {
    const {data = [], total = 0} = this.props;
    const {seeVisible, seeUrl, color} = this.state;
    const src_see = localStorage.getItem('livebos') + seeUrl;
    const seeModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '100rem',
      title: '流程查看',
      style: {top: '10rem'},
      visible: seeVisible,
      footer: null,
    };
    return (
      <Row className='workBench' style={{height: '100%', padding: '3.571rem'}}>
        <div style={{width: '100%', lineHeight: '3.571rem', paddingBottom: '2.381rem'}}>
          <div style={{display: 'flex',}}>
            <i style={{color: 'rgba(51, 97, 255, 1)', fontSize: '3.57rem', marginRight: '1rem'}}
               className="iconfont icon-procedure"/>
            <div style={{height: '10%', fontSize: '2.381rem', fontWeight: 700, color: '#303133',}}>流程情况
            </div>
          </div>
        </div>
        {/*立项流程查看弹窗*/}
        {seeVisible &&
        <BridgeModel modalProps={seeModalProps} onSucess={this.onSuccess} onCancel={this.closeSeeModal}
                     src={src_see}/>}
        <Col xs={24} sm={24} lg={24} xl={24} style={{display: 'flex', flexDirection: 'row',}}>
          <Col xs={24} sm={24} lg={24} xl={24} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div style={{height: '100%'}}>
              <div style={{height: '70rem'}}>
                <Card title='' bordered={false} className='ProcessStatus' headStyle={{padding: '0'}}
                      style={{height: '100%',}} bodyStyle={{padding: '0rem', height: '100%',}}>
                  {
                    data.map((item = {}, index) => {
                      console.log('item****',item);
                      return <div className='ProcessStatus-Div' style={{}}>
                        <div className='title'>
                          {/* <div className='cont-row-point' style={{borderColor: 'rgba(51, 97, 255, 1)'}}/> */}
                          {/* <Link style={{color: color, fontSize: '2.083rem',}}
                                onMouseOver={() => this.handleColorChange("#3361FF")}
                                onMouseLeave={() => this.handleColorChange('')}
                                onClick={() => this.handleSee("项目信息管理系统立项申请")}>{item.subject}</Link>&nbsp;
                          <i
                            className={'iconfont icon-right'}
                            style={{fontSize: '2.381rem', color: color}}
                          /> */}
                          <Points status={item.state}/>
                          <a target="_blank" className='title-link' style={{fontSize: '2.083rem'}}
                             rel="noopener noreferrer" href={item.url}>{item.subject}</a>&nbsp;
                          <i
                            className={'iconfont icon-right'}
                            style={{fontSize: '2.381rem'}}
                          />
                        </div>
                        <Row className='cont'>
                          <Col span={15} className='col1' style={{fontSize: '2.083rem',}}>
                            项目：
                            <span className='span' style={{fontSize: '2.083rem',}}>
                                {item.xmmc}
                              </span>
                          </Col>
                          <Col span={9} className='col2' style={{fontSize: '2.083rem',}}>
                            <ProgressStatus state={item.state}/>
                          </Col>
                        </Row>
                        <Divider style={{margin: '2.381rem 0'}}/>
                      </div>
                    })
                  }
                </Card>
              </div>
              <div style={{height: '10%', marginBottom: '1rem'}}>
                <Pagination
                  style={{textAlign: 'end', fontSize: '2.083rem'}}
                  total={total}
                  size="small"
                  showTotal={total => `共 ${total} 条`}
                  defaultPageSize={5}
                  onChange={this.handPageChange}
                  // showQuickJumper={true}
                  defaultCurrent={1}
                />
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default ProcessSituation;
