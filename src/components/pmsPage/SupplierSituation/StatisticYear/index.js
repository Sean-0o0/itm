import React, { useEffect, useState, useRef } from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { QueryBudgetOverviewInfo, QueryUserRole } from '../../../../services/pmsServices';

export default connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
}))(function StatisticYear(props) {
  const {
    role = '', //用户角色
    defaultYear = undefined, //默认年份
    userBasicInfo = {}, //登陆用户数据
    refresh = () => {}, //刷新数据的回调
    setIsSpinning = () => {}, //加载状态
    statisticYearData = {
      currentYear: undefined,
      dropdown: [],
    }, //统计年份下拉数据
    setStatisticYearData = () => {}, //统计年份下拉数据
  } = props;

  useEffect(() => {
    if (defaultYear !== undefined) {
      if (role !== '') {
        getStatisticYears(role, defaultYear);
      } else {
        getUserRole(defaultYear);
      }
      setStatisticYearData({
        dropdown: statisticYearData.dropdown,
        currentYear: defaultYear,
      });
    }
    console.log('🚀 ~ StatisticYear ~ defaultYear:', defaultYear);
    return () => {};
  }, [role, defaultYear]);

  //获取用户角色
  const getUserRole = year => {
    setIsSpinning(true);
    QueryUserRole({
      userId: String(userBasicInfo.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '' } = res;
          getStatisticYears(role, year);
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryUserRole', e);
        setIsSpinning(false);
      });
  };

  //获取统计年份
  const getStatisticYears = (role, year) => {
    setIsSpinning(true);
    QueryBudgetOverviewInfo({
      org: Number(userBasicInfo.orgid),
      queryType: 'SY',
      role,
      year,
    })
      .then(res => {
        if (res.success) {
          setStatisticYearData({
            currentYear: year,
            dropdown: JSON.parse(res.ysqs),
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        message.error('统计年份信息查询失败', 1);
        console.error('统计年份', e);
        setIsSpinning(false);
      });
  };

  //统计年份变化 - 调接口刷新数据
  const handleCurYearChange = year => {
    setIsSpinning(true);
    setStatisticYearData({
      dropdown: statisticYearData.dropdown,
      currentYear: year,
    });
    refresh(year);
  };
  return (
    <div className="statistic-year-box">
      统计年份：
      <Dropdown
        overlay={
          <Menu>
            {statisticYearData.dropdown?.map(x => (
              <Menu.Item
                key={x.NF}
                onClick={() => {
                  if (Number(x.NF) !== statisticYearData.currentYear) {
                    handleCurYearChange(Number(x.NF));
                  }
                }}
              >
                {x.NF}
              </Menu.Item>
            ))}
          </Menu>
        }
        trigger={['click']}
      >
        <span>
          {statisticYearData.currentYear}
          <i className="iconfont icon-fill-down" />
        </span>
      </Dropdown>
    </div>
  );
});
