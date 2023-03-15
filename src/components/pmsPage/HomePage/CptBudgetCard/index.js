import { Progress } from 'antd';
import React, { useEffect, useState } from 'react';

export default function CptBudgetCard(props) {
  const { isVertical = false } = props;
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="cptbudget-card-box">
      <div className="home-card-title-box">
        资本性预算执行情况
        <span>
          全部
          <i className="iconfont icon-right" />
        </span>
      </div>
      <div
        className="budget-box"
        style={
          isVertical ? { flexDirection: 'column', marginBottom: '-16px' } : { marginRight: '-16px' }
        }
      >
        <div
          className="budget-item"
          style={
            isVertical
              ? { width: '100%', marginBottom: '16px' }
              : { width: 'calc(50% - 8px)', marginRight: '16px' }
          }
        >
          <div className="item-top">
            <i className="iconfont software" />
            已执行软件预算(万元)
          </div>
          <div className="item-middle">
            <span>12392</span>
            <span>31%</span>
          </div>
          <Progress
            showInfo={false}
            percent={60}
            strokeColor={{
              from: '#F0F2F5',
              to: '#3361FF',
            }}
            strokeWidth={10}
          />
          <div className="item-bottom">
            <span>目标值：21,028万元</span>
            <span>剩余值：15,212万元</span>
          </div>
        </div>
        <div
          className="budget-item"
          style={
            isVertical
              ? { width: '100%', marginBottom: '16px' }
              : { width: 'calc(50% - 8px)', marginRight: '16px' }
          }
        >
          <div className="item-top">
            <i className="iconfont hardware" />
            已执行硬件预算(万元)
          </div>
          <div className="item-middle">
            <span>12392</span>
            <span>31%</span>
          </div>
          <Progress
            showInfo={false}
            percent={60}
            strokeColor={{
              from: '#F0F2F5',
              to: '#3361FF',
            }}
            strokeWidth={10}
          />
          <div className="item-bottom">
            <span>目标值：21,028万元</span>
            <span>剩余值：15,212万元</span>
          </div>
        </div>
      </div>
    </div>
  );
}
