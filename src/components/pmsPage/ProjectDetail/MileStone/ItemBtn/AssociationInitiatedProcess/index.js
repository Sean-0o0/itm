import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Form, message, Modal, Row, Spin, Tooltip, Radio, Select, Input } from 'antd';
import moment from 'moment';
import { QueryIteContractFlow, RelIteContractFlow } from '../../../../../../services/pmsServices';

export default Form.create()(function AssociationInitiatedProcess(props) {
  const { visible, setVisible, xmid = -2, form = {} } = props;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [gllcData, setGllcData] = useState([]); //关联流程下拉框数据

  const labelCol = 4;
  const wrapperCol = 20;

  useEffect(() => {
    if (visible && xmid !== -2) {
      getGllcData(xmid);
    }
    return () => {};
  }, [visible, xmid]);

  //获取关联流程下拉框数据
  const getGllcData = projectId => {
    setIsSpinning(true);
    QueryIteContractFlow({ queryType: 1, projectId })
      .then(res => {
        if (res?.success) {
          setGllcData(JSON.parse(res.result));
          console.log('🚀 ~ getGllcData: ', JSON.parse(res.result));
          //to do ...
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀关联流程下拉框数据', e);
        message.error('关联流程下拉框数据获取失败', 1);
        setIsSpinning(false);
      });
  };

  //单选框、下拉框静态值
  const constData = {
    glfs: [
      { title: '系统中发起的流程', value: 1 },
      // { title: 'OA中发起的流程', value: 2 },
    ],
  };

  //单选框
  const getRadio = ({
    label,
    dataIndex,
    initialValue,
    radioArr = [{ title: 'xx', value: 1 }],
    labelCol,
    wrapperCol,
  }) => {
    return (
      <Col span={24}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <Radio.Group>
              {radioArr.map(x => (
                <Radio key={x.value} value={x.value}>
                  {x.title}
                </Radio>
              ))}
            </Radio.Group>,
          )}
        </Form.Item>
      </Col>
    );
  };

  //单选普通下拉框
  const getSingleSelector = ({
    label,
    dataIndex,
    initialValue,
    labelCol,
    wrapperCol,
    sltArr = [],
  }) => {
    return (
      <Col span={24}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <Select placeholder="请选择" optionFilterProp="optionfilter" showSearch allowClear>
              {sltArr.map(x => (
                <Select.Option optionfilter={x.BT} key={x.LCID} value={x.LCID}>
                  <Tooltip title={x.BT} placement="topLeft">
                    {x.BT}
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
    );
  };

  //输入框
  const getInput = (label, dataIndex, initialValue, labelCol, wrapperCol) => {
    return (
      <Col span={24}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <Input
              maxLength={500}
              placeholder={'请输入' + label}
              allowClear="true"
              style={{ width: '100%' }}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  //提交数据
  const onOk = () => {
    validateFields((err, values) => {
      const fn = () => {
        //关联迭代合同
        setIsSpinning(true);
        RelIteContractFlow({
          type: values.glfs,
          flowId: values.gllc,
          url: values.lclj,
          flowName: values.lcbt,
          projectId: xmid,
        })
          .then(res => {
            if (res?.success) {
              message.success('操作成功', 1);
              setIsSpinning(false);
              onCancel();
            }
          })
          .catch(e => {
            console.error('🚀关联迭代合同', e);
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
      };
      if (!err) {
        if (values.glfs === 2) {
          if (values.lclj?.includes('&_tf_file_id=')) {
            fn();
          } else {
            message.error('链接格式不匹配！', 1);
          }
        } else {
          fn();
        }
      }
    });
  };

  //取消
  const onCancel = () => {
    resetFields();
    setVisible(false);
  };

  //弹窗参数
  const modalProps = {
    wrapClassName: 'association-initiated-process-modal',
    width: 600,
    maskClosable: false,
    style: { top: 60 },
    maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
    zIndex: 100,
    title: null,
    visible,
    onCancel,
    onOk,
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>关联已发起流程</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Row>
            {getRadio({
              label: '关联方式',
              dataIndex: 'glfs',
              initialValue: 1,
              radioArr: constData.glfs,
              labelCol,
              wrapperCol,
            })}
          </Row>
          {getFieldValue('glfs') === 1 ? (
            <Row>
              {getSingleSelector({
                label: '关联流程',
                dataIndex: 'gllc',
                initialValue: undefined,
                labelCol,
                wrapperCol,
                sltArr: gllcData,
              })}
            </Row>
          ) : (
            <Fragment>
              <Row>{getInput('流程标题', 'lcbt', undefined, labelCol, wrapperCol)}</Row>
              <Row>{getInput('流程链接', 'lclj', undefined, labelCol, wrapperCol)}</Row>
            </Fragment>
          )}
        </Form>
      </Spin>
    </Modal>
  );
});
