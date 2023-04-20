import React, { Component } from 'react'
import { Spin, Tabs } from 'antd'


const { TabPane } = Tabs;

class InfoTable extends Component {
  state = {
    loading: false
  }
  render() {
    const { loading } = this.state;
    const allTabs = [{

    }]
    return (<div>
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <Tabs
          tabBarStyle={{
            backgroundColor: 'white',
            margin: '0',
            padding: '3.571rem 0 0 3.571rem',
          }}
          onChange={this.callback}
          type="card"
          activeKey={1}
        >
          {allTabs.map(items => {
            // console.log("1111",item)
            return (
              <TabPane tab={items.xmmc} key={items.xmid}>1111</TabPane>
            )
          })}

        </Tabs>
      </Spin>

    </div>);
  }
}

export default InfoTable;