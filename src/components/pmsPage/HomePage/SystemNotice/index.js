import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ShowAllModal from './ShowAllModal';

export default function SystemNotice(props) {
  const { noticeData = [] } = props;
  const [modalVisible, setModalVisible] = useState(false); //弹窗需要
  const location = useLocation();
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  const getNoticeItem = ({ txnr = '--', xxlx = '3', txrq = '', xxid }) => {
    return (
      <div className={xxlx === '4' ? 'notice-item' : 'notice-item-unclick'} key={xxid}>
        <i className="iconfont icon-notice-fill" />
        <div
          className="item-title"
          style={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: '2',
          }}
        >
          {xxlx === '4' ? <i className="iconfont icon-right" /> : ''} {txnr}
        </div>
        <div className="item-date">{moment(txrq).format('YYYY-MM-DD')}</div>
      </div>
    );
  };

  return (
    <div className="system-notice-card-box">
      <div className="home-card-title-box" style={{ marginBottom: 9 }}>
        <div>系统公告</div>
        <span onClick={() => setModalVisible(true)}>
          全部
          <i className="iconfont icon-right" />
        </span>
      </div>
      <ShowAllModal
        dataProps={{ visible: modalVisible }}
        funcProps={{ setVisible: setModalVisible }}
      />
      <div className="notice-box">{noticeData.map(x => getNoticeItem(x))}</div>
    </div>
  );
}
