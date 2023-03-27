import React, { useEffect, useState } from 'react';

export default function InfoDisplay(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  //获取信息块
  const getInfoItem = (label, val, isLink = false) => {
    return (
      <div className="info-item">
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
      <div className="info-item" style={{ width: '100%', display: 'flex', height: 'unset' }}>
        <div className="payment-label">付款计划：</div>
        <div className="payment-plan">
          {arr.map((x, i) => (
            <div key={i}>{x}</div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="col-left info-display-box">
      <div className="info-box">
        <div className="top-title">项目信息</div>
        <div className="info-row">
          {getInfoItem('项目类型：', '外采项目')}
          {getInfoItem('关联软件：', '测试项目1')}
          {getInfoItem('应用部门：', '测试项目1测试项目1测试项目1测试项目1测试项目1测试项目1')}
        </div>
        <div className="info-row">
          {getInfoItem('文档库：', '查看详情', true)}
          {getInfoItem('获奖信息：', '查看详情', true)}
          {getInfoItem('项目课题：', '查看详情', true)}
        </div>
        <div className="info-row">{getInfoItem('变更类/计划外需求：', '查看详情', true)}</div>
      </div>
      <div className="info-box">
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
      <div className="info-box">
        <div className="top-title">供应商信息</div>
        <div className="info-row">
          {getInfoItem('供应商名称：', 'XXXXX供应商')}
          {getInfoItem('供应商类型：', '服务供应商')}
          {getInfoItem('供应商联系人：', '王小帅 15497367584')}
        </div>
      </div>
      <div className="info-box">
        <div className="top-title">招采信息</div>
        <div className="info-row">
          {getInfoItem('合同金额：', '查看详情', true)}
          {getInfoItem('招采方式：', '查看详情', true)}
          {getInfoItem('签署日期：', '查看详情', true)}
        </div>
        <div className="info-row">
          {getInfoItem('招标保证金：', '外采项目')}
          {getInfoItem('履约保证金：', '测试项目1')}
          {getInfoItem('评标报告：', '顶点公司评标报告.docx')}
        </div>
        <div className="info-row">{getPmtPlan([])}</div>
        <div className="info-row">{getInfoItem('其他投标供应商：', '查看详情', true)}</div>
      </div>
    </div>
  );
}
