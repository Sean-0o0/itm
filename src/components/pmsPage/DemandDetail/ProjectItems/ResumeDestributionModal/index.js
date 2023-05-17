import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal } from 'antd';
import moment from 'moment';

export default function PersonnelArrangementModal(props) {
  const { visible, setVisible, JLXX = [] } = props;
  useEffect(() => {
    return () => {};
  }, []);
  const handleDestribute = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  //供应商块
  const getSplierItem = (splierName = '--', resumeArr = []) => {
    return (
      <div className="splier-item">
        <div className="splier-name">{splierName}</div>
        <div className="resume-list">
          {resumeArr.map(x => (
            <div className="resume-item" key={x.JLID}>
              <span>{x.JLMC}</span>
              <i className="iconfont icon-download" />
              <i className="iconfont delete" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      wrapClassName="editMessage-modify resume-destribution-modal"
      width={'720px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      cancelText={'取消'}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      okText="分发"
      onOk={handleDestribute}
      onCancel={handleCancel}
    >
      <div className="body-title-box">
        <strong>简历分发</strong>
      </div>
      <div className="splier-list">{JLXX.map(x => getSplierItem(x.GYSMC, x.JLDATA))}</div>
    </Modal>
  );
}
