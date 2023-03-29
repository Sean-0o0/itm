import { Popover, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

export default function InfoDisplay(props) {
  const { prjData, dictionary } = props;
  const {
    prjBasic = {},
    award = [],
    demand = [],
    topic = [],
    payment = [],
    otrSupplier = [],
    contrast = {},
    bidding = {},
    supplier = [],
  } = prjData;

  useEffect(() => {
    return () => {};
  }, []);

  //金额显示,
  const getAmountFormat = (value = 0) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //获取信息块
  const getInfoItem = (label, val, isLink = false) => {
    return (
      <div className="info-item" key={label}>
        <span>{label}</span>
        {isLink ? <a style={{ color: '#3361ff' }}>{val}</a> : val}
      </div>
    );
  };
  //付款计划
  const getPmtPlan = (arr = []) => {
    return (
      <div
        className="info-item"
        key="付款计划："
        style={{ width: '100%', display: 'flex', height: 'unset' }}
      >
        <div className="payment-label">付款计划：</div>
        <div className="payment-plan">
          {arr.map((x, i) => (
            <div key={x.ID}>
              第{toChinesNum(i + 1)}期付款{x.FKJE}万，占总金额{Number(x.BFB) * 100}%，{x.FKZT}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const otherSupplierPopover = data => (
    <div className="list">
      {data.map(x => (
        <div className="item" key={x.GYSID} onClick={() => {}}>
          {x.GYSMC}
        </div>
      ))}
    </div>
  );
  const tablePopover = (data, columns) => {
    return (
      <div className="table-box">
        <Table columns={columns} rowKey={'id'} dataSource={data} size="middle" pagination={false} />
      </div>
    );
  };
  return (
    <div className="col-left info-display-box">
      <div className="info-box" key="xmxx">
        <div className="top-title">项目信息</div>
        <div className="info-row">
          {getInfoItem('项目类型：', prjBasic.XMLX)}
          {getInfoItem('关联软件：', prjBasic.GLXT)}
          {getInfoItem('应用部门：', prjBasic.SSBM)}
        </div>
        <div className="info-row">
          {getInfoItem('文档库：', '查看详情', true)}
          <div className="info-item">
            <span>获奖信息：</span>
            <Popover
              placement="bottom"
              title={null}
              content={tablePopover(award, [
                {
                  title: '奖项名称',
                  dataIndex: 'JXMC',
                  width: 160,
                  key: 'JXMC',
                  ellipsis: true,
                },
                {
                  title: '荣誉等级',
                  dataIndex: 'RYDJ',
                  width: 110,
                  key: 'RYDJ',
                  ellipsis: true,
                },
                {
                  title: '知识产权类型',
                  dataIndex: 'ZSCQLX',
                  width: 120,
                  key: 'ZSCQLX',
                  ellipsis: true,
                },
                {
                  title: '获奖时间',
                  dataIndex: 'HJSJ',
                  key: 'HJSJ',
                  ellipsis: true,
                },
              ])}
              overlayClassName="project-topic-content-popover"
            >
              <a style={{ color: '#3361ff' }}>查看详情</a>
            </Popover>
          </div>
          <div className="info-item">
            <span>项目课题：</span>
            <Popover
              placement="bottomLeft"
              title={null}
              content={tablePopover(topic, [
                {
                  title: '课题名称',
                  dataIndex: 'XMKT',
                  width: 160,
                  key: 'XMKT',
                  ellipsis: true,
                },
                {
                  title: '进度',
                  dataIndex: 'JD',
                  width: 100,
                  key: 'JD',
                  ellipsis: true,
                },
                {
                  title: '简介',
                  dataIndex: 'JJ',
                  key: 'JJ',
                  ellipsis: true,
                },
                {
                  title: '当前进展',
                  dataIndex: 'DQJZ',
                  width: 100,
                  key: 'DQJZ',
                  ellipsis: true,
                },
              ])}
              overlayClassName="project-topic-content-popover"
            >
              <a style={{ color: '#3361ff' }}>查看详情</a>
            </Popover>
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span>变更类/计划外需求：</span>
            <Popover
              placement="bottom"
              title={null}
              content={tablePopover(demand, [
                {
                  title: '需求标题',
                  dataIndex: 'XQBT',
                  width: 144,
                  key: 'XQBT',
                  ellipsis: true,
                },
                {
                  title: '需求内容',
                  dataIndex: 'XQNR',
                  width: 188,
                  key: 'XQNR',
                  ellipsis: true,
                },
                {
                  title: '需求日期',
                  dataIndex: 'XQRQ',
                  width: 100,
                  key: 'XQRQ',
                  ellipsis: true,
                },
              ])}
              overlayClassName="unplanned-demand-content-popover"
            >
              <a style={{ color: '#3361ff' }}>查看详情</a>
            </Popover>
          </div>
        </div>
      </div>
      <div className="info-box" key="ysxx">
        <div className="top-title">预算信息</div>
        <div className="info-row">
          {getInfoItem('项目预算：', getAmountFormat(prjBasic.YSJE) + '元')}
          {getInfoItem('关联预算项目：', prjBasic.YSXMMC)}
          <div className="info-item" style={{ height: '44px' }}>
            <div className="item-top">
              <span>已执行预算</span>
              {getAmountFormat(prjBasic.SYYS)}元
            </div>
            <div className="item-bottom">
              <span>/执行率：</span>
              {(Number(prjBasic.SYYS) / Number(prjBasic.KZXYS)) * 100}%
            </div>
          </div>
        </div>
      </div>
      <div className="info-box" key="gysxx">
        <div className="top-title">供应商信息</div>
        <div className="info-row">
          {getInfoItem('供应商名称：', supplier[0]?.GYSMC)}
          {getInfoItem('供应商类型：', supplier[0]?.GYSLX)}
          <div
            className="info-item"
            key="供应商联系人："
            style={{ display: 'flex', height: 'unset' }}
          >
            <div className="payment-label" style={{ width: 98 }}>
              供应商联系人：
            </div>
            <div className="payment-plan">
              {supplier.map(x => (
                <div key={x.LXRXXID}>
                  {x.LXR}
                  {'  ' + x.SJ}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="info-box" key="zcxx">
        <div className="top-title">招采信息</div>
        <div className="info-row" key="zcxx-1">
          {getInfoItem('合同金额：', getAmountFormat(contrast.HTJE) + '元')}
          {getInfoItem('招采方式：', prjBasic.ZBFS)}
          {getInfoItem('签署日期：', moment(contrast.QSRQ).format('YYYY年MM月DD日'))}
        </div>
        <div className="info-row" key="zcxx-2">
          {getInfoItem('招标保证金：', getAmountFormat(bidding.TBBZJ) + '元')}
          {getInfoItem('履约保证金：', getAmountFormat(bidding.LYBZJ) + '元')}
          <div className="info-item" key="评标报告：">
            <span>评标报告：</span>
            <a style={{ color: '#3361ff' }} onClick={() => {}}>
              {bidding.PBBG}
            </a>
          </div>
        </div>
        <div className="info-row" key="zcxx-3">
          {getPmtPlan(payment)}
        </div>
        <div className="info-row" key="zcxx-4">
          <div className="info-item" key="zcxx-4-1">
            <span>其他投标供应商：</span>
            <Popover
              placement="rightTop"
              title={null}
              // autoAdjustOverflow={false}
              content={otherSupplierPopover(otrSupplier)}
              overlayClassName="other-supplier-content-popover"
            >
              <a style={{ color: '#3361ff' }}>查看详情</a>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * 数字转成汉字
 * @params num === 要转换的数字
 * @return 汉字
 * */
const toChinesNum = num => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ['', '十', '百', '千', '万'];
  num = parseInt(num);
  let getWan = temp => {
    let strArr = temp
      .toString()
      .split('')
      .reverse();
    let newNum = '';
    let newArr = [];
    strArr.forEach((item, index) => {
      newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index]);
    });
    let numArr = [];
    newArr.forEach((m, n) => {
      if (m !== '零') numArr.push(n);
    });
    if (newArr.length > 1) {
      newArr.forEach((m, n) => {
        if (newArr[newArr.length - 1] === '零') {
          if (n <= numArr[numArr.length - 1]) {
            newNum += m;
          }
        } else {
          newNum += m;
        }
      });
    } else {
      newNum = newArr[0];
    }

    return newNum;
  };
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan;
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num);
};
