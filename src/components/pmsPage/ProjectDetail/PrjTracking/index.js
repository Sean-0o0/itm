import React, { useEffect, useState, useRef } from 'react';
import { Button, Carousel, message, Popover, Progress, Icon } from 'antd';
import moment from 'moment';
import EditPrjTracking from '../../ProjectTracking/editPrjTracking/index.js';
import AddPrjTracking from '../../ProjectTracking/addPrjTracking/index.js';
import Lodash from 'lodash'

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

  const [isAddBtnShow, setIsAddBtnShow] = useState(false) // 是否显示新增按钮

  // const latestDateRangeRef = useRef([]) //最新周日期区间

  const [addModal, setAddModal] = useState({
    visible: false,
    record: {},
    cycle: 0,
  }); //新增按钮——弹窗



  //初始化按钮状态
  useEffect(() => {
    if (trackingData.length !== 0) {
      judgeIsAddBtnShow()
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
    return () => { };
  }, [xmid, JSON.stringify(trackingData)]);

  //项目跟踪块
  const getTrackingItem = (
    { XMZQ = '--', DQZT = '--', DQJD = '--', KSSJ, JSSJ },
    isActive = false,
    index,
  ) => {
    const latestWeek = XMZQ === trackingData[trackingData.length - 1].XMZQ;
    const fontColor =
      DQZT === '低风险'
        ? '#05BEFE'
        : DQZT === '中风险'
          ? '#f9a812'
          : DQZT === '高风险'
            ? '#FF2F31'
            : DQZT === '延期'
              ? '#FF2F31'
              : '#3361ff';
    const bgColor =
      DQZT === '低风险'
        ? '#05BEFE1A'
        : DQZT === '中风险'
          ? '#F9A8121A'
          : DQZT === '高风险'
            ? '#FF2F311A'
            : DQZT === '延期'
              ? '#FF2F311A'
              : '#3361FF1A';
    const getRiskIcon = zt => {
      return (
        <div className="icon-wrapper" style={{ backgroundColor: bgColor }}>
          {zt === '进度正常' ? (
            <i className="iconfont icon-hourglass" />
          ) : zt === '延期' ? (
            <i className="iconfont icon-delay" />
          ) : (
            <i className="iconfont icon-alarm" style={{ color: fontColor }} />
          )}
        </div>
      );
    };

    return (
      <div
        className="tracking-item"
        key={XMZQ}
        style={isActive ? { borderColor: '#3361ff' } : {}}
        onClick={() => handleStepChange(XMZQ, index)}
      >
        <div className="top">
          项目第{XMZQ}周{getRiskIcon(DQZT)}
          <span style={latestWeek ? { color: '#303133' } : {}}>{DQZT}</span>
        </div>
        <div className="rate">
          当前进度：<span style={latestWeek ? { color: fontColor } : {}}>{DQJD}</span>
        </div>
        <div className="date">
          {KSSJ ? moment(String(KSSJ)).format('YYYY.MM.DD') : '-.-.-'} -{' '}
          {JSSJ ? moment(String(JSSJ)).format('YYYY.MM.DD') : '-.-.-'}
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
    let currentIndex = data.findIndex(x => x.XMZQ === v);
    if (data.length >= 3) {
      if (
        currentIndex >= 1 &&
        currentIndex < data.length - 1 &&
        v !== data[data.length - 1].XMZQ &&
        v !== data[data.length - 2].XMZQ
      ) {
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
      if (
        currentIndex - 1 >= 0 &&
        currentIndex < data.length - 1 &&
        v !== data[data.length - 1].XMZQ &&
        v !== data[data.length - 2].XMZQ
      ) {
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

  /** 进度及报告填写 hover列表 */
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

  /** 判断是否显示新增按钮 */
  const judgeIsAddBtnShow = () => {
    if (!Lodash.isEmpty(trackingData)) {
      const latestItem = trackingData[trackingData.length - 1]
      if (latestItem.KSSJ && latestItem.JSSJ) {
        const { KSSJ, JSSJ } = latestItem
        // const startDate = String(KSSJ)
        const endDate = String(JSSJ)
        const currentDate = new Date();
        const formattedEndDate = new Date(endDate.substring(0, 4), endDate.substring(4, 6) - 1, endDate.substring(6, 8));
        if (currentDate > formattedEndDate) {
          setIsAddBtnShow(true) // 如果日期不在当前时间内
        } else {
          setIsAddBtnShow(false)
        }
      }
    }
  }

  /** 点击新增按钮 */
  const addBtnClickHandle = () => {
    const latestItem = Lodash.cloneDeep(trackingData[trackingData.length - 1])

    const currentDate = new Date(); // 获取当前时间
    const currentDay = currentDate.getDay(); // 获取当前时间的星期几，0 表示星期日，1 表示星期一

    // 获取当前时间所在的周一的日期
    const firstDayOfWeek = new Date(currentDate.getTime() - (currentDay - 1) * 24 * 60 * 60 * 1000);
    const formattedFirstDay = `${firstDayOfWeek.getFullYear()}${(firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}${firstDayOfWeek.getDate().toString().padStart(2, '0')}`;

    // 获取当前时间所在的周日的日期
    const lastDayOfWeek = new Date(currentDate.getTime() + (7 - currentDay) * 24 * 60 * 60 * 1000);
    const formattedLastDay = `${lastDayOfWeek.getFullYear()}${(lastDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}${lastDayOfWeek.getDate().toString().padStart(2, '0')}`;

    latestItem.KSSJ = formattedFirstDay
    latestItem.JSSJ = formattedLastDay
    latestItem.BZGZNR = latestItem.XZGZAP
    latestItem.XZGZAP = ''
    latestItem.ZYSXSM = ''
    latestItem.DQZT = ''
    latestItem.DQJD = ''

    setAddModal({ visible: true, record: latestItem, cycle: latestItem.XMZQ + 1 })
  }

  //底部信息盒子
  const getBottomBox = x => {
    const { DQJD = '0%', DQZT = '--', ZYSXSM = '--', BZGZNR = '--', XZGZAP = '--', XMZQ } = x;
    const latestWeek = XMZQ === trackingData[trackingData.length - 1].XMZQ;
    const fontColor = !latestWeek
      ? '#909399'
      : DQZT === '低风险'
        ? '#05BEFE'
        : DQZT === '中风险'
          ? '#f9a812'
          : DQZT === '高风险'
            ? '#FF2F31'
            : DQZT === '延期'
              ? '#FF2F31'
              : '#3361ff';
    return (
      <div className="bottom-box">
        <div className="title">
          项目进度概况
          {isXMJL && (
            <div
              className="icon-box"
              onClick={() => {
                setEditModal({ visible: true, record: x, cycle: XMZQ })
              }}
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
                  strokeColor={fontColor}
                  format={p => (
                    <span
                      style={{
                        color: fontColor,
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
              <div className="value" style={{ color: fontColor }}>
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


  if (trackingData.length === 0) return null;
  return (
    <div className="prj-tracking-box">
      {/*新增——项目信息弹窗*/}
      {addModal.visible && (
        <AddPrjTracking
          record={addModal.record}
          cycle={addModal.cycle}
          getTableData={getTrackingData}
          contractSigningVisible={addModal.visible}
          closeContractModal={() => setAddModal(p => ({ ...p, visible: false }))}
        />
      )}

      {/*编辑——项目跟踪信息弹窗*/}
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
        {/* <Popover
          placement="bottomRight"
          title={null}
          content={popoverContent}
          overlayClassName="btn-more-content-popover"
        >
          <div className="icon-box">
            <i className="iconfont icon-file-fillout" />
            <span>进度及报告填写</span>
          </div>
        </Popover> */}

        {isXMJL && isAddBtnShow &&
          <div className="icon-box" onClick={addBtnClickHandle}>
            <Icon type='plus-circle' style={{ fontSize: 14, marginRight: 5, color: '#3361ff' }}></Icon>
            <span>新增</span>
          </div>
        }
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
          .map((x, i) => getTrackingItem(x, activeKey === x.XMZQ, i))}
      </div>
      {getBottomBox(trackingData.find(x => x.XMZQ === activeKey) ?? {})}
    </div>
  );
}
