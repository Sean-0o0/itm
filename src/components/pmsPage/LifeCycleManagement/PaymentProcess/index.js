import React, { useEffect, useState } from 'react';
import { Row, Col, Popconfirm, Modal, Form, Input, Table, DatePicker, message, Upload, Button, Icon, Select, Pagination, Spin, Radio } from 'antd';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import FormOperate from './FormOperate';
import { QueryPaymentAccountList, QueryPaymentFlowInfo } from '../../../../services/pmsServices';
import ExpenseDetail from './ExpenseDetail';
import { fetchUserBasicInfo } from '../../../../services/commonbase/userBasicInfo';
import { get } from 'immutable';

const PaymentProcess = (props) => {
    //标题
    const [bt, setBt] = useState('');
    //是否有合同 单选 1是 2否
    const [sfyht, setSfyht] = useState(1);
    //合同金额
    const [htje, setHtje] = useState('');
    //已付款金额
    const [yfkje, setYfkje] = useState('');
    //申请日期
    const [sqrq, setSqrq] = useState(null);
    //附件张数
    const [fjzs, setFjzs] = useState('');
    //账户范围 单选 1个人 2对公
    const [zhfw, setZhfw] = useState(1);
    //收款账户
    const [skzh, setSkzh] = useState([]);
    //描述
    const [ms, setMs] = useState('');
    //弹窗全屏
    const [isModalFullScreen, setIsModalFullScreen] = useState(false);
    //加载状态
    const [isSpinning, setIsSpinning] = useState(false);
    //收款账户添加弹窗显示
    const [addSkzhModalVisible, setAddSkzhModalVisible] = useState(false);
    //对公收款账户
    const [dgskzh, setDgskzh] = useState([]);
    //附件列表
    const [fileList, setFileList] = useState([]);
    //附件base64
    const [fileUrl, setFileUrl] = useState('');
    //附件字段校验报红
    const [isFjTurnRed, setIsFjTurnRed] = useState(false);
    //附件名称
    const [fileName, setFileName] = useState('');
    //部门名称
    const [bmName, setBmName] = useState('');

    const { paymentModalVisible, closePaymentProcessModal, form, currentXmid } = props;
    const formData = {
        bt, setBt, sfyht, setSfyht, htje, setHtje, yfkje, setYfkje, sqrq, setSqrq,
        fjzs, setFjzs, zhfw, setZhfw, skzh, setSkzh, ms, setMs, dgskzh, setDgskzh,
        fileList, setFileList, fileUrl, setFileUrl, isFjTurnRed, setIsFjTurnRed,
        fileName, setFileName, bmName
    };

    useEffect(() => {
        fetchQueryPaymentAccountList();
        fetchQueryPaymentFlowInfo();
        getUserBasicInfo();
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
            }
        }).catch(e=>console.error(e));
    };
    //创建单据时获取基本信息
    const fetchQueryPaymentFlowInfo = ()=>{
        QueryPaymentFlowInfo({
            xmmc: currentXmid,
        }).then(res=>{
            if(res.code === 1){
                const rec = JSON.parse(res.result);
                setHtje(rec.htje);
                setYfkje(rec.yfkje);
            }
        }).catch(e=>console.error(e))
    };

    const getUserBasicInfo = ()=>{
        fetchUserBasicInfo({

        }).then(res=>{
            setBmName(res.records[0].extAttr.orgname);
        })
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
        style: { top: '20rem' },
        visible: addSkzhModalVisible,
        footer: null,
    };

    return (
        <>
            {addSkzhModalVisible &&
                <BridgeModel modalProps={addSkzhModalProps}
                    onCancel={() => setAddSkzhModalVisible(false)}
                    onSucess={OnSkzhAddSuccess}
                    src={localStorage.getItem('livebos') + '/OperateProcessor?operate=View_SKZH_ADD&Table=View_SKZH'} />}
            <Modal wrapClassName='editMessage-modify' width={isModalFullScreen ? '100vw' : '1000px'}
                maskClosable={false}
                zIndex={100}
                cancelText={'关闭'}
                style={isModalFullScreen ? {
                    maxWidth: "100vw",
                    top: 0,
                    paddingBottom: 0,
                    marginBottom: 0
                } : {}}
                bodyStyle={isModalFullScreen ? {
                    height: "calc(100vh - 53px)",
                    overflowY: "auto",
                    padding: '0'
                } : {
                    padding: '0'
                }}
                title={null} visible={paymentModalVisible}
                onOk={() => {
                    closePaymentProcessModal();
                }}
                onCancel={closePaymentProcessModal}>
                <div style={{
                    height: '42px', width: '100%', display: 'flex',
                    alignItems: 'center', backgroundColor: '#3361FF', color: 'white',
                    padding: '0 24px', borderRadius: '8px 8px 0 0', fontSize: '2.333rem'
                }}>
                    <strong>付款流程发起</strong>
                    <img src={isModalFullScreen
                        ? require('../../../../image/pms/LifeCycleManagement/full-screen-cancel.png')
                        : require('../../../../image/pms/LifeCycleManagement/full-screen.png')} alt=''
                        style={{ height: '14px', marginLeft: 'auto', marginRight: '25px', cursor: 'pointer' }}
                        onClick={() => setIsModalFullScreen(!isModalFullScreen)} />
                </div>
                <Spin spinning={isSpinning} tip='加载中' size='large' wrapperClassName='diy-style-spin payment-process-box'>
                    <FormOperate form={form} formData={formData} setAddSkzhModalVisible={setAddSkzhModalVisible} />
                    <ExpenseDetail currentXmid={currentXmid}/>
                </Spin>
            </Modal>
        </>

    )
}
export default Form.create()(PaymentProcess);