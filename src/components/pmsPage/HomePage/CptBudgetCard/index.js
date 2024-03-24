import React, { Fragment, useEffect, useState } from 'react';
import { getAmountFormat } from '..';
import { Progress, Tooltip } from 'antd';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';

export default function CptBudgetCard(props) {
  //AUTH 权限点控制
  const { isVertical = false, userRole, budgetData = {}, time, defaultYear, AUTH = [] } = props;
  const location = useLocation();

  const getNewBgItem = (title = '--', update = '--', top = {}, bottom = {}, auth = false) => {
    const getProgress = (
      rateLabel,
      executedLabel,
      executableLabel,
      { rate, executed, executable },
    ) => {
      return (
        <div className="progress-item">
          <div className="top-row">
            <div className="left-info">
              <div className="rate-label">{rateLabel}</div>
              <div className="rate">
                {Number(rate)}
                <span>%</span>
              </div>
            </div>
            <div className="right-info">
              <div className="executed-box">
                <div className="left-divider"></div>
                <div className="executed-label">{executedLabel}</div>
                <div className="executed">
                  {getAmountFormat(Number(executed))}
                  <span>万元</span>
                </div>
              </div>
              <div className="executable-box">
                <div className="left-divider"></div>
                <div className="executable-label">{executableLabel}</div>
                <div className="executable">
                  {getAmountFormat(Number(executable))}
                  <span>万元</span>
                </div>
              </div>
            </div>
          </div>
          <Progress
            showInfo={false}
            percent={Number(rate)}
            strokeColor={{
              from: '#BDD3FE',
              to: '#6985F7',
            }}
            strokeWidth={10}
            className="normal-process"
          />
        </div>
      );
    };
    return (
      <div
        className="new-bgt-item cptbudget-card-box"
        style={isVertical ? {} : { width: 'calc(50% - 8px)' }}
      >
        <div className="title-row">
          {title}
          <div className="update">{update}&nbsp;更新</div>
          {['普通人员', '二级部门领导'].includes(userRole) ? (
            auth ? (
              <span>
                <Link
                  to={{
                    pathname: `/pms/manage/BudgetStatistic/${EncryptBase64(
                      JSON.stringify({
                        tab: title === '资本性预算' ? 'ZB' : 'FZB',
                      }),
                    )}`,
                    state: {
                      routes: [{ name: '个人工作台', pathname: location.pathname }],
                    },
                  }}
                >
                  详情
                  <i className="iconfont icon-right" />
                </Link>
              </span>
            ) : (
              ''
            )
          ) : auth ? (
            <span>
              <Link
                to={{
                  pathname: `/pms/manage/BudgetExcute/${EncryptBase64(
                    JSON.stringify({
                      defaultYear,
                      routes: [{ name: '个人工作台', pathname: location.pathname }],
                    }),
                  )}`,
                  state: {
                    routes: [{ name: '个人工作台', pathname: location.pathname }],
                  },
                }}
              >
                全部
                <i className="iconfont icon-right" />
              </Link>
            </span>
          ) : (
            ''
          )}
        </div>
        {getProgress('执行率', '已执行预算', '可执行预算', top)}
        {getProgress('立项率', '已立项预算', '总预算', bottom)}
      </div>
    );
  };

  return (
    <div className="bgt-box-wrapper" style={isVertical ? { flexDirection: 'column' } : {}}>
      {getNewBgItem(
        '资本性预算',
        time,
        { rate: budgetData.ZBRJWCL, executed: budgetData.ZBRJWCZ, executable: budgetData.ZBRJMBZ },
        { rate: budgetData.ZBYSLXL, executed: budgetData.ZBYSLXZ, executable: budgetData.ZBYSZYS },
        AUTH.includes('capitalBudgetDetail'),
      )}
      {getNewBgItem(
        '非资本性预算',
        time,
        { rate: budgetData.FZBWCL, executed: budgetData.FZBWCZ, executable: budgetData.FZBMBZ },
        { rate: budgetData.FZBLXL, executed: budgetData.FZBLXZ, executable: budgetData.FZBZYS },
        AUTH.includes('nonCapitalBudgetDetail'),
      )}
    </div>
  );
}
