import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import moment from 'moment';

export default function PrjItems(props) {
  const { dtlData = {} } = props;
  const { XQXQ = [] } = dtlData;
  useEffect(() => {
    return () => {};
  }, []);
  const getItemBtn = ({ SXMC = '--', ZXZT = '2' }) => {
    let txt = '执行';
    if (['账号新增', '综合评测打分', '发送确认邮件'].includes(SXMC) || ZXZT === '2') {
      txt = '执行';
    } else if (SXMC === '需求发起') {
      txt = '重新发起';
    } else {
      txt = '查看';
    }
    return <div className="opr-btn">{txt}</div>;
  };
  return (
    <div className="prj-items-box">
      <div className="top">
        <div className="left">项目事项</div>
        <div className="right">
          <i className="iconfont fill-info" />
          1-3月的费用已计算完成
          <div className="ort-btn">发起付款</div>
        </div>
      </div>
      <div className="bottom">
        {XQXQ.map(item => (
          <div className="item" key={item.SXLX}>
            <div className="item-top">{item.SXLX}</div>
            <div className="item-bottom">
              {item.SXDATA.map((x, i) => (
                <div
                  className="bottom-row"
                  style={x.ZXZT === '2' ? {} : { color: '#3361ff' }}
                  key={i}
                >
                  {x.ZXZT === '2' ? (
                    <i className="iconfont circle-reduce" />
                  ) : (
                    <i className="iconfont circle-check" />
                  )}
                  <Tooltip title={x.SXMC} placement="topLeft">
                    <span>{x.SXMC}</span>
                  </Tooltip>
                  {getItemBtn(x)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
