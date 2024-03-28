import React, { useEffect, useState } from 'react';
import { Button, Col, Form, message, Modal, Row, Select, Spin, Tooltip } from 'antd';
import moment from 'moment';
import {
  QueryXCContractInfo,
  UpdateHTXX,
  UpdatePaymentContract,
} from '../../../../../../services/pmsServices';
import { connect } from 'dva';
import { debounce } from 'lodash';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(
  Form.create()(function AssociationOAContract(props) {
    const { visible, setVisible, form, refresh, htData = {}, roleData = {} } = props;
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [sltData, setSltData] = useState([]); //OA合同下拉框数据
    const [curData, setCurData] = useState({}); //下拉框选中的OA合同
    const labelCol = 8;
    const wrapperCol = 16;
    const roleTxt =
      (JSON.parse(roleData.testRole || '{}')?.ALLROLE ?? '') + ',' + (roleData.role ?? ''); //角色信息

    useEffect(() => {
      if (visible) getPTHTData();
      return () => {};
    }, [visible]);

    //OA合同下拉框
    const getPTHTData = () => {
      setIsSpinning(true);
      //信创合同信息
      QueryXCContractInfo({
        current: 1,
        pageSize: 999,
        paging: -1,
        sort: '',
        total: -1,
        role: roleTxt + ',项目详情',
        handleStatus: 2,
      })
        .then(res => {
          if (res?.success) {
            console.log('🚀 ~ tableData:', JSON.parse(res.result));
            setSltData(JSON.parse(res.result));
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀OA合同下拉框数据', e);
          message.error('OA合同下拉框数据获取失败', 1);
          setIsSpinning(false);
        });
    };

    //提交数据
    const onOk = debounce(() => {
      validateFields(e => {
        if (!e) {
          setIsSpinning(true);
          const params = {
            xmmc: Number(htData.xmid),
            json: JSON.stringify([]),
            rowcount: 0,
            htje: htData.htje === undefined ? undefined : Number(htData.htje),
            qsrq: htData.qsrq === undefined ? undefined : Number(htData.qsrq),
            gysid: htData.gys === undefined ? undefined : Number(htData.gys),
            czlx: 'UPDATE',
            lcid: htData.htlc === undefined || htData.htlc === '' ? -1 : Number(htData.htlc),
            htid: htData.htxxid === undefined ? undefined : Number(htData.htxxid),
            oahtid: Number(curData.HTID),
            htmc: curData.HTMC,
          };
          console.log('🚀 ~ onOk ~ params:', params);
          UpdateHTXX(params)
            .then(res => {
              if (res?.success) {
                refresh();
                message.success('操作成功', 1);
                setIsSpinning(false);
                onCancel();
              }
            })
            .catch(e => {
              console.error('🚀 UpdateHTXX', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
        }
      });
    }, 500);

    //取消
    const onCancel = () => {
      resetFields();
      setCurData({});
      setVisible(false);
    };

    //输入框 - 灰
    const getInputDisabled = (label, value = '-', labelCol, wrapperCol) => {
      return (
        <Col span={12}>
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
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <Tooltip title={value} placement="topLeft">
                {value}
              </Tooltip>
            </div>
          </Form.Item>
        </Col>
      );
    };

    //金额格式化
    const getAmountFormat = value => {
      if ([undefined, null, '', ' ', NaN].includes(value)) return '-';
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
      <Modal
        wrapClassName="association-contract-modal"
        width={700}
        maskClosable={false}
        style={{ top: 60 }}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        zIndex={103}
        title={null}
        visible={visible}
        destroyOnClose={true}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={isSpinning}
      >
        <div className="body-title-box">
          <strong>关联OA合同</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Form className="content-box">
            <Row>
              <Col span={12}>
                <Form.Item
                  label="选择OA合同"
                  labelCol={{ span: labelCol }}
                  wrapperCol={{ span: wrapperCol }}
                  style={{ marginBottom: 24 }}
                >
                  {getFieldDecorator('glht', {
                    rules: [
                      {
                        required: true,
                        message: '选择OA合同不允许空值',
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择OA合同"
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children?.props?.children
                          ?.toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(v, node) => {
                        setCurData(node?.props?.data || {});
                      }}
                    >
                      {sltData.map(x => (
                        <Option key={x.HTID} value={x.HTID} data={x}>
                          <Tooltip title={x.HTMC} placement="topLeft">
                            {x.HTMC}
                          </Tooltip>
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              {getInputDisabled('合同名称', curData.HTMC, labelCol, wrapperCol)}
            </Row>
            <Row>
              {getInputDisabled('合同乙方', curData.HTYF, labelCol, wrapperCol)}
              {getInputDisabled('合同金额', getAmountFormat(curData.HTJE), labelCol, wrapperCol)}
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }),
);
