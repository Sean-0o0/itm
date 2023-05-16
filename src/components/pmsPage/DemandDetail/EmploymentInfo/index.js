import React, { useEffect, useState, useRef } from 'react';
import { Popover } from 'antd';
import moment from 'moment';

export default function EmploymentInfo(props) {
  const { dtlData = {} } = props;
  const { LYSQ = {} } = dtlData;
  const [remarkFold, setRemarkFold] = useState(true); //录用备注文本是否折叠
  useEffect(() => {
    const node = document.getElementsByClassName('remarks');
    if (node.length > 0) {
      setRemarkFold(node[0].clientHeight <= 44 && node[0].scrollHeight <= 44);
    }
    return () => {};
  }, [JSON.stringify(LYSQ)]);
  return (
    <div className="empolyment-info-box info-box">
      <div className="title">录用申请信息</div>
      <div className="remarks">
        <div className="label">录用备注：</div>
        <div
          className="detail"
          style={
            remarkFold
              ? {
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: '2',
                }
              : {}
          }
        >
          {remarkFold && (
            <Popover
              title={null}
              content={<div className="content">{LYSQ.LYBZ}</div>}
              placement="bottomRight"
              overlayClassName="empolyment-remark-popover"
            >
              <div className="float">详情</div>
            </Popover>
          )}
          {LYSQ.LYBZ}
        </div>
      </div>
      <div className="grade-script">
        面试打分底稿：
        <span>{LYSQ.MSWJ}</span>
      </div>
    </div>
  );
}
