import React from 'react';
import { Empty, message, Popover, Tooltip } from 'antd';
import config from '../../../../../../../utils/config';
import axios from 'axios';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function FileDownload(props) {
  const { fileStr = '{}', newFileArr = [], params = {} } = props;

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
  const handleNewFileSingleDownload = (file = {}) => {
    let reader = new FileReader();
    reader.readAsDataURL(file.originFileObj || file.blob);
    reader.onload = e => {
      var link = document.createElement('a');
      link.href = e.target.result;
      link.download = file.name;
      link.click();
      window.URL.revokeObjectURL(link.href);
    };
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
    newFileArr.forEach(file => {
      handleNewFileSingleDownload(file);
    });
  };

  //浮窗内容
  const content = (data = []) => (
    <div className="fj-box">
      <div className="fj-header">
        <div className="fj-title flex1">合同</div>
        {data.concat(newFileArr).length !== 0 && (
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
            </div>
          );
        })}
        {newFileArr.map(item => (
          <div className="item" key={item.uid} onClick={() => handleNewFileSingleDownload(item)}>
            <Tooltip title={item.name} placement="topLeft">
              {item.name}
            </Tooltip>
          </div>
        ))}
      </div>
      {data.concat(newFileArr).length === 0 && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
      )}
    </div>
  );
  if ((JSON.parse(fileStr).items || []).concat(newFileArr).length === 0) return '-';
  return (
    <div className="opr-column" style={{ justifyContent: 'flex-start', cursor: 'default' }}>
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
