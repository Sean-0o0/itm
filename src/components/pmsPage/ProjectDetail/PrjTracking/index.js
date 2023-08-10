import React, { useEffect, useState, useRef } from 'react';
import { Button, Carousel, message, Popover, Progress } from 'antd';
import moment from 'moment';
import EditPrjTracking from '../../ProjectTracking/editPrjTracking/index.js';

export default function PrjTracking(props) {
  const { xmid = -2, prjData = {}, getTrackingData } = props;
  const { trackingData = [] } = prjData;
  const [activeKey, setActiveKey] = useState('');
  const [btnVisible, setBtnVisible] = useState({
    last: false,
    next: false,
  }); //切换按钮显隐
  const [editModal, setEditModal] = useState({
    visible: false,
    record: {},
    cycle: 0,
  }); //编辑弹窗
  const [startIndex, setStartIndex] = useState(0); //切割开始index
  const [endIndex, setEndIndex] = useState(3); //切割结束index
  let LOGIN_USER_ID = String(JSON.parse(sessionStorage.getItem('user')).id);
  let isXMJL = LOGIN_USER_ID === String(prjData.prjBasic?.XMJLID);

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
    index,
  ) => {
    return (
      <div
        className="tracking-item"
        key={XMZQ}
        style={isActive ? { borderColor: '#3361ff' } : {}}
        onClick={() => handleStepChange(XMZQ, index)}
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
  const getBottomBox = x => {
    // console.log('🚀 ~ file: index.js:94 ~ getBottomBox ~  x:', x);
    const { DQJD = '0%', DQZT = '--', ZYSXSM = '--', BZGZNR = '--', XZGZAP = '--', XMZQ } = x;
    const lateOrHighRisk = DQZT === '延期' || DQZT === '高风险';
    const latestWeek = XMZQ === trackingData[trackingData.length - 1].XMZQ;
    return (
      <div className="bottom-box">
        <div className="title">
          项目进度概况
          {isXMJL && (
            <div
              className="icon-box"
              onClick={() => setEditModal({ visible: true, record: x, cycle: XMZQ })}
            >
              <i className="iconfont icon-edit" />
              <span>编辑</span>
            </div>
          )}
        </div>
        <div className="content">
          <div className="content-top">
            <div className="info-item-col">
              <div className="label">当前进度：</div>
              <div className="value">
                <Progress
                  percent={Number(DQJD?.replace('%', '') ?? 0)}
                  strokeColor={!latestWeek ? '#909399' : lateOrHighRisk ? '#ff3030' : '#3361ff'}
                  format={p => (
                    <span
                      style={{
                        color: !latestWeek ? '#909399' : lateOrHighRisk ? '#ff3030' : '#3361ff',
                      }}
                    >
                      {p}%
                    </span>
                  )}
                  strokeWidth={12}
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            <div className="info-item-col">
              <div className="label">当前状态：</div>
              <div
                className="value"
                style={{ color: !latestWeek ? '#909399' : lateOrHighRisk ? '#ff3030' : '#3361ff' }}
              >
                {DQZT}
              </div>
            </div>
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

  //切换 - 自动触发 - 选中尽量居中
  const handleStepChange = v => {
    setActiveKey(v);
    let data = [...trackingData];
    let currentIndex = Number(v) - 1;
    if (data.length >= 3) {
      if (currentIndex - 1 >= 0 && currentIndex + 1 < data.length) {
        console.log('8888', currentIndex - 1, currentIndex + 2, startIndex, endIndex);
        setStartIndex(currentIndex - 1);
        setEndIndex(currentIndex + 2); //不包含
      } else if (currentIndex < 1) {
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
      if (currentIndex - 1 >= 0 && currentIndex < data.length - 1) {
        setBtnVisible({
          last: true,
          next: true,
        });
      } else if (currentIndex < 1) {
        setBtnVisible({
          last: false,
          next: true,
        });
      } else {
        setBtnVisible({
          last: true,
          next: false,
        });
      }
    } else {
      setBtnVisible({
        last: false,
        next: false,
      });
    }
    if (currentIndex - 1 === 0) {
      setBtnVisible(p => ({
        ...p,
        last: false,
      }));
    }
    if (currentIndex >= data.length - 2) {
      setBtnVisible(p => ({
        ...p,
        next: false,
      }));
    }
  };

  const popoverContent = (
    <div className="list">
      <div
        className="item"
        onClick={() => (window.location.href = `/#/pms/manage/ProjectTracking`)}
        key="1"
      >
        填写项目进度
      </div>
      <div
        className="item"
        onClick={() => (window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`)}
        key="2"
      >
        填写数字化专班月报
      </div>
      <div
        className="item"
        onClick={() => (window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`)}
        key="3"
      >
        填写金控周报
      </div>
    </div>
  );
  if (trackingData.length === 0) return null;
  return (
    <div className="prj-tracking-box">
      {/*编辑项目跟踪信息弹窗*/}
      {editModal.visible && (
        <EditPrjTracking
          record={editModal.record}
          cycle={editModal.cycle}
          getTableData={getTrackingData}
          contractSigningVisible={editModal.visible}
          closeContractModal={() => setEditModal(p => ({ ...p, visible: false }))}
        />
      )}
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
