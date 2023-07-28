import { Popover, Tooltip } from 'antd';
import React, { useEffect, useState, useLayoutEffect } from 'react';

export default function BasicInfo(props) {
  const { detailData, splId } = props;
  const { splInfo = {}, contactInfo = [] } = detailData;
  // const [jydzFold, setJydzFold] = useState(false); //详情显隐
  // const [zzsmFold, setZzsmFold] = useState(false); //详情显隐
  const [jyfwFold, setJyfwFold] = useState(false); //详情显隐

  // useLayoutEffect(() => {
  //   const node = document.getElementsByClassName('jydz')[0];
  //   if (node) {
  //     setJydzFold(!(node.clientHeight <= 44 && node.scrollHeight <= 44));
  //   }
  //   return () => {};
  // }, [splInfo.JYDZ]);
  // useLayoutEffect(() => {
  //   const node = document.getElementsByClassName('zzsm')[0];
  //   if (node) {
  //     setZzsmFold(!(node.clientHeight <= 44 && node.scrollHeight <= 44));
  //   }
  //   return () => {};
  // }, [splInfo.ZZSM]);
  useLayoutEffect(() => {
    const node = document.getElementsByClassName('jyfw')[0];
    if (node) {
      setJyfwFold(!(node.clientHeight <= 44 && node.scrollHeight <= 44));
    }
    return () => {};
  }, [splInfo.JYFW, splId]);

  //信息块
  const getInfoItemJYFW = (label = '--', content = '暂无信息', bool) => {
    return (
      <div className={'info-item jyfw'} key={'jyfw'}>
        <div className="label">{label}：</div>
        <div
          className="detail"
          style={
            bool
              ? {
                  maxHeight: 44,
                }
              : {}
          }
        >
          {bool && (
            <Popover
              title={null}
              content={<div className="content">{content}</div>}
              placement="bottomRight"
              overlayClassName="supplier-detail-basic-info-popover"
            >
              <div className="float">详情</div>
            </Popover>
          )}
          {content}
        </div>
      </div>
    );
  };
  const getInfoItem = (label = '--', content = '暂无信息', id) => {
    const showToolTip = e => {
      //暂时注释，屏幕宽度变化时不会触发
      // if (e.target.clientWidth >= e.target.scrollWidth) {
      //   e.target.style.pointerEvents = 'none'; // 阻止鼠标事件
      // }
    };
    return (
      <div className={'info-item ' + id} key={id}>
        <div className="label">{label}：</div>
        <Tooltip title={content} placement="topLeft" onMouseEnter={showToolTip}>
          <span className="info">{content}</span>
        </Tooltip>
      </div>
    );
  };

  //联系人展示
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
          {contactInfo.length === 0 ? (
            <div className="lxr-item">暂无信息</div>
          ) : (
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
          )}
          {contactInfo.length > 1 && (
            <Popover
              title={null}
              content={getLxrinfContent(contactInfo?.slice(1))}
              placement="bottomRight"
              overlayClassName="lxr-info-popover"
              trigger="click"
            >
              <div className="more-lxr">
                更多
                <i className="iconfont icon-down" />
              </div>
            </Popover>
          )}
        </div>
        <div className="right">
          {getInfoItem('经营地址', splInfo.JYDZ, 'jydz')}
          {getInfoItem('资质说明', splInfo.ZZSM, 'zzsm')}
          {getInfoItemJYFW('经营说明', splInfo.JYFW, jyfwFold)}
        </div>
      </div>
    </div>
  );
}
