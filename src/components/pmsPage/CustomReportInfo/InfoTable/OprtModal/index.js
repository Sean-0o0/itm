import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Modal, Form, message, Spin, Input, Button, Table, Steps } from 'antd';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
const { Step } = Steps;

function OprtModal(props) {
  const { visible, setVisible, form, hotRef } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //
  const [curStep, setCurStep] = useState(0); //当前tab ID
  const hotElement = hotRef.current;
  const data = [
    ['A1', 'B1', 'C1', 1],
    ['A2', 'B2', 'C2', 2],
    ['A3', 'B3', 'C3', 1],
  ];

  useEffect(() => {
    console.log('🚀 ~ file: index.js:21 ~ useEffect ~  hotElement:', hotElement);
    // if (hotElement !== null) {
    //   const hotInstance = new Handsontable(hotElement, {
    //     data: data,
    //     columns: [
    //       {},
    //       {},
    //       {},
    //       {
    //         type: 'dropdown',
    //         editor: 'select',
    //         selectOptions: ['aaa', 'bbb'],
    //       },
    //     ],
    //     colHeaders: true,
    //     // rowHeaders: true,
    //     mergeCells: true,
    //     licenseKey: 'non-commercial-and-evaluation',
    //     contextMenu: ['mergeCells', 'row_above', 'row_below', 'col_left', 'col_right'],
    //     afterChange: () => {
    //       // hotInstance?.render();
    //     },
    //   });

    //   return () => {
    //     hotInstance?.destroy();
    //   };
    // }
  }, [hotRef]);

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
    setCurStep(v);
  };

  const handleContinue = () => {};

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
          <a style={{ color: '#3361ff' }}>查看模板</a>
          <a style={{ color: '#3361ff', marginLeft: 6 }}>使用模板</a>
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
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <div className="modal-footer">
          <Button className="btn-default" onClick={handleCancel}>
            取消
          </Button>
          <Button
            loading={isSpinning}
            className="btn-primary"
            type="primary"
            onClick={handleContinue}
          >
            确认并继续
          </Button>
          <Button loading={isSpinning} className="btn-primary" type="primary" onClick={handleOk}>
            确认
          </Button>
        </div>
      }
    >
      <div className="body-title-box">
        <strong>账号新增</strong>
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
          <Form.Item required label="报告名称" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
            <div ref={hotRef}>111</div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(OprtModal);
