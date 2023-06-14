import React, { useEffect, useState, useRef } from 'react';
import { Button, Carousel, message, Progress } from 'antd';
import moment from 'moment';
import { QueryProjectTracking } from '../../../../services/pmsServices';

export default function PrjTracking(props) {
  const { xmid = -2, prjData = {} } = props;
  const { trackingData = [] } = prjData;
  const sliderRef = useRef(null);
  const [activeKey, setactiveKey] = useState('');
  const [data, setData] = useState([]); //数据
  const [btnVisible, setBtnVisible] = useState({
    last: false,
    next: false,
  }); //切换按钮显隐
  useEffect(() => {
    return () => {};
  }, []);

  const getTrackingItem = () => {
    return (
      <div className="tracking-item">
        <div className="top">项目第15周</div>
      </div>
    );
  };
  return (
    <div className="prj-tracking-box">
      <div className="top-box">
        项目跟踪
        <i className="iconfont icon-file-fillout" />
        <span>进度及报告填写</span>
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
        {/* <Carousel ref={sliderRef} afterChange={key => setCurSliderKey(key)}></Carousel> */}
      </div>
      <div className="bottom-box">
        <div className="title">
          项目进度概况
          <i className="iconfont icon-edit" />
          <span>编辑</span>
        </div>
        <div className="content">
          <div className="content-top">
            <div className="label">当前进度：</div>
            <div className="value">
              <Progress
                percent={Number(trackingData[0]?.DQJD?.replace('%', '') ?? 0)}
                strokeColor="#3361ff"
                format={p => <span style={{ color: '#3361ff' }}>{p}%</span>}
                strokeWidth={12}
              />
            </div>
            <div className="label">当前状态：</div>
            <div className="value">{trackingData[0]?.DQZT}</div>
          </div>
          <div className="info-item">
            <div className="label">重要事项说明：</div>
            <div className="value">{trackingData[0]?.ZYSXSM}</div>
          </div>
          <div className="info-item">
            <div className="label">本周工作内容：</div>
            <div className="value">{trackingData[0]?.BZGZNR}</div>
          </div>
          <div className="info-item">
            <div className="label">下周工作计划：</div>
            <div className="value">{trackingData[0]?.XZGZAP}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
