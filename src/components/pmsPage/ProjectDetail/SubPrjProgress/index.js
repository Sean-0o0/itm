import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Progress, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';

export default function SubPrjProgress(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { prjData = {}, routes = [] } = dataProps;
  const { subPrjData = [] } = prjData;
  const {} = funcProps;

  useEffect(() => {
    return () => {};
  }, []);

  //子项目块
  const getItem = ({
    DQJD = '0%',
    DQZT = '--',
    XMID,
    DQLCB = '--',
    DQLCBJD = '--',
    XMJL = '--',
    XMMC = '--',
  }) => {
    const fontColor =
      DQZT === '低风险'
        ? '#05BEFE'
        : DQZT === '中风险'
        ? '#f9a812'
        : DQZT === '高风险'
        ? '#FF2F31'
        : DQZT === '延期'
        ? '#FF2F31'
        : '#3361ff';
    const bgColor =
      DQZT === '低风险'
        ? '#05BEFE1A'
        : DQZT === '中风险'
        ? '#F9A8121A'
        : DQZT === '高风险'
        ? '#FF2F311A'
        : DQZT === '延期'
        ? '#FF2F311A'
        : '#3361FF1A';
    const getRiskIcon = zt => {
      return (
        <div className="icon-wrapper" style={{ backgroundColor: bgColor }}>
          {zt === '进度正常' ? (
            <i className="iconfont icon-hourglass" />
          ) : zt === '延期' ? (
            <i className="iconfont icon-delay" />
          ) : (
            <i className="iconfont icon-alarm" style={{ color: fontColor }} />
          )}
        </div>
      );
    };
    return (
      <div className="sub-prj-item" key={XMID}>
        <div className="progress-row">
          <Tooltip title={XMMC} placement="topLeft">
            <Link
              className="prj-name"
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: XMID,
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
            >
              {XMMC}
            </Link>
          </Tooltip>
          <div className="prj-progress">
            <Progress
              percent={Number(DQJD?.replace('%', '') ?? 0)}
              strokeColor={fontColor}
              format={p => (
                <span
                  style={{
                    color: fontColor,
                  }}
                >
                  {p}%
                </span>
              )}
              strokeWidth={12}
              // style={{ width: '90%' }}
            />
          </div>
          <div className="prj-status">
            {getRiskIcon(DQZT)}
            <span>{DQZT}</span>
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span>项目经理：</span>
            {XMJL}
          </div>
          <div className="info-item">
            <span>当前里程碑：</span>
            {DQLCB}
          </div>
          <div className="info-item">
            <span>里程碑进度：</span>
            {DQLCBJD}
          </div>
        </div>
      </div>
    );
  };

  if (subPrjData.length === 0) return null;
  return (
    <div className="sub-prj-progress-box">
      <div className="top-title">子项目进度</div>
      <div className="content">{subPrjData.map(x => getItem(x))}</div>
    </div>
  );
}
