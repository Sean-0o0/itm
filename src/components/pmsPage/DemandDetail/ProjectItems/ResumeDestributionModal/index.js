import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal, Popconfirm, Spin } from 'antd';
import config from '../../../../../utils/config';
import axios from 'axios';
import { ResumeDistribution } from '../../../../../services/pmsServices';

const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function ResumeDistributionModal(props) {
  const { visible, setVisible, JLXX = [], xqid, swzxid, reflush } = props;
  const [isSpinning, setIsSpinning] = useState(false);
  const [data, setData] = useState([]); //数据展示

  useEffect(() => {
    setData([...JLXX]);
    return () => {};
  }, [JSON.stringify(JLXX)]);

  const handleDestribute = () => {
    let submitArr = data.map(x => {
      return {
        JLID: String(x.JLID),
        GYSID: String(x.GYSID),
        JLMC: JSON.stringify(x.JLORIGINDATA).replace(/"/g, '!'),
      };
    });
    console.log('🚀 ~ submitArr ~ submitArr:', submitArr);
    ResumeDistribution({
      xqid: Number(xqid),
      swzxid: Number(swzxid),
      wjmc: JSON.stringify(submitArr),
      count: submitArr.length,
    })
      .then(res => {
        if (res?.success) {
          message.success('分发成功', 1);
          setVisible(false);
          setData([]);
          reflush();
        }
      })
      .catch(e => {
        message.error('分发失败', 1);
      });
  };

  const handleCancel = () => {
    setVisible(false);
    setData([]);
  };

  //供应商块
  const getSplierItem = ({ GYSMC = '--', JLDATA = [] }, index) => {
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
    if (JLDATA.length === 0) return '';
    return (
      <div className="splier-item">
        <div className="splier-name">{GYSMC}</div>
        <div className="resume-list">
          {JLDATA.map((x, i) => (
            <div className="resume-item" key={x.ENTRYNO}>
              <span>{x.JLMC}</span>
              <i
                className="iconfont icon-download"
                onClick={() => handleFileDownload(x.JLID, x.JLMC, x.ENTRYNO)}
              />
              <Popconfirm
                title="确定要删除该简历吗?"
                onConfirm={() => {
                  let arr = [...data];
                  arr[index].JLORIGINDATA.items = arr[index]?.JLORIGINDATA?.items?.filter(
                    j => j[0] !== x.ENTRYNO,
                  );
                  arr[index].JLDATA = arr[index].JLDATA.filter(j => j.ENTRYNO !== x.ENTRYNO);
                  // console.log('🚀 ~ file: index.js:72 ~ getSplierItem ~ arr:', arr);
                  setData([...arr]);
                  message.success('删除成功', 1);
                }}
              >
                <i className="iconfont delete" />
              </Popconfirm>
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
        <div className="splier-list">{data.map((x, i) => getSplierItem(x, i))}</div>
      </Spin>
    </Modal>
  );
}
