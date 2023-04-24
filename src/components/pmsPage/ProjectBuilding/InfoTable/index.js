import React, { Component } from 'react'
import { Spin, Tabs } from 'antd'
import StaffTable from './StaffTable'

const { TabPane } = Tabs;

class InfoTable extends Component {
  state = {
    activeKey: '1',
    queryType: 'MX_ALL',
    gwbm: ''
  }

  handleTab = id => {
    let queryType = '';
    let gwbm = '';
    if (id === '1') {
      queryType = 'MX_ALL';
      gwbm = ''
    } else {
      queryType = 'MX_SINGLE';
      gwbm = id
    }
    this.setState({
      activeKey: id,
      queryType,
      gwbm
    }, () => {
      this.props.fetchData(queryType, gwbm, {
        current: 1,
        pageSize: 10,
        paging: 1,
        sort: "",
        total: -1
      })
    })

  }

  render() {
    const { activeKey, queryType, gwbm } = this.state;
    const { gwfb = [], bgxx = [], tableLoading, pageParam, role, routes } = this.props;
    return (<div className='info-table'>
      <Spin spinning={false} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <Tabs
          onChange={this.handleTab}
          type="card"
          activeKey={activeKey}
        >
          <TabPane tab='全部项目' key='1'>
            <StaffTable routes={routes} role={role} queryType={queryType} gwbm={gwbm} fetchData={this.props.fetchData} bgxx={bgxx} tableLoading={tableLoading} pageParam={pageParam} />
          </TabPane>
          <TabPane tab='进行中项目' key='2'>
            <StaffTable routes={routes} role={role} queryType={queryType} gwbm={gwbm} fetchData={this.props.fetchData} bgxx={bgxx} tableLoading={tableLoading} pageParam={pageParam} />
          </TabPane>
          <TabPane tab='未开始项目' key='3'>
            <StaffTable routes={routes} role={role} queryType={queryType} gwbm={gwbm} fetchData={this.props.fetchData} bgxx={bgxx} tableLoading={tableLoading} pageParam={pageParam} />
          </TabPane>
          <TabPane tab='完结项目' key='4'>
            <StaffTable routes={routes} role={role} queryType={queryType} gwbm={gwbm} fetchData={this.props.fetchData} bgxx={bgxx} tableLoading={tableLoading} pageParam={pageParam} />
          </TabPane>

        </Tabs>
      </Spin>

    </div>);
  }
}

export default InfoTable;