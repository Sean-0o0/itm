import React, { useEffect, useState } from 'react';
import { getAmountFormat } from '..';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_female.png';
import {message, Popover, Tooltip} from 'antd';

export default function OverviewCard(props) {
  const [hovered, setHovered] = useState(false);
  const {width = '70%', overviewInfo = [], userRole = '', toDoData = [], toDoDataNum = 0} = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const location = useLocation();

  //获取招呼语
  const getGreeting = () => {
    let h = new Date().getHours();
    let txt = '';
    if (h < 6) txt = '凌晨';
    else if (h < 9) txt = '早上';
    else if (h < 12) txt = '上午';
    else if (h < 14) txt = '中午';
    else if (h < 17) txt = '下午';
    else if (h < 19) txt = '傍晚';
    else if (h < 22) txt = '晚上';
    else txt = '夜里';
    let greeting = txt + '好！' + LOGIN_USER_INFO.name;
    return greeting;
  };

  //待办块
  const getToDoItem = (data) => {
    return (
      <div>
        {data?.map(x => (
          <div className="todo-card-box">
            <div className="todo-card-title">
              <div className="todo-card-xmmc">
                {x.xmmc}
              </div>
              <div className="todo-deal-box">
                <div className="todo-to-deal">
                  去处理 <i className="iconfont icon-right todo-to-deal-icon"/>
                </div>
              </div>

            </div>
            <div className="todo-card-content">
              {Number(x.wdsl) < 0 && <div className="todo-card-status">逾期{Number(x.wdsl) * -1}天</div>}
              <div className="todo-card-txnr">{x.txnr}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  //概览块
  const getOverviewItem = ({
                             title = '--',
                             more = true,
                             width = '24%',
                             img = '',
                             amount = '--',
                             percent = '--',
                             addNum = '--',
                             unit = '',
                             fn = false,
                             linkTo = false,
                           }) => {
    return (
      <div className="overview-item" style={{width}}>
        <div className="item-top">
          <img
            className="top-img"
            src={require(`../../../../assets/homePage/icon_${img}@2x.png`)}
          />
          {!fn && !linkTo && (
            <div className="top-txt top-txt-link">
              {title}
              {more && <Popover
                title={null}
                placement="rightTop"
                visible={hovered}
                onVisibleChange={() => {
                  setHovered(true)
                }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                autoAdjustOverflow={true}
                content={getToDoItem(toDoData)}
                overlayClassName="todo-card-content-popover"
              ><i className="iconfont icon-right"/>
              </Popover>}
            </div>
          )}
          {fn && (
            <div className="top-txt top-txt-link" onClick={fn}>
              {title}
              {more && <i className="iconfont icon-right" />}
            </div>
          )}
          {linkTo && (
            <div className="top-txt top-txt-link">
              <Link to={linkTo} style={{ color: '#606266FF' }}>
                {title}
                {more && <i className="iconfont icon-right" />}
              </Link>
            </div>
          )}
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
        {!['--', 0, '0'].includes(addNum) ? (
          <div className="item-bottom">
            今日新增<span>{addNum}</span>
            {unit}
          </div>
        ) : (
          '' // <div className="item-bottom"></div>
        )}
      </div>
    );
  };

  return (
    <div className="overview-card-box">
      <div className="avatar-card-box">
        <div className="avatar">
          <img src={overviewInfo?.xb === '女' ? avatarFemale : avatarMale} alt="" />
        </div>
        <div className="title">
          <span>{getGreeting()}</span>
          <div className="desc">
            {overviewInfo?.sm}
            {overviewInfo?.sm && '，'}这是你在****的第
            {moment().diff(moment(overviewInfo?.rzsj), 'days')}天
          </div>
        </div>
      </div>
      <div className="divider"></div>
      {userRole === '普通人员' ? (
        <div className="overview-row">
          {getOverviewItem({
            title: '我的待办',
            img: 'wddb',
            amount: getAmountFormat(toDoDataNum),
            addNum: overviewInfo?.dbjrxz,
            unit: '项',
            // more: false,
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
              if (Number(overviewInfo?.fqxm) === 0) {
                message.info('暂无发起项目', 1);
              } else {
                window.location.href = `/#/pms/manage/ProjectInfo/${EncryptBase64(
                  JSON.stringify({
                    prjManager: Number(LOGIN_USER_INFO.id),
                    cxlx: 'PERSON',
                  }),
                )}`;
              }
            },
          })}
          {getOverviewItem({
            title: '参与项目',
            img: 'cyxm',
            amount: getAmountFormat(overviewInfo?.cyxm),
            fn: () => {
              if (Number(overviewInfo?.cyxm) === 0) {
                message.info('暂无参与项目', 1);
              } else {
                window.location.href = `/#/pms/manage/ProjectInfo/${EncryptBase64(
                  JSON.stringify({
                    prjManager: Number(LOGIN_USER_INFO.id),
                    cxlx: 'PARTICIPATE',
                  }),
                )}`;
              }
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
            linkTo: {
              pathname: `/pms/manage/projectBuilding`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
          {getOverviewItem({
            title: '部门队伍数量',
            img: 'bmdwsl',
            amount: getAmountFormat(overviewInfo?.ryzs),
            addNum: overviewInfo?.ryjrxz,
            unit: '人',
            width: '22%',
            linkTo: {
              pathname: `/pms/manage/departmentOverview`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
          {getOverviewItem({
            title: '预算执行金额(万元)/执行率',
            img: 'yszxje',
            amount: getAmountFormat(overviewInfo?.yszxje),
            percent: overviewInfo?.yszxl,
            addNum: overviewInfo?.ysjrxz,
            unit: '万元',
            width: '34%',
            linkTo: {
              pathname: `/pms/manage/BudgetExcute`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
          {getOverviewItem({
            title: '供应商数量',
            img: 'gyssl',
            amount: getAmountFormat(overviewInfo?.gyssl),
            addNum: overviewInfo?.gysjrxz,
            unit: '家',
            width: '22%',
            linkTo: {
              pathname: `/pms/manage/SupplierSituation`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
