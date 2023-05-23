import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Spin } from 'antd';
import config from '../../../../../utils/config';
import axios from 'axios';

const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function PersonnelArrangementModal(props) {
  const { visible, setVisible, JLXX = [] } = props;
  const [isSpinning, setIsSpinning] = useState(false);
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
    let jlArr = mc =>
      ['', '{}', ' ', '[]', undefined, null].includes(mc) ? '--' : JSON.parse(mc)?.items[0] || [];
    const handleFileDownload = (id, fileName, entryno) => {
      setIsSpinning(true);
      axios({
        method: 'POST',
        url: queryFileStream,
        responseType: 'blob',
        data: {
          objectName: 'TWBXQ_JLSC',
          columnName: 'JL',
          id,
          title: fileName,
          extr: entryno,
          type: '',
        },
      })
        .then(res => {
          const href = URL.createObjectURL(res.data);
          const a = document.createElement('a');
          a.download = fileName;
          a.href = href;
          a.click();
          window.URL.revokeObjectURL(a.href);
          setIsSpinning(false);
        })
        .catch(err => {
          setIsSpinning(false);
          message.error('简历下载失败', 1);
        });
    };
    return (
      <div className="splier-item">
        <div className="splier-name">{splierName}</div>
        <div className="resume-list">
          {resumeArr.map(x => (
            <div className="resume-item" key={x.JLID}>
              <span>{jlArr(x.JLMC)[1]}</span>
              <i
                className="iconfont icon-download"
                onClick={() => handleFileDownload(x.JLID, jlArr(x.JLMC)[1], jlArr(x.JLMC)[0])}
              />
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
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>简历分发</strong>
      </div>
      <Spin spinning={isSpinning}>
        <div className="splier-list">{JLXX.map(x => getSplierItem(x.GYSMC, x.JLDATA))}</div>
      </Spin>
    </Modal>
  );
}
