import React, { useEffect, useState, useRef } from 'react';
import { Empty, message, Popover, Tooltip } from 'antd';
import config from '../../../../utils/config';
import axios from 'axios';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function FileDownload(props) {
  const { fileStr = '{}', params = {} } = props;

  useEffect(() => {
    return () => {};
  }, []);

  //单个下载
  const handleSingleDownload = (id, title, params = {}) => {
    axios({
      method: 'POST',
      url: queryFileStream,
      responseType: 'blob',
      data: {
        ...params,
        title: title,
        extr: id,
      },
    })
      .then(res => {
        const href = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.download = title;
        a.href = href;
        a.click();
        //记录下载历史
        this.inSertHistorySingle(wdid);
      })
      .catch(err => {
        message.error(err);
      });
  };

  //批量下载
  const handleBatchDownload = (items = [], params = {}) => {
    items.forEach(element => {
      const [id, title] = element;
      axios({
        method: 'post',
        url: queryFileStream,
        responseType: 'blob',
        data: {
          ...params,
          title: title,
          extr: id,
        },
      })
        .then(res => {
          const href = URL.createObjectURL(res.data);
          const a = document.createElement('a');
          a.download = title;
          a.href = href;
          a.click();
        })
        .catch(err => {
          message.error(err);
        });
    });
  };

  //浮窗内容
  const content = (data = []) => (
    <div className="fj-box">
      <div className="fj-header">
        <div className="fj-title flex1">附件</div>
        {data.length !== 0 && (
          <div className="fj-header-btn" onClick={() => handleBatchDownload(data, params)}>
            全部下载
          </div>
        )}
      </div>
      <div className="fj-content">
        {data.map((item, index) => {
          const [id, title] = item;
          return (
            <div
              className="item"
              key={index}
              onClick={() => handleSingleDownload(id, title, params)}
            >
              <Tooltip title={title} placement="topLeft">
                {title}
              </Tooltip>
              {/* <i className="iconfont icon-download" /> */}
            </div>
          );
        })}
      </div>
      {data.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
    </div>
  );
  return (
    <div className="opr-column" style={{ justifyContent: 'flex-start' }}>
      <Popover
        placement="bottomLeft"
        overlayClassName="file-list-popover"
        content={content(JSON.parse(fileStr).items || [])}
      >
        查看更多
      </Popover>
    </div>
  );
}
