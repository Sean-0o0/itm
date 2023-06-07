import React, { useState } from 'react';
import {
  message,
  Button,
  Spin,
  Divider,
  Drawer,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Icon,
  Form,
  Popover,
} from 'antd';
import BridgeModel from '../../../../Common/BasicModal/BridgeModel';
import {
  CreateOperateHyperLink,
  QueryPaymentFlowDetailFile,
} from '../../../../../services/pmsServices';
// import { WpsInvoke, WpsClientOpen } from '../../../../../js/wpsjsrpcsdk';
import { PluginsUrl } from '../../../../../utils/config';
import moment from 'moment';
import AddExpense from './AddExpense';
const { Option } = Select;

const LOGIN_USER_ID = localStorage.getItem('firstUserID');

const ExpenseDetail = props => {
  const {
    currentXmid,
    setIsSpinning,
    isXzTurnRed,
    setIsXzTurnRed,
    form,
    userykbid,
    expenseDetail,
    setExpenseDetail,
  } = props;
  const [addExpenseModalVisiable, setAddExpenseModalVisiable] = useState(false);

  //加载状态
  const [isExpenseSpinning, setIsExpenseSpinning] = useState(false);
  const { getFieldDecorator } = form;
  const [updateExpense, setUpdateExpense] = useState(undefined); //费用明细编辑修改回显得数据

  //费用明细新增弹窗调用成功 - 获取费用明细
  const handleAddExpenseSuccess = data => {
    setAddExpenseModalVisiable(false);
    setIsXzTurnRed(false);
    if (expenseDetail.filter(x => x.id === data.id).length > 0) {
      console.log('修改');
      //已有的，进行更新
      let arr = [...expenseDetail];
      const index = arr.findIndex(item => data.id === item.id);
      const item = arr[index];
      arr.splice(index, 1, {
        ...item, //old
        ...data, //new
      });
      setExpenseDetail([...arr]);
    } else {
      console.log('新增');
      setExpenseDetail(p => [...[...p, data]]);
    }
  };

  //处理点击新增
  const handleAddExpense = () => {
    setAddExpenseModalVisiable(true);
  };

  //金额显示1.00
  const getJeFormat = je => {
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
  const popoverContent = data => {
    return (
      <div className="list">
        {data?.map(x => (
          <div className="item">
            <img
              alt=""
              src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')}
            />
            <span
              onClick={e => {
                e.stopPropagation();
                //文件预览
                let ifram = "<iframe width='100%' height='100%' src='" + x.base64 + "'></iframe>";
                let page = window.open().document;
                page.open();
                page.write(ifram);
                page.close();
              }}
            >
              {x.fileName || x.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="expense-detail-box">
        <div className="expense-title">费用明细</div>
        <Button
          className="expense-add-btn"
          style={isXzTurnRed ? { borderColor: '#f5222d' } : {}}
          onClick={handleAddExpense}
        >
          新增
        </Button>
        {isXzTurnRed && <span className="expense-add-btn-help">费用明细不允许空值</span>}
        {/* 费用明细新增弹窗 */}
        <AddExpense
          visible={addExpenseModalVisiable}
          setVisible={setAddExpenseModalVisiable}
          userykbid={userykbid}
          currentXmid={currentXmid}
          handleAddExpenseSuccess={handleAddExpenseSuccess}
          updateExpense={updateExpense}
          setUpdateExpense={setUpdateExpense}
        />
        <Spin
          spinning={isExpenseSpinning}
          tip="加载中"
          size="large"
          wrapperClassName="expense-detail-spin"
        >
          {expenseDetail?.map((item, index) => (
            <div
              className="content-box"
              key={item.id}
              onMouseEnter={() => {
                let arr = [...expenseDetail];
                arr.forEach(x => {
                  if (x.id === item?.id) {
                    x.isHover = true;
                  }
                });
                setExpenseDetail(p => [...arr]);
              }}
              onMouseLeave={() => {
                let arr = [...expenseDetail];
                arr.forEach(x => {
                  if (x.id === item?.id) {
                    x.isHover = false;
                  }
                });
                setExpenseDetail(p => [...arr]);
              }}
              style={item.isHover ? { backgroundColor: 'aliceblue' } : {}}
              onClick={e => {
                e.preventDefault();
                setAddExpenseModalVisiable(true);
                setUpdateExpense({
                  ...item,
                });
                // console.log('🚀 ~ 修改数据回显 ~ updateExpense:', item);
              }}
            >
              <div className="expense-info">
                <div className="info-icon-num">{index + 1}</div>
                <div className="info-wrapper">
                  <div className="info-type">
                    {item.fylxInfo?.NAME}
                    <span className="info-bwb">本位币 CNY {getJeFormat(item.je)}</span>
                  </div>
                  <div className="info-reason">消费事由：{item.consumptionReasons}</div>
                </div>
              </div>
              <div className="expense-content">
                <div className="receipt-box">
                  <div className="receipt-title">
                    <div className="divider"></div>
                    <span>发票：</span>
                    <div className="receipt-content" onClick={e => e.stopPropagation()}>
                      {item.receiptFileInfo?.length !== 0 ? (
                        <Popover
                          title="发票"
                          content={popoverContent(item.receiptFileInfo)}
                          overlayClassName="receipt-content-popover"
                        >
                          <span>已有发票</span>
                        </Popover>
                      ) : (
                        <span>无</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="receipt-box">
                  <div className="receipt-title">
                    <div className="divider"></div>
                    <span>附件：</span>
                    <div className="attachment-content" onClick={e => e.stopPropagation()}>
                      {item.attachmentLength !== 0 ? (
                        <Popover
                          title="附件"
                          content={popoverContent(item.attachmentArr)}
                          overlayClassName="receipt-content-popover"
                        >
                          <span>{item.attachmentLength + '个附件'}</span>
                        </Popover>
                      ) : (
                        <span>无</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="icon-delete"
                style={item.isHover ? {} : { visibility: 'hidden' }}
                onClick={e => {
                  //confirm
                  let arr = [...expenseDetail].filter(x => x.id !== item?.id);
                  setExpenseDetail(p => [...arr]);
                  e.stopPropagation();
                }}
              >
                <i className="iconfont delete" />
              </div>
            </div>
          ))}
        </Spin>
      </div>
    </>
  );
};
export default Form.create()(ExpenseDetail);
