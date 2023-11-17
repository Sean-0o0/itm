import React, { useLayoutEffect, useState, useRef } from 'react';
import { Button, message, Tooltip } from 'antd';
import config from '../../../../utils/config';
import axios from 'axios';
import OprtModal from './OprtModal';
import Waterfall from './Waterfall';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function TemplateBox(props) {
  const { tpltData = [], getDocTplt, setTpltData, isGLY } = props;
  const [docEditModalData, setDocEditModalData] = useState({
    visible: false,
    id: undefined, //文档模板id
    type: undefined, //文档类型id
    typeName: undefined, //文档类型
    wdmb: undefined, //文档模板
    operateType: 'ADD',
  }); //新增、编辑弹窗

  //模板块
  const getTpltItem = ({ ID, WDLX = '--', WDLXID, WDMB = [], ISFOLD = true }) => {
    //点击文件下载
    const handleDownload = (id, extr, title) => {
      axios({
        method: 'POST',
        url: queryFileStream,
        responseType: 'blob',
        data: {
          objectName: 'TWD_WDMB',
          columnName: 'WDMB',
          id,
          type: '',
          title,
          extr,
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
    //点击编辑
    const handleEdit = (id, type, wdmb, typeName) => {
      setDocEditModalData({ operateType: 'UPDATE', visible: true, id, type, wdmb, typeName });
    };
    //单个模板文件
    const getDocItem = (id, extr, title) => {
      return (
        <div
          className="doc-item"
          key={`${id}-${extr}-${title}`}
          onClick={() => handleDownload(id, extr, title)}
        >
          {title}
        </div>
      );
    };
    //展开收起
    const handleFold = (id, bool) => {
      setTpltData(p => p.map(x => ({ ...x, ISFOLD: x.ID === id ? bool : x.ISFOLD })));
    };
    return (
      <div className="tplt-item" key={ID}>
        <div className="title-row">
          <Tooltip title={WDLX} placement="topLeft">
            {WDLX}
          </Tooltip>
          {isGLY && (
            <i className="iconfont icon-edit" onClick={() => handleEdit(ID, WDLXID, WDMB, WDLX)} />
          )}
        </div>
        <div className="content-row">
          {(ISFOLD ? WDMB.items?.slice(0, 5) : WDMB.items).map(x => getDocItem(ID, x[0], x[1]))}
          {WDMB.items?.length > 5 &&
            (ISFOLD ? (
              <div className="more-item" onClick={() => handleFold(ID, false)}>
                展开
                <i className="iconfont icon-down" />
              </div>
            ) : (
              <div className="more-item-unfold" onClick={() => handleFold(ID, true)}>
                收起
                <i className="iconfont icon-up" />
              </div>
            ))}
        </div>
      </div>
    );
  };

  //上传模板
  const handleAdd = () => {
    setDocEditModalData({ operateType: 'ADD', visible: true });
  };

  return (
    <div className="template-box">
      <OprtModal
        visible={docEditModalData.visible}
        setVisible={v => setDocEditModalData(p => ({ ...p, visible: v }))}
        data={{
          existingTypes: tpltData.map(x => Number(x.WDLXID)),
          ...docEditModalData,
          refresh: getDocTplt,
        }}
      />
      {isGLY && (
        <div className="btn-row">
          <Button type="primary" onClick={handleAdd}>
            上传模板
          </Button>
        </div>
      )}
      <div className="content-box">
        <Waterfall list={tpltData} itemRender={getTpltItem} />
      </div>
    </div>
  );
}
