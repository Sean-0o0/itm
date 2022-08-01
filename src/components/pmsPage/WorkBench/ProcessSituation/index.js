import {Row, Col, Card, Divider, Pagination} from 'antd';
import React from 'react';
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProgressStatus from "../ProgressStatus";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

class ProcessSituation extends React.Component {
  state = {
    seeVisible: false,
    seeUrl: '',
  };

  componentDidMount() {
  }

  handleSee = (name) => {
    let seeUrl = "";
    switch (name) {
      case "项目信息管理系统立项申请":
        seeUrl = "/UIProcessor?Table=WORKFLOW_TOTASKS&Token=4a62a93d0c13f6c312f811e684b33ce0&View=Detail&ID=94&HideCancelBtn=true";
        break;
    }
    this.setState({
      seeUrl: seeUrl
    })
    this.setState({
      seeVisible: true,
    });
  };

  closeSeeModal = () => {
    this.setState({
      seeVisible: false,
    });
  };


  //成功回调
  onSuccess = () => {

  }

  render() {
    const {seeVisible, seeUrl} = this.state;
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
      <Row className='workBench' style={{height: 'calc(100% - 4.5rem)', margin: '1rem 2rem'}}>
        {/*立项流程发起弹窗*/}
        {seeVisible &&
        <BridgeModel modalProps={seeModalProps} onSucess={this.onSuccess} onCancel={this.closeSeeModal}
                     src={src_see}/>}
        <Card title='流程情况' bordered={false} className='ProcessStatus' headStyle={{padding: '1'}}
              bodyStyle={{padding: '1rem'}}>
          <div className='ProcessStatus-Div'>
            <div className='title'>
              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
              <a onClick={() => this.handleSee("项目信息管理系统立项申请")}>项目信息管理系统立项申请</a>
            </div>
            <Row className='cont'>
              <Col span={14} className='col1'>
                关联项目：
                <span className='span'>
                  项目信息管理系统
                </span>
              </Col>
              <Col span={10} className='col2'>
                流程状态：<ProgressStatus state={"正常"}/>
              </Col>
            </Row>
          </div>
          <Divider/>
          <div className='ProcessStatus-Div'>
            <div className='title'>
              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
              <a onClick={() => this.handleSee("项目信息管理系统立项申请")}>合同用印流程</a>
            </div>
            <Row className='cont'>
              <Col span={14} className='col1'>
                关联项目：
                <span className='span'>
                  项目信息管理系统
                </span>
              </Col>
              <Col span={10} className='col2'>
                流程状态：<ProgressStatus state={"正常"}/>
              </Col>
            </Row>
          </div>
          <Divider/>
          <div className='ProcessStatus-Div'>
            <div className='title'>
              <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
              <a onClick={() => this.handleSee("项目信息管理系统立项申请")}>项目付款流程</a>
            </div>
            <Row className='cont'>
              <Col span={14} className='col1'>
                关联项目：
                <span className='span'>
                  项目信息管理系统
                </span>
              </Col>
              <Col span={10} className='col2'>
                流程状态：<ProgressStatus state={"正常"}/>
              </Col>
            </Row>
          </div>
          <Divider/>
          <div className='ProcessStatus-Div'>
            <div className='title'>
              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
              项目信息管理系统立项申请
            </div>
            <Row className='cont'>
              <Col span={14} className='col1'>
                关联项目：
                <span className='span'>
                  项目信息管理系统
                </span>
              </Col>
              <Col span={10} className='col2'>
                流程状态：<ProgressStatus state={"正常"}/>
              </Col>
            </Row>
          </div>
          <Divider/>
          <div className='ProcessStatus-Div'>
            <div className='title'>
              <div className='cont-row-point' style={{background: 'rgba(192, 196, 204, 1)'}}/>
              项目信息管理系统立项申请
            </div>
            <Row className='cont'>
              <Col span={14} className='col1'>
                关联项目：
                <span className='span'>
                  项目信息管理系统
                </span>
              </Col>
              <Col span={10} className='col2'>
                流程状态：<ProgressStatus state={"正常"}/>
              </Col>
            </Row>
          </div>
          <Divider/>
          <Pagination
            total={5}
            showTotal={total => `共 ${total} 条`}
            defaultPageSize={5}
            showQuickJumper={true}
            defaultCurrent={1}
          />
        </Card>
      </Row>
    );
  }
}

export default ProcessSituation;
