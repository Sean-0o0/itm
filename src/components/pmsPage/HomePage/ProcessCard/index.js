import React, { useEffect, useState } from 'react';

export default function ProcessCard(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  const getProcessItem = ({ type = '1', content = '--', date = '--', isDone = false }) => {
    let backgroundColor = '#FDC041CC';
    if (type === '2') {
      backgroundColor = '#05BEFECC';
    }
    if (type === '3') {
      backgroundColor = '#3361FFCC';
    }
    return (
      <div className="process-item">
        <div className="item-top">
          <div className="left-tag" style={{ backgroundColor }}>
            {type}
          </div>
          {content}
        </div>
        {isDone && (
          <div className="right-tag">
            <i className="iconfont fill-success" />
            已完成
          </div>
        )}
        发起日期：{date}
      </div>
    );
  };
  return (
    <div className="process-card-box">
      <div className="home-card-title-box">流程情况</div>
      <div className="process-box">
        {getProcessItem({
          type: 'OA',
          content: '项目信息管理系统立项申请',
          date: '2023-03-06',
          isDone: true,
        })}
        {getProcessItem({ type: '2' })}
        {getProcessItem({ type: '2' })}
        {getProcessItem({ type: '3' })}
      </div>
    </div>
  );
}
