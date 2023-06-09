import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, message, Spin, Row, Col, Select } from 'antd';
import moment from 'moment';
import { QueryRequirementListPara, QueryUserRole } from '../../../../../services/pmsServices';
import axios from 'axios';
import config from '../../../../../utils/config';

const { Option } = Select;
const { api } = config;
const {
  pmsServices: { outsourceCostExportExcel },
} = api;

function ExpenseExportModal(props) {
  const { visible, setVisible, form, reflush, quarterData = [] } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator, setFieldsValue } = form;
  const [xmmcData, setXmmcData] = useState([]); //项目名称
  const [isSpinning, setIsSpinning] = useState(false);
  const [dateRange, setDateRange] = useState(quarterData[0]?.range); //开始结束月份
  const [checkQuarter, setCheckQuarter] = useState('第一季度'); //用来最后获取校验用的
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    getSelectorData();
    return () => {};
  }, []);

  //季度变化
  const handleQuarterChange = (v, node) => {
    const range = [...(node?.props?.range ?? [])];
    setDateRange(range);
    if (node?.props?.jd === 1) {
      setCheckQuarter('第一季度');
    } else if (node?.props?.jd === 2) {
      setCheckQuarter('第二季度');
    } else if (node?.props?.jd === 3) {
      setCheckQuarter('第三季度');
    } else {
      setCheckQuarter('第四季度');
    }
  };

  //下拉框数据
  const getSelectorData = () => {
    LOGIN_USER_INFO.id !== undefined && setIsSpinning(true);
    LOGIN_USER_INFO.id !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole = '' } = res;
            QueryRequirementListPara({
              current: 1,
              pageSize: 10,
              paging: -1,
              sort: '',
              total: -1,
              cxlx: 'FYJS',
              js: zyrole === '外包项目对接人' ? zyrole : role,
            })
              .then(res => {
                if (res?.success) {
                  setXmmcData([...JSON.parse(res.xmxx)]);
                  setIsSpinning(false);
                }
              })
              .catch(e => {
                message.error('项目名称信息查询失败', 1);
              });
          }
        })
        .catch(e => {
          message.error('用户角色信息查询失败', 1);
        });
  };

  const handleOk = () => {
    validateFields(err => {
      if (!err) {
        let arr = xmmcData.filter(x => x.ID === String(getFieldValue('xmmc')));
        if (arr.length > 0) {
          setIsSpinning(true);
          axios({
            method: 'POST',
            url: outsourceCostExportExcel,
            responseType: 'blob',
            data: {
              jd: checkQuarter,
              jssj: Number(dateRange[1]?.format('YYYYMM')),
              kssj: Number(dateRange[0]?.format('YYYYMM')),
              nf: moment().year(),
              xmid: Number(getFieldValue('xmmc') ?? 0),
              xmmc: arr[0].XMMC,
            },
          })
            .then(res => {
              console.log(res);
              const href = URL.createObjectURL(res.data);
              const a = document.createElement('a');
              a.download = arr[0].XMMC + checkQuarter + '人力外包费用结算表';
              a.href = href;
              a.click();
              window.URL.revokeObjectURL(a.href);
              setIsSpinning(false);
              message.success('正在导出', 1);
            })
            .catch(e => {
              console.log('🚀 ~ file: index.js:121 ~ handleOk ~ e:', e);
              message.error('导出失败', 1);
              setIsSpinning(false);
            });
        }
      }
    });
  };

  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  //项目名称变化是清空人员列表
  const handleXmmcChange = v => {};

  return (
    <Modal
      wrapClassName="editMessage-modify expense-calculation-modal"
      width={'720px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isSpinning}
      okText="导出"
    >
      <div className="body-title-box">
        <strong>费用导出</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form
          className="content-box"
          style={{ minHeight: 0, marginLeft: 0, padding: 24, paddingBottom: 0 }}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="项目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('xmmc', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '项目名称不允许空值',
                    },
                  ],
                })(
                  <Select
                    className="item-selector"
                    placeholder="请选择"
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleXmmcChange}
                  >
                    {xmmcData.map(x => {
                      return (
                        <Option key={x.ID} value={x.ID}>
                          {x.XMMC}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="季度" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('jd', {
                  initialValue: quarterData[0]?.title || '',
                  rules: [
                    {
                      required: true,
                      message: '季度不允许空值',
                    },
                  ],
                })(
                  <Select
                    className="item-selector"
                    placeholder="请选择"
                    showSearch
                    allowClear
                    optionLabelProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleQuarterChange}
                  >
                    {quarterData.map((x, i) => (
                      <Option key={i} value={x.title} range={x.range} jd={i + 1}>
                        {x.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(ExpenseExportModal);
