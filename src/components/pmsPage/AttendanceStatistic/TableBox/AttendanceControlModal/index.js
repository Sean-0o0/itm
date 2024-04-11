import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Spin, Row, Col, Radio, DatePicker } from 'antd';
import moment from 'moment';
import {
  QuerySysConfigInfo,
  SelfProjectMonthAttendManage,
} from '../../../../../services/pmsServices';

function AttendanceControlModal(props) {
  const {
    visible,
    setVisible,
    form,
    defaultDate = moment(),
  } = props;
  const { validateFields, setFieldsValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState(0);
  const [status, setStatus] = useState('OPEN');
  const [oldTime, setOldTime] = useState([]);

  const labelCol = 4;
  const wrapperCol = 20;

  const ztArr = [
    { title: '开启考勤登记', value: 'OPEN' },
    { title: '关闭考勤登记', value: 'CLOSE' },
  ]

  useEffect(() => {
    if (visible) {
      querySysConfigInfo();
    }
    return () => {};
  }, [visible]);

  //自研项目考勤登记月份管理
  const querySysConfigInfo = () => {
    try {
      setIsSpinning(true);
      QuerySysConfigInfo({
        configName: "自研项目考勤登记月份管理"
      })
        .then(res => {
          if (res?.success) {
            const result = JSON.parse(res.result);
            if(result.length > 0) {
              if(result[0].config) {
                const config = JSON.parse(result[0].config)
                setStatus(config.state);
                setOldTime([moment(String(config.startMonth)), moment(String(config.endMonth))])
                setFieldsValue({
                  range: [moment(String(config.startMonth)), moment(String(config.endMonth))],
                  zt: config.state,
                });
              }
            }
          }
        })
    } catch (e) {
      message.error('自研项目考勤登记月份管理信息查询失败', 1);
    } finally {
      setIsSpinning(false);
    }
  };

  const handleOk = () => {
    validateFields(async (err, values) => {
      if (!err) {
        try {
          setIsSpinning(true);
          SelfProjectMonthAttendManage({
            startMonth: values.zt === 'OPEN' ? parseInt(moment(values.range[0]).format('YYYYMM')) : parseInt(moment(oldTime[0]).format('YYYYMM')),
            endMonth: values.zt === 'OPEN' ? parseInt(moment(values.range[1]).format('YYYYMM')) : parseInt(moment(oldTime[1]).format('YYYYMM')),
            state: values.zt
          })
            .then(res => {
              if (res?.success) {
                message.success('操作成功', 1);
                handleCancel();
              }
            })
        } catch (e) {
          message.error('操作失败', 1);
        } finally {
          setIsSpinning(false);
        }
      }
    });
  };

  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  const handleChangeStatus = (e) => {
    setStatus(e.target.value)
  };

  //单选按钮
  const getRadio = ({ label, dataIndex, initialValue, radioArr = [], labelCol, wrapperCol, labelNode }) => {
    return (
      <Col span={24}>
        <Form.Item
          label={labelNode ? labelNode : label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
        >
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <Radio.Group value={status} onChange={handleChangeStatus}>
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

  return (
    <Modal
      wrapClassName="editMessage-modify employment-application-modal"
      width={'600px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="确认"
    >
      <div className="body-title-box">
        <strong>考勤控制</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Row>
            {getRadio({
              label: '状态',
              dataIndex: 'zt',
              initialValue: undefined,
              radioArr: ztArr,
              labelCol,
              wrapperCol
            })}
          </Row>
          { status === 'OPEN' &&
            <Row>
              <Col span={24}>
                <Form.Item label="月份范围" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('range', {
                    rules: [
                      {
                        required: true,
                        message: '月份范围不允许为空！',
                      },
                    ],
                  })(
                    <DatePicker.RangePicker
                      style={{ minWidth: '100%' }}
                      mode={['month', 'month']}
                      placeholder="请选择"
                      format="YYYY-MM"
                      open={open}
                      onOpenChange={v => {
                        setOpen(v);
                        setFlag(0);
                      }}
                      onChange={(dates, dateStrings) => {
                        setFieldsValue({
                          range: dates,
                        });
                      }}
                      onPanelChange={dates => {
                        setFieldsValue({
                          range: dates,
                        });
                        let f = flag + 1;
                        setFlag(f);
                        setOpen(f < 2);
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          }
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(AttendanceControlModal);
