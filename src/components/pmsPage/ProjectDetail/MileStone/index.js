import React, { useEffect, useState } from 'react';
import { Button, Popover, Steps, Tooltip } from 'antd';
import overallRateImg from '../../../../assets/projectDetail/overall-rate.png';
import {
  FetchQueryLiftcycleMilestone,
  FetchQueryLifecycleStuff,
} from '../../../../services/pmsServices/index';
import lastBtn from '../../../../assets/projectDetail/last-milestone.png';
import nextBtn from '../../../../assets/projectDetail/next-milestone.png';
import moment from 'moment';

const { Step } = Steps;

export default function MileStone(props) {
  const { xmid = -1 } = props;
  const [currentStep, setCurrentStep] = useState(0); //当前步骤
  const [itemWidth, setItemWidth] = useState('30.53%'); //块宽度
  const [mileStoneData, setMileStoneData] = useState([]); //里程碑数据-全部数据
  const [mileStoneDataList, setMileStoneDataList] = useState([]); //里程碑数据-切割后展示用
  const [initIndex, setInitIndex] = useState(-1); //初始当前里程碑index
  const [lastBtnVisible, setLastBtnVisible] = useState(false); //上一个按钮显示
  const [nextBtnVisible, setNextBtnVisible] = useState(false); //下一个按钮显示

  //防抖定时器
  let timer = null;

  useEffect(() => {
    if (xmid !== -1) {
      getMileStoneData();
    }

    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);
  const getMileStoneData = () => {
    //所有里程碑
    FetchQueryLiftcycleMilestone({
      xmmc: Number(xmid),
      cxlx: 'ALL',
    })
      .then(res => {
        if (res?.success) {
          let data = [...res.record];
          let currentIndex = -1;
          //当前里程碑 - 添加 isCurrent，判断是否为当前里程碑
          FetchQueryLiftcycleMilestone({
            xmmc: Number(xmid),
            cxlx: 'SINGLE',
          })
            .then(r => {
              if (r?.success) {
                data.forEach((x, i) => {
                  x.isCurrent = x.lcbid === r.record[0].lcbid;
                  currentIndex = i;
                  setInitIndex(i);
                });
                //里程碑事项数据 - 事项分类到各个里程碑的 itemData中
                FetchQueryLifecycleStuff({
                  xmmc: Number(xmid),
                  cxlx: 'ALL',
                })
                  .then(res => {
                    if (res?.success) {
                      data.forEach(item => {
                        let arr = [];
                        res.record?.forEach(x => {
                          if (item.lcbid === x.lcbid) {
                            arr.push(x);
                          }
                        });
                        item.itemData = arr;
                      });
                      // console.log('🚀 ~ file: index.js ~ line 69 ~ getData ~ data', data);
                      setMileStoneData(p => [...data]);
                      if (data.length >= 5) {
                        if (currentIndex - 2 >= 0 && currentIndex + 2 <= data.length) {
                          setMileStoneDataList(p => [
                            ...data.slice(currentIndex - 2, currentIndex + 2),
                          ]);
                          setCurrentStep(2);
                          setLastBtnVisible(true);
                          setNextBtnVisible(true);
                        } else if (currentIndex < 2) {
                          setMileStoneDataList(p => [...data.slice(0, 5)]);
                          setCurrentStep(currentIndex);
                          setNextBtnVisible(true);
                        } else {
                          setLastBtnVisible(true);
                          setMileStoneDataList(p => [...data.slice(data.length - 5, data.length)]);
                          if (currentIndex === data.length - 2) {
                            setCurrentStep(3);
                          }
                          if (currentIndex === data.length - 1) {
                            setCurrentStep(4);
                          }
                        }
                      } else {
                        setMileStoneDataList(p => [...data]);
                        setCurrentStep(currentIndex);
                      }
                    }
                  })
                  .catch(e => {
                    console.error('FetchQueryLifecycleStuff', e);
                  });
              }
            })
            .catch(e => {
              console.error('FetchQueryLiftcycleMilestone', e);
            });
        }
      })
      .catch(e => {
        console.error('FetchQueryLiftcycleMilestone', e);
      });
  };
  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };
  //屏幕宽度变化触发
  const resizeUpdate = e => {
    const fn = () => {
      let w = e.target.innerWidth; //屏幕宽度
      // console.log('🚀 ~ file: index.js ~ line 21 ~ resizeUpdate ~ w', w);
      if (w < 1750) {
        setItemWidth('30.53%');
      } else if (w < 2040) {
        setItemWidth('22.05%');
      } else if (w < 2350) {
        setItemWidth('17.5%');
      } else if (w < 2660) {
        setItemWidth('14.34%');
      } else if (w < 2970) {
        setItemWidth('12.143%');
      } else if (w < 3280) {
        setItemWidth('10.531%');
      } else if (w < 3590) {
        setItemWidth('9.3%');
      } else {
        setItemWidth('8.4%'); //11个
      }
    };
    debounce(fn, 200);
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = width => {
    let arr = [];
    for (let i = 0; i < 11; i++) {
      //每行最多n=8个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  const handleStepChange = v => {
    console.log('handleStepChange', v);
    setCurrentStep(v);
  };

  const getRiskTag = data => {
    const riskPopoverContent = data => {
      data = [
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 2,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
        {
          fl: '标题1',
          BT: '标题1-1',
          NR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          CLNR:
            '处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容处理内容描述文字处理内容描述文字处理内容',
          status: 1,
        },
      ];
      const getItem = (label, content) => {
        return (
          <div className="content">
            <span className="label">{label}：</span>
            <span>{content}</span>
          </div>
        );
      };
      return (
        <div className="list">
          {data.map((x, i) => (
            <div className="item" key={i}>
              <div className="top">
                <div className="left-bar"></div>
                {x.BT}
                {x.status === 1 ? (
                  <div className="handled-tag">
                    <div className="dot"></div>
                    已处理
                  </div>
                ) : (
                  <div className="unhandled-tag">
                    <div className="dot"></div>
                    未处理
                  </div>
                )}
              </div>
              {getItem('风险标题', x.NR || '')}
              {getItem('风险内容', x.NR || '')}
              {getItem('处理内容', x.CLNR || '')}
            </div>
          ))}
        </div>
      );
    };
    return (
      <Popover
        placement="rightBottom"
        title={null}
        content={riskPopoverContent(data)}
        overlayClassName="risk-content-popover"
      >
        <div className="risk-tag">有风险</div>
      </Popover>
    );
  };
  const reoprMoreCotent = (
    <div className="list">
      <div
        className="item"
        onClick={() => {
          // setEditingIndex(id);
          // setDrawerVisible(true);
        }}
      >
        选项123
      </div>
      <div
        className="item"
        onClick={() => {
          // handleMsgDelete(id, content);
        }}
      >
        选项234
      </div>
    </div>
  );
  const getItem = () => {
    const getRow = () => {
      return (
        <div className="bottom-row">
          <i className="iconfont circle-reduce" />
          {/* <i className="iconfont circle-check" /> */}
          <Tooltip title={'需求文档'}>
            <span>需求文档</span>
          </Tooltip>
          <div className="opr-btn">上传</div>
          {/* <div className="opr-more">
            <div className="reopr-btn">重新上传</div>
            <Popover
              placement="bottom"
              title={null}
              content={reoprMoreCotent}
              overlayClassName="btn-more-content-popover"
            >
              <div className="reopr-more">
                <i className="iconfont icon-more2" />
              </div>
            </Popover>
          </div> */}
        </div>
      );
    };
    return (
      <div className="item" style={{ width: itemWidth }}>
        <div className="item-top">需求设计需求设计需求设计需求设计需求设计需求设计</div>
        <div className="item-bottom">
          {getRow()}
          {getRow()}
          {getRow()}
          {getRow()}
        </div>
      </div>
    );
  };
  //获取里程碑状态
  const getStatus = zt => {
    if (zt === '1') return 'wait';
    else if (zt === '2') return 'process';
    else if (zt === '3') return 'finish';
    // else return 'error';
  };
  const stepSwitch = txt => {
    // let data = [...mileStoneData];
    // if (txt === 'last') {
    //   if (data.length >= 5) {
    //     if (initIndex - 2 >= 0 && initIndex + 2 <= data.length) {
    //       setMileStoneDataList(p => [...data.slice(initIndex - 2, initIndex + 2)]);
    //       setCurrentStep(2);
    //       setLastBtnVisible(true);
    //       setNextBtnVisible(true);
    //     } else if (initIndex < 2) {
    //       setMileStoneDataList(p => [...data.slice(0, 5)]);
    //       setCurrentStep(initIndex);
    //       setNextBtnVisible(true);
    //     } else {
    //       setLastBtnVisible(true);
    //       setMileStoneDataList(p => [...data.slice(data.length - 5, data.length)]);
    //       if (initIndex === data.length - 2) {
    //         setCurrentStep(3);
    //       }
    //       if (initIndex === data.length - 1) {
    //         setCurrentStep(4);
    //       }
    //     }
    //   } else {
    //     setMileStoneDataList(p => [...data]);
    //     setCurrentStep(initIndex);
    //     setLastBtnVisible(false);
    //     setNextBtnVisible(false);
    //   }
    // }
  };
  return (
    <div className="mile-stone-box">
      <div className="top-box">
        项目里程碑
        <div className="overall-rate">
          <img src={overallRateImg} alt="" />
          <span>项目整体进度：</span>
          <span className="rate">31%</span>
        </div>
      </div>
      <div className="middle-box">
        {lastBtnVisible && (
          <a>
            <img className="last-milestone" src={lastBtn} alt="" onClick={stepSwitch('last')} />
          </a>
        )}
        {nextBtnVisible && (
          <a>
            <img className="next-milestone" src={nextBtn} alt="" onClick={stepSwitch('next')} />
          </a>
        )}

        <Steps type="navigation" size="small" current={currentStep} onChange={handleStepChange}>
          {mileStoneDataList?.map(step => (
            <Step
              title={step.lcbmc}
              subTitle={getRiskTag()}
              // status={getStatus(step.zt)}
              description={
                step.lcbmc === '项目付款'
                  ? ''
                  : moment(step.kssj).format('YYYY-MM-DD') +
                    '至' +
                    moment(step.jssj).format('MM-DD')
              }
            />
          ))}
        </Steps>
      </div>
      <div className="bottom-box">
        <div className="left-box">
          <div className="top">
            <div className="circle">
              <div className="dot"></div>
            </div>
            项目实施
            <div className="rate-tag">进度50%</div>
          </div>
          <div className="middle">
            <div className="current-plan">现计划：2023-04-04至04-08</div>
            <div className="original-plan">原计划：2023-04-04至04-08</div>
            <div className="remarks">(延迟16天，修改一次)</div>
          </div>
          <div className="bottom">
            <span className="botto-label">项目风险：</span>
            <div className="bottom-risk">
              <div className="risk-tag">风险bt1</div>
              <div className="risk-tag">风险bt2</div>
              <div className="risk-tag">风险bt3</div>
              <Button>
                <span>+</span>添加
              </Button>
            </div>
          </div>
        </div>
        <div className="right-box">
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getItem()}
          {getAfterItem(itemWidth)}
        </div>
      </div>
    </div>
  );
}
