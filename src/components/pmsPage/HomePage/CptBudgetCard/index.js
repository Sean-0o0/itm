import React, { useEffect, useState } from 'react';
import { getAmountFormat } from '..';
import { Progress, Tooltip } from 'antd';

export default function CptBudgetCard(props) {
  const { isVertical = false, userRole, budgetData, time } = props;

  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  useEffect(() => {
    return () => {};
  }, []);

  const getBudgetItem = ({
    title = '--',
    amount = '--',
    rate = 0,
    target = '--',
    remain = '--',
    img = 'software',
  }) => {
    return (
      <div
        className="budget-item"
        style={
          isVertical
            ? { width: '100%', marginBottom: '16px' }
            : { width: 'calc(50% - 8px)', marginRight: '16px' }
        }
      >
        <div className="item-top">
          <i className={`iconfont ${img}`} />
          {title}
        </div>
        <div className="item-middle">
          <span>{getAmountFormat(amount)}</span>
          <span>{rate}%</span>
        </div>
        <Progress
          showInfo={false}
          percent={Number(rate)}
          strokeColor={{
            from: '#F0F2F5',
            to: '#3361FF',
          }}
          strokeWidth={10}
        />
        <div className="item-bottom">
          <Tooltip title={getAmountFormat(target) + '万元'}>
            <span>目标值：{getAmountFormat(target)}</span>
          </Tooltip>
          <Tooltip title={getAmountFormat(remain) + '万元'}>
            <span>剩余值：{getAmountFormat(remain)}</span>
          </Tooltip>
        </div>
      </div>
    );
  };
  return (
    <div className="cptbudget-card-box">
      <div className="home-card-title-box" style={{ marginBottom: 9 }}>
        <div>资本性预算执行情况</div>
        {userRole !== '普通人员' && (
          <span>
            全部
            <i className="iconfont icon-right" />
          </span>
        )}
      </div>
      <div style={{ color: '#b7b3b3', fontSize: '12px', marginBottom: '16px' }}>
        {time + ' 更新'}
      </div>
      <div
        className="budget-box"
        style={
          isVertical ? { flexDirection: 'column', marginBottom: '-16px' } : { marginRight: '-16px' }
        }
      >
        {getBudgetItem({
          title: '已执行软件预算(万元)',
          amount: Number(budgetData?.ZBRJWCZ).toFixed(2),
          rate: budgetData?.ZBRJWCL,
          target: Number(budgetData?.ZBRJMBZ).toFixed(2),
          remain: Number(budgetData?.ZBRJSYZ).toFixed(2),
        })}
        {getBudgetItem({
          title: '已执行硬件预算(万元)',
          amount: Number(budgetData?.ZBYJWCZ).toFixed(2),
          rate: budgetData?.ZBYJWCL,
          target: Number(budgetData?.ZBYJMBZ).toFixed(2),
          remain: Number(budgetData?.ZBYJSYZ).toFixed(2),
          img: 'hardware',
        })}
      </div>
    </div>
  );
}
