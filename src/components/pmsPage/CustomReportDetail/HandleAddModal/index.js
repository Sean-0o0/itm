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
import { EditCustomReport } from '../../../../services/pmsServices';
import { connect } from 'dva';
// import { OperateSupplierInfo } from '../../../../../services/pmsServices';

function HandleAddModal(props) {
  const {
    visible,
    setVisible,
    form,
    tableColumns = [],
    data = {},
    refresh = () => {},
    topData = {},
    userBasicInfo = {},
  } = props;
  const {
    validateFields,
    getFieldValue,
    resetFields,
    getFieldDecorator,
    validateFieldsAndScroll,
  } = form;
  const [tableData, setTableData] = useState([]); //联系人表格数据 - 处理后
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (visible) {
      const UUID = new Date().getTime();
      setTableData([
        tableColumns.reduce((obj = {}, item = {}) => {
          obj.ID = UUID;
          obj[item.key + UUID] = '';
          return obj;
        }, {}),
      ]);
    }
    return () => {};
  }, [visible, JSON.stringify(tableColumns)]);

  //保存
  const handleOK = () => {
    validateFieldsAndScroll(err => {
      if (tableData.length === 0) {
        message.error('表格至少要有一条数据', 2);
      } else if (!err) {
        console.log('🚀🚀🚀', tableData);
        setIsSpinning(true);
        const notNullStr = v => {
          if (['', ' ', undefined, null].includes(v)) return 'undefined';
          return v;
        };
        let submitTable = [];
        let objData = { ...data };
        delete objData.fieldCount;
        tableData.forEach((obj = {}) => {
          const restoredObj = { ID: '-1' };
          for (const key in { ...objData, ...obj }) {
            if (key !== 'ID' && key in objData) {
              const originalKey = key.replace(objData.ID, '');
              if (originalKey === 'TXR') {
                restoredObj[originalKey] = String(userBasicInfo.id);
              } else if (originalKey === 'GLXM') {
                restoredObj[originalKey] = notNullStr(objData['GLXMID' + objData.ID]);
              } else {
                restoredObj[originalKey] = notNullStr(objData[key]);
              }
            } else if (key !== 'ID' && key in obj) {
              const originalKey = key.replace(obj.ID, '');
              restoredObj[originalKey] = notNullStr(obj[key]);
            }
          }
          submitTable.push(restoredObj);
        });
        console.log('submitTable', submitTable);
        const params = {
          fieldCount: data.fieldCount,
          infoCount: submitTable.length,
          operateType: 'UPDATE',
          reportId: Number(data['BBID' + data.ID]),
          reportInfo: JSON.stringify(submitTable),
        };
        console.log('🚀 ~ handleOK ~ params:', params);
        EditCustomReport(params)
          .then(res => {
            if (res?.code === 1) {
              refresh();
              handleCancel();
              message.success('新增成功', 1);
              setIsSpinning(false);
            }
          })
          .catch(e => {
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
      }
    });
  };

  //取消
  const handleCancel = () => {
    resetFields();
    const UUID = new Date().getTime();
    setTableData([
      tableColumns.reduce((obj = {}, item = {}) => {
        obj.ID = UUID;
        obj[item.key + UUID] = '';
        return obj;
      }, {}),
    ]);
    setIsSpinning(false);
    setVisible(false);
  };

  //表格数据保存
  const handleTableSave = row => {
    // console.log('🚀 ~ file: index.js:137 ~ handleTableSave ~ row:', row);
    let newData = [...tableData];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    setTableData(newData);
  };

  const columns = [
    ...tableColumns,
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: 80,
      key: 'OPRT',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            setTableData(p => p.filter(x => x.ID !== record.ID));
          }}
        >
          <a style={{ color: '#3361ff' }}>删除</a>
        </Popconfirm>
      ),
    },
  ].map(col => {
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
          title: col?.title || '',
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
      wrapClassName="custom-report-detail-add-modal"
      width={'900px'}
      maskClosable={false}
      zIndex={103}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      // cancelText={'关闭'}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      okText="保存"
      onOk={handleOK}
      onCancel={handleCancel}
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>报告新增</strong>
      </div>
      <Spin spinning={isSpinning}>
        <div className="content-box">
          {topData.map(x => (
            <div className="top-info" key="x.title">
              <span>{x.title} ：</span>
              {data[x.dataIndex + data.ID]}
            </div>
          ))}
          <Table
            columns={columns}
            components={components}
            rowKey={'ID'}
            rowClassName={() => 'editable-row'}
            dataSource={tableData}
            scroll={tableData.length > 4 ? { y: 275, x: 'auto' } : { x: 'auto' }}
            pagination={false}
            size="middle"
          />
          <div
            className="table-add-row"
            onClick={() => {
              const UUID = new Date().getTime();
              setTableData(p => [
                ...p,
                tableColumns.reduce((obj = {}, item = {}) => {
                  obj.ID = UUID;
                  obj[item.key + UUID] = '';
                  return obj;
                }, {}),
              ]);
              setTimeout(() => {
                const table = document.querySelectorAll(
                  `.custom-report-detail-add-modal .ant-table-body`,
                )[0];
                table.scrollTop = table.scrollHeight;
              }, 200);
            }}
          >
            <span>
              <Icon type="plus" style={{ fontSize: '12px' }} />
              <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增</span>
            </span>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(Form.create()(HandleAddModal));
