import {Row, Col, Card, Divider, Pagination, message} from 'antd';
import React from 'react';
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProgressStatus from "../ProgressStatus";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import {FetchQueryLiftcycleMilestone, FetchQueryOwnerWorkflow} from "../../../../services/pmsServices";

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

  handPageChange = (page, pageSize) => {
    const {fetchQueryOwnerWorkflow} = this.props;
    fetchQueryOwnerWorkflow(page, pageSize)
  }


  //成功回调
  onSuccess = () => {

  }

  render() {
    const {data = [], total = 0} = this.props;
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
      <Row className='workBench' style={{height: '100%', margin: '1rem 2rem'}}>
        {/*立项流程查看弹窗*/}
        {seeVisible &&
        <BridgeModel modalProps={seeModalProps} onSucess={this.onSuccess} onCancel={this.closeSeeModal}
                     src={src_see}/>}
        <Card title='流程情况' bordered={false} className='ProcessStatus' headStyle={{padding: '1'}}
              style={{height: '90%',}} bodyStyle={{padding: '1rem', height: '100%',}}>
          {
            data.map((item = {}, index) => {
              return <div className='ProcessStatus-Div' style={{height: '87%',}}>
                <div className='title'>
                  <div className='cont-row-point' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                  <a style={{color: '#1890ff'}} onClick={() => this.handleSee("项目信息管理系统立项申请")}>{item.subject}</a>
                </div>
                <Row className='cont'>
                  <Col span={12} className='col1'>
                    关联项目：
                    <span className='span'>
                  {item.xmmc}
                </span>
                  </Col>
                  <Col span={12} className='col2'>
                    流程状态：<ProgressStatus state={item.state}/>
                  </Col>
                </Row>
                <Divider/>
              </div>
            })
          }
          <Pagination
            style={{textAlign: 'end'}}
            total={total}
            showTotal={total => `共 ${total} 条`}
            defaultPageSize={5}
            onChange={() => this.handPageChange(page, pagesize)}
            showQuickJumper={true}
            defaultCurrent={1}
          />
        </Card>
      </Row>
    );
  }
}

export default ProcessSituation;
