import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ShowAllModal from './ShowAllModal';
import { Tooltip } from 'antd';

export default function SystemNotice(props) {
  const { noticeData = [], setNoticeData } = props;
  const [modalVisible, setModalVisible] = useState(false); //弹窗需要
  const location = useLocation();

  useEffect(() => {
    const nodeArr = document.querySelectorAll('.notice-item, .notice-item-unclick > .item-title');
    if (nodeArr.length !== 0 && noticeData.length !== 0) {
      let data = [...noticeData];
      for (let i = 0; i < nodeArr.length; i++) {
        let x = nodeArr[i];
        data[i] && (data[i].textHide = !(x.clientHeight <= 44 && x.scrollHeight <= 44));
      }
      setNoticeData([...data]);
    }
    // console.log(noticeData);
    return () => {};
  }, [JSON.stringify(noticeData)]);

  const getNoticeItem = ({ txnr = '--', xxlx = '3', txrq = '', xxid, textHide = false }) => {
    return (
      <div className={xxlx === '4' ? 'notice-item' : 'notice-item-unclick'} key={xxid}>
        <i className="iconfont icon-notice-fill" />
        {textHide ? (
          <div className={'item-title item-title-before'}>
            {xxlx === '4' ? (
              <span className={'icon-wrapper'}>
                ...
                <i className="iconfont icon-right" />
              </span>
            ) : (
              <span className={'icon-wrapper-xxlx3'}>...</span>
            )}
            <Tooltip placement="topLeft" title={txnr}>
              {txnr}
            </Tooltip>
          </div>
        ) : (
          <div className="item-title">
            <Tooltip placement="topLeft" title={txnr}>
              {txnr}
            </Tooltip>
            {xxlx === '4' ? (
              <span className={'icon-wrapper'}>
                <i className="iconfont icon-right" />
              </span>
            ) : (
              ''
            )}
          </div>
        )}
        <div className="item-date">{moment(txrq).format('YYYY-MM-DD')}</div>
      </div>
    );
  };

  if (noticeData.length === 0) return null;
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
