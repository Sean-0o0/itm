import React, { Component } from 'react'
import { Spin, Tabs } from 'antd'
import StaffTable from './StaffTable'

const { TabPane } = Tabs;

class InfoTable extends Component {
  state = {
    loading: false
  }
  render() {
    const { loading } = this.state;
    const allTabs = [{
      xmid: '1',
      xmmc: '大数据应用开发部',
    },{
      xmid: '2',
      xmmc: '移动金融开发部',
    },{
      xmid: '3',
      xmmc: '项目管理部',
    },{
      xmid: '4',
      xmmc: '内控开发部',
    }]
    return (<div className='info-table'>
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <Tabs
          onChange={this.callback}
          type="card"
          activeKey='1'
        >
          {allTabs.map(items => {
            // console.log("1111",item)
            return (
              <TabPane tab={items.xmmc} key={items.xmid}>
                <StaffTable/>
              </TabPane>
            )
          })}

        </Tabs>
      </Spin>

    </div>);
  }
}

export default InfoTable;