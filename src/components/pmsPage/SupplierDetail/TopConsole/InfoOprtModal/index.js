import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Button,
  Input,
  Radio,
  Table,
  Row,
  Col,
  Icon,
  Popconfirm,
  Checkbox,
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
const { TextArea } = Input;
function InfoOprtModal(props) {
  const {
    visible,
    setVisible,
    form,
    oprtType = 'EDIT',
    detailData = {},
    GYSLX = [],
    splId,
    getDetailData,
  } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [editData, setEditData] = useState({
    splName: undefined,
    splType: undefined,
    splStatus: undefined,
    businessScope: undefined,
    businessAddress: undefined,
    qualificationDesc: undefined,
    contrastTable: [],
  }); //编辑数据
  const {
    splInfo = {},
    overviewInfo = {},
    contactInfo = [],
    prjPurchase = [],
    HROutsource = [],
    splEvaluation = [],
  } = detailData;
  const gyslx = str => {
    return GYSLX.filter(x => x.note === str)[0]?.ibm;
  };
  const gyszt = () => {
    let arr = [];
    if (splInfo.SFTT === '1') arr.push('2');
    if (splInfo.SFHMD === '1') arr.push('1');
    return arr;
  };

  useEffect(() => {
    const tableData = [...contactInfo].map(x => {
      const UUID = x.ID;
      return {
        ID: UUID,
        GYSID: x.GYSID,
        ['YWSX' + UUID]: x.YWSX,
        ['LXR' + UUID]: x.LXR,
        ['ZW' + UUID]: x.ZW,
        SJ: x.SJ,
        ['DH' + UUID]: x.DH,
        ['QTLXFS' + UUID]: x.QTLXFS,
        ['BZ' + UUID]: x.BZ,
      };
    });
    // console.log('🚀 ~ file: index.js:27 ~ tableData ~ tableData:', tableData);
    setEditData({
      ...editData,
      contrastTable: [...tableData],
    });
    return () => {};
  }, [detailData]);

  const handleOK = () => {
    setVisible(false);
    getDetailData(splId);
    //刷新别忘了
  };
  const handleRadioChange = e => {
    console.log('handleRadioChange', e.target.value);
  };
  const handleTableSave = row => {
    const newData = [...editData.contrastTable];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    setEditData({
      ...editData,
      contrastTable: newData,
    });
  };
  const getSpan = txt => <span style={{ marginLeft: 12 }}>{txt}</span>;
  //列配置
  const tableColumns = [
    {
      title: getSpan('业务事项'),
      dataIndex: 'YWSX',
      width: '14%',
      key: 'YWSX',
      ellipsis: true,
      editable: true,
    },
    {
      title: getSpan('联系人'),
      dataIndex: 'LXR',
      width: '12%',
      key: 'LXR',
      ellipsis: true,
      editable: true,
    },
    {
      title: getSpan('职务'),
      dataIndex: 'ZW',
      width: '14%',
      key: 'ZW',
      ellipsis: true,
      editable: true,
    },
    {
      title: getSpan('电话'),
      dataIndex: 'DH',
      width: '17%',
      key: 'DH',
      ellipsis: true,
      editable: true,
    },
    {
      title: getSpan('其他联系方式'),
      dataIndex: 'QTLXFS',
      width: '18%',
      key: 'QTLXFS',
      ellipsis: true,
      editable: true,
    },
    {
      title: getSpan('备注'),
      dataIndex: 'BZ',
      // width: '22%',
      key: 'BZ',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: '6%',
      key: 'OPRT',
      ellipsis: true,
      render: (text, record) =>
        contactInfo.length >= 1 ? (
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => {
              // return this.handleSingleDelete(record.id);
            }}
          >
            <a style={{ color: '#3361ff' }}>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const columns = tableColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          key: col.key,
          formdecorate: form,
          title: col.title,
        };
      },
    };
  });

  //覆盖默认table元素
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Modal
      wrapClassName="editMessage-modify supplier-edit-box-modal"
      width={'880px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      cancelText={'关闭'}
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      okText="保存"
      onOk={handleOK}
      onCancel={() => setVisible(false)}
    >
      <div className="body-title-box">
        <strong>供应商信息编辑</strong>
      </div>
      <Form className="content-box">
        <Form.Item label="供应商名称">
          {getFieldDecorator('gysmc', {
            initialValue: splInfo.GYSMC,
            rules: [
              {
                required: true,
                message: '供应商名称不允许空值',
              },
            ],
          })(<Input maxLength={300} placeholder={`请输入供应商名称`} />)}
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item label="供应商类型">
              {getFieldDecorator('gyslx', {
                initialValue: gyslx(splInfo.GYSLX),
                rules: [
                  {
                    required: true,
                    message: '供应商类型不允许空值',
                  },
                ],
              })(
                <Radio.Group onChange={handleRadioChange}>
                  {GYSLX.map(x => (
                    <Radio key={x.ibm} value={x.ibm}>
                      {x.note}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="是否为淘汰或黑名单供应商:">
              {getFieldDecorator('gyszt', {
                initialValue: gyszt(),
              })(
                <Checkbox.Group
                  options={[
                    { label: '黑名单供应商', value: '1' },
                    { label: '淘汰供应商', value: '2' },
                  ]}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="经营范围">
          {getFieldDecorator('jyfw', {
            initialValue: splInfo.JYFW,
            rules: [
              {
                required: true,
                message: '经营范围不允许空值',
              },
            ],
          })(<Input maxLength={300} placeholder={`请输入经营范围`} />)}
        </Form.Item>
        <Form.Item label="经营地址">
          {getFieldDecorator('jydz', {
            initialValue: splInfo.JYDZ,
          })(<Input maxLength={300} placeholder={`请输入经营地址`} />)}
        </Form.Item>
        <Form.Item label="资质说明">
          {getFieldDecorator('zzsm', {
            initialValue: splInfo.ZZSM,
          })(<Input maxLength={300} placeholder={`请输入资质说明`} />)}
        </Form.Item>
        <Form.Item label="联系人信息">
          <div className="lxr-table-box">
            <Table
              columns={columns}
              components={components}
              rowKey={'ID'}
              rowClassName={() => 'editable-row'}
              dataSource={editData.contrastTable}
              scroll={editData.contrastTable.length > 4 ? { y: 191 } : {}}
              pagination={false}
              size="middle"
            />
            <div
              className="table-add-row"
              onClick={() => {
                let arrData = [...editData.contrastTable];
                const UUID = Date.now();
                arrData.push({
                  ID: UUID,
                  GYSID: splInfo.ID,
                  ['YWSX' + UUID]: '',
                  ['LXR' + UUID]: '',
                  ['ZW' + UUID]: '',
                  SJ: '',
                  ['DH' + UUID]: '',
                  ['QTLXFS' + UUID]: '',
                  ['BZ' + UUID]: '',
                });
                setEditData({
                  ...editData,
                  contrastTable: [...arrData],
                });
                setTimeout(() => {
                  const table = document.querySelectorAll(`.lxr-table-box .ant-table-body`)[0];
                  table.scrollTop = table.scrollHeight;
                }, 200);
              }}
            >
              <span>
                <Icon type="plus" style={{ fontSize: '12px' }} />
                <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增联系人信息</span>
              </span>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default Form.create()(InfoOprtModal);
