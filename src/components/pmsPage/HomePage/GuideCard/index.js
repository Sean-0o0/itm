import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
// import guidePicture from '../../../../assets/homePage/guide.png';

const guidePicture = '/fileurl/home/zszq/data/app/data-pms/picture/index-zcyd.png';
export default function GuideCard(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  //图片预览
  const handlePictureView = () => {
    let newTab = window.open(guidePicture, '_blank');
    // 在新标签页打开时等待片刻，确保页面完全加载
    // setTimeout(function() {
    //   // 设置新标签页的缩放级别
    //   window.zoomLevel = 5;
    // }, 1000);
  };
  return (
    <div className="guide-card-box">
      {/* 欢迎使用
      <div className="system-name">信息技术综合管理平台</div> */}
      <div className="system-name">
        <img src={require('../../../../assets/homePage/text@2x.png')} alt="" />
      </div>
      <Button className="guide-btn" onClick={handlePictureView}>
        招采引导
      </Button>
      <div className="guide-img"></div>
    </div>
  );
}
