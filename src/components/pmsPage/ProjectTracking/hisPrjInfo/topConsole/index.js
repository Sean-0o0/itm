import React, {useEffect, useState} from 'react';
import {Button, DatePicker} from 'antd';
import moment from 'moment';

const {RangePicker} = DatePicker;
export default function TopConsole(props) {

  const [startTime, setStartTime] = useState(""); //开始时间
  const [endTime, setEndTime] = useState(""); //结束时间
  //查询的值
  const {handleSearch, callBackParams, params} = props;

  const {} = props;

  useEffect(() => {
    return () => {
    };
  }, []);

  //重置按钮
  const handleReset = v => {
    callBackParams({...params, startTime: '', endTime: '', current: 1})
  };

  // onChange-start
  const handleDateChange = (date, dateString) => {
    console.log(date, dateString);
    setStartTime(moment(dateString[0]).format("YYYYMMDD"));
    setEndTime(moment(dateString[1]).format("YYYYMMDD"));
    callBackParams({
      ...params,
      current: 1,
      pageSize: 5,
      startTime: Number(moment(dateString[0]).format("YYYYMMDD")),
      endTime: Number(moment(dateString[1]).format("YYYYMMDD"))
    })
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">日期选择：</div>
          <RangePicker style={{width: 250}} onChange={handleDateChange} format="YYYY-MM-DD" separator="至"/>
        </div>
        {/*<div className="btn-item" style={{width: '50%'}}>*/}
        {/*  <Button*/}
        {/*    className="btn-search"*/}
        {/*    type="primary"*/}
        {/*    onClick={() => handleSearch({...params})}*/}
        {/*  >*/}
        {/*    查询*/}
        {/*  </Button>*/}
        {/*  <Button className="btn-reset" onClick={handleReset}>*/}
        {/*    重置*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
