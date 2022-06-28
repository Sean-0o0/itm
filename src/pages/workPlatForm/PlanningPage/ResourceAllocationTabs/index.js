import React, { Fragment } from 'react';
import { Tabs,Row,Col } from 'antd';
import { connect } from 'dva';
import ResourceAllocationList from '../../../../components/WorkPlatForm/PlanningPage/ResourceAllocation';
import ResourceAllocationDep from '../../../../components/WorkPlatForm/PlanningPage/ResourceAllocationDep';
const { TabPane } = Tabs;
class ResourceAllocationTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <Fragment>
        <Tabs defaultActiveKey="1" tabBarStyle={{backgroundColor: 'white',margin: '0 0 0.5rem 0'}}>
          <TabPane tab="总体资源配置" key="1" style={{ height: '100%' }}>
            <Row style={{ height: '100%' }} className='evaluation-body'>
              <Col span={24} >
                <Row>
                  <ResourceAllocationList/>
                </Row>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="各部门资源配置" key="2" style={{ height: '100%' }}>
            <Row style={{ height: '100%' }} className='evaluation-body'>
              <Col span={24} >
                <Row>
                  <ResourceAllocationDep/>
                </Row>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ResourceAllocationTabs);
