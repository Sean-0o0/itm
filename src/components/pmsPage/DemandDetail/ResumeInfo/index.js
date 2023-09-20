import React, { useEffect, useState, useRef } from 'react';
import { Button, Popover, Tooltip } from 'antd';
import config from '../../../../utils/config';
import axios from 'axios';

const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function ResumeInfo(props) {
  const { dtlData = {}, isDock, setIsSpinning } = props;
  const { JLXX = [] } = dtlData;

  //供应商块
  const getSplierItem = (label = '--', num = '--', arr = []) => {
    //展示全部简历（包括不分发的），处理前缀
    const getJLMC = (str = '') => {
      if (str.substring(0, 4) === '%no%') {
        return str.substring(4);
      } else if (str.substring(0, 6) === '%tick%') {
        return str.substring(6);
      }
      return str;
    };
    const handleFilePreview = (id, fileName, entryno) => {
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
    const popoverContent = data => (
      <div className="list">
        {data.map(x => (
          <div
            className="item"
            key={x.JLID + x.JLMC + x.ENTRYNO}
            onClick={() => handleFilePreview(x.JLID, x.JLMC, x.ENTRYNO)}
          >
            <Tooltip title={getJLMC(x.JLMC)} placement="topLeft">
              <a style={{ color: '#3361ff' }}>{getJLMC(x.JLMC)}</a>
            </Tooltip>
          </div>
        ))}
      </div>
    );
    return (
      <div className="supplier-item" key={label}>
        <Tooltip title={label} placement="topLeft">
          <span className="label">{label}：</span>
        </Tooltip>
        <div>{num}份</div>
        <Popover
          placement="rightTop"
          title={null}
          content={popoverContent(arr)}
          overlayClassName="demand-detail-content-popover"
        >
          <a style={{ color: '#3361ff' }}>查看详情</a>
        </Popover>
      </div>
    );
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = (width, colNum) => {
    let arr = [];
    for (let i = 0; i < colNum; i++) {
      //每行最多colNum个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  //只有对接人、有数据时显示
  if (JLXX.length === 0 || !isDock) return null;
  return (
    <div className="resume-info-box info-box">
      <div className="title">简历信息</div>
      <div className="supplier-row-box">
        {JLXX.map(x => getSplierItem(x.GYSMC, x.JLDATA?.length, x.JLDATA))}
        {getAfterItem('33%', 3)}
      </div>
    </div>
  );
}
