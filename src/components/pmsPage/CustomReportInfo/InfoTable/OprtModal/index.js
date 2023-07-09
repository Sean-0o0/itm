import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Modal, Form, message, Spin, Input, Button, Table, Steps, Select, Radio } from 'antd';
const { Step } = Steps;

function OprtModal(props) {
  const { visible, setVisible, form, BGLX = [] } = props;
  // console.log('🚀 ~ file: index.js:9 ~ OprtModal ~ BGLX:', BGLX);
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //
  const [curStep, setCurStep] = useState(0); //当前tab ID
  const [columnsData, setColumnsData] = useState([{}]); //字段数据
  const [presetData, setPresetData] = useState([{}]); //预设数据
  const [ZDLX, setZDLX] = useState(['分类字段', '填写字段']); //字段类型

  // useEffect(() => {
  //   let count = 0;
  //   columnsData.forEach(x => {
  //     if (x.ZDLX === '分类字段') count++;
  //   });
  //   // console.log('🚀 ~ file: index.js:25 ~ useEffect ~ columnsData:', columnsData);
  //   if (count === 3) {
  //     setZDLX(['填写字段']);
  //   } else {
  //     setZDLX(['分类字段', '填写字段']);
  //   }
  //   return () => {};
  // }, [columnsData.length, JSON.stringify(columnsData)]);

  useEffect(() => {
    console.log('@@presetData', presetData);
    return () => {};
  }, [JSON.stringify(presetData), presetData.length]);

  const handleOk = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        setVisible(false);
      }
    });
  };

  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  const onStepChange = v => {
    if (v === 1) {
      handleNext();
    } else setCurStep(v);
  };

  const handleNext = () => {
    let empty = [];
    const arr = ['', ' ', undefined, null];
    // for (let i = 0; i < columnsData.length; i++) {
    //   if (!empty.includes('字段名称') && arr.includes(columnsData[i].ZDMC)) {
    //     empty.push('字段名称');
    //   }
    //   if (!empty.includes('字段类型') && arr.includes(columnsData[i].ZDLX)) {
    //     empty.push('字段类型');
    //   }
    // }
    // if (empty.length > 0) {
    //   message.error(empty.join('、') + '不能为空', 1);
    // } else {
    //   setCurStep(1);
    // }
    setCurStep(1);
  };
  const handleLast = () => {
    setCurStep(0);
  };

  //表格模板 - 列配置
  const rptTemplateColumns = [
    {
      title: '模板名称',
      key: 'MBMC',
      dataIndex: 'MBMC',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'CZ',
      dataIndex: 'CZ',
      align: 'center',
      width: 200,
      render: () => (
        <Fragment>
          <a style={{ color: '#3361ff' }}>查看</a>
          <a style={{ color: '#3361ff', marginLeft: 6 }}>使用</a>
        </Fragment>
      ),
    },
  ];

  return (
    <Modal
      wrapClassName="editMessage-modify custom-report-edit-modal"
      width={'850px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      forceRender={true}
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
                onClick={handleOk}
              >
                保存
              </Button>
            </Fragment>
          )}
        </div>
      }
    >
      <div className="body-title-box">
        <strong>新增报告</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Steps
            current={curStep}
            onChange={onStepChange}
            type="navigation"
            style={{ marginBottom: 16 }}
          >
            <Step title="定义报告字段" status={curStep === 0 ? 'process' : 'wait'} />
            <Step title="预设填写数据" status={curStep === 1 ? 'process' : 'wait'} />
          </Steps>
          <div style={{ display: curStep !== 0 ? 'none' : 'block' }}>
            <Form.Item label="报告名称" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              {getFieldDecorator('bbmc', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '报告名称不允许空值',
                  },
                ],
              })(<Input className="item-selector" placeholder="请输入报告名称" allowClear />)}
            </Form.Item>
            <Form.Item label="报告类型" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              {getFieldDecorator('bbmc', {
                initialValue: false,
                rules: [
                  {
                    required: true,
                    message: '报告类型不允许空值',
                  },
                ],
              })(
                <Radio.Group className="item-component">
                  {BGLX.map(x => (
                    <Radio key={x.ibm} value={x.ibm}>
                      {x.note}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item required label="报告模版" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              <Table
                columns={rptTemplateColumns}
                rowKey={'MBMC'}
                dataSource={[
                  {
                    MBMC: 'xxxx模板名称',
                  },
                ]}
                pagination={false}
                bordered
              />
            </Form.Item>
            <Form.Item
              required
              label="报告字段"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              style={{ marginBottom: 0 }}
            ></Form.Item>
          </div>
          <Form.Item
            required
            label="预设字段"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            style={{ marginBottom: 0, display: curStep === 0 ? 'none' : 'block' }}
          ></Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(OprtModal);
