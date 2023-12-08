import React, { Fragment, useState } from 'react';
import { Modal, InputNumber, Form, TreeSelect, Icon } from 'antd';

export default function UpdateModal(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    visible,
    form = {},
    type = '',
    bxbmData = [],
    apportionmentData = [],
    selectedRowIds = [],
    bxbmOrigin = [],
  } = dataProps;
  const { setVisible, setFormData } = funcProps;
  const { getFieldDecorator, getFieldValue, validateFields, setFieldsValue, resetFields } = form;
  const [bxbmObj, setBxbmObj] = useState({
    ykbid: '', //易快报id
    open: false,
  }); //报销部门易快报id

  const handleSubmit = () => {
    let validateFieldsArr = type === 'batch-add' ? ['org-multiple', 'rate', 'amount'] : [type];
    validateFields(validateFieldsArr, err => {
      if (!err) {
        let data = [...apportionmentData];

        switch (type) {
          case 'org':
            data.forEach(x => {
              if (selectedRowIds.includes(x.ID)) {
                x['BXBM' + x.ID] = getFieldValue(type);
                x['BXBMYKBID' + x.ID] = bxbmObj.ykbid;
                setFieldsValue({
                  ['BXBM' + x.ID]: getFieldValue(type),
                });
              }
            });
            break;
          case 'rate':
            data.forEach(x => {
              if (selectedRowIds.includes(x.ID)) {
                x['FTBL' + x.ID] = getFieldValue(type);
                setFieldsValue({
                  ['FTBL' + x.ID]: getFieldValue(type),
                });
              }
            });
            break;
          case 'amount':
            data.forEach(x => {
              if (selectedRowIds.includes(x.ID)) {
                x['FTJE' + x.ID] = getFieldValue(type);
                setFieldsValue({
                  ['FTJE' + x.ID]: getFieldValue(type),
                });
              }
            });
            break;
          default:
            const UUID = String(Date.now());
            let arr = getFieldValue('org-multiple').map((x, i) => {
              let item = bxbmOrigin.filter(y => y.ID === x);
              let ykbid = item.length > 0 ? item[0]?.id : '';
              return {
                ID: UUID + i,
                ['BXBM' + UUID + i]: x,
                ['BXBMYKBID' + UUID + i]: ykbid,
                ['FTBL' + UUID + i]: getFieldValue('rate'),
                ['FTJE' + UUID + i]: getFieldValue('amount'),
              };
            });
            data = data.concat(arr);
            console.log('🚀 ~ file: index.js:78 ~ handleSubmit ~ data:', data);
        }
        setFormData(p => ({
          ...p,
          apportionmentData: [...data],
        }));
        handleClose();
      }
    });
  };
  const handleClose = () => {
    setVisible(false);
    resetFields(['org', 'rate', 'amount', 'org-multiple']);
  };

  //弹窗标题
  const getTitle = (type = 'batch-add') => {
    switch (type) {
      case 'org':
        return '请选择报销部门';
      case 'rate':
        return '请填写分摊比例';
      case 'amount':
        return '请填写分摊金额';
      default:
        return '批量添加';
    }
  };

  //报销部门 - 单选
  const getOrgNode = () => (
    <Form.Item label="报销部门" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
      {getFieldDecorator('org', {
        initialValue: undefined,
        rules: !visible ? [] : [{ required: true, message: '报销部门不允许空值' }],
      })(
        <TreeSelect
          allowClear
          showArrow
          className="item-selector"
          showSearch
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          treeNodeFilterProp="title"
          placeholder="请选择"
          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          style={{ width: '100%', borderRadius: '8px !important' }}
          treeData={bxbmData}
          treeDefaultExpandedKeys={['Fjg7WPFpfYdA00:1']}
          onChange={(v, txt, node) =>
            setBxbmObj(p => ({ ...p, ykbid: node?.triggerNode?.props?.id }))
          }
        />,
      )}
    </Form.Item>
  );

  //报销部门 - 多选
  const getMulOrgNode = () => (
    <div className="bxbm-multiple-row">
      <Form.Item label="报销部门" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        {getFieldDecorator('org-multiple', {
          initialValue: [],
          rules: !visible ? [] : [{ required: true, message: '报销部门不允许空值' }],
        })(
          <TreeSelect
            allowClear
            showArrow
            className="item-selector"
            showSearch
            multiple
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeNodeFilterProp="title"
            treeCheckable
            dropdownClassName="newproject-treeselect"
            placeholder="请选择"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            style={{ width: '100%', borderRadius: '8px !important' }}
            treeData={bxbmData}
            open={bxbmObj.open}
            treeDefaultExpandedKeys={['Fjg7WPFpfYdA00:1']}
            onDropdownVisibleChange={v => setBxbmObj(p => ({ ...p, open: v }))}
          />,
        )}
      </Form.Item>
      {/* <Icon
        type="down"
        className={'label-selector-arrow' + (bxbmObj.open ? ' selector-rotate' : '')}
      /> */}
    </div>
  );

  //分摊金额
  const getAmountNode = () => (
    <Form.Item label="分摊金额(￥)" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
      {getFieldDecorator('amount', {
        initialValue: undefined,
        rules: !visible ? [] : [{ required: true, message: '分摊金额不允许空值' }],
      })(
        <InputNumber
          style={{ width: '100%' }}
          max={1000000000}
          precision={2}
          step={0.01}
          min={0}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />,
      )}
    </Form.Item>
  );
  //分摊比例
  const getRateNode = () => (
    <Form.Item label="分摊比例(%)" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
      {getFieldDecorator('rate', {
        initialValue: undefined,
        rules: !visible ? [] : [{ required: true, message: '分摊比例不允许空值' }],
      })(
        <InputNumber
          style={{ width: '100%' }}
          max={100}
          precision={2}
          step={0.01}
          min={0}
          // formatter={value => `${value}%`}
          // parser={value => value.replace('%', '')}
        />,
      )}
    </Form.Item>
  );

  //弹窗内容
  const getFormContent = (type = 'batch-add') => {
    switch (type) {
      case 'org':
        return getOrgNode();
      case 'rate':
        return getRateNode();
      case 'amount':
        return getAmountNode();
      case 'batch-add':
        return (
          <Fragment>
            {getMulOrgNode()}
            {getRateNode()}
            {getAmountNode()}
            {getFieldValue('org-multiple')?.length > 0 && (
              <div className="count-tips-row">
                系统将依此批量创建：
                <div className="tips-num">{getFieldValue('org-multiple')?.length}条分摊</div>
                {(getFieldValue('rate') || getFieldValue('amount')) && (
                  <div className="tips-content">
                    其中每条分摊的{getFieldValue('rate') && `比例为「${getFieldValue('rate')}%」`}
                    {getFieldValue('amount') && `金额为「¥${getFieldValue('amount')}」`}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        );
      default:
        return '';
    }
  };

  return (
    <Modal
      wrapClassName="editMessage-modify"
      width={'550px'}
      maskClosable={false}
      style={{ top: type === 'batch-add' ? 10 : 60 }}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      cancelText={'关闭'}
      bodyStyle={{
        // height: 'calc(100vh - 25.5rem)',
        padding: '0',
        overflow: 'hidden',
      }}
      title={null}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
    >
      <div className="body-title-box">
        <strong>{getTitle(type)}</strong>
      </div>
      <div className="upload-receipt-modal-content">{getFormContent(type)}</div>
    </Modal>
  );
}
