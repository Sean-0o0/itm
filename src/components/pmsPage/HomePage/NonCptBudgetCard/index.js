import React, {useEffect, useState} from 'react';
import {getAmountFormat} from '..';
import {Progress, Tooltip} from 'antd';
import {useLocation} from 'react-router';
import {Link} from 'react-router-dom';

export default function NonCptBudgetCard(props) {
  const {isVertical = false, userRole, budgetData = {FZBWCZ, FZBWCL, FZBMBZ, FZBSYZ}, time} = props;
  const location = useLocation();
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  const getBudgetItem = ({
                           title = '--',
                           amount = '--',
                           rate = 0,
                           target = '--',
                           remain = '--',
                           img = 'software',
                           remainLabel = '未立项',
                         }) => {
    return (
      <div
        className="budget-item"
        style={
          isVertical
            ? {width: '100%', marginBottom: '16px'}
            : {width: 'calc(50% - 8px)', marginRight: '16px'}
        }
      >
        <div className="item-top">
          <i className={`iconfont ${img}`}/>
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
            from: '#9EC4FE',
            to: '#3361FF',
          }}
          strokeWidth={10}
          className="normal-process"
        />
        <div className="item-bottom">
          <Tooltip title={getAmountFormat(target)}>
            <span style={{cursor: 'default'}}>总数：{getAmountFormat(target)}</span>
          </Tooltip>
          <Tooltip title={getAmountFormat(remain)}>
            <span style={{cursor: 'default'}}>
              {remainLabel}：{getAmountFormat(remain)}
            </span>
          </Tooltip>
        </div>
      </div>
    );
  };

  const getAmountFormat = value => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // //数据处理
  // let zyswcz = Number.parseFloat(budgetData.ZBRJZYS) - Number.parseFloat(budgetData.ZBRJSYZ);
  // let zyswcl = (Number.parseFloat(zyswcz) * 100) / Number.parseFloat(budgetData.ZBRJZYS);
  // zyswcz = !isNaN(zyswcz) ? zyswcz.toFixed(2) : 0;
  // zyswcl = !isNaN(zyswcl) ? zyswcl.toFixed(2) : 0;
  //
  // let kzxsyz = Number.parseFloat(budgetData.ZBRJKZX) - Number.parseFloat(budgetData.ZBRJWCZ);
  // let kzxwcl =
  //   (Number.parseFloat(budgetData.ZBRJWCZ) * 100) / Number.parseFloat(budgetData.ZBRJKZX);
  // kzxsyz = !isNaN(kzxsyz) ? kzxsyz.toFixed(2) : 0;
  // kzxwcl = !isNaN(kzxwcl) ? kzxwcl.toFixed(2) : 0;
  return (
    <div className="cptbudget-card-box">
      <div className="home-card-title-box" style={{marginBottom: 9}}>
        <div>非资本性预算执行情况</div>
        {userRole !== '普通人员' && (
          <span>
            <Link
              to={{
                pathname: `/pms/manage/BudgetExcute`,
                state: {
                  routes: [{name: '个人工作台', pathname: location.pathname}],
                },
              }}
            >
              全部
              <i className="iconfont icon-right"/>
            </Link>
          </span>
        )}
      </div>
      <div style={{color: '#b7b3b3', fontSize: '12px', marginBottom: '16px'}}>
        {time + ' 更新'}
      </div>
      <div
        className="budget-box"
        style={
          isVertical ? {flexDirection: 'column', marginBottom: '-16px'} : {marginRight: '-16px'}
        }
      >
        {userRole !== '普通人员' &&
        getBudgetItem({
          title: '已执行预算(万元)',
          amount: getAmountFormat(budgetData.FZBWCZ),
          rate: budgetData.FZBWCL,
          target: getAmountFormat(budgetData.FZBMBZ),
          remain: budgetData.FZBSYZ,
          img: 'icon-money-dallar',
        })}
      </div>
    </div>
  );
}
