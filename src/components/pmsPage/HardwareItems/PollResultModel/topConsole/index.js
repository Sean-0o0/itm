import React, {useEffect, useState} from 'react';
import {Select, Button, Input, TreeSelect, Row, Col} from 'antd';

const InputGroup = Input.Group;
const {Option} = Select;

export default function TopConsole(props) {

  //const { XMLX } = props.dictionary; //项目类型
  //查询的值
  const [itemName, setItemName] = useState(undefined); //项目名称

  const {} = props;

  useEffect(() => {
    return () => {
    };
  }, []);


  //查询按钮
  const handleSearch = {};

  //重置按钮
  const handleReset = v => {
    setItemName(''); //关联预算-生效的入参
  };

  // onChange-start
  //项目名称
  const handleItemNameChange = v => {
    // console.log('handleBtAmountChange', v.target.value);
    setItemName(v)
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item" style={{width: '50%'}}>
          <div className="item-label">询比项目名称</div>
          <Input placeholder="请输入" value={itemName} onChange={handleItemNameChange}/>
        </div>
        <div className="btn-item" style={{width: '50%'}}>
          <Button
            className="btn-search"
            type="primary"
            onClick={handleSearch}
          >
            查询
          </Button>
          <Button className="btn-reset" onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
