import React, { useEffect, useState } from 'react';
import { Button, message, Popover, Steps, Tooltip } from 'antd';
import overallRateImg from '../../../../assets/projectDetail/overall-rate.png';
import {
  FetchQueryLiftcycleMilestone,
  FetchQueryLifecycleStuff,
  CreateOperateHyperLink,
} from '../../../../services/pmsServices/index';
import lastBtn from '../../../../assets/projectDetail/last-milestone.png';
import nextBtn from '../../../../assets/projectDetail/next-milestone.png';
import moment from 'moment';
import ItemBtn from './ItemBtn';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

const { Step } = Steps;

export default function MileStone(props) {
  const { xmid = -1, prjData = {}, getPrjDtlData, setIsSpinning, isLeader } = props;
  const { risk = [], member = [], prjBasic = [] } = prjData;
  const [currentStep, setCurrentStep] = useState(0); //当前步骤
  const [itemWidth, setItemWidth] = useState('30.53%'); //块宽度
  const [mileStoneData, setMileStoneData] = useState([]); //里程碑数据-全部数据
  const [initIndex, setInitIndex] = useState(0); //初始当前里程碑index
  const [lastBtnVisible, setLastBtnVisible] = useState(false); //上一个按钮显示
  const [nextBtnVisible, setNextBtnVisible] = useState(false); //下一个按钮显示
  const [startIndex, setStartIndex] = useState(0); //切割开始index
  const [endIndex, setEndIndex] = useState(5); //切割结束index
  const [riskUrl, setRiskUrl] = useState(''); //风险弹窗
  const [riskVisible, setRiskVisible] = useState(false); //风险弹窗
  const [riskTxt, setRiskTxt] = useState(''); //风险弹窗
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  //防抖定时器
  let timer = null;

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('prjMileStoneResize', resizeUpdate);
    window.dispatchEvent(new Event('prjMileStoneResize', { bubbles: true, composed: true })); //刷新时能触发resize

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('prjMileStoneResize', resizeUpdate);
      clearTimeout(timer);
      setLastBtnVisible(false);
      setNextBtnVisible(false);
    };
  }, []);

  useEffect(() => {
    if (xmid !== -1) {
      getMileStoneData();
    }
    return () => {};
  }, [xmid]);

  //获取里程碑数据
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
                  if (x.lcbid === r.record[0].lcbid) {
                    currentIndex = i;
                    // console.log(
                    //   '🚀 ~ file: index.js ~ line 75 ~ data.forEach ~ currentIndex',
                    //   currentIndex,
                    // );
                  }
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
                        const groupBy = arr => {
                          let dataArr = [];
                          arr.map(mapItem => {
                            if (dataArr.length === 0) {
                              dataArr.push({ swlx: mapItem.swlx, swItem: [mapItem] });
                            } else {
                              let res = dataArr.some(item => {
                                //判断相同swlx，有就添加到当前项
                                if (item.swlx === mapItem.swlx) {
                                  item.swItem.push(mapItem);
                                  return true;
                                }
                              });
                              if (!res) {
                                //如果没找相同swlx添加一个新对象
                                dataArr.push({ swlx: mapItem.swlx, swItem: [mapItem] });
                              }
                            }
                          });
                          return dataArr;
                        };
                        item.itemData = groupBy(arr);
                      });
                      // console.log('🚀 ~ file: index.js ~ line 69 ~ getData ~ data', data);
                      setMileStoneData(p => [...data]);
                      setIsSpinning(false);
                      setCurrentStep(currentIndex);
                      if (data.length >= 5) {
                        if (currentIndex - 2 >= 0 && currentIndex + 2 < data.length) {
                          setStartIndex(currentIndex - 2);
                          setInitIndex(currentIndex - 2);
                          setEndIndex(currentIndex + 2);
                          // setCurrentStep(2);
                        } else if (currentIndex < 2) {
                          setStartIndex(0);
                          setInitIndex(0);
                          setEndIndex(5);
                          // setCurrentStep(currentIndex);
                        } else {
                          setInitIndex(data.length - 5);
                          setStartIndex(data.length - 5);
                          setEndIndex(data.length);
                          // if (currentIndex === data.length - 2) {
                          //   setCurrentStep(3);
                          // }
                          // if (currentIndex === data.length - 1) {
                          //   setCurrentStep(4);
                          // }
                        }
                      } else {
                        setInitIndex(0);
                        setStartIndex(0);
                        setEndIndex(data.length);
                      }
                      if (data.length > 5) {
                        if (currentIndex - 2 >= 0 && currentIndex < data.length - 2) {
                          setLastBtnVisible(true);
                          setNextBtnVisible(true);
                          console.log(1);
                        } else if (currentIndex < 2) {
                          setLastBtnVisible(false);
                          setNextBtnVisible(true);
                          console.log(2);
                        } else {
                          setNextBtnVisible(false);
                          setLastBtnVisible(true);
                        }
                      } else {
                        setLastBtnVisible(false);
                        setNextBtnVisible(false);
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
    // console.log('handleStepChange', v);
    setCurrentStep(v);
  };

  const getRiskTag = data => {
    const riskPopoverContent = data => {
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
            <div className="item" key={x.ID}>
              <div className="top">
                <div className="left-bar"></div>
                标题{i + 1}
                {x.ZT === 2 && (
                  <div className="handled-tag">
                    <div className="dot"></div>
                    已处理
                  </div>
                )}
                {x.ZT === 1 && (
                  <div className="unhandled-tag">
                    <div className="dot"></div>
                    未处理
                  </div>
                )}
              </div>
              {getItem('风险标题', x.FXBT || '')}
              {getItem('风险内容', x.FXNR || '')}
              {getItem('处理内容', x.CLNR || '')}
            </div>
          ))}
        </div>
      );
    };
    if (data.length === 0) return '';
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

  const getItem = item => {
    return (
      <div className="item" style={{ width: itemWidth }} key={item.swlx}>
        <div className="item-top">{item.swlx}</div>
        <div className="item-bottom">
          {item.swItem?.map((x, i) => (
            <div className="bottom-row" style={x.zxqk === ' ' ? {} : { color: '#3361ff' }} key={i}>
              {x.zxqk === ' ' ? (
                <i className="iconfont circle-reduce" />
              ) : (
                <i className="iconfont circle-check" />
              )}
              <Tooltip title={x.sxmc}>
                <span>{x.sxmc}</span>
              </Tooltip>
              <ItemBtn item={x} xmmc={prjBasic?.XMMC || -1} xmbh={prjBasic?.XMBM || -1} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  //获取里程碑状态
  const getStatus = zt => {
    // console.log('🚀 ~ file: index.js ~ line 288 ~ getStatus ~ zt', zt);
    if (zt === '1') return 'wait';
    else if (zt === '2') return 'process';
    else if (zt === '3') return 'finish';
    else return 'process';
  };
  //切换里程碑
  const stepSwitch = txt => {
    let data = [...mileStoneData];
    let st = 0;
    let ed = 5;
    let init = initIndex;
    if (txt === 'last') {
      if (startIndex - 1 === 0) {
        st = 0;
        ed = 5;
        setLastBtnVisible(false);
        setInitIndex(0);
      } else {
        st = startIndex - 1;
        ed = endIndex - 1;
        setInitIndex(init - 1);
      }
    } else {
      if (endIndex + 1 === data.length) {
        if (data.length >= 5) {
          st = data.length - 5;
          setInitIndex(data.length - 5);
        } else {
          st = 0;
          setInitIndex(0);
        }
        ed = data.length;
        setNextBtnVisible(false);
      } else {
        st = startIndex + 1;
        ed = endIndex + 1;
        setInitIndex(init + 1);
      }
    }
    setLastBtnVisible(st > 0);
    setNextBtnVisible(ed < data.length);
    setStartIndex(st);
    // console.log('🚀 ~ file: index.js ~ line 369 ~ stepSwitch', st, ed);
    setEndIndex(ed);
  };
  //高亮的里程碑数据
  const hLMileStone = mileStoneData[currentStep] || [];
  //日期格式
  const dateFormat = (kssj, jssj) =>
    moment(kssj).format('YYYY-MM-DD') + '至' + moment(jssj).format('MM-DD');
  const getDateDiff = item => {
    return `（${
      moment(item.ycjssj).diff(moment(item.jssj), 'day') > 0 ||
      moment(item.yckssj).diff(moment(item.kssj), 'day') > 0
        ? '提前' +
          (moment(item.ycjssj).diff(moment(item.jssj), 'day') >
          moment(item.yckssj).diff(moment(item.kssj), 'day')
            ? moment(item.ycjssj).diff(moment(item.jssj), 'day')
            : moment(item.yckssj).diff(moment(item.kssj), 'day'))
        : '延迟' +
          (moment(item.jssj).diff(moment(item.ycjssj), 'day') >
          moment(item.kssj).diff(moment(item.yckssj), 'day')
            ? moment(item.jssj).diff(moment(item.ycjssj), 'day')
            : moment(item.kssj).diff(moment(item.yckssj), 'day'))
    }天，修改${item.xgcs}次）`;
  };
  const handleRisk = (item, type = 'ADD') => {
    // console.log("🚀 ~ file: index.js ~ line 380 ~ handleRisk ~ item", item)
    let params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'TFX_JBXX',
      operateName: 'TFX_JBXX_ADD',
      parameter: [
        {
          name: 'GLXM',
          value: item.XMID || xmid,
        },
        {
          name: 'GLLCB',
          value: item.GLLCBID || item.lcbid,
        },
      ],
      userId: LOGIN_USER_INFO.loginName,
    };
    let txt = '添加风险';
    if (type === 'MOD') {
      txt = '处理风险';
      params = {
        attribute: 0,
        authFlag: 0,
        objectName: 'TFX_JBXX',
        operateName: 'TFX_JBXX_MOD',
        parameter: [
          {
            name: 'ID',
            value: item.ID,
          },
        ],
        userId: LOGIN_USER_INFO.loginName,
      };
    }
    setRiskTxt(txt);
    setRiskVisible(true);
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          setRiskUrl(url);
        }
      })
      .catch(error => {
        console.error(!error.success ? error.message : error.note);
      });
  };
  //成功回调
  const onSuccess = name => {
    message.success(name + '成功');
    getPrjDtlData();
    getMileStoneData();
    setRiskVisible(false);
  };
  const getBottomBox = () => {
    const arr = [];
    member.forEach(x => {
      arr.push(x.RYID);
    });
    if (arr.includes(String(LOGIN_USER_INFO.id)) || isLeader)
      return (
        <div className="bottom-box">
          <div className="left-box">
            <div className="top">
              <div className="circle">
                <div className="dot"></div>
              </div>
              {hLMileStone.lcbmc}
              <div className="rate-tag">进度{hLMileStone.jd}</div>
            </div>
            {hLMileStone.lcbmc === '项目付款' ? (
              ''
            ) : (
              <div className="middle">
                <div className="current-plan">
                  现计划：{dateFormat(hLMileStone.kssj, hLMileStone.jssj)}
                </div>
                <div className="original-plan">
                  原计划：{dateFormat(hLMileStone.yckssj, hLMileStone.ycjssj)}
                </div>
                <div className="remarks">{getDateDiff(hLMileStone)}</div>
              </div>
            )}
            <div className="bottom">
              <span className="bottom-label">项目风险：</span>
              <div className="bottom-risk">
                {risk
                  .filter(x => x.GLLCBID === hLMileStone.lcbid)
                  ?.map(x => (
                    <div>
                      <div className="risk-tag" key={x.ID} onClick={() => handleRisk(x, 'MOD')}>
                        {x.FXBT}
                      </div>
                    </div>
                  ))}
                <Button size="small" onClick={() => handleRisk(hLMileStone)}>
                  <span>+</span>添加
                </Button>
              </div>
            </div>
          </div>
          <div className="right-box">
            {hLMileStone?.itemData?.map(x => getItem(x))}
            {getAfterItem(itemWidth)}
          </div>
        </div>
      );
    return '';
  };
  const riskModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    width: '670px',
    height: '400px',
    title: riskTxt,
    style: { top: '67px' },
    visible: riskVisible,
    footer: null,
  };
  return (
    <div className="mile-stone-box">
      {/*风险信息修改弹窗*/}
      {riskVisible && (
        <BridgeModel
          modalProps={riskModalProps}
          onSucess={() => onSuccess(riskTxt)}
          onCancel={() => setRiskVisible(false)}
          src={riskUrl}
        />
      )}
      <div className="top-box">
        项目里程碑
        <div className="overall-rate">
          <img src={overallRateImg} alt="" />
          <span>项目整体进度：</span>
          <span className="rate">{prjBasic.XMJD}%</span>
        </div>
      </div>
      <div className="middle-box">
        {lastBtnVisible && (
          <img className="last-milestone" src={lastBtn} alt="" onClick={() => stepSwitch('last')} />
        )}
        {nextBtnVisible && (
          <img className="next-milestone" src={nextBtn} alt="" onClick={() => stepSwitch('next')} />
        )}

        <Steps
          type="navigation"
          size="small"
          initial={initIndex}
          current={currentStep}
          onChange={handleStepChange}
        >
          {mileStoneData?.slice(startIndex, endIndex)?.map(step => (
            <Step
              key={step.lcbid}
              title={step.lcbmc}
              subTitle={
                <>
                  {step.zt === '4' && (
                    <div className="risk-tag" style={{ fontWeight: 'normal' }}>
                      已逾期
                    </div>
                  )}{' '}
                  {getRiskTag(risk.filter(x => x.GLLCBID === step.lcbid))}
                </>
              }
              status={getStatus(step.zt) || 'process'}
              description={step.lcbmc === '项目付款' ? '' : dateFormat(step.kssj, step.jssj)}
            />
          ))}
        </Steps>
      </div>
      {getBottomBox()}
    </div>
  );
}
