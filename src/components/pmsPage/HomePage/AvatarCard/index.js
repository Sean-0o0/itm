import React, { useEffect, useState } from 'react';
import moment from 'moment';

export default function AvatarCard(props) {
  const { width = '70%', overviewInfo } = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  useEffect(() => {
    return () => {};
  }, []);
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
  return (
    <div className="avatar-card-box" style={{ width }}>
      <div className="avatar">
        <img src={require('../../../../assets/homePage/img_avatar_male.png')} alt="" />
      </div>
      <div className="title">
        <span>{getGreeting()}</span>
        <div className="desc">
          {overviewInfo?.gw}，这是你在浙商证券的第
          {moment().diff(moment(overviewInfo?.rzsj), 'days')}天
        </div>
      </div>
    </div>
  );
}
