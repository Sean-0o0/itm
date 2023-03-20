import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Drawer, Button, Col, Row, Input, Select, DatePicker, Icon } from 'antd';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import FormOperate from './FormOperate';
import { QueryPaymentAccountList, QueryPaymentFlowDetail, QueryPaymentFlowInfo, CreatPaymentFlow } from '../../../../services/pmsServices';
import ExpenseDetail from './ExpenseDetail';
import moment from 'moment';


const PaymentProcess = (props) => {
    //是否有合同 单选 1是 2否
    const [sfyht, setSfyht] = useState(1);
    //合同金额
    const [htje, setHtje] = useState('');
    //已付款金额
    const [yfkje, setYfkje] = useState('');
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

    const { paymentModalVisible, closePaymentProcessModal, form, currentXmid, fetchQueryLifecycleStuff } = props;
    const { validateFields, getFieldValue, resetFields } = form;
    const formData = {
        sfyht, setSfyht, htje, yfkje, setSqrq,
        zhfw, setZhfw, skzh, setSkzh, dgskzh,
        // fileList, setFileList, fileUrl, setFileUrl, isFjTurnRed, setIsFjTurnRed,
      // fileName, setFileName,
        setskzhId, setYkbSkzhId
    };

    useEffect(() => {
        setSqrq(moment().format('YYYYMMDD'));
        setIsSpinning(true);
        fetchQueryPaymentAccountList();
        return () => {
        }
    }, []);

    // 获取收款账户
    const fetchQueryPaymentAccountList = () => {
        QueryPaymentAccountList({
            type: 'ALL',
        }).then(res => {
            if (res.success) {
                let rec = res.record;
                setSkzh(p => [...rec]);
                setDgskzh(p => [...rec]);
                // fetchQueryPaymentFlowInfo();
                setIsSpinning(false);
            }
        }).catch(e => console.error(e));
    };
    //创建单据时获取基本信息
    const fetchQueryPaymentFlowInfo = () => {
        QueryPaymentFlowInfo({
            xmmc: currentXmid,
        }).then(res => {
            if (res.code === 1) {
                const rec = JSON.parse(res.result);
                setHtje(rec.htje);
                setYfkje(rec.yfkje);
                setUserykbid(rec.userykbid);
                setOrgykbid(rec.orgykbid);
                setIsSpinning(false);
            }
        }).catch(e => console.error(e))
    };
    // 获取费用明细
    const getExpenseDetailData = (fn) => {
        QueryPaymentFlowDetail({
            xmmc: -currentXmid,
        }).then(res => {
            if (res.code === 1) {
                const arr = res.record.map(item => {
                    return {
                        id: item.id,
                        fylx: item.fylx,
                        je: item.je,
                        rq: item.rq,
                        fplx: item.fplx === ' ' ? '无' : item.fplx,
                        fp: JSON.parse(item.fp),
                        ysxm: item.ysxm === ' ' ? '无' : item.ysxm,
                        se: item.se,
                        sl: item.sl,
                        xfsy: item.xfsy,
                        fj: JSON.parse(item.fj),
                        htfyj: item.htfyj,
                        ysbgfyj: item.ysbgfyj,
                        fylxdm: item.fylxdm,
                        fylxmbdm: item.fylxmbdm,
                        fpbm: item.fpbm,
                        ysfydm: item.ysfydm,
                    };
                });
                setExpenseDetailData(p => [...arr])
                fn && fn(false); //关闭加载状态
                message.success('新增成功', 1);
            }
        }).catch(e => {
            message.error('新增失败', 1);
            console.error(e);
        });
    };

    const handleSubmit = () => {
        validateFields(err => {
            if (expenseDetailData.length === 0) {
                setIsXzTurnRed(true);
            }
            if (!err) {
                if (!isXzTurnRed) {
                    let detailData = expenseDetailData.map(item => {
                        const str = [item.fylxdm,
                        item.fylxmbdm,
                        item.fpbm,
                        item.ysfydm].join(',');
                        return [item.id,
                        item.fylx,
                        item.je,
                        item.rq,
                        item.fplx,
                        JSON.stringify(item.fp),
                        item.ysxm,
                        item.se,
                        item.sl,
                        item.xfsy,
                        JSON.stringify(item.fj),
                        item.htfyj,
                        item.ysbgfyj,
                            str].join('|');
                    });
                    const submitData = {
                        title: String(getFieldValue('bt')),
                        submitterId: String(userykbid),
                        expenseDepartment: String(orgykbid),
                        expenseDate: String(moment(sqrq).format('YYYYMMDD')),
                        payeeId: String(ykbSkzhId),
                        description: String(getFieldValue('ms')),
                        details: String(detailData.join('#')),
                        haveContract: String(sfyht),
                        contractAmount: String(getFieldValue('htje')),
                        paidAmount: String(getFieldValue('yfkje')),
                        attQuantity: String(getFieldValue('fjzs')),
                        legalEntity: '浙商证券股份有限公司（ZSZQ）',
                        orgId: String(LOGIN_USER_ORG_ID),
                        projectName: String(currentXmid),
                        payName: String(skzhId),
                    };
                    console.log('submitData', submitData);
                    CreatPaymentFlow(submitData).then(res => {
                        if (res.code === 200) {
                            // message.success('付款流程发起成功', 1);
                            onSuccess();
                            resetFields();
                            fetchQueryLifecycleStuff(currentXmid);
                        }
                    }).catch(e => {
                        console.error(e)
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

    const addSkzhModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新增收款账户',
      width: '120rem',
      height: '90rem',
      style: {top: '20rem'},
      visible: addSkzhModalVisible,
      footer: null,
    };

  const LOGIN_USER = JSON.parse(sessionStorage.getItem("user"));
  const LOGIN_USER_ORG_ID = LOGIN_USER.org;

  return (
    <>
      {addSkzhModalVisible &&
      <BridgeModel modalProps={addSkzhModalProps}
                   onCancel={() => setAddSkzhModalVisible(false)}
                   onSucess={OnSkzhAddSuccess}
                   src={localStorage.getItem('livebos') + '/OperateProcessor?operate=View_SKZH_ADD&Table=View_SKZH'}/>}
      <Modal wrapClassName='editMessage-modify' width={isModalFullScreen ? '100vw' : '180rem'}
             maskClosable={false}
                zIndex={100}
                maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
                cancelText={'关闭'}
                style={isModalFullScreen ? {
                    maxWidth: "100vw",
                    top: 0,
                    paddingBottom: 0,
                    marginBottom: 0
                } : {
                    top: '2rem'
                }}
                bodyStyle={isModalFullScreen ? {
                    height: "calc(100vh - 7.8864rem)",
                    overflowY: "auto",
                    padding: '0'
                } : {
                    height: 'calc(100vh - 13.5rem)',
                    padding: '0',
                    overflow: 'hidden'
                }}
                title={null} visible={paymentModalVisible}
                onOk={handleSubmit}
                onCancel={closePaymentProcessModal}>
                <div className='body-title-box'>
                    <strong>付款流程发起</strong>
                    <img src={isModalFullScreen
                        ? require('../../../../image/pms/LifeCycleManagement/full-screen-cancel.png')
                        : require('../../../../image/pms/LifeCycleManagement/full-screen.png')} alt=''
                        style={{ height: '2.0832rem', marginLeft: 'auto', marginRight: '3.72rem', cursor: 'pointer' }}
                        onClick={() => setIsModalFullScreen(!isModalFullScreen)} />
                </div>
                <Spin spinning={isSpinning} tip='加载中' size='large' wrapperClassName='diy-style-spin payment-process-box'>
                    <FormOperate form={form} formData={formData} setAddSkzhModalVisible={setAddSkzhModalVisible} />
                    <ExpenseDetail currentXmid={currentXmid} getExpenseDetailData={getExpenseDetailData}
                        expenseDetailData={expenseDetailData} isSpinning={isSpinning} setIsSpinning={setIsSpinning}
                        isXzTurnRed={isXzTurnRed} setIsXzTurnRed={setIsXzTurnRed} userykbid={userykbid} />
                </Spin>
            </Modal>
        </>

    )
}
export default Form.create()(PaymentProcess);
