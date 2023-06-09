import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Button } from 'antd';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import FormOperate from './FormOperate';
import {
  QueryPaymentAccountList,
  QueryPaymentFlowInfo,
  CreatPaymentFlow,
  InsertOutsourcePaymentInfo,
} from '../../../../services/pmsServices';
import ExpenseDetail from './ExpenseDetail';
import moment from 'moment';

const { confirm } = Modal;

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
    rlwbData, //人力外包费用支付 - 付款流程总金额
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
    fetchQueryPaymentFlowInfo();
    return () => {};
  }, []);

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
      .catch(e => {
        console.error(e);
        message.error('单据基本信息查询失败', 1);
      });
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
          let fymxSum = 0; //费用明细金额总和
          expenseDetail?.forEach(item => {
            fymxSum += Number(item.je);
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
            let oaFile = item.OAProcessFileInfo?.concat(item.otherFileInfo ?? []).map(x => {
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
            description:
              String(getFieldValue('ms')) +
              `\n由项目信息技术综合管理平台发起 项目名称：${String(currentXmmc)}`,
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
          if (
            Number(getFieldValue('htje')) !== 0 &&
            Number(getFieldValue('htje')) - Number(getFieldValue('yfkje')) < fymxSum
          ) {
            message.error('费用明细金额总和不能超过未付款金额', 1);
            return;
          }
          confirm({
            title: `将提交该流程到易快报中，${
              operateType === 'send' ? '直接发起流程进行审批' : '存为草稿'
            }，请确认！`,
            content: null,
            onOk() {
              setIsSpinning(true);
              CreatPaymentFlow(submitData)
                .then(res => {
                  if (res.code === 200) {
                    setIsSpinning(false);
                    if (JSON.stringify(rlwbData) !== '{}') {
                      OutsourcePaymentInfoInsert(String(res.ykbid));
                    }
                    message.success(
                      `付款流程${operateType === 'send' ? '发起' : '草稿暂存'}成功`,
                      1,
                    );
                    if (onSuccess !== undefined) onSuccess(); //刷新数据
                    resetFields();
                    closePaymentProcessModal();
                  }
                })
                .catch(e => {
                  setIsSpinning(false);
                  message.error(`付款流程${operateType === 'send' ? '发起' : '草稿暂存'}失败`, 1);
                });
            },
          });
        }
      }
    });
  };

  //外包人员付款后插入外包付款信息
  const OutsourcePaymentInfoInsert = ykbid => {
    InsertOutsourcePaymentInfo({
      fkje: String(getFieldValue('htje') ?? ''),
      fksj: Number(moment(sqrq).format('YYYYMMDD') ?? 0),
      gysid: Number(rlwbData.GYSID ?? 0),
      jd: String(rlwbData.JD ?? ''),
      nf: Number(rlwbData.NF ?? 0),
      xmid: Number(currentXmid ?? 0),
      ykbid,
    })
      .then(res => {})
      .catch(e => {
        message.error('操作失败', 1);
      });
  };

  //收款账户添加成功
  const OnSkzhAddSuccess = () => {
    setAddSkzhModalVisible(false);
    message.success('账户添加成功', 1);
  };

  //底部按钮
  const footer = (
    <div className="modal-footer">
      <Button loading={isSpinning} className="btn-default" onClick={closePaymentProcessModal}>
        取消
      </Button>
      <Button
        loading={isSpinning}
        className="btn-primary"
        type="primary"
        onClick={() => handleSubmit('save')}
      >
        提交为草稿
      </Button>
      <Button
        loading={isSpinning}
        className="btn-primary"
        type="primary"
        onClick={() => handleSubmit('send')}
      >
        提交审批
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
            rlwbData={rlwbData}
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
