import React, { Component } from 'react';
import { Spin, Tabs } from 'antd';
import StaffTable from './StaffTable';

const { TabPane } = Tabs;

class InfoTable extends Component {
  state = {
    activeKey: 'MX_ZB',
    queryType: 'MX_ZB',
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.defaultYear !== prevProps.defaultYear) {
      this.setState({
        activeKey: 'MX_ZB',
        queryType: 'MX_ZB',
      });
    }
  }

  handleTab = id => {
    let queryType = id;
    this.setState(
      {
        activeKey: id,
        queryType,
      },
      () => {
        this.props.fetchData(queryType, {
          ...(this.props.pageParam || {}),
          current: 1,
          pageSize: 10,
          paging: 1,
          total: -1,
        });
      },
    );
  };

  render() {
    const { activeKey, queryType } = this.state;
    const { data = [], tableLoading, pageParam, role, routes, orgid, ysglxx } = this.props;
    return (
      <div className="info-table">
        <Tabs onChange={this.handleTab} type="card" activeKey={activeKey}>
          <TabPane tab="资本性预算" key="MX_ZB">
            <StaffTable
              defaultYear={this.props.defaultYear}
              routes={routes}
              orgid={orgid}
              role={role}
              queryType={queryType}
              fetchData={this.props.fetchData}
              bgxx={data}
              tableLoading={tableLoading}
              pageParam={pageParam}
              ysglxx={ysglxx}
              YSLB={this.props.YSLB}
            />
          </TabPane>
          <TabPane tab="非资本性预算" key="MX_FZB">
            <StaffTable
              defaultYear={this.props.defaultYear}
              routes={routes}
              orgid={orgid}
              role={role}
              queryType={queryType}
              fetchData={this.props.fetchData}
              bgxx={data}
              tableLoading={tableLoading}
              pageParam={pageParam}
              ysglxx={ysglxx}
              YSLB={this.props.YSLB}
            />
          </TabPane>
          <TabPane tab="科研预算" key="MX_KY">
            <StaffTable
              defaultYear={this.props.defaultYear}
              routes={routes}
              orgid={orgid}
              role={role}
              queryType={queryType}
              fetchData={this.props.fetchData}
              bgxx={data}
              tableLoading={tableLoading}
              pageParam={pageParam}
              ysglxx={ysglxx}
              YSLB={this.props.YSLB}
            />
          </TabPane>
          {role === '二级部门领导' && (
            <TabPane tab="其他支付" key="MX_QT">
              <StaffTable
                defaultYear={this.props.defaultYear}
                routes={routes}
                orgid={orgid}
                role={role}
                queryType={queryType}
                fetchData={this.props.fetchData}
                bgxx={data}
                tableLoading={tableLoading}
                pageParam={pageParam}
                ysglxx={ysglxx}
              />
            </TabPane>
          )}
        </Tabs>
      </div>
    );
  }
}

export default InfoTable;
