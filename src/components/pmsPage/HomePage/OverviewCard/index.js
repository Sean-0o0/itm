import React, { useEffect, useState } from 'react';
import { getAmountFormat } from '..';
import { EncryptBase64 } from '../../../Common/Encrypt';
export default function OverviewCard(props) {
  const { width = '70%', overviewInfo, userRole = '' } = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
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
    fn = () => {},
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
            {more && <i className="iconfont icon-right" onClick={fn} />}
          </div>
        </div>
        <div className="item-middle">
          {amount}
          {percent !== '--' && (
            <>
              <span>/</span>
              <span>{percent}%</span>
            </>
          )}
        </div>
        {addNum !== '--' ? (
          <div className="item-bottom">
            今日新增<span>{addNum}</span>
            {unit}
          </div>
        ) : (
          <div className="item-bottom"></div>
        )}
      </div>
    );
  };
  return (
    <div className="overview-card-box" style={{ width }}>
      项目概览
      {userRole === '普通人员' ? (
        <div className="overview-row">
          {getOverviewItem({
            title: '我的待办',
            img: 'wddb',
            amount: getAmountFormat(overviewInfo?.db),
            addNum: overviewInfo?.dbjrxz,
            unit: '项',
            more: false,
          })}
          {getOverviewItem({
            title: '现有风险',
            img: 'xyfx',
            amount: getAmountFormat(overviewInfo?.xyfx),
            addNum: overviewInfo?.fxjrxz,
            unit: '项',
            more: false,
          })}
          {getOverviewItem({
            title: '发起项目',
            img: 'fqxm',
            amount: getAmountFormat(overviewInfo?.fqxm),
            fn: () => {
              window.location.href = `/#/pms/manage/ProjectInfo/${EncryptBase64(
                JSON.stringify({
                  prjManager: Number(LOGIN_USER_INFO.id),
                }),
              )}`;
            },
          })}
          {getOverviewItem({
            title: '参与项目',
            img: 'cyxm',
            amount: getAmountFormat(overviewInfo?.cyxm),
            fn: () => {
              window.location.href = `/#/pms/manage/ProjectInfo/${EncryptBase64(
                JSON.stringify({
                  prjManager: -1,
                }),
              )}`;
            },
          })}
        </div>
      ) : userRole !== '' ? (
        <div className="overview-row">
          {getOverviewItem({
            title: '部门项目数量',
            img: 'bmxmsl',
            amount: getAmountFormat(overviewInfo?.xmzs),
            addNum: overviewInfo?.xmjrxz,
            unit: '项',
            width: '22%',
          })}
          {getOverviewItem({
            title: '部门队伍数量',
            img: 'bmdwsl',
            amount: getAmountFormat(overviewInfo?.ryzs),
            addNum: overviewInfo?.ryjrxz,
            unit: '人',
            width: '22%',
          })}
          {getOverviewItem({
            title: '预算执行金额(万元)/执行率',
            img: 'yszxje',
            amount: getAmountFormat(overviewInfo?.yszxje),
            percent: overviewInfo?.yszxl,
            addNum: overviewInfo?.ysjrxz,
            unit: '万元',
            width: '34%',
          })}
          {getOverviewItem({
            title: '供应商数量',
            img: 'gyssl',
            amount: getAmountFormat(overviewInfo?.gyssl),
            addNum: overviewInfo?.gysjrxz,
            unit: '家',
            width: '22%',
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
