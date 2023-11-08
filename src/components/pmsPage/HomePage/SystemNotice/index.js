import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ShowAllModal from './ShowAllModal';
import { message, Tooltip } from 'antd';
import OprModal from '../../AwardHonor/OprModal';

export default function SystemNotice(props) {
  const { noticeData = [], setNoticeData, isGLY } = props;
  const [modalVisible, setModalVisible] = useState(false); //弹窗需要
  const [hjryData, setHjryData] = useState({
    visible: false, //显隐
    oprType: 'ADD',
    rowData: undefined,
    isSB: false, //是否申报
    fromPrjDetail: false, //入口是否在项目详情
    parentRow: undefined, //申报行的父行数据{}
    type: 'KJJX',
  }); //操作弹窗
  const location = useLocation();

  const getNoticeItem = ({
    txnr = '--',
    xxlx = '3',
    txrq = '',
    xxid,
    textHide = false,
    kzzd = '{}',
    gqts = '',
  }) => {
    const handleClick = () => {
      if (xxlx === '4') {
        if (gqts !== '') {
          message.warn(JSON.parse(gqts).tsnr, 1);
          return;
        }
        if (JSON.parse(kzzd).LX === 'HJRY') {
          handleSb(JSON.parse(kzzd));
          return;
        }
      }
    };
    return (
      <div className={xxlx === '4' ? 'notice-item' : 'notice-item-unclick'} key={xxid}>
        <i className="iconfont icon-notice-fill" />
        <div className="item-title" onClick={handleClick}>
          <Tooltip placement="topLeft" title={txnr}>
            {txnr}
          </Tooltip>
        </div>
        <div className="item-date">{moment(txrq).format('YYYY-MM-DD')}</div>
      </div>
    );
  };

  //申报
  const handleSb = row => {
    const getHJLX = (key = 1) => {
      if (key === 2) {
        return 'YJKT';
      } else {
        return 'KJJX';
      }
    };
    setHjryData({
      visible: true,
      oprType: 'ADD',
      rowData: undefined,
      isSB: true,
      fromPrjDetail: false,
      parentRow: { ...row, KTMC: row.JXMC },
      type: getHJLX(row.HJLX),
    });
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
      {/* 获奖荣誉 */}
      <OprModal
        setVisible={v => setHjryData(p => ({ ...p, visible: v }))}
        type={hjryData.type}
        data={hjryData}
        refresh={() => {}}
        isGLY={isGLY}
      />
      <ShowAllModal
        dataProps={{ visible: modalVisible, isGLY }}
        funcProps={{ setVisible: setModalVisible }}
      />
      <div className="notice-box">{noticeData.map(x => getNoticeItem(x))}</div>
    </div>
  );
}
