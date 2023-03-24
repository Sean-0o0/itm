import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Drawer,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Icon,
} from 'antd';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import FormOperate from './FormOperate';
import {
  QueryPaymentAccountList,
  QueryPaymentFlowDetail,
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
  // //附件列表
  // const [fileList, setFileList] = useState([]);
  // //附件base64
  // const [fileUrl, setFileUrl] = useState('');
  // //附件字段校验报红
  // const [isFjTurnRed, setIsFjTurnRed] = useState(false);
  // //附件名称
  // const [fileName, setFileName] = useState('');
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
    fetchQueryLifecycleStuff,
    currentXmmc,
    projectCode,
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
    // fileList, setFileList, fileUrl, setFileUrl, isFjTurnRed, setIsFjTurnRed,
    // fileName, setFileName,
    setskzhId,
    setYkbSkzhId,
  };

  useEffect(() => {
    setSqrq(moment().format('YYYYMMDD'));
    setIsSpinning(true);
    fetchQueryPaymentAccountList();
    return () => {};
  }, []);

  useEffect(() => {
    console.log('expenseDetail %%%=>', expenseDetail);
    return () => {};
  }, [expenseDetail]);

  // 获取收款账户
  const fetchQueryPaymentAccountList = () => {
    QueryPaymentAccountList({
      type: 'ALL',
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          setSkzh(p => [...rec]);
          setDgskzh(p => [...rec]);
          fetchQueryPaymentFlowInfo();
          setIsSpinning(false);
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

  const handleSubmit = () => {
    validateFields(err => {
      if (expenseDetail.length === 0) {
        setIsXzTurnRed(true);
        return;
      }
      if (!err) {
        if (!isXzTurnRed) {
          let details = [];
          expenseDetail?.forEach(item => {
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
              contract: (item.contractFileInfo?.base64.split(','))[1],
              contractName: item.contractFileInfo?.name,
              report: (item.checkFileInfo?.base64.split(','))[1],
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
          console.log('🚀 ~ file: index.js ~ line 205 ~ handleSubmit ~ details', details);

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
            operateType: 'send',
          };
          console.log('submitData', submitData);
          CreatPaymentFlow(submitData)
            .then(res => {
              if (res.code === 200) {
                message.success('付款流程发起成功', 1);
                // onSuccess();
                resetFields();
                fetchQueryLifecycleStuff(currentXmid);
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
    QueryPaymentAccountList({
      type: 'ALL',
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        setSkzh(p => [...rec]);
        message.success('账户添加成功', 1);
      }
    });
  };

  // const footer = (
  //   <div className="modal-footer">
  //     <Button onClick={closePaymentProcessModal}>取消</Button>
  //     <Button type="primary" onClick={()=>handleSubmit('save')}>暂存草稿</Button>
  //     <Button type="primary" onClick={()=>handleSubmit('send')}>确定</Button>
  //   </div>
  // );

  const addSkzhModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '新增收款账户',
    width: '120rem',
    height: '90rem',
    style: { top: '20rem' },
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
        width={'860px'}
        maskClosable={false}
        zIndex={100}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        cancelText={'关闭'}
        style={{
          top: '14px',
        }}
        bodyStyle={{
          padding: '0',
          overflow: 'hidden',
        }}
        title={null}
        visible={paymentModalVisible}
        onOk={handleSubmit}
        onCancel={closePaymentProcessModal}
        // footer={footer}
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
