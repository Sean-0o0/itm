import React, { useEffect, useState, useRef } from 'react';
import { Popover } from 'antd';
import config from '../../../../utils/config';
import axios from 'axios';

const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function EmploymentInfo(props) {
  const { dtlData = {}, isAuth, setIsSpinning } = props;
  const { LYSQ = {} } = dtlData;
  const [showDetail, setShowDetail] = useState(false); //录用备注文本是否折叠
  useEffect(() => {
    const node = document.getElementsByClassName('remarks');
    if (node.length > 0) {
      console.log(node[0].clientHeight, node[0].scrollHeight);
      setShowDetail(!(node[0].clientHeight <= 44 && node[0].scrollHeight <= 44));
    }
    return () => {};
  }, [JSON.stringify(LYSQ)]);
  const handleFilePreview = (id, fileName) => {
    setIsSpinning(true);
    axios({
      method: 'POST',
      url: queryFileStream,
      responseType: 'blob',
      data: {
        objectName: 'TWBMS_LYXX',
        columnName: 'FJ',
        id,
        title: fileName,
        // extr: 0,
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
        message.error('面试打分底稿下载失败', 1);
      });
  };
  if ((!isAuth || JSON.stringify(LYSQ) === '{}')) return null;
  return (
    <div className="empolyment-info-box info-box">
      <div className="title">录用申请信息</div>
      <div className="remarks">
        <div className="label">录用备注：</div>
        <div
          className="detail"
          style={
            showDetail
              ? {
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: '2',
                }
              : {}
          }
        >
          {showDetail && (
            <Popover
              title={null}
              content={<div className="content">{LYSQ.LYBZ}</div>}
              placement="bottomRight"
              overlayClassName="empolyment-remark-popover"
            >
              <div className="float">详情</div>
            </Popover>
          )}
          {LYSQ.LYBZ}
        </div>
      </div>
      <div className="grade-script">
        面试打分底稿：
        <span onClick={() => handleFilePreview(LYSQ.LYXXID, LYSQ.FJ)}>{LYSQ.FJ}</span>
      </div>
    </div>
  );
}
