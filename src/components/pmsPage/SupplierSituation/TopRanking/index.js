import React, { useEffect, useState, useRef } from 'react';
import { Button, Empty, Tooltip } from 'antd';
import moment from 'moment';

export default function TopRanking(props) {
  const { data = [] } = props;
  useEffect(() => {
    return () => {};
  }, []);

  //金额格式化
  const getAmountFormat = (value = 0) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="top-ranking-box">
      {data.map((x, i) => (
        <div className="ranking-item" key={x.GYSID}>
          <div className="top">
            <div className="ranking-num">{i + 1}</div>
            <Tooltip title={x.GYSMC} placement="topLeft">
              <span>{x.GYSMC}</span>
            </Tooltip>
          </div>
          <div className="bottom">
            <div className="bottom-item">
              <div className="label">项目金额(万元)</div>
              {getAmountFormat(x.CGJE)}
            </div>
            <div className="bottom-item">
              <div className="label">项目数量</div>
              {x.CGSL}
            </div>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div style={{ width: '100%', margin: '0 auto' }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  );
}
