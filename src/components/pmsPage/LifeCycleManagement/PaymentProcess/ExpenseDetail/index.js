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
import { WpsInvoke, WpsClientOpen } from '../../../../../js/wpsjsrpcsdk';
import { PluginsUrl } from '../../../../../utils/config';
import moment from 'moment';
import AddExpense from './AddExpense';
const { Option } = Select;

const LOGIN_USER_ID = localStorage.getItem('firstUserID');

const ExpenseDetail = props => {
  const { currentXmid, setIsSpinning, isXzTurnRed, setIsXzTurnRed, form, userykbid } = props;
  const [addExpenseModalVisiable, setAddExpenseModalVisiable] = useState(false);
  const [expenseDetail, setExpenseDetail] = useState([]); //费用详情数据
  //加载状态
  const [isExpenseSpinning, setIsExpenseSpinning] = useState(false);
  const { getFieldDecorator } = form;

  //费用明细新增弹窗调用成功 - 获取费用明细
  const handleAddExpenseSuccess = data => {
    // getExpenseDetailData(setIsExpenseSpinning);
    // setIsExpenseSpinning(true);
    setAddExpenseModalVisiable(false);
    setIsXzTurnRed(false);
    setExpenseDetail(p => [...[...expenseDetail, data]]);
    console.log(
      '🚀 ~ file: index.js ~ line 44 ~ handleAddExpenseSuccess ~ [...expenseDetail, data]',
      [...expenseDetail, data],
    );
  };

  //处理点击新增
  const handleAddExpense = () => {
    setAddExpenseModalVisiable(true);
  };

  //唤起WPS
  const WPSInvoke = param => {
    let clientType = WpsInvoke.ClientType.wps;
    let name = 'WpsOAAssist';
    if (
      param.filepath.includes('.docx') ||
      param.filepath.includes('.doc') ||
      param.filepath.includes('.DOCX') ||
      param.filepath.includes('.DOC')
    ) {
      clientType = WpsInvoke.ClientType.wps;
      name = 'WpsOAAssist';
    }
    if (param.filepath.includes('.xlsx') || param.filepath.includes('.xls')) {
      clientType = WpsInvoke.ClientType.et;
      name = 'EtOAAssist';
    }
    if (param.filepath.includes('.pdf')) {
      window.open(param.filepath);
      return;
    }
    const WpsClient = new WpsClientOpen.WpsClient(clientType);
    //打包时修改config.js文件里的插件地址PluginsUrl。
    WpsClient.jsPluginsXml = PluginsUrl;
    WpsClient.InvokeAsHttp(
      // clientType, // 组件类型
      name, // 插件名，与wps客户端加载的加载的插件名对应
      'InvokeFromSystemDemo', // 插件方法入口，与wps客户端加载的加载的插件代码对应，详细见插件代码
      JSON.stringify(param), // 传递给插件的数据
      function(result) {
        // 调用回调，status为0为成功，其他是错误
        // console.log("🚀 ~ file: index.js ~ line 79 ~ WPSInvoke ~ result", result)
        if (result.status) {
          if (result.status === 100) {
            message.info('请在稍后打开的网页中，点击"高级" => "继续前往"，完成授权。');
            return;
          }
          message.info(result.message);
        } else {
          message.info(result.response);
        }
      },
      true,
    );
  };

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
  const data = [
    {
      id: 1,
      fylx: '办公用品',
      je: 12,
      rq: '20220212',
      fplx: '普通发票',
      fp: {
        items: [
          [1, '滴滴电子发票1.pdf'],
          [1, '滴滴电子发票2.pdf'],
          [1, '滴滴电子发票3.pdf'],
        ],
      },
      ysxm: '',
      se: '',
      sl: '',
      xfsy: '这是一条普通的消费事由。。。',
      fj: {
        items: [
          [1, '滴滴电子发票1.pdf'],
          [1, '滴滴电子发票2.pdf'],
          [1, '滴滴电子发票3.pdf'],
        ],
      },
      htfyj: '某某合同复印件.pdf',
      ysbgfyj: '某某验收报告复印件.pdf',
      fylxdm: 'z',
      fylxmbdm: 'z',
      fpbm: 'z',
      ysfydm: 'z',
    },
    {
      id: 1,
      fylx: '办公用品',
      je: 12,
      rq: '20220212',
      fplx: '普通发票',
      fp: {
        items: [
          [1, '滴滴电子发票1.pdf'],
          [1, '滴滴电子发票2.pdf'],
          [1, '滴滴电子发票3.pdf'],
        ],
      },
      ysxm: '',
      se: '',
      sl: '',
      xfsy: '这是一条普通的消费事由。。。',
      fj: {
        items: [
          [1, '滴滴电子发票1.pdf'],
          [1, '滴滴电子发票2.pdf'],
          [1, '滴滴电子发票3.pdf'],
        ],
      },
      htfyj: '某某合同复印件.pdf',
      ysbgfyj: '某某验收报告复印件.pdf',
      fylxdm: 'z',
      fylxmbdm: 'z',
      fpbm: 'z',
      ysfydm: 'z',
    },
  ];
  const popoverContent = data => {
    data = [
      { name: '滴滴电子发票111111111111111111.pdf' },
      { name: '滴滴电子发票1.pdf' },
      { name: '滴滴电子发票1.pdf' },
      { name: '滴滴电子发票1.pdf' },
      { name: '滴滴电子发票111111111111111111.pdf' },
    ];
    return (
      <div className="list">
        {data?.map(x => (
          <div className="item">
            <img
              alt=""
              src={require('../../../../../image/pms/LifeCycleManagement/attachment.png')}
            />
            <span>{x.name}</span>
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
          handleAddExpenseSuccess={handleAddExpenseSuccess}
        />
        <Spin
          spinning={isExpenseSpinning}
          tip="加载中"
          size="large"
          wrapperClassName="expense-detail-spin"
        >
          {expenseDetail?.map((item, index) => (
            <div className="content-box" key={item.id}>
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
                    <Popover
                      title="发票"
                      content={popoverContent()}
                      overlayClassName="receipt-content-popover"
                    >
                      <div className="receipt-content">
                        {item.receiptFileInfo?.length !== 0 ? '已有发票' : '无'}
                      </div>
                    </Popover>
                  </div>
                </div>
                <div className="receipt-box">
                  <div className="receipt-title">
                    <div className="divider"></div>
                    <span>OA流程附件：</span>
                    <Popover
                      title="附件"
                      content={popoverContent()}
                      overlayClassName="receipt-content-popover"
                    >
                      <div className="attachment-content">
                        {item.attachmentLength !== 0 ? item.attachmentLength + '个附件' : '无'}
                      </div>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Spin>
      </div>
    </>
  );
};
export default Form.create()(ExpenseDetail);
