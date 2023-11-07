import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
// import guidePicture from '../../../../assets/homePage/guide.png';

export default function GuideCard(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  //图片预览
  const handlePictureView = () => {
    // let newTab = window.open(guidePicture, '_blank');
    window.open('/#/single/pms/ImagePreview', '_blank');
  };
  return (
    <div className="guide-card-box">
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
