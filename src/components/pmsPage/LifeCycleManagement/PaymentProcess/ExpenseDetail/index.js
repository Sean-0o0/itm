import React, { useState } from 'react';
import { message, Button, Spin, Divider } from 'antd';
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";
import { CreateOperateHyperLink, QueryPaymentFlowDetailFile } from '../../../../../services/pmsServices';
import { WpsInvoke, WpsClientOpen } from '../../../../../js/wpsjsrpcsdk';
import { PluginsUrl } from "../../../../../utils/config";
import moment from 'moment';

const LOGIN_USER_ID = localStorage.getItem("firstUserID");

export default function ExpenseDetail(props) {
    const { currentXmid, getExpenseDetailData, expenseDetailData, setIsSpinning, isXzTurnRed, setIsXzTurnRed } = props;
    const [addExpenseModalVisiable, setAddExpenseModalVisiable] = useState(false);
    const [addExpenseModalUrl, setAddExpenseModalUrl] = useState('#');
    //加载状态
    const [isExpenseSpinning, setIsExpenseSpinning] = useState(false);

    //费用明细新增弹窗调用成功
    const handleAddExpenseSuccess = () => {
        getExpenseDetailData(setIsExpenseSpinning);
        setIsExpenseSpinning(true);
        setAddExpenseModalVisiable(false);
        setIsXzTurnRed(false);
    };

    //处理点击新增
    const handleAddExpense = () => {
        setIsSpinning(true);
        let params = {
            "attribute": 0,
            "authFlag": 0,
            "objectName": "TYKBFYMX",
            "operateName": "TYKBFYMX_ADD",
            "parameter": [
                {
                    "name": "FKLCID",
                    "value": -currentXmid,
                },
            ],
            "userId": LOGIN_USER_ID,
        };
        CreateOperateHyperLink(params).then((ret = {}) => {
            const { code, message, url } = ret;
            if (code === 1) {
                setAddExpenseModalUrl(url);
                setAddExpenseModalVisiable(true);
                setIsSpinning(false);
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    //唤起WPS
    const WPSInvoke = (param) => {
        let clientType = WpsInvoke.ClientType.wps;
        let name = "HelloWps";
        if (param.filepath.includes(".docx") || param.filepath.includes(".doc")) {
            clientType = WpsInvoke.ClientType.wps;
            name = "HelloWps";
        }
        if (param.filepath.includes(".xlsx") || param.filepath.includes(".xls")) {
            clientType = WpsInvoke.ClientType.et;
            name = "HelloWp s-et";
        }
        if (param.filepath.includes(".pdf")) {
            window.open(param.filepath)
            return;
        }
        const WpsClient = new WpsClientOpen.WpsClient(clientType);
        //打包时修改config.js文件里的插件地址PluginsUrl。
        WpsClient.jsPluginsXml = PluginsUrl;
        WpsClient.InvokeAsHttp(
            name, // 组件类型
            // "HelloWps", // 插件名，与wps客户端加载的加载的插件名对应
            "InvokeFromSystemDemo", // 插件方法入口，与wps客户端加载的加载的插件代码对应，详细见插件代码
            JSON.stringify(param), // 传递给插件的数据
            function (result) { // 调用回调，status为0为成功，其他是错误
                // console.log("🚀 ~ file: index.js ~ line 79 ~ WPSInvoke ~ result", result)
                if (result.status) {
                    if (result.status === 100) {
                        message.info('请在稍后打开的网页中，点击"高级" => "继续前往"，完成授权。')
                        return;
                    }
                    message.info(result.message)
                } else {
                    message.info(result.response)
                }
            },
            true)
    }

    //处理预览
    const handlePreView = (id, filename, entryno, filetype) => {
        QueryPaymentFlowDetailFile({ id, filename, entryno, filetype }).then(res => {
            const param = {
                Index: 'OpenFile',
                filepath: res.record.url,
            };
            WPSInvoke(param);
        });
    };

    //金额显示1.00
    const getJeFormat = (je) => {
        return Number(je) % 1 === 0 ? je + '.00' : je;
    };

    //费用明细弹窗参数
    const addExpenseModalProps = {
        isAllWindow: 1,
        // defaultFullScreen: true,
        title: '新增',
        width: '120rem',
        height: '90rem',
        style: { top: '20rem' },
        visible: addExpenseModalVisiable,
        footer: null,
    };

    return (
        <>
            {addExpenseModalVisiable &&
                <BridgeModel modalProps={addExpenseModalProps}
                    onCancel={() => setAddExpenseModalVisiable(false)}
                    onSucess={handleAddExpenseSuccess}
                    src={addExpenseModalUrl} />}
            <div className='expense-detail-box'>
                <div className='expense-title'>
                    费用明细
                </div>
                <Button className='expense-add-btn' style={isXzTurnRed ? { borderColor: '#f5222d' } : {}} onClick={handleAddExpense}>新增</Button>{isXzTurnRed && <span className='expense-add-btn-help'>费用明细不允许空值</span>}
                <Spin spinning={isExpenseSpinning} tip='加载中' size='large' wrapperClassName='expense-detail-spin'>
                    {expenseDetailData?.map((item, index) => (
                        <div className='content-box' key={item.id}>
                            <div className='expense-info'>
                                <div className='info-icon-num'>{index + 1}</div>
                                <div>
                                    <div className='info-type'>{item.fylx}<Divider type='vertical' className='info-type-divider' />{moment(item.rq).format('YYYY-MM-DD')}
                                        <span className='info-bwb'>本位币 CNY {getJeFormat(item.je)}</span>
                                    </div>
                                    <div className='info-reason'>消费事由：{item.xfsy}</div>
                                </div>
                            </div>
                            <div className='expense-content'>
                                <div className='receipt-box'>
                                    <div className='receipt-title'><div className='divider'></div>发票：</div>
                                    <div className='receipt-list'>
                                        {item.fp?.items.map((x, i) => (
                                            <div className='receipt-item' key={i} onClick={() => handlePreView(item.id, x[1], x[0], 'FP')}>
                                                <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                                {x[1]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='receipt-box'>
                                    <div className='receipt-title'>
                                        <div className='divider'></div>
                                        OA流程附件：
                                    </div>
                                    <div className='receipt-list'>
                                        {item.fj?.items.map((x, i) => (
                                            <div className='receipt-item' key={i} onClick={() => handlePreView(item.id, x[1], x[0], 'FJ')}>
                                                <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                                {x[1]}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                            {(item.htfyj !== ' ' || item.ysbgfyj !== ' ') && (<div className='attachment-box'>
                                {item.htfyj !== ' ' && (<div className='attachment-item'>
                                    合同复印件：
                                    <div className='file-item ht' onClick={() => handlePreView(item.id, item.htfyj, '', 'HTFYJ')}>
                                        <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                        {item.htfyj}</div>
                                </div>)}
                                {item.ysbgfyj !== ' ' && (<div className='attachment-item'>
                                    验收报告复印件：
                                    <div className='file-item ys' onClick={() => handlePreView(item.id, item.ysbgfyj, '', 'YSBGFYJ')}>
                                        <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                        {item.ysbgfyj}</div>
                                </div>)}
                            </div>)}
                        </div>
                    )
                    )}
                </Spin>
            </div>
        </>

    )
}
