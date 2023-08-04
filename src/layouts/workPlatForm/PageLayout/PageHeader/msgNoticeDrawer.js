import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Avatar, Badge, Button, Drawer, message } from 'antd';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_female.png';
import moment from 'moment';

export default function MsgNoticeDrawer(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { msgData = Array.from({ length: 101 }, (_, i) => i) } = dataProps;
  const {} = funcProps;
  const [visible, setVisible] = useState(false); //详情显隐
  const [newMsgNum, setNewMsgNum] = useState(0); //新消息数目
  useEffect(() => {
    setNewMsgNum(5);
    return () => {};
  }, []);

  const getTitleNode = () => {
    const handleAllRead = () => {};
    return (
      <div className="drawer-header">
        消息通知
        <div className="all-read" onClick={handleAllRead}>
          <i className="iconfont icon-msg-read" />
          全部已读
        </div>
      </div>
    );
  };

  const getMsgItem = (unread = true, i) => {
    return (
      <div className="msg-item" key={i}>
        <Badge dot={unread} offset={[-4, 5]} className="item-avatar">
          <Avatar src={avatarMale} />
        </Badge>
        <div className="item-info" style={unread ? {} : { color: '#909399', fontWeight: 400 }}>
          <div className="info-title">
            朱浩璐 <span>2023-05-26 16:54:32</span>
          </div>
          <div className="info-detail">邀请您加入信息技术综合管理平台项目担任产品经理</div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className="msg-notice-box">
        <Badge
          count={newMsgNum}
          offset={newMsgNum > 9 && newMsgNum <= 99 ? [4, 0] : newMsgNum > 99 ? [8, 0] : undefined}
          className="msg-bell"
          onClick={() => setVisible(true)}
        >
          <i className="iconfont icon-message" />
        </Badge>
      </div>
      <Drawer
        title={getTitleNode()}
        width={400}
        visible={visible}
        onClose={() => setVisible(false)}
        className="msg-notice-drawer"
        zIndex={101}
        closable={false}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      >
        {msgData.map((x, i) => getMsgItem(i < 5, i))}
      </Drawer>
    </Fragment>
  );
}
