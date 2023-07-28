import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import {Radio, Tabs} from 'antd';
import StaffTable from "../../ProjectBuilding/InfoTable/StaffTable";

const {TabPane} = Tabs;

export default forwardRef(function TopConsole(props, ref) {
  const {
    tabsKeyCallback,
    activeKey,
    tabsData,
    handleRadioChange,
    isRouter,
  } = props;

  useEffect(() => {
    return () => {
    };
  }, []);

  //转为树结构-关联项目

  //顶部下拉框查询数据

  //查询按钮

  //重置按钮

  // onChange-start

  // onChange-end

  const handleTab = (key) => {
    console.log("kykeykey", key)
    tabsKeyCallback(key)
  }

  return (
    <div className="top-console">
      <Tabs
        onChange={handleTab}
        activeKey={activeKey}
        tabBarExtraContent={!isRouter && <div className='top-tabs-boxs'>
          <Radio.Group defaultValue="项目统计" buttonStyle="solid" onChange={(e) => handleRadioChange(e)}>
            <Radio.Button value="项目列表"><i className="iconfont icon-xmlb"/>项目列表</Radio.Button>
            <Radio.Button value="项目统计"><i className="iconfont icon-xmtj"/>项目统计</Radio.Button>
          </Radio.Group>
        </div>}
      >
        <TabPane tab='全部' key='YJBM_ALL'>
        </TabPane>
        {
          tabsData.length > 0 && tabsData.map(item => {
            return <TabPane tab={item.ORGNAME} key={item.ORGID}>
            </TabPane>
          })
        }
      </Tabs>
    </div>
  );
});
