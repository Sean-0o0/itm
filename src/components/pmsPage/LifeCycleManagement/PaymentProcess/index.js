import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Button } from 'antd';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import FormOperate from './FormOperate';
import {
  QueryPaymentAccountList,
  QueryPaymentFlowInfo,
  CreatPaymentFlow,
  InsertOutsourcePaymentInfo,
  UpdateItePayInfo,
} from '../../../../services/pmsServices';
import ExpenseDetail from './ExpenseDetail';
import moment from 'moment';
import { connect } from 'dva';
import ConnectApply from './ConnectApply';

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
  const [fklx, setFklx] = useState(1); //单独采购金额-付款类型，为硬件付款 2 时出现关联设备...
  const [bxbmData, setBxbmData] = useState({
    selectorData: [],
    mb: '',
    origin: [], //非树型的原数据
  }); //报销部门 下拉框数据、分摊模板
  const [glsqData, setGlsqData] = useState({
    radioObj: undefined,
    radioValue: undefined,
  }); //关联申请数据
  let LOGIN_USER = JSON.parse(sessionStorage.getItem('user'));
  let LOGIN_USER_ORG_ID = LOGIN_USER.org;

  const {
    paymentModalVisible,
    closePaymentProcessModal,
    form,
    currentXmid,
    currentXmmc,
    projectCode,
    onSuccess,
    isHwPrj = false, //是否硬件入围项目类型
    ddcgje = 0, // 单独采购金额，为0时无值
    rlwbData = {}, //人力外包费用支付 - 付款流程总金额
    dictionary = {},
    ddfkData = false, //迭代付款{infoId, zcb},zcb赋值给合同金额
    dhtData = [], //多合同
  } = props;
  const { DJLX = [], FRST = [] } = dictionary;
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
    fklx,
    setFklx,
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
          // setHtje(rec.htje);
          // setYfkje(rec.yfkje);
          setHtje(dhtData.length > 0 ? Number(dhtData[0].HTJE || 0) : 0);
          setYfkje(dhtData.length > 0 ? Number(dhtData[0].YFKJE || 0) : 0);
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
    if (expenseDetail.length === 0) {
      setIsXzTurnRed(true);
      return;
    }
    const fn = err => {
      if (!err && !isXzTurnRed) {
        let details = [];
        let lcid = '-1';
        let fymxSum = 0; //费用明细金额总和
        expenseDetail?.forEach(item => {
          fymxSum += Number(item.je);
          lcid = String(item.lcid);
          let detailInfo = JSON.stringify({
            FYLX: item.fylxInfo.ID || '-1',
            JE: String(item.je),
            RQ: item.date,
            FPLX: item.fplxInfo?.ID || '-1',
            YSXM: item.ysxmInfo?.ID || '-1',
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
          let apportionsArr = item.apportions.map(x => ({
            apportionForm: {
              //费用分摊明细
              apportionMoney: {
                //分摊金额，分摊比例是负数的话，分摊金额必须也是负数
                standard: String(x['FTJE' + x.ID]),
                standardStrCode: 'CNY',
                standardNumCode: '156',
                standardSymbol: '¥',
                standardUnit: '元',
                standardScale: 2,
              },
              apportionPercent: String(x['FTBL' + x.ID]), //分摊比例，允许设置负数
              expenseDepartment: String(x['BXBMYKBID' + x.ID]), //报销部门
              项目: '', //分摊项目ID - 暂时用空串
            },
            specificationId: bxbmData.mb, //费用分摊模板ID
          }));
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
            apportions: apportionsArr, //分摊明细
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
          contractAmount: String(getFieldValue('htje') || 0),
          paidAmount: String(getFieldValue('yfkje') || 0),
          attQuantity: String(getFieldValue('fjzs')),
          legalEntity: getFieldValue('frst') || FRST.find(x => x.ibm === '1')?.cbm,
          orgId: String(LOGIN_USER_ORG_ID),
          projectName: String(currentXmmc),
          payName: String(skzhId),
          projectId: String(currentXmid),
          projectCode,
          operateType,
          lcid,
          requisitionInfo: glsqData.radioObj?.id,
          // specificationId: DJLX.find(x => x.ibm === getFieldValue('djlx'))?.cbm,
          specificationId: DJLX.find(x => x.ibm === getFieldValue('djlx'))?.note,
          //关联合同 ID
          fkqs: String(dhtData.length > 1 ? getFieldValue('glht') || '' : dhtData[0]?.ID || ''),
        };
        (isHwPrj || (!isHwPrj && ddcgje !== 0 && fklx === 2)) &&
          (submitData.yjyhtid = String(getFieldValue('glsb')));
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
                  if (JSON.stringify(rlwbData) !== '{}' && rlwbData !== undefined) {
                    OutsourcePaymentInfoInsert(String(res.ykbid));
                  }
                  if (ddfkData !== false) {
                    handleUpdateItePayInfo(Number(ddfkData.infoId), String(res.ykbid));
                  }
                  message.success(`付款流程${operateType === 'send' ? '发起' : '草稿暂存'}成功`, 1);
                  if (onSuccess !== undefined) onSuccess(); //刷新数据
                  resetFields();
                  handleCancel();
                }
              })
              .catch(e => {
                setIsSpinning(false);
                console.error(' ~ e:', e);
                message.error(e.note, 3);
              });
          },
        });
      }
    };
    if (operateType === 'send') validateFields(fn);
    else {
      if (isHwPrj || (!isHwPrj && ddcgje !== 0 && fklx === 2))
        validateFields(['glsb', 'bt', 'skzh'], fn);
      else {
        validateFields(['bt', 'skzh'], fn);
      }
    }
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

  //迭代付款
  const handleUpdateItePayInfo = (infoId, ykbid) => {
    UpdateItePayInfo({
      infoId,
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

  //关闭弹窗
  const handleCancel = () => {
    closePaymentProcessModal();
    resetFields();
    setExpenseDetail([]);
  };

  //底部按钮
  const footer = (
    <div className="modal-footer">
      <Button loading={isSpinning} className="btn-default" onClick={handleCancel}>
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
        width={900}
        maskClosable={false}
        zIndex={100}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        cancelText={'关闭'}
        style={{
          top: 10,
        }}
        bodyStyle={{
          padding: 0,
          overflow: 'hidden',
        }}
        title={null}
        visible={paymentModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={footer}
        destroyOnClose
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
            ddcgje={ddcgje}
            currentXmid={currentXmid}
            rlwbData={rlwbData}
            dictionary={dictionary}
            dhtData={dhtData}
            ddfkData={ddfkData}
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
            bxbmData={bxbmData}
            setBxbmData={setBxbmData}
          />
          <ConnectApply
            dictionary={props.dictionary || {}}
            userykbid={userykbid}
            form={form}
            glsqData={glsqData}
            setGlsqData={setGlsqData}
          />
        </Spin>
      </Modal>
    </>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(PaymentProcess));
