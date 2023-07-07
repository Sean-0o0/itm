import React, { Component } from 'react'
import { Spin, Tabs } from 'antd'
import StaffTable from './StaffTable'

const { TabPane } = Tabs;

class InfoTable extends Component {
  state = {
    activeKey: '0',
    queryType: 'MX_ALL',
    gwbm: ''
  }

  handleTab = id => {
    let queryType = '';
    let gwbm = '';
    if (id === '0') {
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
        pageSize: 20,
        paging: 1,
        sort: "",
        total: -1
      })
    })

  }

  render() {
    const { activeKey, queryType, gwbm } = this.state;
    const { gwfb = [], bgxx = [], tableLoading, pageParam, role, routes } = this.props;
    return (<div className='info-table' style={{marginTop: role === '信息技术事业部领导' || role === '一级部门领导' ? '20px' : '0'}}>
      <Spin spinning={false} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <Tabs
          onChange={this.handleTab}
          type="card"
          destroyInactiveTabPane={true}
          activeKey={activeKey}
        >
          <TabPane tab='全部' key='0'>
            <StaffTable routes={routes} role={role} queryType={queryType} gwbm={gwbm} fetchData={this.props.fetchData}
                        bgxx={bgxx} tableLoading={tableLoading} pageParam={pageParam}/>
          </TabPane>
          {gwfb.map(item => {
            const { BMGW = '-', BMGWID = '-' } = item
            return (
              <TabPane tab={BMGW} key={BMGWID}>
                <StaffTable routes={routes} role={role} queryType={queryType} gwbm={gwbm} fetchData={this.props.fetchData} bgxx={bgxx} tableLoading={tableLoading} pageParam={pageParam} />
              </TabPane>
            )
          })}

        </Tabs>
      </Spin>

    </div>);
  }
}

export default InfoTable;
