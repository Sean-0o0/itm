import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Button, Empty, Input, message, Modal, Popconfirm, Spin } from 'antd';
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
  const [unSaveData, setUnsaveData] = useState([]); //数据保存前的操作数据 - 还未展示
  const [emptyArr, setEmptyArr] = useState([]); //为空的数据 - 用于接口提交
  const [jlTotal, setJlTotal] = useState(0); //简历数量

  useEffect(() => {
    setData(JSON.parse(JSON.stringify(JLXX)));
    setUnsaveData(JSON.parse(JSON.stringify(JLXX)));
    let total = 0;
    JLXX.forEach(x => {
      total += x.JLDATA.length;
    });
    setJlTotal(total);
    return () => {};
  }, [JSON.stringify(JLXX)]);

  const handleDestribute = () => {
    const groupedData = {};

    for (const item of data) {
      const { GYSID } = item;
      for (const jldata of item.JLDATA) {
        const { JLID, JLMC, NEXTID } = jldata;
        if (!groupedData[JLID]) {
          groupedData[JLID] = [];
        }
        const groupItem = groupedData[JLID].find(group => group.GYSID === GYSID);
        if (groupItem) {
          // group already exists
          groupItem.JLMC.items.push([jldata.ENTRYNO, jldata.JLMC]);
        } else {
          // create new group
          groupedData[JLID].push({
            JLID,
            GYSID,
            JLMC: {
              nextId: NEXTID,
              items: [[jldata.ENTRYNO, jldata.JLMC]],
            },
          });
        }
      }
    }

    const submitArr = Object.values(groupedData).flatMap(group => group);

    let submitArr2 = submitArr.map(x => {
      return {
        JLID: x.JLID,
        GYSID: x.GYSID,
        JLMC: JSON.stringify(x.JLMC).replace(/"/g, '!'),
      };
    });
    submitArr2 = submitArr2.concat([...emptyArr]);
    // console.log('🚀 ~ submitArr ~ submitArr:', submitArr2);
    ResumeDistribution({
      xqid: Number(xqid),
      swzxid: Number(swzxid),
      wjmc: JSON.stringify(submitArr2),
      count: submitArr2.length,
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
    setData([]);
    setVisible(false);
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
            <div className="resume-item" key={x.JLMC}>
              <span>
                <Input
                  defaultValue={x.JLMC}
                  onBlur={e => {
                    let arr = JSON.parse(JSON.stringify([...data]));
                    let jldata = [...arr[index].JLDATA];
                    jldata.forEach(j => {
                      if (j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC) {
                        // console.log('%%$',j);
                        j.JLMC = e.target.value;
                      }
                    });
                    arr[index].JLDATA = jldata;
                    setData(JSON.parse(JSON.stringify([...arr])));
                    console.log(
                      '🚀 ~ file: index.js:149 ~ getSplierItem ~ [...arr]:',
                      arr,
                      jldata,
                      e.target.value,
                    );
                  }}
                  style={{ width: '100%' }}
                />
              </span>
              {/* <i

                className="iconfont icon-download"
                onClick={() => handleFileDownload(x.JLID, x.JLMC, x.ENTRYNO)}
              /> */}
              <Popconfirm
                title="确定要删除该简历吗?"
                onConfirm={() => {
                  let arr = [...data];
                  arr[index].JLDATA = arr[index].JLDATA.filter(
                    j => !(j.ENTRYNO === x.ENTRYNO && j.JLID === x.JLID && j.JLMC === x.JLMC),
                  );
                  if (
                    arr[index].JLDATA.length == 0 ||
                    arr[index].JLDATA.filter(jl => jl.JLID === x.JLID).length === 0
                  ) {
                    setEmptyArr(p => [
                      ...p,
                      {
                        JLID: x.JLID,
                        GYSID: arr[index].GYSID,
                        JLMC: JSON.stringify({ nextId: x.NEXTID, items: [] }).replace(/"/g, '!'),
                      },
                    ]);
                  }
                  // console.log(
                  //   '🚀 ~ file: index.js:177 ~ getSplierItem ~ arr[index].JLDATA:',
                  //   arr[index].JLDATA,
                  // );
                  // console.log('🚀 ~ file: index.js:72 ~ getSplierItem ~ arr:', arr);
                  let total = 0;
                  arr.forEach(x => {
                    total += x.JLDATA.length;
                  });
                  setJlTotal(total);
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
      destroyOnClose={true}
    >
      <div className="body-title-box">
        <strong>简历查看</strong>
      </div>
      <Spin spinning={isSpinning}>
        <div className="splier-list">
          {jlTotal === 0 && (
            <Empty
              description="暂无简历"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ width: '100%' }}
            />
          )}
          {data.map((x, i) => getSplierItem(x, i))}
        </div>
      </Spin>
    </Modal>
  );
}
