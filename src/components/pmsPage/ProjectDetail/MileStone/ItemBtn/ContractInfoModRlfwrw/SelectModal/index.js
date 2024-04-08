import React, { useEffect, useState, useCallback } from 'react';
import { Col, Form, Icon, message, Modal, Spin, Tooltip, Select } from 'antd';
import { connect } from 'dva';
import { QueryPaymentAccountList } from '../../../../../../../services/pmsServices';
import { debounce } from 'lodash';
import BridgeModel from '../../../../../../Common/BasicModal/BridgeModel';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(
  Form.create()(function SelectModal(props) {
    const {
      visible,
      setVisible,
      data = {},
      setTableData,
      tableData = [],
      form = {},
      skzhSlt = [],
      editData = [],
      setEditData,
    } = props;
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [sltData, setSltData] = useState({
      skzh: [],
      loading: false,
    });
    const [sltObj, setSltObj] = useState({}); //选中值
    //供应商账户添加弹窗显示
    const [addSkzhModalVisible, setAddSkzhModalVisible] = useState(false);

    useEffect(() => {
      if (visible) {
        let arr = [...skzhSlt];
        if (data.accountObj && skzhSlt.findIndex(x => x.id === data.accountObj?.id) === -1) {
          arr.push(data.accountObj);
        }
        setSltData({
          skzh: arr,
          loading: false,
        });
        setSltObj(data.accountObj || {});
      }
      return () => {};
    }, [visible, JSON.stringify(data), JSON.stringify(skzhSlt)]);

    const getSltData = useCallback(
      debounce(async khmc => {
        try {
          setSltData(p => ({ ...p, loading: true }));
          const res = await QueryPaymentAccountList({
            type: 'ALL',
            current: 1,
            pageSize: 20,
            paging: 1,
            sort: '',
            total: -1,
            zhid: -1,
            khmc: khmc === '' ? undefined : khmc,
          });
          if (res.success) {
            setSltData(p => ({
              ...p,
              skzh: res.record,
            }));
            setIsSpinning(false);
            setSltData(p => ({ ...p, loading: false }));
          }
        } catch (error) {
          console.error('🚀供应商账户下拉框数据', error);
          message.error('供应商账户下拉框数据获取失败', 1);
          setIsSpinning(false);
          setSltData(p => ({ ...p, loading: false }));
        }
      }, 500),
      [],
    );
    const handleSearch = value => {
      getSltData(value);
    };
    const handleChange = (v, node) => {
      // console.log('🚀 ~ handleChange ~ v, node:', v, node);
      setSltObj(node?.props.item || {});
    };

    //提交数据
    const onOk = () => {
      const tableDataArr = [...tableData];
      const index = tableDataArr.findIndex(item => data.ID === item.ID);
      if (index !== -1) {
        tableDataArr.splice(index, 1, {
          ...tableDataArr[index],
          accountObj: { ...sltObj },
        });
      }
      const editDataArr = [...editData];
      const index2 = editDataArr.findIndex(item => data.ID === item.ID);
      if (index2 !== -1) {
        editDataArr.splice(index2, 1, {
          ...editDataArr[index2],
          accountObj: { ...sltObj },
        });
      } else {
        editDataArr.push({
          ...tableDataArr[index],
          accountObj: { ...sltObj },
        });
      }
      setTableData(tableDataArr);
      setEditData(editDataArr);
      onCancel();
    };

    //取消
    const onCancel = () => {
      setSltObj({});
      setVisible(false);
    };

    //弹窗参数
    const modalProps = {
      wrapClassName: 'contract-info-mod-default-modal',
      width: 650, // todo
      maskClosable: false,
      style: { top: 60 },
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 103,
      title: null,
      visible,
      onCancel,
      onOk,
      confirmLoading: isSpinning,
    };

    const addSkzhModalProps = {
      isAllWindow: 1,
      title: '新增供应商账户',
      width: '800px',
      height: '600px',
      style: { top: '60px' },
      visible: addSkzhModalVisible,
      footer: null,
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>附件上传</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Form className="content-box">
            <Form.Item label={'供应商账户'} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Select
                showSearch
                placeholder="请输入供应商账户"
                style={{ width: '100%' }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                className="skzh-selector"
                allowClear
                onSearch={handleSearch}
                value={sltObj.id}
                onChange={handleChange}
                notFoundContent={sltData.loading ? <Spin size="small" tip="加载中" /> : '暂无数据'}
              >
                {sltData.skzh?.map(item => (
                  <Select.Option key={item.id} value={item.id} item={item}>
                    <Tooltip
                      title={
                        <div>
                          开户行：{item.khmc}
                          <div>账号：{item.yhkh}</div>
                          网点：{item.wdmc}
                        </div>
                      }
                      placement="topLeft"
                    >
                      <i
                        className="iconfont icon-bank"
                        style={{ fontSize: '1em', marginRight: '4px', color: '#3361ff' }}
                      />
                      {item.khmc} - {item.yhkh} - {item.wdmc}
                    </Tooltip>
                    <div style={{ fontSize: '12px', marginLeft: '18px', color: '#bfbfbf' }}>
                      所属者：{item.ssr}
                    </div>
                  </Select.Option>
                ))}
              </Select>
              <div className="skzh-selector-divide" style={{}}></div>
              <i
                className="iconfont circle-add skzh-selector-circle-add"
                onClick={() => setAddSkzhModalVisible(true)}
                style={{}}
              />
            </Form.Item>
          </Form>
        </Spin>
        {addSkzhModalVisible && (
          <BridgeModel
            modalProps={addSkzhModalProps}
            onCancel={() => setAddSkzhModalVisible(false)}
            onSucess={() => {}}
            src={
              localStorage.getItem('livebos') +
              '/OperateProcessor?operate=View_SKZH_ADD&Table=View_SKZH'
            }
          />
        )}
      </Modal>
    );
  }),
);
