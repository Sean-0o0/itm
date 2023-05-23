import { Button, Empty, message, Tooltip, Icon, Modal } from 'antd';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  CreateOperateHyperLink,
  FetchQueryOwnerMessage,
  UpdateMessageState,
} from '../../../../services/pmsServices';
import moment from 'moment';
import PaymentProcess from '../../LifeCycleManagement/PaymentProcess';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import EditProjectInfoModel from '../../EditProjectInfoModel';

export default function ToDoCard(props) {
  const { itemWidth, getAfterItem, reflush, toDoData = [], total } = props;
  const [dataList, setDataList] = useState([]); //待办数据 - 展示
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [paymentModalVisible, setPaymentModalVisible] = useState(false); //付款流程发起弹窗
  const [ryxztxModalVisible, setRyxztxModalVisible] = useState(false); //人员新增提醒发起弹窗
  const [ryxztxUrl, setRyxztxUrl] = useState('#'); //人员新增提醒发起弹窗
  const [currentXmid, setCurrentXmid] = useState(-1); //当前项目id
  const [currentXmmc, setCurrentXmmc] = useState(''); //当前项目名称
  const [projectCode, setProjectCode] = useState('-1'); //当前项目编号
  const [isHwPrj, setIsHwPrj] = useState(false); //是否包含硬件
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目信息修改弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [allToDo, setAllToDo] = useState([]); //全部待办
  const [isLoading, setIsLoading] = useState(false); //查询全部数据时加载状态
  const location = useLocation();

  const ryxztxModalProps = {
    isAllWindow: 1,
    width: '720px',
    height: '300px',
    title: '人员新增提醒',
    style: { top: '60px' },
    visible: ryxztxModalVisible,
    footer: null,
  };

  useLayoutEffect(() => {
    if (toDoData.length !== 0) {
      setDataList(p => [...toDoData]);
      setIsUnfold(false);
    }
    return () => {};
  }, [props]);

  useEffect(() => {
    return () => {};
  }, []);

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
    setIsHwPrj(item.sfbhyj === '1'); //1是2否
    setCurrentXmid(item.xmid);
    setCurrentXmmc(item.xmmc);
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
    // console.log('handleXwhhyjg', item);
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

      //特殊处理
      case '付款流程':
      case '合同分期付款':
        return handlePaymentProcess(item);
      case '人员新增提醒':
        return handleRyxztx(item);
      case '信委会会议结果':
        return handleXwhhyjg(item);
      case '项目信息完善':
        return jumpToEditProjectInfo(item);
      case '预算使用超限':
        return jumpToProjectDetail(item);

      //暂不处理
      case '外包人员录用信息提交':
        return jumpToLBPage('');
      case '外包项目需求填写':
        return jumpToLBPage('');
      case '里程碑逾期':
        return jumpToLBPage('');

      default:
        console.error(`🚀 ~ 该待办事项名称【${item.sxmc}】未配置`);
        return;
    }
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

  //获取操作按钮文本
  const getBtnTxt = (txt, sxmc) => {
    if (sxmc === '信委会会议结果') return '确认';
    else if (txt.includes('录入')) return '录入';
    else if (txt.includes('填写')) return '填写';
    else return '处理';
  };

  // //获取目前每行几个
  // const getColNum = w => {
  //   switch (w) {
  //     case '32%':
  //       return 3;
  //     case '24%':
  //       return 4;
  //     case '19%':
  //       return 5;
  //     case '15.6%':
  //       return 6;
  //     case '13.2%':
  //       return 7;
  //     case '11.5%':
  //       return 8;
  //     default:
  //       return 3;
  //   }
  // };

  //展开、收起
  const handleUnfold = bool => {
    if (bool) {
      // if (allToDo.length === 0) {
      setIsLoading(true);
      FetchQueryOwnerMessage({
        cxlx: 'ALL',
        date: Number(new moment().format('YYYYMMDD')),
        paging: -1,
        current: 1,
        pageSize: 99999,
        total: -1,
        sort: '',
      })
        .then(res => {
          if (res?.success) {
            setDataList(p => [...res.record]);
            setAllToDo(p => [...res.record]);
            setIsLoading(false);
            setIsUnfold(bool);
          }
        })
        .catch(e => {
          console.error('FetchQueryOwnerMessage', e);
          message.error('待办信息查询失败', 1);
        });
      // } else {
      //   setDataList(p => [...allToDo]);
      //   setIsUnfold(bool);
      // }
    } else {
      setIsUnfold(bool);
      setDataList(p => [...toDoData]);
    }
  };

  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };

  //待办块
  const getToDoItem = ({
    title = '--',
    content = '--',
    btnTxt = '--',
    isLate = false,
    isDueSoon = false,
    lateDay = '--',
    key,
    item = {},
  }) => {
    let borderColor = '#3361ff';
    let fontColor = '#3361FF';
    if (isDueSoon) {
      fontColor = '#F9A812FF';
      borderColor = '#F9A812';
    } else if (isLate) {
      fontColor = '#FF1313';
      borderColor = '#FF1313';
    }
    return (
      <div
        className="todo-item"
        style={{
          borderColor: borderColor,
          cursor: Number(item.xxlx) === 2 ? 'default' : 'pointer',
        }}
        onClick={() => {
          if (Number(item.xxlx) !== 2) handleToDo(item);
        }}
        key={key}
      >
        {/* {isDueSoon && <div className="status-tag-2">即将到期</div>}
    {isLate && <div className="status-tag-3">逾期{lateDay}天</div>} */}
        <div className="item-title">
          <div className="title-top">
            <span className="top-left">
              <i style={{ color: fontColor }}>#</i>
              {title}
            </span>
            {isLate && <div className="status-tag-late">逾期{Number(lateDay) * -1}天</div>}
            {isDueSoon && <div className="status-tag-due">即将到期</div>}
          </div>
          <Tooltip title={content} placement="topLeft">
            <div className="content" style={isLate || isDueSoon ? { color: fontColor } : {}}>
              {content}
            </div>
          </Tooltip>
        </div>
        {Number(item.xxlx) !== 2 ? (
          <div
            className="item-btn"
            onClick={() => handleToDo(item)}
            style={
              isLate
                ? {
                    backgroundColor: 'rgba(255, 19, 19, 0.2)',
                    color: 'rgba(255, 19, 19, 1)',
                  }
                : isDueSoon
                ? { backgroundColor: '#F9A81233', color: '#F9A812' }
                : {}
            }
          >
            去{btnTxt}
          </div>
        ) : (
          <div style={{ height: '32px' }}></div>
        )}
      </div>
    );
  };
  if (dataList?.length === 0) return null;
  return (
    <div className="todo-card-box">
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
            handleOperateSuccess();
          }}
          isHwPrj={isHwPrj}
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
      <div className="home-card-title-box">我的待办</div>
      <div className="todo-row">
        {dataList?.map(item =>
          getToDoItem({
            title: item.xmmc,
            content: item.txnr,
            deadline: moment(item.jzrq).format('YYYY-MM-DD'),
            btnTxt: getBtnTxt(item.txnr, item.sxmc),
            isLate: Number(item.wdsl) < 0, //是否逾期, < 0 true
            isDueSoon:
              Number(moment(item.jzrq).diff(moment(new moment()), 'days')) <= 3 &&
              Number(moment(item.jzrq).diff(moment(new moment()), 'days')) > 0,
            key: item.xxid,
            lateDay: item.wdsl,
            item,
          }),
        )}
        {getAfterItem('32%')}
      </div>
      {/* {dataList?.length === 0 && (
        <Empty
          description="暂无待办事项"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ width: '100%' }}
        />
      )} */}
      {total > 2 &&
        (isUnfold ? (
          <div className="more-item" onClick={() => handleUnfold(false)}>
            收起
            <i className="iconfont icon-up" />
          </div>
        ) : (
          <div className="more-item" onClick={() => handleUnfold(true)}>
            更多
            {isLoading ? <Icon type="loading" /> : <i className="iconfont icon-down" />}
          </div>
        ))}
    </div>
  );
}
