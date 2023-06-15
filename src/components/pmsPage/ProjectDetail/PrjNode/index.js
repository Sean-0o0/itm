import { Empty, Popover, Timeline, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

export default function PrjNode(props) {
  const { prjData } = props;
  const { nodeData = [] } = prjData;

  const getPrjNodeItem = (nodeName = '--', date = '--', ago = '') => (
    <div className="prj-node-item">
      <div className="node-arrow"></div>
      <div className="node-content">
        <div className="title">
          <Tooltip title={nodeName} placement="topLeft">
            <div>{nodeName}</div>
          </Tooltip>
          {ago !== '' && <span>距今{ago}天</span>}
        </div>
        <div className="date">{date}</div>
      </div>
    </div>
  );

  //时间差
  const getDiffDays = (date, i, ago = false) => {
    if (ago) {
      if (i === 0 && date !== undefined) {
        return moment(String(date)).diff(moment(), 'days');
      }
    } else if (
      i < nodeData.length - 1 &&
      date !== undefined &&
      nodeData[i + 1]?.WCSJ !== undefined
    ) {
      return moment(String(date)).diff(moment(String(nodeData[i + 1]?.WCSJ)), 'days');
    }
    return '';
  };

  return (
    <div className="prj-node-box">
      <div className="top-title">项目节点</div>
      <div className="bottom-box">
        <Timeline>
          <Timeline.Item dot=" " style={{ height: 38 }}></Timeline.Item>
          {nodeData.map((x, i) => (
            <div key={x.SXMC}>
              <Timeline.Item
                dot={
                  <div className="dot-wrapper">
                    <div className="dot-circle"></div>
                  </div>
                }
                style={{
                  paddingBottom: 0,
                  height: i === nodeData.length - 1 ? 38 : 44,
                }}
              >
                {getPrjNodeItem(
                  x.SXMC,
                  x.WCSJ ? moment(String(x.WCSJ)).format('YYYY-MM-DD') : '--',
                  getDiffDays(x.WCSJ, i, true),
                )}
              </Timeline.Item>
              {i < nodeData.length - 1 && (
                <Timeline.Item
                  style={{ height: 44 }}
                  dot={<span className="interval-date">{getDiffDays(x.WCSJ, i)}天</span>}
                ></Timeline.Item>
              )}
            </div>
          ))}
        </Timeline>
        {nodeData.length === 0 && (
          <Empty
            description="暂无节点"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        )}
      </div>
    </div>
  );
}
