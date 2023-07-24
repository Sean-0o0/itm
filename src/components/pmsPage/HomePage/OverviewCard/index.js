import React, { useEffect, useState } from 'react';
import { getAmountFormat } from '..';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_female.png';
import { Dropdown, Menu, message, Modal, Popover, Tooltip } from 'antd';
import { CreateOperateHyperLink, UpdateMessageState } from '../../../../services/pmsServices';
import InterviewScoreModal from '../../DemandDetail/ProjectItems/InterviewScoreModal';
import PaymentProcess from '../../LifeCycleManagement/PaymentProcess';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import EditProjectInfoModel from '../../EditProjectInfoModel';

export default function OverviewCard(props) {
  const [hovered, setHovered] = useState(false);
  const {
    overviewInfo = [],
    userRole = '',
    toDoData = [],
    toDoDataNum = 0,
    reflush,
    dictionary,
    statisticYearData = {},
    setStatisticYearData,
    handleCurYearChange,
  } = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const location = useLocation();
  const { WBRYGW } = dictionary;
  const [paymentModalVisible, setPaymentModalVisible] = useState(false); //付款流程发起弹窗
  const [ryxztxModalVisible, setRyxztxModalVisible] = useState(false); //人员新增提醒发起弹窗
  const [ryxztxUrl, setRyxztxUrl] = useState('#'); //人员新增提醒发起弹窗
  const [currentXmid, setCurrentXmid] = useState(-1); //当前项目id
  const [currentXmmc, setCurrentXmmc] = useState(''); //当前项目名称
  const [currentXqid, setCurrentXqid] = useState('-1'); //当前需求id
  const [currentSwzxid, setCurrentSwzxid] = useState('-1'); //当前需求事务执行id
  const [currentXxid, setCurrentXxid] = useState('-1'); //当前xxid
  const [rlwbData, setRlwbData] = useState({}); //人力外包费用支付 - 付款流程总金额等
  const [projectCode, setProjectCode] = useState('-1'); //当前项目编号
  const [isHwPrj, setIsHwPrj] = useState(false); //是否硬件入围 - 优先判断是否硬件入围
  const [ddcgje, setDdcgje] = useState(undefined); //单独采购金额
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [modalVisible, setModalVisible] = useState({
    wbrymspf: false, //外包人员面试评分
  }); //弹窗显隐

  //人员新增提醒弹窗配置
  const ryxztxModalProps = {
    isAllWindow: 1,
    width: '720px',
    height: '300px',
    title: '人员新增提醒',
    style: { top: '60px' },
    visible: ryxztxModalVisible,
    footer: null,
  };

  //获取招呼语
  const getGreeting = () => {
    let h = new Date().getHours();
    let txt = '';
    if (h < 6) txt = '凌晨';
    else if (h < 9) txt = '早上';
    else if (h < 12) txt = '上午';
    else if (h < 14) txt = '中午';
    else if (h < 17) txt = '下午';
    else if (h < 19) txt = '傍晚';
    else if (h < 22) txt = '晚上';
    else txt = '夜里';
    let greeting = txt + '好！' + LOGIN_USER_INFO.name;
    return greeting;
  };

  //弹窗操作成功
  const handleOperateSuccess = txt => {
    txt && message.success(txt, 1);
    //刷新数据
    reflush();
  };

  //跳转livebos页面
  const jumpToLBPage = tableName => {
    // console.log('openLiveBosModal', tableName);
    if (tableName === '') {
      console.error(`🚀 ~ 该待办事项暂不处理`);
      return;
    }
    window.location.href = `/#/UIProcessor?Table=${tableName}&hideTitlebar=true`;
  };

  //跳转项目详情
  const jumpToProjectDetail = item => {
    window.location.href = `/#/pms/manage/ProjectDetail/${EncryptBase64(
      JSON.stringify({
        routes: [{ name: '个人工作台', pathname: location.pathname }],
        xmid: item.xmid,
      }),
    )}`;
  };

  //付款流程
  const handlePaymentProcess = item => {
    // console.log('handlePaymentProcess', item);
    setPaymentModalVisible(true);
    setProjectCode(item.xmbh);
    // setProjectCode((xmbhData?.filter(x => Number(x.xmid) === Number(item.xmid)))[0]?.xmbh);
    setIsHwPrj(item.xmlx === '6');
    setDdcgje(Number(item.sfbhyj ?? 0));
    setCurrentXmid(item.xmid);
    setCurrentXmmc(item.xmmc);
    setCurrentXxid(item.xxid);
    if (item.kzzd !== '') {
      setRlwbData(JSON.parse(item.kzzd));
    }
  };

  //人员新增提醒
  const handleRyxztx = item => {
    const params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_RYXXGL',
      operateName: 'TRY_XMRY_COMFIRM',
      parameter: [
        {
          name: 'SSXM',
          value: item.xmid,
        },
        {
          name: 'RYMC',
          value: String(LOGIN_USER_INFO.id),
        },
      ],
      userId: String(LOGIN_USER_INFO.loginName),
    };
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          setRyxztxUrl(url);
          setRyxztxModalVisible(true);
        }
      })
      .catch(error => {
        console.error('人员新增提醒', !error.success ? error.message : error.note);
        message.error('人员新增提醒失败', 1);
      });
  };

  //信委会会议结果
  const handleXwhhyjg = item => {
    UpdateMessageState({
      zxlx: 'EXECUTE',
      xxid: item.xxid,
    })
      .then((ret = {}) => {
        const { code = 0, note = '', record = [] } = ret;
        if (code === 1) {
          //刷新数据
          reflush();
          message.success('执行成功', 1);
        }
      })
      .catch(error => {
        message.error('操作失败', 1);
        console.error('信委会会议结果', !error.success ? error.message : error.note);
      });
  };

  //创建需求
  const handleCjxq = item => {
    console.log('🚀 ~ file: index.js:162 ~ handleCjxq ~ item:', item);
    UpdateMessageState({
      zxlx: 'EXECUTE',
      xxid: item.xxid,
    })
      .then((ret = {}) => {
        const { code = 0, note = '', record = [] } = ret;
        if (code === 1) {
          //刷新数据
          reflush();
          // message.success('执行成功', 1);
          window.location.href = `/#/pms/manage/DemandDetail/${EncryptBase64(
            JSON.stringify({
              routes: [{ name: '个人工作台', pathname: location.pathname }],
              xqid: JSON.parse(item.kzzd).XQID,
            }),
          )}`;
        }
      })
      .catch(error => {
        message.error('操作失败', 1);
        console.error('创建需求', !error.success ? error.message : error.note);
      });
  };

  const jumpToEditProjectInfo = item => {
    setFileAddVisible(true);
    setSrc_fileAdd({
      xmid: item.xmid,
      type: true,
      subItemFlag: true,
      subItemFinish: true,
      projectStatus: 'SAVE',
    });
  };

  //外包人员面试评分
  const handleWbrymspf = item => {
    setModalVisible(p => {
      return {
        ...p,
        wbrymspf: true,
      };
    });
    setCurrentXmid(item.xmid);
    if (item.kzzd !== '') {
      // console.log('item.kzzd', JSON.parse(item.kzzd));
      setCurrentSwzxid(JSON.parse(item.kzzd).SWZXID);
      setCurrentXqid(JSON.parse(item.kzzd).XQID);
    }
  };

  //简历分发、提交录用申请
  const jumpToDemandDetail = item => {
    if (item.kzzd !== '') {
      UpdateMessageState({
        zxlx: 'EXECUTE',
        xxid: item.xxid,
      })
        .then((ret = {}) => {
          const { code = 0, note = '', record = [] } = ret;
          if (code === 1) {
            window.location.href = `/#/pms/manage/DemandDetail/${EncryptBase64(
              JSON.stringify({
                routes: [{ name: '个人工作台', pathname: location.pathname }],
                xqid: JSON.parse(item.kzzd).XQID,
                fqrid: JSON.parse(item.kzzd).FQR,
              }),
            )}`;
            reflush();
          }
        })
        .catch(error => {
          message.error('操作失败', 1);
        });
    } else {
      message.error('数据错误，操作失败', 1);
    }
  };

  //自定义报告详情
  const jumpToCustomReportDetail = item => {
    console.log(JSON.parse(item.kzzd));
    if (item.kzzd !== '') {
      window.location.href = `/#/pms/manage/CustomReportDetail/${EncryptBase64(
        JSON.stringify({
          bgid: JSON.parse(item.kzzd).BGID,
          bgmc: JSON.parse(item.kzzd).BGMC,
          routes: [{ name: '个人工作台', pathname: location.pathname }],
        }),
      )}`;
    }
  };

  //获取操作按钮文本
  const getBtnTxt = (txt, sxmc) => {
    if (sxmc === '信委会会议结果') return '确认';
    else if (txt.includes('录入')) return '录入';
    else if (txt.includes('填写')) return '填写';
    else return '处理';
  };

  //按钮点击
  const handleToDo = item => {
    // console.log('handleToDo', item);
    switch (item?.sxmc) {
      //跳转livebos页面
      case '月报填写':
        return jumpToLBPage('ZBYBTX');
      case '流程待处理':
      case '信委会议案被退回':
      case '信委会流程待审批':
      case '信委会议案流程待审批':
        return jumpToLBPage('WORKFLOW_TOTASKS');
      case '信委会议案待上会前审批':
        return jumpToLBPage('V_XWHYALC_LDSP');
      case '信委会议案待上会':
      case '信委会议案待提交领导审批':
        return jumpToLBPage('XWHYAGL');
      case '收款账户供应商维护':
        return jumpToLBPage('View_GYSXX');
      case '周报填写':
        return jumpToLBPage('ZBYBTX');
      case '资本性预算年中录入':
        return jumpToLBPage('V_ZBXYSNZLR');
      case '资本性预算年中录入被退回':
        return jumpToLBPage('V_ZBXYSNZLR');
      case '资本性预算年初录入':
        return jumpToLBPage('V_ZBXYSNCLR');
      case '资本性预算年初录入被退回':
        return jumpToLBPage('V_ZBXYSNCLR');
      case '非资本性预算年中录入':
        return jumpToLBPage('V_FZBXYSNZLR');
      case '非资本性预算年中录入被退回':
        return jumpToLBPage('V_FZBXYSNZLR');
      case '非资本性预算年初录入':
        return jumpToLBPage('V_FZBXYSNCLR');
      case '非资本性预算年初录入被退回':
        return jumpToLBPage('V_FZBXYSNCLR');
      case '信委会流程待处理':
        return jumpToLBPage('WORKFLOW_TOTASKS');

      //特殊处理
      case '付款流程':
      case '合同分期付款':
      case '人力外包费用支付':
        return handlePaymentProcess(item);
      case '人员新增提醒':
        return handleRyxztx(item);
      case '信委会会议结果':
        return handleXwhhyjg(item);
      case '项目信息完善':
        return jumpToEditProjectInfo(item);
      case '预算使用超限':
        return jumpToProjectDetail(item);
      case '外包人员面试评分':
        return handleWbrymspf(item);
      case '提交录用申请':
      case '简历分发':
      case '外包需求简历更新':
        return jumpToDemandDetail(item);
      case '创建需求':
        return handleCjxq(item);
      case '自定义月报填写':
        return jumpToCustomReportDetail(item);

      //暂不处理
      case '外包人员录用信息提交':
        return jumpToLBPage('');
      case '外包项目需求填写':
        return jumpToLBPage('');
      case '里程碑逾期':
        return jumpToLBPage('');

      default:
        console.error(`🚀 ~ 该待办事项名称【${item.sxmc}】尚未配置`);
        return;
    }
  };

  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };

  //待办块
  const getToDoItem = data => {
    return (
      <div>
        {data?.map(item => (
          <div className="todo-card-box">
            <div className="todo-card-title">
              <div className="todo-card-xmmc">{item.xmmc}</div>
              <div className="todo-deal-box">
                <div
                  className="todo-to-deal"
                  onClick={() => {
                    if (Number(item.xxlx) !== 2) {
                      setHovered(false);
                      handleToDo(item);
                    }
                  }}
                >
                  去{getBtnTxt(item.txnr, item.sxmc)}{' '}
                  <i className="iconfont icon-right todo-to-deal-icon" />
                </div>
              </div>
            </div>
            <div className="todo-card-content">
              {Number(item.wdsl) < 0 && (
                <div className="todo-card-status">逾期{Number(item.wdsl) * -1}天</div>
              )}
              <div className="todo-card-txnr">{item.txnr}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleVisibleChange = visible => {
    setHovered(visible);
  };

  //概览块
  const getOverviewItem = ({
    title = '--',
    more = true,
    width = '24%',
    img = '',
    amount = '--',
    percent = '--',
    addNum = '--',
    unit = '',
    fn = false,
    linkTo = false,
  }) => {
    return (
      <div className="overview-item" style={{ width }}>
        <div className="item-top">
          <img
            className="top-img"
            src={require(`../../../../assets/homePage/icon_${img}@2x.png`)}
          />
          {!fn && !linkTo && (
            <div className="top-txt top-txt-link">
              {more ? (
                <Popover
                  title={null}
                  placement="rightTop"
                  trigger="click"
                  visible={hovered}
                  onVisibleChange={handleVisibleChange}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  autoAdjustOverflow={true}
                  content={getToDoItem(toDoData)}
                  overlayClassName="todo-card-content-popover"
                >
                  {title}
                  <i className="iconfont icon-right" />
                </Popover>
              ) : (
                title
              )}
            </div>
          )}
          {fn && (
            <div className="top-txt top-txt-link" onClick={fn}>
              {title}
              {more && <i className="iconfont icon-right" />}
            </div>
          )}
          {linkTo && (
            <div className="top-txt top-txt-link">
              <Link to={linkTo} style={{ color: '#606266FF' }}>
                {title}
                {more && <i className="iconfont icon-right" />}
              </Link>
            </div>
          )}
        </div>
        <div className="item-middle">
          {amount}
          {percent !== '--' && (
            <>
              <span>/</span>
              <span>{percent}%</span>
            </>
          )}
        </div>
        {!['--', 0, '0'].includes(addNum) ? (
          <div className="item-bottom">
            今日新增<span>{addNum}</span>
            {unit}
          </div>
        ) : (
          '' // <div className="item-bottom"></div>
        )}
      </div>
    );
  };

  // 统计年份
  const menu = (
    <Menu>
      {statisticYearData.dropdown?.map(x => (
        <Menu.Item
          key={x.NF}
          onClick={() => {
            if (Number(x.NF) !== statisticYearData.currentYear) {
              setStatisticYearData(p => ({
                ...p,
                currentYear: Number(x.NF),
              }));
              handleCurYearChange(Number(x.NF));
            }
          }}
        >
          {x.NF}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="overview-card-box">
      {/* 外包人员面试评分 */}
      {modalVisible.wbrymspf && (
        <InterviewScoreModal
          visible={modalVisible.wbrymspf}
          setVisible={v => {
            setModalVisible(p => {
              return {
                ...p,
                wbrymspf: v,
              };
            });
          }}
          xqid={Number(currentXqid)}
          reflush={reflush}
          WBRYGW={WBRYGW}
          swzxid={Number(currentSwzxid)}
        />
      )}
      {/* 付款流程发起弹窗 */}
      {paymentModalVisible && (
        <PaymentProcess
          paymentModalVisible={paymentModalVisible}
          fetchQueryLifecycleStuff={() => {}}
          currentXmid={Number(currentXmid)}
          currentXmmc={currentXmmc}
          projectCode={projectCode}
          closePaymentProcessModal={() => setPaymentModalVisible(false)}
          onSuccess={() => {
            UpdateMessageState({
              zxlx: 'EXECUTE',
              xxid: currentXxid,
            })
              .then((ret = {}) => {
                const { code = 0, note = '', record = [] } = ret;
                if (code === 1) {
                  //刷新数据
                  reflush();
                }
              })
              .catch(error => {
                message.error('操作失败', 1);
                console.error('付款流程', !error.success ? error.message : error.note);
              });
          }}
          isHwPrj={isHwPrj} // 是否硬件入围
          ddcgje={ddcgje} // 单独采购金额，为0时无值
          rlwbData={rlwbData}
        />
      )}
      {/*人员新增提醒弹窗*/}
      {ryxztxModalVisible && (
        <BridgeModel
          modalProps={ryxztxModalProps}
          onSucess={() => {
            handleOperateSuccess('人员新增操作');
            setRyxztxModalVisible(false);
          }}
          onCancel={() => setRyxztxModalVisible(false)}
          src={ryxztxUrl}
        />
      )}
      {fileAddVisible && (
        <Modal
          wrapClassName="editMessage-modify xbjgEditStyle"
          width={'1000px'}
          // height={'700px'}
          maskClosable={false}
          zIndex={100}
          maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
          style={{ top: '10px' }}
          visible={fileAddVisible}
          okText="保存"
          bodyStyle={{
            padding: 0,
          }}
          onCancel={closeFileAddModal}
          title={
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3361FF',
                color: 'white',
                borderRadius: '8px 8px 0 0',
                fontSize: '16px',
              }}
            >
              <strong>完善子项目</strong>
            </div>
          }
          footer={null}
        >
          <EditProjectInfoModel
            closeModel={closeFileAddModal}
            successCallBack={() => {
              closeFileAddModal();
              reflush();
            }}
            xmid={src_fileAdd.xmid}
            type={src_fileAdd.type}
            subItemFlag={src_fileAdd.subItemFlag}
            subItemFinish={src_fileAdd.subItemFinish}
            projectStatus={src_fileAdd.projectStatus}
          />
        </Modal>
      )}
      <div className="avatar-card-box">
        <div className="avatar">
          <img src={overviewInfo?.xb === '女' ? avatarFemale : avatarMale} alt="" />
        </div>
        <div className="title">
          <div className="title-top">
            <span>{getGreeting()}</span>
            {['二级部门领导', '一级部门领导', '信息技术事业部领导'].includes(userRole) && (
              <div className="statistic-year">
                统计年份：
                <Dropdown overlay={menu} trigger="click">
                  <span>
                    {statisticYearData.currentYear}
                    <i className="iconfont icon-fill-down" />
                  </span>
                </Dropdown>
              </div>
            )}
          </div>
          <div className="desc">
            {overviewInfo?.sm}
            {overviewInfo?.sm && '，'}这是你在****的第
            {moment().diff(moment(overviewInfo?.rzsj), 'days')}天
          </div>
        </div>
      </div>
      <div className="divider"></div>
      {userRole === '普通人员' ? (
        <div className="overview-row">
          {getOverviewItem({
            title: '我的待办',
            img: 'wddb',
            amount: getAmountFormat(toDoDataNum),
            addNum: overviewInfo?.dbjrxz,
            unit: '项',
            more: true,
          })}
          {getOverviewItem({
            title: '现有风险',
            img: 'xyfx',
            amount: getAmountFormat(overviewInfo?.xyfx),
            addNum: overviewInfo?.fxjrxz,
            unit: '项',
            more: false,
          })}
          {getOverviewItem({
            title: '发起项目',
            img: 'fqxm',
            amount: getAmountFormat(overviewInfo?.fqxm),
            fn: () => {
              if (Number(overviewInfo?.fqxm) === 0) {
                message.info('暂无发起项目', 1);
              } else {
                window.location.href = `/#/pms/manage/ProjectInfo/${EncryptBase64(
                  JSON.stringify({
                    prjManager: Number(LOGIN_USER_INFO.id),
                    cxlx: 'PERSON',
                  }),
                )}`;
              }
            },
          })}
          {getOverviewItem({
            title: '参与项目',
            img: 'cyxm',
            amount: getAmountFormat(overviewInfo?.cyxm),
            fn: () => {
              if (Number(overviewInfo?.cyxm) === 0) {
                message.info('暂无参与项目', 1);
              } else {
                window.location.href = `/#/pms/manage/ProjectInfo/${EncryptBase64(
                  JSON.stringify({
                    prjManager: Number(LOGIN_USER_INFO.id),
                    cxlx: 'PARTICIPATE',
                  }),
                )}`;
              }
            },
          })}
        </div>
      ) : userRole !== '' ? (
        <div className="overview-row">
          {getOverviewItem({
            title: '部门项目数量',
            img: 'bmxmsl',
            amount: getAmountFormat(overviewInfo?.xmzs),
            addNum: overviewInfo?.xmjrxz,
            unit: '项',
            width: '22%',
            linkTo: {
              pathname: `/pms/manage/projectBuilding`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
          {getOverviewItem({
            title: '部门队伍数量',
            img: 'bmdwsl',
            amount: getAmountFormat(overviewInfo?.ryzs),
            addNum: overviewInfo?.ryjrxz,
            unit: '人',
            width: '22%',
            linkTo: {
              pathname: `/pms/manage/departmentOverview`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
          {getOverviewItem({
            title: '预算执行金额(万元)/执行率',
            img: 'yszxje',
            amount: getAmountFormat(overviewInfo?.yszxje),
            percent: overviewInfo?.yszxl,
            addNum: overviewInfo?.ysjrxz,
            unit: '万元',
            width: '34%',
            linkTo: {
              pathname: `/pms/manage/BudgetExcute`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
          {getOverviewItem({
            title: '供应商数量',
            img: 'gyssl',
            amount: getAmountFormat(overviewInfo?.gyssl),
            addNum: overviewInfo?.gysjrxz,
            unit: '家',
            width: '22%',
            linkTo: {
              pathname: `/pms/manage/SupplierSituation`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            },
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
