import React, { useState, useEffect } from 'react';
import { Button, Table, Form, message, Popconfirm, Icon, DatePicker, Select } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import {
  CreateOperateHyperLink,
  OperateMonthly,
  QueryUserInfo,
} from '../../../../services/pmsServices';
import config from '../../../../utils/config';
import moment from 'moment';

const { MonthPicker } = DatePicker;
const { Option } = Select;
const { api } = config;
const {
  pmsServices: { digitalSpecialClassMonthReportExcel },
} = api;
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem('user')).id);

const TableBox = props => {
  const {
    form,
    tableData,
    setTableData,
    tableLoading,
    setTableLoading,
    edited,
    setEdited,
    monthData,
    getRowSpanCount,
    currentXmid,
    queryTableData,
    txrData,
    projectData,
    setCurrentXmid,
    setMonthData,
    originData,
  } = props;
  const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
  const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');
  const [authIdAData, setAuthIdData] = useState([]); //权限用户id
  const [isSaved, setIsSaved] = useState(false);
  const [toLeft, setToLeft] = useState(false); //是否允许左滚
  const [toRight, setToRight] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false); //编辑状态
  const [editData, setEditData] = useState([]); //编辑数据

  useEffect(() => {
    getAutnIdData();
    setTableLoading(true);
    // const tableNode = document.querySelector('.monthly-report-detail .ant-table .ant-table-body');
    // tableNode.addEventListener('scroll', e => {
    //   if (tableNode.scrollLeft === 0) {
    //     setToLeft(false);
    //     setToRight(true);
    //   } else if (
    //     tableNode.scrollLeft > 0 &&
    //     tableNode.scrollLeft < Math.floor(tableNode.scrollWidth - tableNode.clientWidth)
    //   ) {
    //     setToLeft(true);
    //     setToRight(true);
    //   } else {
    //     setToLeft(true);
    //     setToRight(false);
    //   }
    // });
  }, []);

  const getAutnIdData = () => {
    QueryUserInfo({
      type: 'YBAUTH',
    })
      .then(res => {
        if (res.success) {
          let idArr = res.record?.map(item => {
            return item.id;
          });
          setAuthIdData(p => [...idArr]);
        }
      })
      .catch(e => {
        // message.error('查询失败', 1);
      });
  };
  const handleTableSave = row => {
    const newData = [...tableData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    //去空格
    const newRow = {
      // id: row.id,
      // zdgz: row.zdgz,
      // rwfl: row.rwfl,
      // xmmc: row.xmmc,
      // zmk: row.zmk,
      // yf: row.yf,
      // zt: row.zt,
      // ['bywcqk' + row.id]: row['bywcqk' + row.id]?.trim(),
      // ['xygzjh' + row.id]: row['xygzjh' + row.id]?.trim(),
      // ['ldyj' + row.id]: row['ldyj' + row.id]?.trim(),
      // ['txr' + row.id]: row['txr' + row.id],
      ...row,
    };
    // console.log('newRow', newRow);
    newData.splice(index, 1, {
      ...item, //old row data
      ...newRow, //new row data
    });
    let newEdit = [...editData];
    let index2 = newEdit.findIndex(item => row.id === item.id);
    if (index !== -1) {
      newEdit.push(row);
    } else {
      newEdit.splice(index2, 1, {
        ...newEdit[index2], //old row data
        ...newRow, //new row data
      });
    }
    setEditData(p => [...newEdit]);
    // console.log('newTable', newData);
    setEdited(true);
    setTableData(preState => [...newData]);
  };
  const handleSubmit = () => {
    form.validateFields(err => {
      if (!err) {
        let editIdArr = [];
        editData.forEach(x => {
          editIdArr.push(x.id);
        });
        let editArr = [];
        tableData.forEach(x => {
          if (editIdArr.includes(x.id)) editArr.push(x);
        });
        let submitTable = editArr.map((item, index) => {
          // let rowspan = getRowSpanCount(tableData, 'rwfl', index);
          // if (rowspan === 0) {
          //   if (index >= 1) {
          //     let arr = tableData[index - 1];
          //     item['txr' + item.id] = [...arr['txr' + arr.id]];
          //     item['ldyj' + item.id] = arr['ldyj' + arr.id];
          //   }
          // }
          return {
            V_ID: String(item.id),
            V_BYWCQK: String(item['bywcqk' + item.id]).trim(),
            V_XYGZJH: String(item['xygzjh' + item.id]).trim(),
            V_LDYJ: String(item['ldyj' + item.id]).trim(),
            V_TXR: item['txr' + item.id]?.join(';') || 'null',
          };
        });
        submitTable.push({});
        console.log('🚀submitTable', submitTable);
        let submitData = {
          json: JSON.stringify(submitTable),
          count: submitTable.length,
          type: 'UPDATE',
        };
        OperateMonthly({ ...submitData }).then(res => {
          if (res?.code === 1) {
            message.success('保存成功', 1);
            setIsSaved(true);
            setEditing(false);
            queryTableData(Number(monthData.format('YYYYMM')), Number(currentXmid), txrData);
          } else {
            message.error('保存失败', 1);
          }
        });
        console.log('submitData', submitData);
      }
    });
  };
  const handleSendBack = id => {
    let sendBackData = {
      json: JSON.stringify([
        {
          V_ID: String(id),
        },
        {},
      ]),
      count: 1,
      type: 'BACK',
    };
    OperateMonthly({ ...sendBackData })
      .then(res => {
        if (res.success) {
          message.success('操作成功', 1);
          queryTableData(Number(monthData.format('YYYYMM')), Number(currentXmid), txrData);
        }
      })
      .catch(e => {
        message.error('操作失败', 1);
      });
  };
  const handleDelete = id => {
    let deleteData = {
      json: JSON.stringify([
        {
          V_ID: String(id),
        },
        {},
      ]),
      count: 1,
      type: 'DELETE',
    };
    OperateMonthly({ ...deleteData })
      .then(res => {
        if (res.success) {
          message.success('操作成功', 1);
          queryTableData(Number(monthData.format('YYYYMM')), Number(currentXmid), txrData);
        }
      })
      .catch(e => {
        message.error('操作失败', 1);
      });
  };

  const handleExport = () => {
    let params = new URLSearchParams();
    params.append('month', Number(monthData.format('YYYYMM')));
    params.append('xmmc', Number(currentXmid));
    params.append('czr', 0);
    fetch(digitalSpecialClassMonthReportExcel, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
      .then(res => {
        return res.blob();
      })
      .then(blob => {
        let fileName = `数字化专班月报(${new moment().format('YYYYMMDD')}).xlsx`;
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        message.success('请求成功，正在导出中', 1);
      })
      .catch(e => {
        message.error('导出失败', 1);
        // console.error(e);
      });
  };
  const handleTableScroll = direction => {
    const tableNode = document.querySelector('.monthly-report-detail .ant-table .ant-table-body');
    if (direction === 'left') {
      tableNode.scrollLeft = 0;
    }
    if (direction === 'right') {
      tableNode.scrollLeft = Math.floor(tableNode.scrollWidth - tableNode.clientWidth);
    }
    console.log(
      '🚀 ~ file: index.js ~ line 210 ~ handleTableScroll ~ tableNode',
      tableNode,
      tableNode.scrollLeft,
      tableNode.scrollWidth,
      tableNode.clientWidth,
    );
  };
  const tableColumns = [
    {
      title: '重点工作',
      dataIndex: 'zdgz',
      key: 'zdgz',
      width: 120,
      fixed: 'left',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'zdgz', index);
        return obj;
      },
    },
    {
      title: '任务分类',
      dataIndex: 'rwfl',
      key: 'rwfl',
      width: 120,
      fixed: 'left',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'rwfl', index);
        return obj;
      },
    },
    {
      title: '项目名称',
      dataIndex: 'xmmc',
      key: 'xmmc',
      fixed: 'left',
      width: 150,
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'xmmc', index);
        return obj;
      },
    },
    {
      title: '子模块',
      dataIndex: 'zmk',
      key: 'zmk',
      width: 170,
      fixed: 'left',
      ellipsis: true,
      render: (txt, row) => {
        if (row.zt === '2')
          return (
            <div className="update-col">
              <span>{txt}</span>
              <div className="update-tag">已更新</div>
            </div>
          );
        return txt;
      },
    },
    {
      title: '本月完成情况',
      dataIndex: 'bywcqk',
      key: 'annualPlan',
      ellipsis: true,
      editable: true,
    },
    {
      title: '下月工作计划',
      dataIndex: 'xygzjh',
      key: 'xygzjh',
      ellipsis: true,
      editable: true,
    },
    {
      title: '领导意见',
      dataIndex: 'ldyj',
      key: 'ldyj',
      ellipsis: true,
      editable: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'rwfl', index);
        return obj;
      },
    },
    {
      title: '填报人',
      dataIndex: 'txr',
      key: 'txr',
      width: 200,
      ellipsis: true,
      editable: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'rwfl', index);
        return obj;
      },
    },
    // {
    //   title: '月份',
    //   dataIndex: 'yf',
    //   key: 'yf',
    //   width: 135,
    //   ellipsis: true,
    //   render: (txt, row) => {
    //     if (row.zt === '2')
    //       return (
    //         <div className="update-col">
    //           <span>{txt ? moment(txt).format('YYYY-MM') : null}</span>
    //           <div className="update-tag">已更新</div>
    //         </div>
    //       );
    //     return txt ? moment(txt).format('YYYY-MM') : null;
    //   },
    // },
    // {
    //   title: '状态',
    //   dataIndex: 'zt',
    //   key: 'zt',
    //   width: 100,
    //   ellipsis: true,
    // },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 80,
      fixed: 'right',
      render: (text, row, index) => {
        return (
          <div>
            {/* <a style={{ color: '#3361ff', marginRight: '1.488rem' }} onClick={() => getLcbqkModalUrl(row.id)}>查看</a>
                    {authIdAData?.includes(CUR_USER_ID) && (<> 
                        <Popconfirm title="确定要退回吗?" onConfirm={() => handleSendBack(row.id)}>
                            <a style={{ color: '#3361ff', marginRight: '1.488rem' }}>退回</a>
                        </Popconfirm>*/}
            <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(row.id)}>
              <a style={{ color: '#3361ff' }}>删除</a>
            </Popconfirm>
            {/* </>)} */}
          </div>
        );
      },
    },
  ];
  const columns = tableColumns.map(col => {
    // if (!col.editable) {
    //   return col;
    // }
    return {
      ...col,
      onCell: (record, index) => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          formdecorate: form,
          txrdata: txrData,
          issaved: isSaved,
          recordindex: index,
          tabledata: tableData,
          editing,
        };
      },
    };
  });
  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };
  const lcbqkModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '详细信息',
    width: '60%',
    height: '80rem',
    style: { top: '5%' },
    visible: lcbqkModalVisible,
    footer: null,
  };
  const getLcbqkModalUrl = id => {
    const params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_YBHZ',
      operateName: 'V_YBHZ_VIEW',
      parameter: [
        {
          name: 'YBID',
          value: String(id),
        },
      ],
      userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
    };
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          setLcbqkModalUrl(url);
          setLcbqkModalVisible(true);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  const handleMonthChange = txt => {
    let time = monthData;
    if (txt === 'last') {
      //上
      time = monthData.subtract(1, 'month');
    } else if (txt === 'next') {
      //下
      time = monthData.add(1, 'month');
    } else if (txt === 'current') {
      //当前
      time = new moment();
    } else {
      return;
    }
    setMonthData(time);
    setTableLoading(true);
    queryTableData(Number(time.format('YYYYMM')), currentXmid, txrData);
  };
  const handleDateChange = (d, ds) => {
    setMonthData(d);
    setTableLoading(true);
    queryTableData(Number(d.format('YYYYMM')), currentXmid, txrData);
  };
  const handleProjectChange = value => {
    setCurrentXmid(Number(value));
    setTableLoading(true);
    queryTableData(Number(monthData.format('YYYYMM')), Number(value), txrData);
  };

  //修改
  const handleEdit = () => {
    setEditing(true);
    //编辑态的数据需要处理
    let arr = tableData.map(item => {
      return {
        ...item,
        ['txr' + item.id]: item.txrid,
      };
    });
    setTableData(p => [...arr]);
  };
  const handleEditCancel = () => {
    setEditing(false);
    setTableData(p => [...originData]);
    setEdited(fasle);
  };
  return (
    <>
      {lcbqkModalVisible && (
        <BridgeModel
          modalProps={lcbqkModalProps}
          onSucess={() => setLcbqkModalVisible(false)}
          onCancel={() => setLcbqkModalVisible(false)}
          src={lcbqkModalUrl}
        />
      )}
      <div className="table-box">
        <div className="table-console">
          <div className="console-date">
            {/* <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img> */}
            {/* <div className='console-txt'>{monthData.format('YYYY-MM')}</div> */}
          </div>
          <Button onClick={handleMonthChange.bind(this, 'current')} style={{ marginRight: '16px' }}>
            本月
          </Button>
          <div className="month-slt-btn">
            <Button disabled={tableLoading} onClick={handleMonthChange.bind(this, 'last')}>
              <Icon type="left" />
            </Button>
            <Button disabled={tableLoading} onClick={handleMonthChange.bind(this, 'next')}>
              <Icon type="right" />
            </Button>
          </div>
          <MonthPicker
            value={monthData}
            onChange={handleDateChange}
            style={{ margin: '0 10px', width: '110px', marginRight: 'auto' }}
          />
          {/* <Select
            style={{
              width: '228px',
              borderRadius: '8px !important',
              marginLeft: '16px',
              marginRight: 'auto',
            }}
            showSearch
            placeholder="请选择项目名称"
            optionFilterProp="children"
            onChange={handleProjectChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            open={open}
            onDropdownVisibleChange={visible => {
              setOpen(visible);
            }}
          >
            {projectData?.map((item = {}, ind) => {
              return (
                <Option key={ind} value={item.xmid}>
                  {item.xmmc}
                </Option>
              );
            })}
          </Select> */}
          <div className="console-btn-submit">
            {/* <Button
              style={{ marginLeft: 'auto' }}
              disabled={!toLeft}
              onClick={() => handleTableScroll('left')}
            >
              <Icon type="left" />
              上一列
            </Button>
            <Button
              disabled={!toRight}
              style={{ margin: '0 8px' }}
              onClick={() => handleTableScroll('right')}
            >
              下一列
              <Icon type="right" />
            </Button> */}
            {editing ? (
              <>
                <Button onClick={handleEditCancel} style={{ marginRight: '8px' }}>
                  取消
                </Button>
                <Button disabled={!edited} onClick={handleSubmit}>
                  保存
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>修改</Button>
            )}
            <Popconfirm title="确定要导出吗?" onConfirm={handleExport}>
              <Button style={{ marginLeft: '8px' }}>导出</Button>
            </Popconfirm>
          </div>
        </div>
        <div className="table-content">
          <Table
            loading={tableLoading}
            columns={columns}
            components={components}
            rowKey={'id'}
            rowClassName={() => 'editable-row'}
            dataSource={tableData}
            scroll={
              tableData?.length > (document.body.clientHeight - 278) / (editing ? 59 : 40)
                ? {
                    y: document.body.clientHeight - 278,
                    x: 1600,
                  }
                : { y: false, x: 1600 }
            }
            pagination={false}
            // bordered
          ></Table>
        </div>
      </div>
    </>
  );
};
export default Form.create()(TableBox);
