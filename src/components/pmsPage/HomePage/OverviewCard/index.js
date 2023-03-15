import React, { useEffect, useState } from 'react';

export default function OverviewCard(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  const getOverviewItem = ({
    title = '--',
    more = true,
    width = '24%',
    img = '',
    amount = '--',
    percent = '--',
    addNum = '--',
    unit = '',
  }) => {
    return (
      <div className="overview-item" style={{ width }}>
        <div className="item-top">
          <img
            className="top-img"
            src={require(`../../../../assets/homePage/icon_${img}@2x.png`)}
          />
          <div className="top-txt">
            {title}
            {more && <i className="iconfont icon-right" />}
          </div>
        </div>
        <div className="item-middle">
          <div className="middle-padding"></div>
          {amount}
          {percent !== '--' && (
            <>
              <span>/</span>
              <span>{percent}%</span>
            </>
          )}
        </div>
        {addNum !== '--' && (
          <div className="item-bottom">
            今日新增<span>{addNum}</span>
            {unit}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="overview-card-box">
      项目概览
      {/* <div className="overview-row">
        {getOverviewItem({
          title: '部门项目数量',
          img: 'bmxmsl',
          amount: '109',
          addNum: '3',
          unit: '项',
          width: '22%',
        })}
        {getOverviewItem({
          title: '部门队伍数量',
          img: 'bmdwsl',
          amount: '109',
          addNum: '3',
          unit: '人',
          width: '22%',
        })}
        {getOverviewItem({
          title: '预算执行金额(万元)/执行率',
          img: 'yszxje',
          amount: '14324',
          percent: '21',
          addNum: '3',
          unit: '万元',
          width: '34%',
        })}
        {getOverviewItem({
          title: '供应商数量',
          img: 'gyssl',
          amount: '109',
          addNum: '3',
          unit: '家',
          width: '22%',
        })}
      </div> */}
      <div className="overview-row">
        {getOverviewItem({
          title: '我的待办',
          img: 'wddb',
          amount: '109',
          addNum: '3',
          unit: '项',
        })}
        {getOverviewItem({
          title: '现有风险',
          img: 'xyfx',
          amount: '109',
          addNum: '3',
          unit: '项',
        })}
        {getOverviewItem({
          title: '发起项目',
          img: 'fqxm',
          amount: '14',
        })}
        {getOverviewItem({
          title: '参与项目',
          img: 'cyxm',
          amount: '23',
        })}
        {/* {getOverviewItem()}
        {getOverviewItem()}
        {getOverviewItem()} */}
      </div>
    </div>
  );
}
