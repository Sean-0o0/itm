import { Popover, Table } from 'antd';
import React, { useEffect, useState } from 'react';

export default function InfoDisplay(props) {
  const {} = props;

  useEffect(() => {
    return () => {};
  }, []);

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
    let str =
      '第一期 付款50万元，占总金额 50%，计划付款时间 2022.10.01，已付款；;第二期 付款30万元，占总金额 30%，计划付款时间 2023.01.01，未付款；;第三期 付款20万元，占总金额 20%，计划付款时间 2024.01.01，未付款。';
    arr = str.split(';');
    return (
      <div
        className="info-item"
        key="付款计划："
        style={{ width: '100%', display: 'flex', height: 'unset' }}
      >
        <div className="payment-label">付款计划：</div>
        <div className="payment-plan">
          {arr.map((x, i) => (
            <div key={i}>{x}</div>
          ))}
        </div>
      </div>
    );
  };
  const otherSupplierPopover = data => (
    <div className="list">
      {data.map((x, i) => (
        <div className="item" key={i} onClick={() => {}}>
          {x.name + (i + 1)}
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
          {getInfoItem('项目类型：', '外采项目')}
          {getInfoItem('关联软件：', '测试项目1')}
          {getInfoItem('应用部门：', '测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1')}
        </div>
        <div className="info-row">
          {getInfoItem('文档库：', '查看详情', true)}
          {getInfoItem('获奖信息：', '查看详情', true)}
          <div className="info-item">
            <span>项目课题：</span>
            <Popover
              placement="bottomLeft"
              title={null}
              content={tablePopover(
                [
                  {
                    id: 1,
                    ktmc: 'kkkkk',
                    jd: 'jdjdjdj',
                    jj: 'jjjjjjj',
                    dqjz: 'ddddddd',
                  },
                  {
                    id: 2,
                    ktmc: 'kkkkk',
                    jd: 'jdjdjdj',
                    jj: 'jjjjjjj',
                    dqjz: 'ddddddd',
                  },
                ],
                [
                  {
                    title: '课题名称',
                    dataIndex: 'ktmc',
                    width: 160,
                    key: 'ktmc',
                    ellipsis: true,
                  },
                  {
                    title: '进度',
                    dataIndex: 'jd',
                    width: 100,
                    key: 'jd',
                    ellipsis: true,
                  },
                  {
                    title: '简介',
                    dataIndex: 'jj',
                    key: 'jj',
                    ellipsis: true,
                  },
                  {
                    title: '当前进展',
                    dataIndex: 'dqjz',
                    width: 100,
                    key: 'dqjz',
                    ellipsis: true,
                  },
                ],
              )}
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
              content={tablePopover(
                [
                  {
                    xqbt: '需求需求需求需求需求需求需求需求需求需求需求需求',
                    xqnr: '需求需求需求需求需求需求需求需求需求需求需求需求',
                    xqrq: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                  },
                  {
                    xqbt: '需求需求需求需求需求需求需求需求需求需求需求需求',
                    xqnr: '需求需求需求需求需求需求需求需求需求需求需求需求',
                    xqrq: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                  },
                  {
                    xqbt: '需求需求需求需求需求需求需求需求需求需求需求需求',
                    xqnr: '需求需求需求需求需求需求需求需求需求需求需求需求',
                    xqrq: '2023-02-02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                  },
                ],
                [
                  {
                    title: '需求标题',
                    dataIndex: 'xqbt',
                    width: 144,
                    key: 'xqbt',
                    ellipsis: true,
                  },
                  {
                    title: '需求内容',
                    dataIndex: 'xqnr',
                    width: 144,
                    key: 'xqnr',
                    ellipsis: true,
                  },
                  {
                    title: '需求日期',
                    dataIndex: 'xqrq',
                    width: 144,
                    key: 'xqrq',
                    ellipsis: true,
                  },
                ],
              )}
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
          {getInfoItem('项目预算：', '90,000,000元')}
          {getInfoItem('关联预算项目：', '数字化运营项目')}
          <div className="info-item" style={{ height: '44px' }}>
            <div className="item-top">
              <span>已执行预算</span>50,000元
            </div>
            <div className="item-bottom">
              <span>/执行率：</span>20%
            </div>
          </div>
        </div>
      </div>
      <div className="info-box" key="gysxx">
        <div className="top-title">供应商信息</div>
        <div className="info-row">
          {getInfoItem('供应商名称：', 'XXXXX供应商')}
          {getInfoItem('供应商类型：', '服务供应商')}
          {getInfoItem('供应商联系人：', '王小帅 15497367584')}
        </div>
      </div>
      <div className="info-box" key="zcxx">
        <div className="top-title">招采信息</div>
        <div className="info-row" key="zcxx-1">
          {getInfoItem('合同金额：', '查看详情', true)}
          {getInfoItem('招采方式：', '查看详情', true)}
          {getInfoItem('签署日期：', '查看详情', true)}
        </div>
        <div className="info-row" key="zcxx-2">
          {getInfoItem('招标保证金：', '外采项目')}
          {getInfoItem('履约保证金：', '测试项目1')}
          {getInfoItem('评标报告：', '顶点公司评标报告.docx')}
        </div>
        <div className="info-row" key="zcxx-3">
          {getPmtPlan([])}
        </div>
        <div className="info-row" key="zcxx-4">
          <div className="info-item" key="zcxx-4-1">
            <span>其他投标供应商：</span>
            <Popover
              placement="rightTop"
              title={null}
              // autoAdjustOverflow={false}
              content={otherSupplierPopover([
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
                { name: '供应商名称 ' },
              ])}
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
