import { Row, Col, Card, Divider, Pagination, message } from 'antd';
import React from 'react';
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProgressStatus from "../ProgressStatus";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import { FetchQueryLiftcycleMilestone, FetchQueryOwnerWorkflow, GetApplyListProvisionalAuth } from "../../../../services/pmsServices";
import { Link } from "dva/router";
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
    const { fetchQueryOwnerWorkflow } = this.props;
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

  handleToggle = (url) => {
    if (url.includes('YKB:')) {
      const arr = url.split(',');
      const id = arr[0].split(':')[1];
      const userykbid = arr[1];
      GetApplyListProvisionalAuth({
        id, userykbid,
      }).then(res => {
        window.open(res.url);
      }).catch(e => console.error(e));
    } else {//OA流程
      window.open(url);
    }
  }

  render() {
    const { data = [], total = 0 } = this.props;
    const { seeVisible, seeUrl, color } = this.state;
    const src_see = localStorage.getItem('livebos') + seeUrl;
    const seeModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '100rem',
      title: '流程查看',
      style: { top: '10rem' },
      visible: seeVisible,
      footer: null,
    };
    return (
      <Row className='workBench' style={{ height: '100%', padding: '3.5712rem 1.7856rem 3.5712rem 3.5712rem' }}>
        <div style={{ width: '100%', lineHeight: '3.5712rem', paddingBottom: '2.381rem' }}>
          <div style={{ display: 'flex', }}>
            <i style={{ color: 'rgba(51, 97, 255, 1)', fontSize: '3.57rem', marginRight: '1rem' }}
              className="iconfont icon-procedure" />
            <div style={{ height: '10%', fontSize: '2.3808rem', fontWeight: 700, color: '#303133', }}>流程情况
            </div>
          </div>
        </div>
        {/*立项流程查看弹窗*/}
        {seeVisible &&
          <BridgeModel modalProps={seeModalProps} onSucess={this.onSuccess} onCancel={this.closeSeeModal}
            src={src_see} />}
        <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'row', }}>
          <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card title='' bordered={false} className='ProcessStatus' headStyle={{ padding: '0' }}
              bodyStyle={{ padding: '0rem', height: '100%', }}>
              {
                data?.map((item = {}, index) => {
                  return <div className='ProcessStatus-Div' style={{}} key={index}>
                    <div className='title'>
                      <Points status={item.state} />
                      <a target="_blank" className='title-link' style={{ fontSize: '2.083rem' }}
                        rel="noopener noreferrer" onClick={() => this.handleToggle(item.url)}>{item.subject}</a>&nbsp;
                      <i
                        className={'iconfont icon-right'}
                        style={{ fontSize: '2.381rem' }}
                      />
                    </div>
                    <Row className='cont'>
                      <Col span={15} className='col1' style={{ fontSize: '2.083rem', }}>
                        项目：
                        <span className='span' style={{ fontSize: '2.083rem', }}>
                          {item.xmmc}
                        </span>
                      </Col>
                      <Col span={9} className='col2' style={{ fontSize: '2.083rem', }}>
                        <ProgressStatus state={item.state} />
                      </Col>
                    </Row>
                  </div>
                })
              }
            </Card>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default ProcessSituation;
