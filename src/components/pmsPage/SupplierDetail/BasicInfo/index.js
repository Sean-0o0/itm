import { Popover } from 'antd';
import { node } from 'prop-types';
import React, { useEffect, useState,useLayoutEffect } from 'react';

export default function BasicInfo(props) {
  const { detailData } = props;
  const { splInfo = {}, contactInfo = [] } = detailData;
  const [dtlFold, setDtlFold] = useState({
    jydz: false,
    zzsm: false,
    jyfw: false,
  }); //详情显隐

  useLayoutEffect(() => {
    const node1 = document.getElementsByClassName('jydz')[0];
    const node2 = document.getElementsByClassName('zzsm')[0];
    const node3 = document.getElementsByClassName('jyfw')[0];
    let p = {};
    if (node1) p.jydz = !(node1.clientHeight <= 44 && node1.scrollHeight <= 44);
    if (node2) p.zzsm = !(node2.clientHeight <= 44 && node2.scrollHeight <= 44);
    if (node3) p.jyfw = !(node3.clientHeight <= 44 && node3.scrollHeight <= 44);
    setDtlFold({
      ...p,
    });
    console.log('scrollHeight', node1.scrollHeight, node2.scrollHeight, node3.scrollHeight);
    console.log('clientHeight', node1.clientHeight, node2.clientHeight, node3.clientHeight);
    return () => {};
  }, [splInfo]);

  const getInfoItem = (label = '--', content = '--', id, bool) => {
    return (
      <div className={'info-item ' + id} key={id}>
        <div className="label">{label}：</div>
        <div
          className="detail"
          style={
            bool
              ? {
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: '2',
                }
              : {}
          }
        >
          {bool && (
            <Popover
              title={null}
              content={<div style={{ maxWidth: 400 }}>{content}</div>}
              placement="bottomRight"
            >
              <div className="float">详情</div>
            </Popover>
          )}
          {content}
        </div>
      </div>
    );
  };
  const getLxrinfContent = (arr = []) => {
    return (
      <div className="list">
        {arr.map(x => (
          <div className="item" key={x.ID}>
            <div className="top">
              <div>{x.LXR}</div>
              <div className="position-tag">{x.ZW}</div>
            </div>
            <div className="bottom">
              <span>电话：</span> {x.DH || '无'}
              <span className="email">｜ 邮箱：</span> {x.QTLXFS || '无'}
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="basic-info-box">
      <div className="title">基本信息</div>
      <div className="content-row">
        <div className="left">
          <div className="label">联系人信息</div>
          <div className="lxr-item">
            <div className="top">
              <div className="lxr-name">{contactInfo[0]?.LXR}</div>
              <div className="position-tag">{contactInfo[0]?.ZW}</div>
            </div>
            <div className="bottom">
              <span>电话：</span> {contactInfo[0]?.DH || '无'}
              <span className="email">｜ 邮箱：</span> {contactInfo[0]?.QTLXFS || '无'}
            </div>
          </div>
          {contactInfo.length > 1 && (
            <Popover
              title={null}
              content={getLxrinfContent(contactInfo)}
              placement="bottomRight"
              overlayClassName="lxr-info-popover"
            >
              <div className="more-lxr">
                更多
                <i className="iconfont icon-down" />
              </div>
            </Popover>
          )}
        </div>
        <div className="right">
          {getInfoItem('经营地址', splInfo.JYDZ, 'jydz', dtlFold.jydz)}
          {getInfoItem('资质说明', splInfo.ZZSM, 'zzsm', dtlFold.zzsm)}
          {getInfoItem('经营说明', splInfo.JYFW, 'jyfw', dtlFold.jyfw)}
        </div>
      </div>
    </div>
  );
}
