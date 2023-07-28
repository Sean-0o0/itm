import React, { Fragment, useEffect, useState } from 'react';
import { getAmountFormat } from '..';
import { Progress, Tooltip } from 'antd';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export default function CptBudgetCard(props) {
  const {
    isVertical = false,
    userRole,
    budgetData = {},
    time,
    marginBottom = '',
    border = '',
    boxShadow = '',
  } = props;
  const location = useLocation();
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  // const getBudgetItem = ({
  //   title = '--',
  //   amount = '--',
  //   rate = 0,
  //   target = '--',
  //   remain = '--',
  //   img = 'software',
  //   remainLabel = '未立项',
  // }) => {
  //   return (
  //     <div
  //       className="budget-item"
  //       style={
  //         isVertical
  //           ? { width: '100%', marginBottom: '16px' }
  //           : { width: 'calc(50% - 8px)', marginRight: '16px' }
  //       }
  //     >
  //       <div className="item-top">
  //         <i className={`iconfont ${img}`} />
  //         {title}
  //       </div>
  //       <div className="item-middle">
  //         <span>{getAmountFormat(amount)}</span>
  //         <span>{rate}%</span>
  //       </div>
  //       <Progress
  //         showInfo={false}
  //         percent={Number(rate)}
  //         strokeColor={{
  //           from: '#9EC4FE',
  //           to: '#3361FF',
  //         }}
  //         strokeWidth={10}
  //         className="normal-process"
  //       />
  //       <div className="item-bottom">
  //         <Tooltip title={getAmountFormat(target)}>
  //           <span style={{ cursor: 'default' }}>总数：{getAmountFormat(target)}</span>
  //         </Tooltip>
  //         <Tooltip title={getAmountFormat(remain)}>
  //           <span style={{ cursor: 'default' }}>
  //             {remainLabel}：{getAmountFormat(remain)}
  //           </span>
  //         </Tooltip>
  //       </div>
  //     </div>
  //   );
  // };

  const getNewBgItem = (title = '--', update = '--', top = {}, bottom = {}) => {
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
          {userRole !== '普通人员' && (
            <span>
              <Link
                to={{
                  pathname: `/pms/manage/BudgetExcute`,
                  state: {
                    routes: [{ name: '个人工作台', pathname: location.pathname }],
                  },
                }}
              >
                全部
                <i className="iconfont icon-right" />
              </Link>
            </span>
          )}
        </div>
        {getProgress('执行率', '已执行预算', '可执行预算', top)}
        {getProgress('立项率', '已立项预算', '总预算', bottom)}
      </div>
    );
  };

  // //数据处理
  // let zyswcz = Number.parseFloat(budgetData.ZBRJZYS) - Number.parseFloat(budgetData.ZBRJSYZ);
  // let zyswcl = (Number.parseFloat(zyswcz) * 100) / Number.parseFloat(budgetData.ZBRJZYS);
  // zyswcz = !isNaN(zyswcz) ? zyswcz.toFixed(2) : 0;
  // zyswcl = !isNaN(zyswcl) ? zyswcl.toFixed(2) : 0;

  // let kzxsyz = Number.parseFloat(budgetData.ZBRJKZX) - Number.parseFloat(budgetData.ZBRJWCZ);
  // let kzxwcl =
  //   (Number.parseFloat(budgetData.ZBRJWCZ) * 100) / Number.parseFloat(budgetData.ZBRJKZX);
  // kzxsyz = !isNaN(kzxsyz) ? kzxsyz.toFixed(2) : 0;
  // kzxwcl = !isNaN(kzxwcl) ? kzxwcl.toFixed(2) : 0;

  return (
    <div className="bgt-box-wrapper" style={isVertical ? { flexDirection: 'column' } : {}}>
      {getNewBgItem(
        '资本性预算',
        time,
        { rate: budgetData.ZBRJWCL, executed: budgetData.ZBRJWCZ, executable: budgetData.ZBRJMBZ },
        { rate: budgetData.ZBYSLXL, executed: budgetData.ZBYSLXZ, executable: budgetData.ZBYSZYS },
      )}
      {getNewBgItem(
        '非资本性预算',
        time,
        { rate: budgetData.FZBWCL, executed: budgetData.FZBWCZ, executable: budgetData.FZBMBZ },
        { rate: budgetData.FZBLXL, executed: budgetData.FZBLXZ, executable: budgetData.FZBZYS },
      )}
    </div>
  );

  return (
    <div className="cptbudget-card-box" style={{ marginBottom, border, boxShadow }}>
      <div className="home-card-title-box" style={{ marginBottom: 9 }}>
        <div>资本性预算执行情况</div>
        {userRole !== '普通人员' && (
          <span>
            <Link
              to={{
                pathname: `/pms/manage/BudgetExcute`,
                state: {
                  routes: [{ name: '个人工作台', pathname: location.pathname }],
                },
              }}
            >
              全部
              <i className="iconfont icon-right" />
            </Link>
          </span>
        )}
      </div>
      <div style={{ textAlign: 'left', color: '#b7b3b3', fontSize: '12px', marginBottom: '16px' }}>
        {time + ' 更新'}
      </div>
      <div
        className="budget-box"
        style={
          isVertical ? { flexDirection: 'column', marginBottom: '-16px' } : { marginRight: '-16px' }
        }
      >
        {userRole !== '普通人员' &&
          getBudgetItem({
            title: '总预算(万元)',
            amount: zyswcz,
            rate: zyswcl,
            target: Number(budgetData.ZBRJZYS).toFixed(2),
            remain: Number(budgetData.ZBRJSYZ).toFixed(2),
          })}
        {getBudgetItem({
          title: '可执行总预算(万元)',
          amount: Number(budgetData.ZBRJWCZ).toFixed(2),
          rate: kzxwcl,
          remainLabel: '未付款',
          target: Number(budgetData.ZBRJKZX).toFixed(2),
          remain: kzxsyz,
          img: 'hardware',
        })}
      </div>
    </div>
  );
}
