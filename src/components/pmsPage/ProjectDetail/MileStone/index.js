import React, { useEffect, useState } from 'react';
import { Button, message, Popover, Steps, Tooltip } from 'antd';
import overallRateImg from '../../../../assets/projectDetail/overall-rate.png';
import { CreateOperateHyperLink } from '../../../../services/pmsServices/index';
import moment from 'moment';
import ItemBtn from './ItemBtn';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

const { Step } = Steps;

export default function MileStone(props) {
  const {
    xmid = -1,
    prjData = {},
    getPrjDtlData,
    setIsSpinning,
    isLeader,
    isHwSltPrj,
    stateProps = {},
  } = props;
  const {
    currentStep,
    setCurrentStep,
    mileStoneData,
    initIndex,
    setInitIndex,
    lastBtnVisible,
    setLastBtnVisible,
    nextBtnVisible,
    setNextBtnVisible,
    startIndex,
    setStartIndex,
    endIndex,
    setEndIndex,
  } = stateProps;
  const { risk = [], member = [], prjBasic = {}, xmjbxxRecord = [] } = prjData;
  const [itemWidth, setItemWidth] = useState('47.76%'); //块宽度
  const [riskUrl, setRiskUrl] = useState(''); //风险弹窗
  const [riskVisible, setRiskVisible] = useState(false); //风险弹窗
  const [riskTxt, setRiskTxt] = useState(''); //风险弹窗
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [isUnfold, setIsUnfold] = useState(false); //是否展开

  //防抖定时器
  let timer = null;

  //风险弹窗
  const riskModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    width: '670px',
    height: '400px',
    title: riskTxt,
    style: { top: '60px' },
    visible: riskVisible,
    footer: null,
  };

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize
    // console.log('里程碑更新了', xmid, prjBasic);
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
      setLastBtnVisible(false);
      setNextBtnVisible(false);
    };
  }, []);

  useEffect(() => {
    // console.log('里程碑更新了', xmid, prjBasic);
    if (xmid !== -1 && JSON.stringify(prjBasic) !== '{}') {
      // 项目经理初始展开、迭代项目项目里程碑不论谁都初始收起
      // setIsUnfold(
      //   prjBasic.XMJLID === String(LOGIN_USER_INFO.id) && !prjBasic.XMBQ?.includes('迭代项目'),
      // );
      setIsUnfold(prjBasic.XMJLID === String(LOGIN_USER_INFO.id)); //生产版本
    }
    return () => {};
  }, [xmid, JSON.stringify(prjBasic)]);

  //展开、收起
  const handleUnfold = bool => {
    setIsUnfold(bool);
  };

  // 防抖
  const debounce = (fn, waits = 500) => {
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
      if (w < 1440) {
        setItemWidth('47.76%');
      } else if (w < 1730) {
        setItemWidth('47.76%');
      } else if (w < 2021) {
        setItemWidth('30.388%');
      } else if (w < 2312) {
        setItemWidth('23.4%');
      } else if (w < 2603) {
        setItemWidth('18.633%');
      } else if (w < 2894) {
        setItemWidth('15.4852%');
      } else if (w < 3185) {
        setItemWidth('13.2434%');
      } else {
        setItemWidth('11.572%'); //8个
      }
    };
    debounce(fn, 300);
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = width => {
    let arr = [];
    for (let i = 0; i < 11; i++) {
      //每行最多n=11个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  //风险标签
  const getRiskTag = data => {
    const riskPopoverContent = data => {
      const getItem = (label, content) => {
        return (
          <div className="content" kry={label}>
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
                风险{i + 1}
                {x.ZT === '2' && (
                  <div className="handled-tag">
                    <div className="dot"></div>
                    已处理
                  </div>
                )}
                {x.ZT === '1' && (
                  <div className="unhandled-tag">
                    <div className="dot"></div>
                    未处理
                  </div>
                )}
              </div>
              {getItem('风险标题', x.FXBT || '')}
              {getItem('风险内容', x.FXNR || '')}
              {x.ZT !== '1' && getItem('处理内容', x.CLNR || '')}
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

  //刷新数据
  const refresh = () => {
    getPrjDtlData();
  };

  //里程碑块
  const getItem = item => {
    return (
      <div
        className="item"
        // style={{ width: itemWidth }}
        key={item.swlx}
      >
        <div className="item-top">{item.swlx}</div>
        <div className="item-bottom">
          {item.swItem?.map((x, i) => (
            <div className="bottom-row" style={x.zxqk === ' ' ? {} : { color: '#3361ff' }} key={i}>
              {x.zxqk === ' ' ? (
                <i className="iconfont circle-reduce" />
              ) : (
                <i className="iconfont circle-check" />
              )}
              <Tooltip title={x.sxmc} placement="topLeft">
                <span>{x.sxmc}</span>
              </Tooltip>
              <ItemBtn
                xmjbxxRecord={xmjbxxRecord}
                item={x}
                xmmc={prjBasic.XMMC || ''}
                xmbh={prjBasic.XMBM || ''}
                xwhid={
                  isLeader && String(prjBasic.XMJLID) !== String(LOGIN_USER_INFO.id)
                    ? prjBasic.XWHLCID || -1
                    : prjBasic.XWHID || -1
                }
                setIsSpinning={setIsSpinning}
                refresh={refresh}
                isHwSltPrj={isHwSltPrj} //是否硬件入围
                ddcgje={Number(prjBasic.DDCGJE ?? 0)} //单独采购金额
                auth={{
                  isLeader,
                  isMember: (() => {
                    const arr = member.reduce((acc, cur) => {
                      if (cur.RYZT === '1' && cur.RYID !== String(prjBasic.XMJLID))
                        return [...acc, cur.RYID];
                      return acc;
                    }, []);
                    return arr.includes(String(LOGIN_USER_INFO.id));
                  })(),
                  isMnger: String(prjBasic.XMJLID) === String(LOGIN_USER_INFO.id),
                  isFXMJL: (prjBasic.FXMJL?.split(',') || []).includes(String(LOGIN_USER_INFO.id)),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  //获取里程碑状态
  const getStatus = zt => {
    // // console.log('🚀 ~ file: index.js ~ line 288 ~ getStatus ~ zt', zt);
    if (zt === '1') return 'wait';
    else if (zt === '2') return 'process';
    else if (zt === '3') return 'finish';
    else return 'process';
  };

  //切换里程碑 - 按钮触发
  const stepSwitch = txt => {
    let data = [...mileStoneData];
    let st = 0;
    let ed = 3;
    let init = initIndex;
    if (txt === 'last') {
      if (startIndex - 1 === 0) {
        st = 0;
        ed = 3;
        setLastBtnVisible(false);
        setInitIndex(0);
      } else {
        st = startIndex - 1;
        ed = endIndex - 1;
        setInitIndex(init - 1);
      }
    } else {
      if (endIndex + 1 === data.length) {
        if (data.length >= 3) {
          st = data.length - 3;
          setInitIndex(data.length - 3);
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
    // // console.log('🚀 ~ file: index.js ~ line 369 ~ stepSwitch', st, ed);
    setEndIndex(ed);
  };

  //步骤条切换 - 自动触发 - 选中尽量居中
  const handleStepChange = v => {
    setCurrentStep(v);
    setIsUnfold(true);
    let data = [...mileStoneData];
    let currentIndex = v;
    if (data.length >= 3) {
      if (currentIndex - 1 >= 0 && currentIndex + 1 < data.length) {
        setStartIndex(currentIndex - 1);
        setInitIndex(currentIndex - 1);
        setEndIndex(currentIndex + 2); //不包含
      } else if (currentIndex < 1) {
        setStartIndex(0);
        setInitIndex(0);
        setEndIndex(3);
      } else {
        setInitIndex(data.length - 3);
        setStartIndex(data.length - 3);
        setEndIndex(data.length);
      }
    } else {
      setInitIndex(0);
      setStartIndex(0);
      setEndIndex(data.length);
    }
    if (data.length > 3) {
      if (currentIndex - 1 >= 0 && currentIndex < data.length - 1) {
        setLastBtnVisible(true);
        setNextBtnVisible(true);
      } else if (currentIndex < 1) {
        setLastBtnVisible(false);
        setNextBtnVisible(true);
      } else {
        setNextBtnVisible(false);
        setLastBtnVisible(true);
      }
    } else {
      setLastBtnVisible(false);
      setNextBtnVisible(false);
    }
    if (currentIndex - 1 === 0) {
      setLastBtnVisible(false);
    }
    if (currentIndex >= data.length - 2) {
      setNextBtnVisible(false);
    }
  };

  //高亮的里程碑数据
  const hLMileStone = mileStoneData[currentStep] || [];
  //日期格式化
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

  //处理风险
  const handleRisk = (item, type = 'ADD') => {
    // // console.log("🚀 ~ file: index.js ~ line 380 ~ handleRisk ~ item", item)
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
        message.error(riskTxt + '失败', 1);
      });
  };

  //成功回调
  const onSuccess = name => {
    refresh();
    setRiskVisible(false);
    message.success(name + '成功');
  };

  //是否成员或领导
  const isMember = () => {
    const arr = member.filter(x => x.RYZT === '1').map(x => x.RYID);
    return arr.includes(String(LOGIN_USER_INFO.id)) || isLeader;
  };

  //底部盒子jsx
  const getBottomBox = () => {
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
              {Number(hLMileStone.xgcs) > 0 && (
                <>
                  <div className="original-plan">
                    原计划：{dateFormat(hLMileStone.yckssj, hLMileStone.ycjssj)}
                  </div>
                  <div className="remarks">{getDateDiff(hLMileStone)}</div>
                </>
              )}
            </div>
          )}
          <div className="bottom">
            <span className="bottom-label">项目风险：</span>
            <div className="bottom-risk">
              {risk
                .filter(x => x.GLLCBID === hLMileStone.lcbid)
                ?.map(x => (
                  <div key={x.ID}>
                    <Tooltip title={x.FXBT} placement="topLeft">
                      <div className="risk-tag" key={x.ID} onClick={() => handleRisk(x, 'MOD')}>
                        {x.FXBT}
                      </div>
                    </Tooltip>
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
          <span>事项完成度：</span>
          <span className="rate">{prjBasic.XMJD}%</span>
        </div>
      </div>
      <div className="middle-box">
        {/* {lastBtnVisible && (
          <img className="last-milestone" src={lastBtn} alt="" onClick={() => stepSwitch('last')} />
        )}
        {nextBtnVisible && (
          <img className="next-milestone" src={nextBtn} alt="" onClick={() => stepSwitch('next')} />
        )} */}
        {lastBtnVisible && (
          <div className="last-milestone" onClick={() => stepSwitch('last')}>
            <i className="iconfont icon-left" />
          </div>
        )}
        {nextBtnVisible && (
          <div className="next-milestone" onClick={() => stepSwitch('next')}>
            <i className="iconfont icon-right" />
          </div>
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
                  )}
                  {getRiskTag(risk.filter(x => x.GLLCBID === step.lcbid))}
                </>
              }
              status={getStatus(step.zt) || 'process'}
              description={step.lcbmc === '项目付款' ? '' : dateFormat(step.kssj, step.jssj)}
              // className={step.isCurrent ? 'ant-steps-item-active' : ''}
            />
          ))}
        </Steps>
      </div>
      {isUnfold ? (
        <>
          {getBottomBox()}
          <div className="more-item-unfold" onClick={() => handleUnfold(false)}>
            收起
            <i className="iconfont icon-up" />
          </div>
        </>
      ) : (
        <div className="more-item" onClick={() => handleUnfold(true)}>
          展开
          <i className="iconfont icon-down" />
        </div>
      )}
    </div>
  );
}
