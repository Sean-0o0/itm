import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

export default function GuideCard(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="guide-card-box">
      {/* 欢迎使用
      <div className="system-name">信息技术综合管理平台</div> */}
      <div className="system-name">
        <img src={require('../../../../assets/homePage/text@2x.png')} alt="" />
      </div>
      <Button className="guide-btn">查看引导</Button>
      <div className="guide-img"></div>
    </div>
  );
}
