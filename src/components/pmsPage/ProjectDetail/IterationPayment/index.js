import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Empty, message, Modal, Popover, Spin, Tooltip } from 'antd';
import moment from 'moment';
import OprtModal from './OprtModal';
import PaymentProcess from '../../LifeCycleManagement/PaymentProcess';
import {
  CreateOperateHyperLink,
  FetchQueryOwnerWorkflow,
  GetApplyListProvisionalAuth,
} from '../../../../services/pmsServices';
import config from '../../../../utils/config';
import axios from 'axios';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import AssociationContract from '../MileStone/ItemBtn/AssociationContract';
import SoftwarePaymentWHT from '../MileStone/ItemBtn/SoftwarePaymentWHT';
const { api } = config;
const {
  pmsServices: { getStreamByLiveBos },
} = api;

export default function IterationPayment(props) {
  const { xmid, prjData = {}, is_XMJL_FXMJL, funcProps, isLeader = false } = props;
  const { getIterationPayment, getPrjDtlData } = funcProps;
  const { iterationPayment = [], prjBasic = {}, contrastArr = [] } = prjData;
  const [dataShow, setDataShow] = useState([]); //显示数据，6个折叠
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [itemWidth, setItemWidth] = useState('31.851%'); //块宽度
  const [modalData, setModalData] = useState({
    visible: false, //弹窗显隐
    infoId: -1,
    type: 'ADD',
    paymentNum: 1,
  }); //新增迭代付款
  const [lbModal, setLbModal] = useState({
    url: '',
    title: '',
    payment: false,
    rjfyspwht: false,
    xwh: false,
    zbh: false,
    infoId: -1,
    zcb: 0,
    xwhck: false,
    glht: false,
    curYkbid: '',
    fkjhId: -1,
  });
  const [popData, setPopData] = useState({
    splcfq: false, //审批流程发起
    splcck: false, //审批流程查看
    jumpLoading: false,
    fklcLoading: false,
    fklcPopoverVisible: false,
    currentFklcList: [],
    printUrl: '',
  }); //浮窗数据
  let LOGIN_USER_ID = JSON.parse(sessionStorage.getItem('user')).id;

  //防抖定时器
  let timer = null;

  useEffect(() => {
    setDataShow([...iterationPayment.slice(0, getColNum(itemWidth) * 2)]);
    setIsUnfold(false);
    return () => {};
  }, [JSON.stringify(iterationPayment)]);

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);

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
      if (w < 1730) {
        setItemWidth('31.851%');
      } else if (w < 2008) {
        setItemWidth('23.718%');
      } else if (w < 2292) {
        setItemWidth('18.911%');
      } else if (w < 2576) {
        setItemWidth('15.724%');
      } else if (w < 2860) {
        setItemWidth('13.4565%');
      } else if (w < 3145) {
        setItemWidth('11.7605%');
      } else {
        setItemWidth('10.4441%'); //9个
      }
    };
    debounce(fn, 300);
  };

  //获取目前每行几个
  const getColNum = w => {
    switch (w) {
      case '31.851%':
        return 3;
      case '23.718%':
        return 4;
      case '18.911%':
        return 5;
      case '15.724%':
        return 6;
      case '13.4565%':
        return 7;
      case '11.7605%':
        return 8;
      case '10.4441%':
        return 9;
      default:
        return 3;
    }
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = width => {
    let arr = [];
    for (let i = 0; i < 9; i++) {
      //每行最多n=11个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  //付款块
  const getPaymentItem = (item = {}) => {
    // console.log("🚀 ~ file: index.js:81 ~ getPaymentItem ~ item:", item)

    //评估信息修改
    const updateIterationPayment = infoId => {
      setModalData(p => ({ ...p, visible: true, type: 'UPDATE', infoId, paymentNum: item.fkcs }));
    };

    //审批流程按钮
    const getSplcBtn = (item = {}) => {
      //获取Livebos弹窗链接
      const getLink = (objName, oprName, data) => {
        let Loginname = JSON.parse(sessionStorage.getItem('user')).loginName;
        const params = {
          attribute: 0,
          authFlag: 0,
          objectName: objName,
          operateName: oprName,
          parameter: data,
          userId: Loginname,
        };
        CreateOperateHyperLink(params)
          .then((ret = {}) => {
            const { code, url } = ret;
            if (code === 1) {
              setLbModal(p => ({ ...p, url }));
            }
          })
          .catch(error => {
            message.error('livebos链接创建失败', 1);
            console.error(error);
          });
      };
      /**
       * 总成本为 50 万元以下时，审批流程为软件费用审批无合同流程；
       * 为 50-200 万元时，审批流程为信委会议案流程和软件费用审批无合同流程；
       * 为 200 万元以上时，审批流程为信委会议案流程、总办会流程和软件费用审批无合同流程。
       */
      //发起
      const fqContent = () => {
        const rjfyspwht = () => {
          setLbModal(p => ({
            ...p,
            title: '软件费用审批无合同流程' + '发起',
            rjfyspwht: true,
            fkjhId: item.id,
          }));
          // getLink('TLC_LCFQ', 'TLC_LCFQ_RJGMWHT', [
          //   {
          //     name: 'GLXM',
          //     value: Number(xmid),
          //   },
          //   {
          //     name: 'DDFKJH',
          //     value: Number(item.id),
          //   },
          // ]);
          setPopData(p => ({ ...p, splcfq: false }));
        };
        const xwh = () => {
          setLbModal(p => ({
            ...p,
            title: '信委会议案流程' + '发起',
            xwh: true,
          }));
          getLink('LC_XWHYALC', 'LC_XWHYALC_TAFQ', [
            {
              name: 'XMMC',
              value: Number(xmid),
            },
            {
              name: 'DDFKJH',
              value: Number(item.id),
            },
          ]);
          setPopData(p => ({ ...p, splcfq: false }));
        };
        const zbh = () => {
          setLbModal(p => ({
            ...p,
            title: '总办会流程' + '发起',
            zbh: true,
          }));
          getLink('TLC_LCFQ', 'TLC_LCFQ_HYYA', [
            {
              name: 'GLXM',
              value: Number(xmid),
            },
            {
              name: 'DDFKJH',
              value: Number(item.id),
            },
          ]);
          setPopData(p => ({ ...p, splcfq: false }));
        };
        return (
          <div className="list">
            {parseFloat(item.zcb) > 500000 && (
              <div className="item" onClick={xwh} key="信委会议案流程">
                信委会议案流程
              </div>
            )}
            {parseFloat(item.zcb) > 2000000 && (
              <div className="item" onClick={zbh} key="总办会流程">
                总办会流程
              </div>
            )}
            <div className="item" onClick={rjfyspwht} key="软件费用审批无合同流程">
              软件费用审批无合同流程
            </div>
          </div>
        );
      };
      const xwhmcArr = item.xwhlcmc?.split(',') || [];
      const xwhidArr = item.xwhlc?.split(',') || [];
      const xwhArr = xwhmcArr.map((x, i) => ({ name: x, id: xwhidArr[i], isXwh: true }));
      const zbhmcArr = item.zbhlcmc?.split(',') || [];
      const zbhidArr = item.zbhlc?.split(',') || [];
      const zbhArr = zbhmcArr.map((x, i) => ({ name: x, id: zbhidArr[i] }));
      const rjgmwhtlcmcArr = item.rjgmwhtlcmc?.split(',') || [];
      const rjgmwhtidArr = item.rjgmwht?.split(',') || [];
      const rjgmwhtArr = rjgmwhtlcmcArr.map((x, i) => ({ name: x, id: rjgmwhtidArr[i] }));
      const ckDataList = [...xwhArr, ...zbhArr, ...rjgmwhtArr];
      // console.log('🚀 ~ file: index.js:244 ~ ckContent ~ ckDataList:', ckDataList);

      //查看 - 待查
      const ckContent = () => {
        const handleClick = (id, isXwh = false) => {
          if (isXwh) {
            //是否项目经理
            const isMnger = String(LOGIN_USER_ID) === String(prjBasic.XMJLID);
            // console.log(
            //   '🚀 ~ file: index.js:246 ~ handleClick ~ String(LOGIN_USER_ID) === String(prjBasic.XMJLID):',
            //   String(LOGIN_USER_ID),
            //   String(prjBasic.XMJLID),
            // );
            if (isLeader && !isMnger) {
              getLink('LC_XWHYALC', 'TrackWork', [
                {
                  name: 'ID',
                  value: Number(id),
                },
              ]);
              setLbModal(p => ({
                ...p,
                title: '信委会议案流程查看',
                xwhck: true,
              }));
              return;
            }
            setLbModal(p => ({
              ...p,
              title: '信委会议案流程查看',
              xwhck: true,
              url: `/livebos/ShowWorkflow?wfid=${id}&stepId=3&PopupWin=true&HideCancelBtn=true`,
            }));
            return;
          }
          setPopData(p => ({ ...p, splcck: false }));
          window.open(
            'http://10.55.75.188:8080/ZSZQOA/getURLSyncBPM.do?_BPM_FUNCCODE=C_FormSetFormData&_mode=4&_form_control_design=LABEL&_tf_file_id=' +
              id,
          );
        };
        const content = (
          <div className="list">
            {ckDataList.map(c => (
              <div className="item" key={c.id + c.name} onClick={() => handleClick(c.id, c.isXwh)}>
                <Tooltip title={c.name} placement="topLeft">
                  {c.name}
                </Tooltip>
              </div>
            ))}
          </div>
        );
        return (
          <div className="list">
            <Popover
              placement="right"
              title={null}
              content={content}
              trigger="click"
              // visible={popData.splcck}
              // onVisibleChange={v => setPopData(p => ({ ...p, splcck: v }))}
              overlayClassName="document-list-content-popover"
            >
              <div className="item" key="查看" style={{ color: '#3361ff' }}>
                查看
              </div>
            </Popover>
          </div>
        );
      };

      return (
        item.zcb && (
          <Fragment>
            <Popover
              placement="bottom"
              title={null}
              content={fqContent()}
              // trigger="click"
              trigger="hover"
              // visible={popData.splcfq}
              // onVisibleChange={v => setPopData(p => ({ ...p, splcfq: v }))}
              overlayClassName="btn-more-content-popover"
            >
              <div className="opr-btn">发起</div>
            </Popover>
            {ckDataList.length > 0 && (
              <Popover
                placement="bottom"
                title={null}
                content={ckContent()}
                // trigger="click"
                trigger="hover"
                overlayClassName="btn-more-content-popover"
              >
                <div className="reopr-more">
                  <i className="iconfont icon-more2" />
                </div>
              </Popover>
            )}
          </Fragment>
        )
      );
    };

    //付款流程
    const getFklcBtn = (item = {}) => {
      //查看
      const lcck = item => {
        setPopData(p => ({ ...p, fklcLoading: true }));
        FetchQueryOwnerWorkflow({
          paging: -1,
          current: 1,
          pageSize: 9999,
          total: -1,
          sort: 'XQ',
          xmid: Number(item.xmid),
        })
          .then(ret => {
            const { code = 0, record = [] } = ret;
            if (code === 1) {
              const recArr = record.filter(x => x.type === '易快报流程');
              const ykbidArr = item.fklc?.split(',') || [];
              const list = recArr.reduce((acc, cur) => {
                if (cur.url?.includes('YKB:')) {
                  const arr = cur.url?.split(',') || [];
                  const ykbid = arr[0]?.split(':')[1] || '';
                  if (ykbidArr.includes(ykbid)) {
                    return [...acc, cur];
                  }
                  return acc;
                }
              }, []);
              // console.log('🚀 ~ file: index.js:337 ~ list ~ list:', ykbidArr, recArr, list);
              setPopData(p => ({
                ...p,
                fklcLoading: false,
                currentFklcList: list,
              }));
            }
          })
          .catch(error => {
            message.error('流程信息获取失败', 1);
            setPopData(p => ({ ...p, fklcLoading: false }));
            console.error(!error.success ? error.message : error.note);
          });
      };
      //发起
      const lcfq = item => {
        //付款流程
        setLbModal(p => ({ ...p, payment: true, infoId: item.id, zcb: parseFloat(item.zcb) }));
        return;
      };
      //打印
      const lcdy = async item => {
        Modal.confirm({
          title: '提示：',
          content: `将批量打印pdf和图片附件，word文件暂不支持批量打印，麻烦您自行打印！`,
          okText: '打印',
          cancelText: '取消',
          onOk: async () => {
            // setIsSpinning(true);
            const res = await axios({
              method: 'GET',
              url: getStreamByLiveBos,
              params: {
                xmid: item.xmid,
              },
              responseType: 'blob', // 更改responseType类型为 blob
            });
            // console.log('🚀 ~ file: index.js:335 ~ onOk: ~ res:', res);
            // .then(res => {
            let blob = new Blob([res.data], { type: 'application/pdf' });
            const src = URL.createObjectURL(blob);
            setPopData(p => ({ ...p, printUrl: src }));
            //   this.setState(
            //     {
            //       src,
            //     },
            //     () => {
            setTimeout(() => {
              const printIframe = document.getElementById('Iframe');
              printIframe.onload = () => {
                printIframe.contentWindow.print();
              };
            }, 200);
            //     },
            //   );
            // })
            // .catch(err => {
            //   setIsSpinning(false);
            //   message.error('流程打印失败', 1);
            // });
          },
        });
      };

      const reoprMoreCotent = (
        <div className="list">
          <div className="item" onClick={() => lcfq(item)} key="再次发起">
            再次发起
          </div>
          <div className="item" onClick={() => lcdy(item)} key="打印流程附件">
            打印流程附件
          </div>
        </div>
      );
      const fklcNameListContent = () => {
        const jumpToYKB = url => {
          if (url.includes('YKB:')) {
            const arr = url.split(',');
            const id = arr[0].split(':')[1];
            const userykbid = arr[1];
            setPopData(p => ({ ...p, jumpLoading: true }));
            GetApplyListProvisionalAuth({
              id,
              userykbid,
            })
              .then(res => {
                setPopData(p => ({ ...p, jumpLoading: false, fklcPopoverVisible: false }));
                window.open(res.url);
              })
              .catch(e => {
                console.error(e);
                message.error('付款流程查看失败', 1);
                setPopData(p => ({ ...p, jumpLoading: false }));
              });
          }
        };
        //单据编号
        const getDJBH = url => {
          if (url.includes('YKB:')) {
            const arr = url?.split(',') || [];
            if (arr.length > 2) return arr[2];
          }
          return '';
        };

        //关联合同
        const glht = url => {
          if (url.includes('YKB:')) {
            const arr = url.split(',');
            const id = arr[0].split(':')[1];
            setLbModal(p => ({ ...p, glht: true, curYkbid: id }));
          }
        };

        return (
          <Spin tip="跳转中" spinning={popData.jumpLoading} size="small">
            <Spin tip="加载中" spinning={popData.fklcLoading} size="small">
              <div
                className="list"
                style={popData.jumpLoading || popData.fklcLoading ? { minHeight: 40 } : {}}
              >
                {popData.currentFklcList?.map(x => (
                  <div
                    className="item"
                    key={x.subject}
                    onClick={() => jumpToYKB(x.url)}
                    style={{
                      height: 'unset',
                      lineHeight: 'unset',
                      marginBottom: 0,
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: 'unset',
                        lineHeight: 'unset',
                        marginBottom: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip title={x.subject} placement="topLeft" key={x.subject}>
                        <div className="subject">{x.subject}</div>
                      </Tooltip>
                      {this.props.dhtData.length > 1 && (
                        <div
                          className="opr-btn"
                          key="关联合同"
                          onClick={e => {
                            e.stopPropagation();
                            glht(x.url);
                          }}
                        >
                          关联合同
                          <Tooltip
                            title="可将付款流程和具体的合同信息进行关联"
                            overlayStyle={{ maxWidth: 'unset' }}
                          >
                            <Icon type="question-circle-o" style={{ marginLeft: 4 }} />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    {getDJBH(x.url) !== '' && <div className="djbh">{getDJBH(x.url)}</div>}
                  </div>
                ))}
              </div>
            </Spin>
          </Spin>
        );
      };
      if (item.fklc !== null)
        return (
          <div className="opr-more">
            <Popover
              placement="bottomRight"
              title={null}
              content={fklcNameListContent()}
              overlayClassName="document-list-content-popover"
              trigger="click"
              visible={popData.fklcPopoverVisible}
              onVisibleChange={v => setPopData(p => ({ ...p, fklcPopoverVisible: v }))}
            >
              <div className="reopr-btn" onClick={() => lcck(item)}>
                查看
              </div>
            </Popover>
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
          </div>
        );
      return (
        <div className="opr-btn" onClick={() => lcfq(item)}>
          发起
        </div>
      );
    };

    //整数转中文
    const intToChinese = num => {
      if (!Number.isInteger(num)) {
        return '';
      }
      let numArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      let numLimit = ['亿', '万', '']; //设置数字上限
      let numUnit = ['千', '百', '十', ''];
      //num四位数是一个阶段对应 numLimit 每个阶段对应一个 numUnit，每个数字对应numArr。
      num = num.toString();
      num = num.split('');
      while (num.length < numLimit.length * 4) {
        num.unshift('');
      }
      // console.log(num)
      let numLength = num.length;
      let str = '';
      let limit = Math.ceil(numLength / 4);
      // console.log(limit)
      for (let i = 1; i <= limit; i++) {
        let start = (i - 1) * 4;
        let end = i * 4;
        let limitNum = num.slice(start, end);
        // console.log(limitNum)
        for (let j = 0; j < limitNum.length; j++) {
          if (limitNum[j] !== '') {
            let char = numArr[limitNum[j]];
            let unit = numUnit[j];
            if (limitNum[j] == 0) {
              unit = '';
            }
            str += char + unit;
          }
        }
        let hasValue = limitNum.filter(val => {
          return val !== '';
        });
        str = str.replace(/(零{2,})/, '零'); //中间超过两个零替换为一个零
        if (str !== '零') {
          str = str.replace(/(零*)$/, ''); //结尾去掉零
        }
        if (hasValue.length > 0) {
          str += numLimit[i - 1];
        }
      }
      str = str.replace(/^一十/, '十');
      return str;
    };

    return (
      <div className="item" key={item.id}>
        <div className="item-top">
          <div className="title-times">第{intToChinese(Number(item.fkcs))}次</div>
          <div className="title-range">
            {item.kssj && moment(String(item.kssj)).format('YYYY.MM')}&nbsp;-&nbsp;
            {item.jssj && moment(String(item.jssj)).format('YYYY.MM')}
          </div>
        </div>
        <div className="item-bottom">
          <div className="bottom-row" key="评估信息">
            <span>评估信息</span>
            <div className="opr-more">
              <div className="reopr-btn" onClick={() => updateIterationPayment(item.pgxx)}>
                修改
              </div>
            </div>
          </div>
          <div className="bottom-row" key="审批流程">
            <span>审批流程</span>
            {getSplcBtn(item)}
          </div>
          <div className="bottom-row" key="迭代付款流程">
            <span>迭代付款流程</span>
            {getFklcBtn(item)}
          </div>
        </div>
      </div>
    );
  };

  //新增迭代付款
  const handleAddIterationPayment = () => {
    if (prjBasic.RLDJ === undefined || prjBasic.DJLX === undefined) {
      message.warn('请先完成迭代合同信息录入', 1);
    } else {
      setModalData(p => ({
        ...p,
        visible: true,
        type: 'ADD',
        paymentNum: iterationPayment.length,
      }));
    }
  };

  //信委会议案流程发起
  const xwhModalProps = {
    isAllWindow: 1,
    title: lbModal.title,
    width: '1000px',
    height: '680px',
    style: { top: 10 },
    visible: lbModal.xwh,
    footer: null,
  };

  //信委会立案流程查看
  const xwhckModalProps = {
    isAllWindow: 1,
    title: lbModal.title,
    width: '1000px',
    height: '680px',
    style: { top: 10 },
    visible: lbModal.xwhck,
    footer: null,
  };

  //软件费用审批无合同流程发起
  const rjfyspwhtModalProps = {
    isAllWindow: 1,
    title: lbModal.title,
    width: '864x',
    height: '700px',
    style: { top: 10 },
    visible: lbModal.rjfyspwht,
    footer: null,
  };

  //总办会流程发起
  const zbhModalProps = {
    isAllWindow: 1,
    title: lbModal.title,
    width: '864px',
    height: '700px',
    style: { top: 10 },
    visible: lbModal.zbh,
    footer: null,
  };

  if (iterationPayment.length === 0 && !is_XMJL_FXMJL) return null;
  return (
    <div className="iteration-payment-box">
      <OprtModal
        dataProps={{
          xmid,
          modalData,
          rldj: prjBasic.RLDJ,
          djlx: prjBasic.DJLX,
        }}
        funcProps={{
          setModalData,
          getIterationPayment,
        }}
      />
      {/* 付款流程发起弹窗 */}
      <PaymentProcess
        paymentModalVisible={lbModal.payment}
        currentXmid={Number(xmid)}
        currentXmmc={prjBasic.XMMC || ''}
        closePaymentProcessModal={() => setLbModal(p => ({ ...p, payment: false }))}
        onSuccess={() => {
          getIterationPayment();
          setLbModal(p => ({ ...p, payment: false }));
        }}
        projectCode={prjBasic.XMBM || ''}
        isHwPrj={prjBasic.XMLX === '6'}
        ddcgje={Number(prjBasic.DDCGJE ?? 0)}
        ddfkData={{ infoId: lbModal.infoId, zcb: lbModal.zcb }}
        dhtData={contrastArr}
      />
      {/* 信委会议案流程发起 */}
      {lbModal.xwh && (
        <BridgeModel
          modalProps={xwhModalProps}
          onCancel={() => setLbModal(p => ({ ...p, xwh: false }))}
          onSucess={() => {
            message.success('操作成功', 1);
            getIterationPayment();
            setLbModal(p => ({ ...p, xwh: false }));
          }}
          src={lbModal.url}
        />
      )}
      {/* 信委会议案流程查看 */}
      {lbModal.xwhck && (
        <BridgeModel
          modalProps={xwhckModalProps}
          onCancel={() => setLbModal(p => ({ ...p, xwhck: false }))}
          onSucess={() => {
            message.success('操作成功', 1);
            getIterationPayment();
            setLbModal(p => ({ ...p, xwhck: false }));
          }}
          src={lbModal.url}
        />
      )}
      {/* 总办会流程发起 */}
      {lbModal.zbh && (
        <BridgeModel
          modalProps={zbhModalProps}
          onCancel={() => setLbModal(p => ({ ...p, zbh: false }))}
          onSucess={() => {
            message.success('操作成功', 1);
            getIterationPayment();
            setLbModal(p => ({ ...p, zbh: false }));
          }}
          src={lbModal.url}
        />
      )}
      {/* 软件费用审批无合同流程发起 */}
      {/* {lbModal.rjfyspwht && (
        <BridgeModel
          modalProps={rjfyspwhtModalProps}
          onCancel={() => setLbModal(p => ({ ...p, rjfyspwht: false }))}
          onSucess={() => {
            message.success('操作成功', 1);
            getIterationPayment();
            setLbModal(p => ({ ...p, rjfyspwht: false }));
          }}
          src={lbModal.url}
        />
      )} */}
      <SoftwarePaymentWHT
        dataProps={{
          visible: lbModal.rjfyspwht,
          currentXmid: Number(xmid),
          xmbh: prjBasic.XMBM || '',
          FKJHID: lbModal.fkjhId,
        }}
        funcProps={{
          setVisible: v => setLbModal(p => ({ ...p, rjfyspwht: v })),
          onSuccess: () => {
            message.success('操作成功', 1);
            getIterationPayment();
            setLbModal(p => ({ ...p, rjfyspwht: false }));
          },
        }}
      />
      <AssociationContract
        visible={lbModal.glht}
        ykbid={lbModal.curYkbid}
        dhtData={contrastArr}
        refresh={getPrjDtlData}
        setVisible={v => setLbModal(p => ({ ...p, glht: v }))}
      />
      <div className="top-title">
        项目迭代付款{is_XMJL_FXMJL && <span onClick={handleAddIterationPayment}>新增迭代付款</span>}
      </div>
      {iterationPayment.length !== 0 && (
        <div className="content-wrapper">
          <div className="content">
            {dataShow.map(x => getPaymentItem(x))}
            {getAfterItem(itemWidth)}
            {iterationPayment.length === 0 && (
              <Empty
                description="暂无内容"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ width: '100%' }}
              />
            )}
          </div>
        </div>
      )}
      {iterationPayment.length > getColNum(itemWidth) * 2 &&
        (isUnfold ? (
          <>
            <div
              className="more-item-unfold"
              onClick={() => {
                setDataShow([...iterationPayment.slice(0, getColNum(itemWidth) * 2)]);
                setIsUnfold(false);
              }}
            >
              收起
              <i className="iconfont icon-up" />
            </div>
          </>
        ) : (
          <div
            className="more-item"
            onClick={() => {
              setDataShow([...iterationPayment]);
              setIsUnfold(true);
            }}
          >
            展开
            <i className="iconfont icon-down" />
          </div>
        ))}
      <iframe src={popData.printUrl} id="Iframe" style={{ display: 'none' }} />
    </div>
  );
}
