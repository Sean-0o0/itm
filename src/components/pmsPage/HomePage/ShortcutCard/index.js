import React, { useEffect, useState } from 'react';

export default function ShortcutCard(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  const getShortcutItem = (imgTxt, txt)=>{
      return (
        <div className="shortcut-item">
          <img
            className="item-img"
            src={require(`../../../../assets/homePage/icon_${imgTxt}@2x.png`)}
            alt=""
          />
          <div className="item-txt">{txt}</div>
        </div>
      )
  };
  return (
    <div className="shortcut-card-box">
      快捷入口
      <div className="shortcut-box">
        {getShortcutItem('xjxm', '新建项目')}
        {getShortcutItem('yian', '议案审批')}
        {getShortcutItem('ysck', '预算查看')}
        {getShortcutItem('bgck', '报告查看')}
        {/* {getShortcutItem('bgtx', '报告填写')} */}
      </div>
    </div>
  );
}
