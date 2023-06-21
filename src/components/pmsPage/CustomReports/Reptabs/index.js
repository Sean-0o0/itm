import React, {useEffect, useState, useRef} from 'react';
import {message, Tabs} from 'antd';

const {TabPane} = Tabs;

export default function Reptabs(props) {
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    return () => {
    };
  }, []);

  function callback(key) {
    console.log(key);
  }


  return (
    <div className="rep-tabs">
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="我的报表" key="1">
        </TabPane>
        <TabPane tab="共享报表" key="2">
        </TabPane>
      </Tabs>
    </div>
  );
}
