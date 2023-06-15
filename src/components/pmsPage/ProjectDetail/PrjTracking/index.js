import React, { useEffect, useState, useRef } from 'react';
import { Button, Carousel, message, Popover, Progress } from 'antd';
import moment from 'moment';

export default function PrjTracking(props) {
  const { xmid = -2, prjData = {} } = props;
  const { trackingData = [] } = prjData;
  const [activeKey, setActiveKey] = useState('');
  const [btnVisible, setBtnVisible] = useState({
    last: false,
    next: false,
  }); //切换按钮显隐
  const [startIndex, setStartIndex] = useState(0); //切割开始index
  const [endIndex, setEndIndex] = useState(3); //切割结束index

  //初始化按钮状态
  useEffect(() => {
    if (trackingData.length !== 0) {
      const data = [...trackingData];
      let activeIndex = data.length - 1;
      setActiveKey(data[activeIndex]?.XMZQ ?? '');
      if (data.length >= 3) {
        if (activeIndex - 1 >= 0 && activeIndex + 1 < data.length) {
          setStartIndex(activeIndex - 1);
          setEndIndex(activeIndex + 2); //不包含
        } else if (activeIndex < 1) {
          setStartIndex(0);
          setEndIndex(3);
        } else {
          setStartIndex(data.length - 3);
          setEndIndex(data.length);
        }
      } else {
        setStartIndex(0);
        setEndIndex(data.length);
      }
      if (data.length > 3) {
        if (activeIndex - 1 > 0 && activeIndex < data.length - 1) {
          setBtnVisible(p => ({ last: true, next: true }));
        } else if (activeIndex < 1) {
          setBtnVisible(p => ({ last: false, next: true }));
        } else {
          setBtnVisible(p => ({ last: true, next: false }));
        }
      } else {
        setBtnVisible(p => ({ last: false, next: false }));
      }
      if (activeIndex - 1 === 0) {
        setBtnVisible(p => ({ ...p, last: false }));
      }
      if (activeIndex === data.length - 1 || activeIndex >= data.length - 2) {
        setBtnVisible(p => ({ ...p, next: false }));
      }
    }
    return () => {};
  }, [xmid, JSON.stringify(trackingData)]);

  //项目跟踪块
  const getTrackingItem = (
    { XMZQ = '--', DQZT = '--', DQJD = '--', KSSJ, JSSJ },
    isActive = false,
  ) => {
    return (
      <div
        className="tracking-item"
        key={XMZQ}
        style={isActive ? { borderColor: '#3361ff' } : {}}
        onClick={() => setActiveKey(XMZQ)}
      >
        <div className="top">
          项目第{XMZQ}周
          <div className="icon-wrapper">
            <i className="iconfont icon-hourglass" />
            {/* <i className="iconfont icon-alarm" />  */}
          </div>
          <span style={isActive ? { color: '#303133' } : {}}>{DQZT}</span>
        </div>
        <div className="rate">
          当前进度：<span style={isActive ? { color: '#3361ff' } : {}}>{DQJD}</span>
        </div>
        <div className="date">
          {KSSJ ? moment(String(KSSJ)).format('YYYY.MM.DD') : '-.-.-'} -{' '}
          {JSSJ ? moment(String(JSSJ)).format('YYYY.MM.DD') : '-.-.-'}
        </div>
      </div>
    );
  };

  //底部信息盒子
  const getBottomBox = ({
    DQJD = '0%',
    DQZT = '--',
    ZYSXSM = '--',
    BZGZNR = '--',
    XZGZAP = '--',
  }) => {
    return (
      <div className="bottom-box">
        <div className="title">
          项目进度概况
          <div className="icon-box">
            <i className="iconfont icon-edit" />
            <span>编辑</span>
          </div>
        </div>
        <div className="content">
          <div className="content-top">
            <div className="label">当前进度：</div>
            <div className="value">
              <Progress
                percent={Number(DQJD?.replace('%', '') ?? 0)}
                strokeColor="#3361ff"
                format={p => <span style={{ color: '#3361ff' }}>{p}%</span>}
                strokeWidth={12}
              />
            </div>
            <div className="label">当前状态：</div>
            <div className="value">{DQZT}</div>
          </div>
          <div className="info-item">
            <div className="label">重要事项说明：</div>
            <div className="value">{ZYSXSM}</div>
          </div>
          <div className="info-item">
            <div className="label">本周工作内容：</div>
            <div className="value">{BZGZNR}</div>
          </div>
          <div className="info-item">
            <div className="label">下周工作计划：</div>
            <div className="value">{XZGZAP}</div>
          </div>
        </div>
      </div>
    );
  };

  //切换 - 按钮触发
  const handleSwitch = txt => {
    let data = [...trackingData];
    let st = 0;
    let ed = 3;
    if (txt === 'last') {
      if (startIndex - 1 === 0) {
        st = 0;
        ed = 3;
        setBtnVisible(p => ({ ...p, last: false }));
      } else {
        st = startIndex - 1;
        ed = endIndex - 1;
      }
    } else {
      if (endIndex + 1 === data.length) {
        if (data.length >= 3) {
          st = data.length - 3;
        } else {
          st = 0;
        }
        ed = data.length;
        setBtnVisible(p => ({ ...p, next: false }));
      } else {
        st = startIndex + 1;
        ed = endIndex + 1;
      }
    }
    setBtnVisible(p => ({ last: st > 0, next: ed < data.length }));
    setStartIndex(st);
    setEndIndex(ed);
  };

  const popoverContent = (
    <div className="list">
      <div className="item" onClick={() => {}} key="1">
        填写项目进度
      </div>
      <div className="item" onClick={() => {}} key="2">
        填写数字化专班月报
      </div>
      <div className="item" onClick={() => {}} key="3">
        填写金控周报
      </div>
    </div>
  );

  return (
    <div className="prj-tracking-box">
      <div className="top-box">
        项目跟踪
        <Popover
          placement="bottomRight"
          title={null}
          content={popoverContent}
          overlayClassName="btn-more-content-popover"
        >
          <div className="icon-box">
            <i className="iconfont icon-file-fillout" />
            <span>进度及报告填写</span>
          </div>
        </Popover>
      </div>
      <div className="middle-box">
        {btnVisible.last && (
          <div className="last-btn" onClick={() => handleSwitch('last')}>
            <i className="iconfont icon-left" />
          </div>
        )}
        {btnVisible.next && (
          <div className="next-btn" onClick={() => handleSwitch('next')}>
            <i className="iconfont icon-right" />
          </div>
        )}
        {trackingData
          .slice(startIndex, endIndex)
          .map(x => getTrackingItem(x, activeKey === x.XMZQ))}
      </div>
      {getBottomBox(trackingData.filter(x => x.XMZQ === activeKey)[0] ?? {})}
    </div>
  );
}
