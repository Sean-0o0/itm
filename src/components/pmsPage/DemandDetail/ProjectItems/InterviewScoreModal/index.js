import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Input,
  Table,
  Row,
  Col,
  Icon,
  Popconfirm,
  DatePicker,
  Select,
  Tooltip,
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
import moment from 'moment';
import {
  EvaluationScoring,
  QueryEvaluationGradeInfo,
  QueryUserRole,
} from '../../../../../services/pmsServices';

const { Option } = Select;

function InterviewScoreModal(props) {
  const { visible, setVisible, form, xqid = -2, swzxid, reflush, WBRYGW = [] } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [tableData, setTableData] = useState([]); //表格数据
  const [editData, setEditData] = useState([]); //提交的修改数据
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [isDock, setIsDock] = useState(false); //是否为外包项目对接人 - 权限控制
  const LOGIN_USER_ID = JSON.parse(sessionStorage.getItem('user'))?.id;

  useEffect(() => {
    if (xqid !== -2) {
      getTableData(Number(xqid));
      console.log('WBRYGW', WBRYGW);
    }
    return () => {};
  }, [xqid, JSON.stringify(WBRYGW)]);

  const getTableData = xqid => {
    setIsSpinning(true);
    QueryEvaluationGradeInfo({
      xqid,
      cxlx: 'ALL',
    })
      .then(res => {
        if (res?.success) {
          let arr = JSON.parse(res.result).map(x => {
            return {
              ...x,
              ['FS' + x.DFID]: x.FS,
            };
          });
          setTableData([...arr]);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        message.error('接口信息获取失败');
        setIsSpinning(false);
      });
    QueryUserRole({
      userId: Number(LOGIN_USER_ID),
    })
      .then(res => {
        if (res.code === 1) {
          setIsDock(res.zyrole === '外包项目对接人');
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
      });
  };

  const handleOk = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        setIsSpinning(true);
        let submitTable = editData.map(x => {
          return {
            DFID: String(x.DFID),
            PF: String(x['FS' + x.DFID] || 0),
          };
        });
        console.log('🚀 ~ file: index.js:81 ~ submitTable ~ submitTable:', submitTable);
        let submitProps = {
          dfxx: JSON.stringify(submitTable),
          count: submitTable.length,
          xqid: Number(xqid),
          swzxid: Number(swzxid),
          czlx: 'XQ',
        };
        // console.log("🚀 ~ file: index.js:88 ~ handleOk ~ submitProps:", submitProps)
        EvaluationScoring(submitProps)
          .then(res => {
            if (res?.success) {
              reflush();
              setIsSpinning(false);
              message.success('打分成功', 1);
              setVisible(false);
            }
          })
          .catch(e => {
            message.error('打分失败', 1);
            setIsSpinning(false);
          });
      }
    });
  };
  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  //表格数据保存
  const handleTableSave = row => {
    let newData = [...tableData];
    const index = newData.findIndex(item => row.DFID === item.DFID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //new row
    });
    let newEdit = [...editData];
    let index2 = newEdit.findIndex(item => String(row.DFID) === String(item.DFID));
    if (index2 === -1) {
      newEdit.push({
        ...row,
      });
    } else {
      newEdit.splice(index2, 1, {
        ...newEdit[index2], //old row data
        ...row,
      });
    }
    setEditData(p => [...newEdit]);
    setTableData(p => newData);
  };

  //列配置
  const tableColumns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      // width: '15%',
      key: 'RYDJ',
      ellipsis: true,
      render: (txt, row) => {
        const v = txt + ` | ` + (WBRYGW.filter(x => x.ibm === String(row.GWID))[0]?.note || '--');
        return (
          <Tooltip title={v} placement="topLeft">
            <span style={{ cursor: 'default' }}>{v}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      key: 'GYSMC',
      width: isDock ? '20%' : '0',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '15%',
      key: 'RYMC',
      ellipsis: true,
    },
    {
      title: '面试时间',
      dataIndex: 'MSSJ',
      width: '30%',
      key: 'MSSJ',
      ellipsis: true,
      render: dateString => {
        // 解析起始日期和时间
        const startDateTime = moment(dateString.split('-')[0], 'YYYY/MM/DD HH:mm');
        // 解析结束日期和时间
        const endDateTime = moment(dateString.split('-')[1], 'YYYY/MM/DD HH:mm');

        // 格式化起始日期和时间
        const formattedStartDateTime = startDateTime.format('YYYY-MM-DD HH:mm');
        // 格式化结束日期和时间
        const formattedEndDateTime = endDateTime.format('HH:mm');

        // 拼接格式化后的日期和时间
        const formattedDateTime = `${formattedStartDateTime}-${formattedEndDateTime}`;
        return formattedDateTime;
      },
    },
    {
      title: '评分',
      dataIndex: 'FS',
      width: '15%',
      align: 'center',
      key: 'FS',
      ellipsis: true,
      editable: true,
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
          title: col?.title?.props?.children || col?.title || '',
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
      wrapClassName="editMessage-modify interview-score-modal"
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
    >
      <div className="body-title-box">
        <strong>面试评分</strong>
      </div>
      <div className="content-box">
        <Table
          columns={columns}
          components={components}
          rowKey={'DFID'}
          rowClassName={() => 'editable-row'}
          dataSource={tableData}
          scroll={tableData.length > 4 ? { y: 227 } : {}}
          pagination={false}
          // bordered
          loading={isSpinning}
          size="middle"
        />
      </div>
    </Modal>
  );
}
export default Form.create()(InterviewScoreModal);
