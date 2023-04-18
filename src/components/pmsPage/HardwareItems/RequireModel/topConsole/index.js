import React, {useEffect, useState} from 'react';
import {Select, Button, Input, TreeSelect, Row, Col} from 'antd';

const InputGroup = Input.Group;
const {Option} = Select;

export default function TopConsole(props) {

  const [demand, setDemand] = useState(""); //询比项目名称
  const [drafter, setDrafter] = useState(""); //发起人
  //查询的值
  const {handleSearch, callBackParams, params,FRQData} = props;

  useEffect(() => {
    return () => {
    };
  }, []);


  //重置按钮
  const handleReset = v => {
    setDemand('')
    setDrafter('')
    callBackParams({...params, demand:'',drafter:'', current: 1})
  };

  // onChange-start
  //询比项目名称
  const handleNameChange = v => {
    console.log('询比项目名称询比项目名称询比项目名称', v.target.value);
    setDemand(v.target.value)
    callBackParams({...params, demand: String(v.target.value), current: 1})
  };

  //发起人
  const handleFQRNameChange = v => {
    console.log('发起人发起人发起人', v);
    setDrafter(v)
    callBackParams({...params, drafter: Number(v), current: 1})
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item" style={{width: '35%'}}>
          <div className="item-label">询比项目名称</div>
          <Input placeholder="请输入" value={demand} onChange={handleNameChange}/>
        </div>
        <div className="console-item" style={{width: '30%'}}>
          <div className="item-label">发起人</div>
          <Select
          style={{borderRadius: '8px !important',width:"50%",marginLeft:'8px'}}
          placeholder="发起人"
          showSearch
          allowClear
          onChange={handleFQRNameChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          {
            FRQData?.map((item = {}, ind) => {
              return <Option key={item.FQR} value={item.FQR}>
                {item.NAME}
              </Option>
            })
          }
        </Select>
        </div>
        <div className="btn-item" style={{width: '35%'}}>
          <Button
            className="btn-search"
            type="primary"
            onClick={() => handleSearch({...params})}
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
