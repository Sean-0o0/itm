import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Input, Table, Row, Col, DatePicker, Tooltip } from 'antd';
import moment from 'moment';
import {
  FetchqueryOutsourceRequirement,
  OperateOutsourceRequirements,
} from '../../../../../services/pmsServices';

const { TextArea } = Input;

function ExpenseInfo(props) {
  const { visible, setVisible, form, xqid = -2, WBRYGW = [], reflush } = props;
  const {
    validateFields,
    getFieldValue,
    resetFields,
    getFieldDecorator,
    validateFieldsAndScroll,
  } = form;
  const [data, setData] = useState({
    ryxq: [],
    rydj: [],
    wbxq: {},
  }); //回显数据
  const [isSpinning, setIsSpinning] = useState(false); //加载状态

  useEffect(() => {
    if (xqid !== -2) {
      getData(xqid);
    }
    return () => {};
  }, [xqid]);

  const getData = xqid => {
    setIsSpinning(true);
    FetchqueryOutsourceRequirement({
      xqid,
      cxlx: 'SJ',
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchqueryOutsourceRequirement ~ res', res);
          let obj = {
            rydj: JSON.parse(res.rydjxx),
            ryxq: JSON.parse(res.ryxqxx),
            wbxq: JSON.parse(res.wbxqxx)[0],
          };
          setData({ ...obj });
          setIsSpinning(false);
          // console.log('🚀 ~ file: index.js:49 ~ getData ~ obj:', obj);
        }
      })
      .catch(e => {
        message.error('接口信息获取失败');
      });
  };

  const columns = [
    {
      title: '人员等级',
      dataIndex: 'RYDJ',
      width: '10%',
      key: 'RYDJ',
      ellipsis: true,
      render: txt => <Input value={txt} readOnly />,
    },
    {
      title: '岗位',
      dataIndex: 'GW',
      width: '10%',
      key: 'GW',
      ellipsis: true,
      render: txt => (
        <Tooltip title={WBRYGW.filter(x => x.ibm === txt)[0]?.note} placement="topLeft">
          <Input value={WBRYGW.filter(x => x.ibm === txt)[0]?.note} readOnly />
        </Tooltip>
      ),
    },
    {
      title: '人员数量',
      dataIndex: 'RYSL',
      width: '10%',
      key: 'RYSL',
      ellipsis: true,
      render: txt => <Input value={txt} readOnly />,
    },
    {
      title: '时长(人/月)',
      dataIndex: 'SC',
      width: '12%',
      key: 'SC',
      ellipsis: true,
      render: txt => <Input value={txt} readOnly />,
    },
    {
      title: '要求',
      dataIndex: 'YQ',
      key: 'YQ',
      ellipsis: false,
      render: txt => (
        <Tooltip title={txt.replace(/<br>/g, '\n')} placement="topLeft">
          <TextArea
            value={txt.replace(/<br>/g, '\n')}
            autoSize={{ minRows: 1, maxRows: 6 }}
            style={{ cursor: 'default' }}
            readOnly
          >
            {txt.replace(/<br>/g, '\n')}
          </TextArea>
        </Tooltip>
      ),
    },
  ];

  //确认
  const handleOk = () => {
    validateFieldsAndScroll(err => {
      if (!err) {
        setIsSpinning(true);
        let submitProps = {
          xqmc: getFieldValue('xqmc') !== '' ? getFieldValue('xqmc') : data.wbxq.XQMC,
          xqid: Number(xqid),
          jlrqsj: Number(getFieldValue('jlrqsj')?.format('YYYYMMDD')),
          pcrqsj: Number(getFieldValue('pcrqsj')?.format('YYYYMMDD')),
          dcrqsj: Number(getFieldValue('dcrqsj')?.format('YYYYMMDD')),
          xqrqsj: Number(getFieldValue('xqrqsj')?.format('YYYYMMDD')),
          czlx: 'SJ',
        };
        console.log('🚀 ~ file: index.js:88 ~ handleOk ~ submitProps:', submitProps);
        OperateOutsourceRequirements(submitProps)
          .then(res => {
            if (res?.success) {
              setVisible(false);
              resetFields();
              reflush();
              setIsSpinning(false);
              message.success('上架成功', 1);
            }
          })
          .catch(e => {
            setIsSpinning(false);
            message.error('上架失败', 1);
          });
      }
    });
  };

  //取消
  const handleCancel = () => {
    setVisible(false);
  };

  //输入框 - 灰
  const getInputDisabled = (label, value, minHeight = 32, colSpan = 12) => {
    return (
      <Col span={colSpan}>
        <Form.Item
          label={label}
          labelCol={{ span: colSpan === 12 ? 8 : 4 }}
          wrapperCol={{ span: colSpan === 12 ? 14 : 19 }}
        >
          {/* <div
            style={{
              width: '100%',
              minHeight,
              backgroundColor: '#F5F5F5',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginTop: '5px',
              lineHeight: colSpan === 12 ? '32px' : '24px',
              padding: colSpan === 12 ? '0 10px' : '6px 10px',
              fontSize: '14px',
            }}
          >
            {value}
          </div> */}
          <TextArea
            value={value}
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{ cursor: 'default' }}
            readOnly
          ></TextArea>
        </Form.Item>
      </Col>
    );
  };

  //输入框
  const getInput = (label, dataIndex, initialValue) => {
    return (
      <Col span={24}>
        <Form.Item label={label} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>
      </Col>
    );
  };

  //日期
  const getDatePicker = (label, dataIndex, initialValue) => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(<DatePicker style={{ width: '100%' }} />)}
        </Form.Item>
      </Col>
    );
  };

  return (
    <Modal
      wrapClassName="editMessage-modify demand-publish-modal"
      width={'1040px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="上架"
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>需求上架</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box" style={{ paddingRight: 0, paddingLeft: 34 }}>
          <Row>{getInput('需求名称', 'xqmc', data.wbxq.XQMC)}</Row>
          <Row>
            {getDatePicker(
              '简历反馈截止日期',
              'jlrqsj',
              data.wbxq.KFSFKQX !== undefined ? moment(data.wbxq.KFSFKQX) : null,
            )}
            {getDatePicker(
              '预计到场日期',
              'dcrqsj',
              data.wbxq.YJSYRQ !== undefined ? moment(data.wbxq.YJSYRQ) : null,
            )}
          </Row>
          <Row>
            {getDatePicker(
              '预计综合评测完成日期',
              'pcrqsj',
              data.wbxq.YJZHPCRQ !== undefined ? moment(data.wbxq.YJZHPCRQ) : null,
            )}
            {getDatePicker(
              '需求截止日期',
              'xqrqsj',
              data.wbxq.XQJZRQ_SJ !== undefined ? moment(data.wbxq.XQJZRQ_SJ) : null,
            )}
          </Row>
          <Row>{getInputDisabled('项目简介', data.wbxq.XMJJ, '64px', 24)}</Row>
          <Form.Item
            label="人员需求"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
            style={{ marginBottom: 16, marginTop: 6 }}
          >
            <div className="ryxq-table-box">
              <Table
                columns={columns}
                rowKey={'XQNRID'}
                dataSource={data.ryxq}
                scroll={data.length > 3 ? { y: 171 } : {}}
                pagination={false}
                bordered
                size="middle"
              />
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(ExpenseInfo);
