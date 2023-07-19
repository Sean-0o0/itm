import React, { useState, useEffect, Fragment } from 'react';
import {
  Modal,
  DatePicker,
  Table,
  Spin,
  Steps,
  Form,
  Row,
  Col,
  Select,
  Input,
  Radio,
  Button,
} from 'antd';
import moment from 'moment';
import {
  FetchQueryOwnerMessage,
  QueryCreatePaymentInfo,
  QueryPaymentByCode,
  SupplyPaymentInfo,
} from '../../../../../services/pmsServices';

const { Step } = Steps;

export default Form.create()(function PaymentModal(props) {
  const { dataProps = {}, funcProps = {}, form } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const { visible = false, paymentPlan = [], xmid } = dataProps;
  const { setVisible } = funcProps;
  const [curStep, setCurStep] = useState(0); //当前tab ID
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [glsbData, setGlsbData] = useState([]); //关联设备下拉框数据
  const [selectedRowQS, setSelectedRowQS] = useState(undefined); //选中行 期数
  const [turnRed, setTurnRed] = useState(false); //报错
  const [confirmInfo, setConfirmInfo] = useState({}); //付款信息

  useEffect(() => {
    if (visible) getSelectorData();
    return () => {};
  }, [visible]);

  //关联设备 -下拉框数据
  const getSelectorData = () => {
    QueryCreatePaymentInfo({
      xmid,
    })
      .then(res => {
        if (res?.success) {
          setGlsbData(p => [...JSON.parse(res.lcxxRecord)]);
          // console.log('🚀 ~ getSelectorData ~ lcxxRecord:', [...JSON.parse(res.lcxxRecord)]);
        }
      })
      .catch(e => {
        console.error('QueryCreatePaymentInfo', e);
        message.error('关联设备采购有合同流程数据查询失败', 1);
      });
  };

  //输入框 - 灰
  const getInputDisabled = (label, value, labelCol = 6, wrapperCol = 18) => {
    return (
      <Col span={24}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          <div
            style={{
              width: '100%',
              height: '32px',
              backgroundColor: '#F5F5F5',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginTop: '5px',
              lineHeight: '32px',
              paddingLeft: '10px',
              fontSize: '14px',
              cursor: 'default',
            }}
          >
            {value}
          </div>
        </Form.Item>
      </Col>
    );
  };

  //输入框 - 付款单单号
  const getInput = () => {
    const getPaymentByCode = () => {
      setIsSpinning(true);
      QueryPaymentByCode({
        code: getFieldValue('fkddh'),
      })
        .then(res => {
          if (res.code === 1) {
            setConfirmInfo(JSON.parse(res.record));
          } else {
            setConfirmInfo([]);
          }
          setIsSpinning(false);
        })
        .catch(e => {
          console.error('🚀单据信息', e);
          message.error('单据信息获取失败', 1);
          setIsSpinning(false);
        });
    };
    return (
      <Form.Item label={'付款单单号'} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        {getFieldDecorator('fkddh', {
          initialValue: 'lllll',
          rules: [
            {
              required: true,
              message: '付款单单号不允许空值',
            },
          ],
        })(<Input placeholder={'请输入付款单单号'} onBlur={getPaymentByCode}></Input>)}
      </Form.Item>
    );
  };

  //单选框
  const getRadio = (label, dataIndex, txt1 = '是', txt2 = '否') => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator(dataIndex, {
            initialValue: 1,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <Radio.Group>
              <Radio value={1}>{txt1}</Radio>
              <Radio value={2}>{txt2}</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
      </Col>
    );
  };

  //实际付款时间
  const getDatePicker = () => {
    return (
      <Col span={12}>
        <Form.Item label="实际付款时间" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('sjfksj', {
            initialValue: moment(),
            rules: [
              {
                required: true,
                message: '实际付款时间不允许空值',
              },
            ],
          })(<DatePicker style={{ width: '100%' }} />)}
        </Form.Item>
      </Col>
    );
  };

  //关联设备采购有合同
  const getGlsbcgyhtSelector = () => {
    return (
      <>
        <Col span={24}>
          <Form.Item
            label={
              <div style={{ display: 'inline-block', lineHeight: '17px' }}>
                关联设备采购
                <br />
                有合同流程
              </div>
            }
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {getFieldDecorator('glsb', {
              // rules: [
              //   {
              //     required: true,
              //     message: '关联设备采购有合同流程不允许空值',
              //   },
              // ],
            })(
              <Select
                style={{ width: '100%', borderRadius: '8px !important' }}
                showSearch
                placeholder="请选择关联设备采购有合同流程"
              >
                {glsbData?.map((item = {}, ind) => {
                  return (
                    <Select.Option key={item.ID} value={item.ID}>
                      {item.BT}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </>
    );
  };

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //付款计划
  const getPaymentPlan = () => {
    //列配置
    const columns = [
      {
        title: '期数',
        dataIndex: 'FKQS',
        key: 'FKQS',
        width: '20%',
        ellipsis: true,
      },
      {
        title: '付款金额',
        dataIndex: 'FKJE',
        key: 'FKJE',
        align: 'right',
        width: '40%',
        ellipsis: true,
        render: txt => getAmountFormat(txt),
      },
      {
        title: '付款时间',
        dataIndex: 'FKSJ',
        key: 'FKSJ',
        width: '40%',
        ellipsis: true,
        render: txt => moment(txt).format('YYYY-MM-DD'),
      },
    ];
    //行选择
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        if (selectedRows.length > 0) setSelectedRowQS(selectedRows[0].FKQS);
      },
    };

    return (
      <Col span={24}>
        <Form.Item
          label="选择对应付款计划"
          required
          help={turnRed ? '付款计划不能为空值' : ''}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Table
            columns={columns}
            rowKey={'ID'}
            dataSource={paymentPlan}
            rowSelection={rowSelection}
            pagination={false}
            // bordered
          />
        </Form.Item>
      </Col>
    );
  };

  const handleCancel = () => {
    resetFields();
    setTurnRed(false);
    setVisible(false);
  };

  const handleNext = () => {
    form.validateFields(err => {
      if (!err) {
        if (selectedRowQS === undefined) {
          setTurnRed(true);
        } else {
          setCurStep(1);
        }
      }
    });
  };

  const handleLast = () => {
    setCurStep(0);
  };

  const onStepChange = v => {
    if (v === 1) {
      handleNext();
    } else setCurStep(v);
  };

  const handleConfirm = () => {
    validateFields(err => {
      if (!err) {
        if (selectedRowQS === undefined) {
          setTurnRed(true);
        } else {
          SupplyPaymentInfo({
             
          })
          .then(res => {
              if (res?.success) {
                console.log('🚀 ~ SupplyPaymentInfo ~ res', res);
              }
          })
          .catch(e => {
             console.error('🚀接口信息', e);
             message.error('接口信息获取失败', 1);
          });
          
          handleCancel();
        }
      }
    });
  };

  return (
    <Modal
      wrapClassName="editMessage-modify payment-process-supplement-modal"
      width={800}
      maskClosable={false}
      style={{ top: 60 }}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <div className="modal-footer">
          <Button className="btn-default" onClick={handleCancel}>
            取消
          </Button>
          {curStep === 0 ? (
            <Button
              loading={isSpinning}
              className="btn-primary"
              type="primary"
              onClick={handleNext}
            >
              下一步
            </Button>
          ) : (
            <Fragment>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={handleLast}
              >
                上一步
              </Button>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={handleConfirm}
              >
                保存
              </Button>
            </Fragment>
          )}
        </div>
      }
    >
      <div className="body-title-box">
        <strong>付款流程补录</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Steps
          current={curStep}
          onChange={onStepChange}
          type="navigation"
          style={{ marginBottom: 16, marginTop: 6 }}
        >
          <Step title="填写流程信息" status={curStep === 0 ? 'process' : 'wait'} />
          <Step title="确认付款信息" status={curStep === 1 ? 'process' : 'wait'} />
        </Steps>
        {curStep === 0 ? (
          <div className="content-box">
            <Form>
              {getInput()}
              {getInputDisabled(
                '说明',
                '填写易快报中的付款单单号，点击付款单详情中可在顶部查看，如B22000001',
              )}
              <Row>
                {getRadio('是否为硬件付款', 'yjfk')}
                {getRadio('是否为硬件入围内付款', 'yjrwfk')}
              </Row>
              {getGlsbcgyhtSelector()}
              {getRadio('是否有付款计划', 'sfyfkjh')}
              {getInputDisabled('说明', '只需要补录今年预算内的付款金额')}
              {getPaymentPlan()}
              {getDatePicker()}
            </Form>
          </div>
        ) : (
          <div className="confirm-info-box">
            <Row>
              <Col span={12}>
                <div class="info-item">
                  <span>提交人：</span>
                  {confirmInfo.tjr}
                </div>
              </Col>
              <Col span={12}>
                <div class="info-item">
                  <span>申请日期：</span>
                  {confirmInfo.tjsj}
                </div>
              </Col>
            </Row>
            <div class="info-item">
              <span>标题：</span>
              {confirmInfo.bt}
            </div>
            <Row>
              <Col span={12}>
                <div class="info-item">
                  <span>合同金额（CNY）：</span>
                  {getAmountFormat(confirmInfo.htje)}
                </div>
              </Col>
              <Col span={12}>
                <div class="info-item">
                  <span>已付款金额（CNY）：</span>
                  {getAmountFormat(confirmInfo.yfkje)}
                </div>
              </Col>
            </Row>
            <div class="info-item">
              <span>付款总金额（元）：</span>
              {getAmountFormat(confirmInfo.fkzje)}
            </div>
            <div class="info-item">
              <span>收款账户：</span>
              {confirmInfo.skzh?.khmc}&nbsp;&nbsp;
              {confirmInfo.skzh?.yhkh}&nbsp;&nbsp;
              {confirmInfo.skzh?.wdmc}
            </div>
            <div class="info-item">
              <span>描述：</span>
              {confirmInfo.ms}
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  );
});
