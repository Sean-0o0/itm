import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Button } from 'antd';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import FormOperate from './FormOperate';
import {
  QueryPaymentAccountList,
  QueryPaymentFlowInfo,
  CreatPaymentFlow,
} from '../../../../services/pmsServices';
import ExpenseDetail from './ExpenseDetail';
import moment from 'moment';

const PaymentProcess = props => {
  //是否有合同 单选 1是 2否
  const [sfyht, setSfyht] = useState(1);
  //合同金额
  const [htje, setHtje] = useState(0);
  //已付款金额
  const [yfkje, setYfkje] = useState(0);
  //申请日期
  const [sqrq, setSqrq] = useState(null);
  //账户范围 单选 1个人 2对公
  const [zhfw, setZhfw] = useState(1);
  //收款账户
  const [skzh, setSkzh] = useState([]);
  //弹窗全屏
  const [isModalFullScreen, setIsModalFullScreen] = useState(false);
  //加载状态
  const [isSpinning, setIsSpinning] = useState(false);
  //收款账户添加弹窗显示
  const [addSkzhModalVisible, setAddSkzhModalVisible] = useState(false);
  //对公收款账户
  const [dgskzh, setDgskzh] = useState([]);
  //易快报id
  const [userykbid, setUserykbid] = useState('');
  const [orgykbid, setOrgykbid] = useState('');
  //费用明细数据
  const [expenseDetailData, setExpenseDetailData] = useState([]);
  //收款账户id
  const [skzhId, setskzhId] = useState('');
  //易快报收款账户id
  const [ykbSkzhId, setYkbSkzhId] = useState('');
  //费用明细新增按钮help显示
  const [isXzTurnRed, setIsXzTurnRed] = useState(false);
  const [expenseDetail, setExpenseDetail] = useState([]); //费用详情数据

  const {
    paymentModalVisible,
    closePaymentProcessModal,
    form,
    currentXmid,
    currentXmmc,
    projectCode,
    onSuccess,
    isHwPrj = false, //是否硬件入围项目类型
  } = props;
  const { validateFields, getFieldValue, resetFields } = form;
  const formData = {
    sfyht,
    setSfyht,
    htje,
    yfkje,
    setSqrq,
    zhfw,
    setZhfw,
    skzh,
    setSkzh,
    dgskzh,
    setskzhId,
    setYkbSkzhId,
    setDgskzh,
  };

  useEffect(() => {
    setSqrq(moment().format('YYYYMMDD'));
    setIsSpinning(true);
    // fetchQueryPaymentAccountList();
    fetchQueryPaymentFlowInfo();
    return () => {};
  }, []);

  // 获取收款账户
  const fetchQueryPaymentAccountList = (khmc = '', zhid = -1) => {
    QueryPaymentAccountList({
      type: 'ALL',
      current: 1,
      pageSize: 10,
      paging: -1,
      sort: '1',
      total: -1,
      khmc,
      zhid,
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          setSkzh(p => [...rec]);
          setDgskzh(p => [...rec]);
        }
      })
      .catch(e => console.error(e));
  };

  //创建单据时获取基本信息
  const fetchQueryPaymentFlowInfo = () => {
    QueryPaymentFlowInfo({
      xmmc: currentXmid,
    })
      .then(res => {
        if (res.code === 1) {
          const rec = JSON.parse(res.result);
          setHtje(rec.htje);
          setYfkje(rec.yfkje);
          setUserykbid(rec.userykbid);
          setOrgykbid(rec.orgykbid);
          setIsSpinning(false);
        }
      })
      .catch(e => console.error(e));
  };

  const handleSubmit = (operateType = 'send') => {
    validateFields(err => {
      if (expenseDetail.length === 0) {
        setIsXzTurnRed(true);
        return;
      }
      if (!err) {
        if (!isXzTurnRed) {
          let details = [];
          let lcid = '-1';
          expenseDetail?.forEach(item => {
            lcid = String(item.lcid);
            let detailInfo = JSON.stringify({
              FYLX: item.fylxInfo.ID,
              JE: String(item.je),
              RQ: item.date,
              FPLX: item.fplxInfo?.ID,
              YSXM: item.ysxmInfo?.ID,
              XFSY: item.consumptionReasons,
              SFWK: String(item.isFinalPay), //1,2
            });
            let invoice = item.receiptFileInfo.map(x => {
              return { fileName: x.fileName, code64: x.base64.split(',')[1] };
            });
            let invoiceCheckInfo = item.receiptFileInfo.map(x => {
              return {
                CYXX: x.message,
                YKBID: x.invoiceId,
                MXID: x.detailIds,
                FPMC: x.fileName,
                ZJE: x.zje,
                SE: x.se,
                SL: x.sl,
                CYJG: x.isCheck,
                FILEID: x.fileId,
                KEY: x.key,
              };
            });
            let codeInfo = {
              FYLXBM: item.fylxInfo.FYLXDM,
              FYLXMBDM: item.fylxInfo.MBDM,
              FPBM: item.fplxInfo?.BM,
              YSFYDM: item.ysxmInfo?.YSFYDM,
            };
            let oaFile = item.OAProcessFileInfo?.map(x => {
              return {
                fileName: x.name,
                code64: x.base64.split(',')[1],
              };
            });
            let detailItem = {
              detailInfo,
              invoice,
              codeInfo,
              contract: (item.contractFileInfo?.base64.split(','))[1] || '无',
              contractName: item.contractFileInfo?.name,
              report: (item.checkFileInfo?.base64.split(','))[1] || '无',
              reportName: item.checkFileInfo?.name,
              oaFile,
              invoiceCheckInfo,
              invoiceType: item.fplxInfo?.NAME,
              feeType: item.fylxInfo.NAME,
              consumptionReasons: item.consumptionReasons,
              date: item.date,
              taxAmount: String(item.taxAmount),
            };
            details.push(detailItem);
          });
          const submitData = {
            title: String(getFieldValue('bt')),
            submitterId: String(userykbid),
            expenseDepartment: String(orgykbid),
            expenseDate: String(moment(sqrq).format('YYYYMMDD')),
            payeeId: String(ykbSkzhId),
            description: String(getFieldValue('ms')),
            details,
            haveContract: String(sfyht),
            contractAmount: String(getFieldValue('htje')),
            paidAmount: String(getFieldValue('yfkje')),
            attQuantity: String(getFieldValue('fjzs')),
            legalEntity: '浙商证券股份有限公司（ZSZQ）',
            orgId: String(LOGIN_USER_ORG_ID),
            projectName: String(currentXmmc),
            payName: String(skzhId),
            projectId: String(currentXmid),
            projectCode,
            operateType,
            lcid,
          };
          isHwPrj && (submitData.yjyhtid = String(getFieldValue('glsb')));
          console.log('submitData', submitData);
          CreatPaymentFlow(submitData)
            .then(res => {
              if (res.code === 200) {
                if (onSuccess === undefined) onSuccess();
                else
                  message.success(`付款流程${operateType === 'send' ? '发起' : '草稿暂存'}成功`, 1);

                resetFields();
                fetchQueryLifecycleStuff && fetchQueryLifecycleStuff(currentXmid);
              }
            })
            .catch(e => {
              console.error(e);
            });
          closePaymentProcessModal();
        }
      }
    });
  };

  //收款账户添加成功
  const OnSkzhAddSuccess = () => {
    setAddSkzhModalVisible(false);
    message.success('账户添加成功', 1);
    // QueryPaymentAccountList({
    //   type: 'ALL',
    // }).then(res => {
    //   if (res.success) {
    //     let rec = res.record;
    //     setSkzh(p => [...rec]);

    //   }
    // });
  };

  //底部按钮
  const footer = (
    <div className="modal-footer">
      <Button className="btn-default" onClick={closePaymentProcessModal}>
        取消
      </Button>
      {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
      <Button className="btn-primary" type="primary" onClick={() => handleSubmit('send')}>
        确定
      </Button>
    </div>
  );

  const addSkzhModalProps = {
    isAllWindow: 1,
    title: '新增收款账户',
    width: '800px',
    height: '600px',
    style: { top: '134px' },
    visible: addSkzhModalVisible,
    footer: null,
  };

  const LOGIN_USER = JSON.parse(sessionStorage.getItem('user'));
  const LOGIN_USER_ORG_ID = LOGIN_USER.org;

  return (
    <>
      {addSkzhModalVisible && (
        <BridgeModel
          modalProps={addSkzhModalProps}
          onCancel={() => setAddSkzhModalVisible(false)}
          onSucess={OnSkzhAddSuccess}
          src={
            localStorage.getItem('livebos') +
            '/OperateProcessor?operate=View_SKZH_ADD&Table=View_SKZH'
          }
        />
      )}
      <Modal
        wrapClassName="editMessage-modify payment-process-box-modal"
        width={'900px'}
        maskClosable={false}
        zIndex={100}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        cancelText={'关闭'}
        style={{
          top: '10px',
        }}
        bodyStyle={{
          padding: '0',
          overflow: 'hidden',
        }}
        title={null}
        visible={paymentModalVisible}
        onOk={handleSubmit}
        onCancel={closePaymentProcessModal}
        footer={footer}
      >
        <div className="body-title-box">
          <strong>付款流程发起</strong>
        </div>
        <Spin
          spinning={isSpinning}
          tip="加载中"
          size="large"
          wrapperClassName="diy-style-spin payment-process-box"
        >
          <FormOperate
            form={form}
            formData={formData}
            setAddSkzhModalVisible={setAddSkzhModalVisible}
            isHwPrj={isHwPrj}
            currentXmid={currentXmid}
          />
          <ExpenseDetail
            currentXmid={currentXmid}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            isXzTurnRed={isXzTurnRed}
            setIsXzTurnRed={setIsXzTurnRed}
            userykbid={userykbid}
            expenseDetail={expenseDetail}
            setExpenseDetail={setExpenseDetail}
          />
        </Spin>
      </Modal>
    </>
  );
};
export default Form.create()(PaymentProcess);
