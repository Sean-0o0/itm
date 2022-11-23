import React, { useEffect, useState } from 'react';
import { Row, Col, Popconfirm, Modal, Form, Input, Table, DatePicker, message, Upload, Button, Icon, Select, Pagination, Spin, Radio, Divider } from 'antd';
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";
import { CreateOperateHyperLink } from '../../../../../services/pmsServices';

const LOGIN_USER_ID = localStorage.getItem("firstUserID");

export default function ExpenseDetail(props) {
    const data = [1, 2, 1, 3, 1, 1, 1, 1], data2 = [1, 2, 3];
    const { currentXmid } = props;
    const [addExpenseModalVisiable, setAddExpenseModalVisiable] = useState(false);
    const [addExpenseModalUrl, setAddExpenseModalUrl] = useState('#');

    const handleAddExpense = () => {
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
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    };
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
                    onSucess={() => message.success('新增成功', 1)}
                    src={addExpenseModalUrl} />}
            <div className='expense-detail-box'>
                <div className='expense-title'>
                    费用明细
                </div>
                <Button className='expense-add-btn' onClick={handleAddExpense}>新增</Button>
                <div className='content-box'>
                    <div className='expense-info'>
                        <div className='info-icon-num'>1</div>
                        <div>
                            <div className='info-type'>办公用品<Divider type='vertical' className='info-type-divider' />2022-11-15
                                <span className='info-bwb'>本位币 CNY 22.00</span>
                            </div>
                            <div className='info-reason'>消费事由：测试已有发票</div>
                        </div>
                    </div>
                    <div className='expense-content'>
                        <div className='receipt-box'>
                            <div className='receipt-title'><div className='divider'></div>发票：</div>
                            <div className='receipt-list'>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                            </div>
                        </div>
                        <div className='receipt-box'>
                            <div className='receipt-title'>
                                <div className='divider'></div>
                                OA流程附件：
                            </div>
                            <div className='receipt-list'>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='attachment-box'>
                        <div className='attachment-item'>
                            合同复印件：
                            <div className='file-item ht'><img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />十九八七六123455555555555555555555555555555.pdf</div>
                        </div>
                        <div className='attachment-item'>
                            验收报告复印件：
                            <div className='file-item ys'><img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />十九八七六123.pdf</div>
                        </div>
                    </div>
                </div>
                <div className='content-box'>
                    <div className='expense-info'>
                        <div className='info-icon-num'>2</div>
                        <div>
                            <div className='info-type'>办公用品<Divider type='vertical' className='info-type-divider' />2022-11-15
                                <span className='info-bwb'>本位币 CNY 22.00</span>
                            </div>
                            <div className='info-reason'>消费事由：测试已有发票</div>
                        </div>
                    </div>
                    <div className='expense-content'>
                        <div className='receipt-box'>
                            <div className='receipt-title'><div className='divider'></div>发票：</div>
                            <div className='receipt-list'>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                            </div>
                        </div>
                        <div className='receipt-box'>
                            <div className='receipt-title'>
                                <div className='divider'></div>
                                OA流程附件：
                            </div>
                            <div className='receipt-list'>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='attachment-box'>
                        <div className='attachment-item'>
                            合同复印件：
                            <div className='file-item ht'><img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />十九八七六123455555555555555555555555555555.pdf</div>
                        </div>
                        <div className='attachment-item'>
                            验收报告复印件：
                            <div className='file-item ys'><img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />十九八七六123.pdf</div>
                        </div>
                    </div>
                </div>
                <div className='content-box'>
                    <div className='expense-info'>
                        <div className='info-icon-num'>3</div>
                        <div>
                            <div className='info-type'>办公用品<Divider type='vertical' className='info-type-divider' />2022-11-15
                                <span className='info-bwb'>本位币 CNY 22.00</span>
                            </div>
                            <div className='info-reason'>消费事由：测试已有发票</div>
                        </div>
                    </div>
                    <div className='expense-content'>
                        <div className='receipt-box'>
                            <div className='receipt-title'><div className='divider'></div>发票：</div>
                            <div className='receipt-list'>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='receipt-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/receipt.png')} />
                                    十九八七六123.pdf
                                </div>
                            </div>
                        </div>
                        <div className='receipt-box'>
                            <div className='receipt-title'>
                                <div className='divider'></div>
                                OA流程附件：
                            </div>
                            <div className='receipt-list'>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                                <div className='receipt-item'>
                                    <img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />
                                    十九八七六123.pdf
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='attachment-box'>
                        <div className='attachment-item'>
                            合同复印件：
                            <div className='file-item ht'><img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />十九八七六123455555555555555555555555555555.pdf</div>
                        </div>
                        <div className='attachment-item'>
                            验收报告复印件：
                            <div className='file-item ys'><img className='attachment-icon' alt='' src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')} />十九八七六123.pdf</div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
