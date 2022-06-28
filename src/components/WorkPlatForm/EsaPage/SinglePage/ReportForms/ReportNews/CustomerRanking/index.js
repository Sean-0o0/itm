import React from 'react';
import { Row, Card, Tabs } from 'antd';
import OutCompany from './OutCompany';
import Department from './Department';
import Manger from './Manger';
import Customer from './Customer';

const { TabPane } = Tabs;

class CustomerRanking extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <Card className="m-card" title={<div style={{ fontWeight: '900' }}>分支机构及客户经理月度排名(高端客户)</div>}>
            <Row>
              <Tabs className="m-tabs-underline m-tabs-underline-small">
                <TabPane tab="分公司排名" key="1">
                  <OutCompany />
                </TabPane>
                <TabPane tab="营业部排名" key="2">
                  <Department />
                </TabPane>
                <TabPane tab="客户经理排名" key="3">
                  <Manger />
                </TabPane>
                <TabPane tab="客户排名" key="4">
                  <Customer />
                </TabPane>
              </Tabs>
            </Row>
          </Card>
        </Row>
      </React.Fragment>
    )
  }
}
export default CustomerRanking;