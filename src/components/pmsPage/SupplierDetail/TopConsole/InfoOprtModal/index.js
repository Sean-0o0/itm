import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Button,
  Input,
  Table,
  Row,
  Col,
  Icon,
  Popconfirm,
  Checkbox,
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
import { OperateSupplierInfo } from '../../../../../services/pmsServices';
const { TextArea } = Input;
function InfoOprtModal(props) {
  const {
    visible,
    setVisible,
    form,
    oprtType = 'UPDATE',
    detailData = {},
    GYSLX = [],
    splId = -1,
    getDetailData,
    getTableData,
  } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [contrastTable, setcontrastTable] = useState([]); //联系人表格数据 - 处理后
  const { splInfo = {}, contactInfo = [] } = detailData;
  //数据处理 -供应商类型、状态
  const gyslx = (str = '') => {
    let arr = str.split(',');
    if (str === '') return [];
    return arr.map(item => GYSLX.filter(x => x.note === item)[0]?.ibm);
  };
  const getGyslxData = () => {
    return GYSLX.map(x => {
      return {
        label: x.note,
        value: x.ibm,
      };
    });
  };
  const gyszt = () => {
    let arr = [];
    if (splInfo.SFTT === '1') arr.push('2');
    if (splInfo.SFHMD === '1') arr.push('1');
    return arr;
  };

  //表格数据处理
  useEffect(() => {
    let tableData = [];
    if (splId !== -1) {
      tableData = [...contactInfo].map(x => {
        const UUID = x.ID;
        return {
          ID: UUID,
          GYSID: x.GYSID,
          ['YWSX' + UUID]: x.YWSX || '',
          ['LXR' + UUID]: x.LXR || '',
          ['ZW' + UUID]: x.ZW || '',
          SJ: x.SJ || '',
          ['DH' + UUID]: x.DH || '',
          ['QTLXFS' + UUID]: x.QTLXFS || '',
          ['BZ' + UUID]: x.BZ || '',
        };
      });
    }
    // console.log('🚀 ~ file: index.js:27 ~ tableData ~ tableData:', tableData);
    setcontrastTable(p => [...tableData]);
    return () => {};
  }, [splId]);

  //保存
  const handleOK = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        let blacklist = '2',
          isSifted = '2';
        getFieldValue('gyszt')?.forEach(x => {
          if (x === '1') blacklist = '1';
          if (x === '2') isSifted = '1';
        });
        let tableArr = [...contrastTable];
        tableArr = tableArr.map(x => {
          return {
            ...x,
            YWSX: x['YWSX' + x.ID],
            LXR: x['LXR' + x.ID],
            ZW: x['ZW' + x.ID],
            DH: x['DH' + x.ID],
            QTLXFS: x['QTLXFS' + x.ID],
            BZ: x['BZ' + x.ID],
          };
        });
        // console.log('🚀 ~ file: index.js:108 ~ handleOK ~ tableArr:', tableArr);
        let params = {
          blacklist: Number(blacklist),
          businessAddress: getFieldValue('jydz').trim(),
          businessScope: getFieldValue('jyfw').trim(),
          count: contrastTable.length,
          description: getFieldValue('zzsm').trim(),
          isSifted: Number(isSifted),
          liaisonInfo: JSON.stringify(tableArr),
          supplierId: splId,
          supplierName: getFieldValue('gysmc').trim(),
          supplierType: getFieldValue('gyslx')?.join(';'),
          type: oprtType,
        };
        // console.log('🚀 ~ file: index.js:117 ~ handleOK ~ params:', params);
        OperateSupplierInfo(params)
          .then(res => {
            if (res?.success) {
              if (res.code === 1) {
                resetFields();
                message.success(oprtType === 'ADD' ? '新增成功' : '编辑成功', 1);
                //刷新数据
                getDetailData && getDetailData(splId);
                getTableData && getTableData({});
              }
            }
          })
          .catch(e => {
            console.error('OperateSupplierInfo', e);
          });
        setVisible(false);
      }
    });
  };

  //取消
  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  //表格数据保存
  const handleTableSave = row => {
    // console.log('🚀 ~ file: index.js:137 ~ handleTableSave ~ row:', row);
    let newData = [...contrastTable];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    newData = newData.map(x => {
      return {
        ...x,
        ['YWSX' + x.ID]: x['YWSX' + x.ID].trim(),
        ['LXR' + x.ID]: x['LXR' + x.ID].trim(),
        ['ZW' + x.ID]: x['ZW' + x.ID].trim(),
        SJ: x.SJ.trim(),
        ['DH' + x.ID]: x['DH' + x.ID].trim(),
        ['QTLXFS' + x.ID]: x['QTLXFS' + x.ID].trim(),
        ['BZ' + x.ID]: x['BZ' + x.ID].trim(),
      };
    });
    // console.log('🚀 ~ file: index.js:96 ~ handleTableSave ~ newData:', newData);
    // setEditData({
    //   ...editData,
    //   contrastTable: newData,
    // });
    setcontrastTable(p => newData);
  };

  //列配置
  const getSpan = txt => <span style={{ marginLeft: 12 }}>{txt}</span>;
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
      width: '14%',
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
      render: (text, record) => (
        // contactInfo.length >= 1 ? (
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            const dataSource = [...contrastTable];
            // console.log(dataSource);
            // setEditData({
            //   ...editData,
            //   contrastTable: dataSource.filter(item => item.ID !== record.ID),
            // });
            setcontrastTable(p => dataSource.filter(item => item.ID !== record.ID));
          }}
        >
          <a style={{ color: '#3361ff' }}>删除</a>
        </Popconfirm>
      ),
      // ) : null,
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
          title: col?.title?.props?.children || '',
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
      onCancel={handleCancel}
    >
      <div className="body-title-box">
        <strong>供应商信息{oprtType === 'EDIT' ? '编辑' : '新增'}</strong>
      </div>
      <Form className="content-box">
        <Form.Item label="供应商名称">
          {getFieldDecorator('gysmc', {
            initialValue: splInfo.GYSMC || '',
            rules: [
              {
                required: true,
                message: '供应商名称不允许空值',
              },
            ],
          })(<Input maxLength={100} allowClear placeholder={`请输入供应商名称`} />)}
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
              })(<Checkbox.Group options={getGyslxData()} />)}
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
          {getFieldDecorator('jyfw' || '', {
            initialValue: splInfo.JYFW,
            rules: [
              {
                required: true,
                message: '经营范围不允许空值',
              },
            ],
          })(
            <TextArea
              allowClear
              autoSize={{
                minRows: 2,
                //   maxRows: 7,
              }}
              maxLength={666}
              placeholder={`请输入经营范围`}
            />,
          )}
        </Form.Item>
        <Form.Item label="经营地址">
          {getFieldDecorator('jydz', {
            initialValue: splInfo.JYDZ || '',
          })(<Input maxLength={166} allowClear placeholder={`请输入经营地址`} />)}
        </Form.Item>
        <Form.Item label="资质说明">
          {getFieldDecorator('zzsm', {
            initialValue: splInfo.ZZSM || '',
          })(
            <TextArea
              allowClear
              autoSize={{
                minRows: 2,
                //   maxRows: 7,
              }}
              maxLength={333}
              placeholder={`请输入资质说明`}
            />,
          )}
        </Form.Item>
        <Form.Item label="联系人信息">
          <div className="lxr-table-box">
            <Table
              columns={columns}
              components={components}
              rowKey={'ID'}
              rowClassName={() => 'editable-row'}
              dataSource={contrastTable}
              scroll={contrastTable.length > 4 ? { y: 191 } : {}}
              pagination={false}
              size="middle"
            />
            <div
              className="table-add-row"
              onClick={() => {
                let arrData = [...contrastTable];
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
                // setEditData({
                //   ...editData,
                //   contrastTable: [...arrData],
                // });
                setcontrastTable(p => [...arrData]);
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
