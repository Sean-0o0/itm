import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, message, Modal, Popconfirm, Form, DatePicker, Select, Icon } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import {
  OperateSZHZBWeekly,
  CreateOperateHyperLink,
  QueryUserInfo,
} from '../../../../services/pmsServices';
import moment from 'moment';
import config from '../../../../utils/config';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import { FetchQueryOrganizationInfo } from '../../../../services/projectManage';
import TreeUtils from '../../../../utils/treeUtils';
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { api } = config;
const {
  pmsServices: { digitalSpecialClassWeeklyReportExcel },
} = api;

const TableBox = props => {
  const { form, dataProps = {}, funcProps = {} } = props;
  const { tableData = {}, columnsData, tableLoading, edited, monthData } = dataProps;
  const { setEdited, setTableData, setColumnsData, setTableLoading, setMonthData } = funcProps;
  const [isSaved, setIsSaved] = useState(false);
  const [authIdData, setAuthIdData] = useState([]); //权限用户id - 管理员
  const [editing, setEditing] = useState(false); //编辑状态
  const [editingIndex, setEditingIndex] = useState(-1); //编辑
  const [editData, setEditData] = useState([]); //编辑数据
  const [dltData, setDltData] = useState([]); //删除行id

  let timer = null;
  // const downloadRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  //表格跨行合并
  const getRowSpanCount = (data, key, target, bool = false) => {
    //当合并项为可编辑时，最后传true
    if (!Array.isArray(data)) return 1;
    data = data.map(_ => _[key + (bool ? _.id : '')]); // 只取出筛选项
    let preValue = data[0];
    const res = [[preValue]]; // 放进二维数组里
    let index = 0; // 二维数组下标
    for (let i = 1; i < data.length; i++) {
      if (data[i] === preValue) {
        // 相同放进二维数组
        res[index].push(data[i]);
      } else {
        // 不相同二维数组下标后移
        index += 1;
        res[index] = [];
        res[index].push(data[i]);
        preValue = data[i];
      }
    }
    const arr = [];
    res.forEach(_ => {
      const len = _.length;
      for (let i = 0; i < len; i++) {
        arr.push(i === 0 ? len : 0);
      }
    });
    return arr[target];
  };

  //权限用户id - 管理员
  const getAutnIdData = () => {
    QueryUserInfo({
      type: 'ZBAUTH',
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
    const newData = [...tableData.data];
    const index = newData.findIndex(item => row.id === item.id); //🚀 定一个ID
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row data
      ...row, //new row data
    });

    let newEdit = [...editData];
    let index2 = newEdit.findIndex(item => row.id === item.id); //🚀 定一个ID
    if (index2 === -1) {
      newEdit.push(row);
    } else {
      newEdit.splice(index2, 1, {
        ...newEdit[index2], //old row data
        ...row, //new row data
      });
    }
    setEditData(p => [...newEdit]);
    console.log('🚀 ~ handleTableSave ~ [...newEdit]:', [...newEdit]);
    setEdited(true);
    console.log('TableData', newData);
    setTableData(preState => [...newData]);
  };

  //提交保存
  const handleSubmit = () => {
    form.validateFields(err => {
      if (!err) {
        setTableLoading(true);
        //过滤删除的数据
        let editDataDelFilter = [];
        editData.forEach(x => {
          if (!dltData.includes(x.id)) {
            editDataDelFilter.push(x);
          }
        });
        let submitTable = editDataDelFilter.map(item => {
          const notNullStr = v => {
            if (['', ' ', undefined].includes(v)) return null;
            return v;
          };
          const notNullNum = v => {
            if (['', ' ', undefined].includes(v)) return -1;
            return v;
          };
          return {
            // V_ID: String(item.id),
            // V_FZR: item['manager' + item.id].join(';'),
            // V_NDGH: String(notNullStr(item['annualPlan' + item.id])),
            // V_WCSJ: String(
            //   ['', ' ', undefined, null].includes(item['cplTime' + item.id])
            //     ? -1
            //     : moment(item['cplTime' + item.id]).format('YYYYMM'),
            // ),
            // V_DQJZ: String(getCurP(item['curProgress' + item.id])),
            // V_DQJD: String(notNullStr(item['curRate' + item.id])),
            // V_DQZT: String(getCurS(item['curStatus' + item.id])),
            // V_FXSM: String(notNullStr(item['riskDesc' + item.id])),
            // V_ZBRS: String(notNullNum(item['peopleNumber' + item.id])),
            // V_SYBM: String(notNullNum(item['orgName' + item.id])),
            // V_SYBM: '11167',
          };
        });
        submitTable.push({});
        console.log('submitTable', submitTable);
        let submitData = {
          json: JSON.stringify(submitTable),
          count: editDataDelFilter.length,
          type: 'UPDATE',
        };
        let deleteIdArr = dltData.map(x => {
          return {
            V_ID: x,
          };
        });
        deleteIdArr.push({});
        if (dltData.length === 0) {
          OperateSZHZBWeekly({ ...submitData })
            .then(res => {
              if (res?.code === 1) {
                queryTableData(
                  Number(monthData.startOf('month').format('YYYYMMDD')),
                  Number(monthData.endOf('month').format('YYYYMMDD')),
                  Number(currentXmid),
                  [...orgArr],
                );
                setIsSaved(true);
                setEditing(false);
                setEditingIndex(-1);
                setDltData([]);
                setTableLoading(false);
                message.success('保存成功', 1);
              }
            })
            .catch(e => {
              message.error('操作失败', 1);
              setTableLoading(false);
            });
        } else {
          OperateSZHZBWeekly({
            json: JSON.stringify(deleteIdArr),
            count: dltData.length,
            type: 'DELETE',
          })
            .then(res => {
              if (res.success) {
                console.log('🚀 ~ file: index.js:186 ~ handleSubmit ~ submitData:', submitData);
                OperateSZHZBWeekly({ ...submitData }).then(res => {
                  if (res?.code === 1) {
                    queryTableData(
                      Number(monthData.startOf('month').format('YYYYMMDD')),
                      Number(monthData.endOf('month').format('YYYYMMDD')),
                      Number(currentXmid),
                      [...orgArr],
                    );
                    setIsSaved(true);
                    setEditing(false);
                    setEditingIndex(-1);
                    setDltData([]);
                    setTableLoading(false);
                    message.success('保存成功', 1);
                  } else {
                    message.error('保存失败', 1);
                  }
                });
              }
            })
            .catch(e => {
              message.error('操作失败', 1);
              setTableLoading(false);
            });
        }
      }
    });
  };

  //行删除、取消删除
  const handleDelete = id => {
    if (!dltData.includes(id)) {
      setDltData(p => [...p, id]);
      setEdited(true);
    }
  };
  const handleDeleteCancel = id => {
    setDltData(p => [...dltData.filter(x => x !== id)]);
  };

  //导出
  const handleExport = () => {};

  //列配置 - 排列顺序 - 分类字段（合并） - 关联项目 - 上月字段 - 本月填写字段 - 固定字段 - 填写人
  const tableColumns = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      fixed: true,
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData.data, 'module', index);
        return obj;
      },
    },
    {
      title: '系统建设',
      dataIndex: 'sysBuilding',
      key: 'sysBuilding',
      width: 220,
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
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 200,
      // fixed: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '完成时间',
      dataIndex: 'cplTime',
      key: 'cplTime',
      width: 130,
      ellipsis: true,
      editable: true,
    },
    {
      title: '项目进展',
      dataIndex: 'curProgress',
      key: 'curProgress',
      width: 100,
      ellipsis: true,
      editable: true,
    },
    {
      title: '项目进度',
      dataIndex: 'curRate',
      key: 'curRate',
      width: 100,
      ellipsis: true,
      editable: true,
    },
    {
      title: '当前状态',
      dataIndex: 'curStatus',
      key: 'curStatus',
      width: 125,
      ellipsis: true,
      editable: true,
    },
    {
      title: '年度规划',
      dataIndex: 'annualPlan',
      key: 'annualPlan',
      ellipsis: true,
      editable: true,
    },
    {
      title: '专班人数',
      dataIndex: 'peopleNumber',
      key: 'peopleNumber',
      width: 100,
      ellipsis: true,
      editable: true,
    },
    {
      title: '使用部门',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 220,
      ellipsis: true,
      editable: true,
    },
    {
      title: '风险说明',
      dataIndex: 'riskDesc',
      key: 'riskDesc',
      ellipsis: true,
      editable: true,
      width: 150,
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 100,
    //   ellipsis: true,
    // },
    // {
    //     title: '项目说明',
    //     dataIndex: 'annualPlan',
    //     key: 'annualPlan',
    //     ellipsis: true,
    //     editable: true,
    // },
    {
      title: editing ? '操作' : '',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: editing ? 80 : 0,
      fixed: editing ? 'right' : false,
      render: (text, row, index) => {
        if (editing)
          return (
            <div>
              {dltData.includes(row.id) ? (
                <a style={{ color: '#3361ff' }} onClick={() => handleDeleteCancel(row.id)}>
                  撤销删除
                </a>
              ) : (
                <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(row.id)}>
                  <a style={{ color: '#3361ff' }}>删除</a>
                </Popconfirm>
              )}
            </div>
          );
        return '';
      },
    },
  ];

  const columns = tableColumns.map(col => {
    return {
      ...col,
      onCell: record => {
        return {
          record,
          title: col?.title?.props?.children || col?.title || '',
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          key: col.key,
          formdecorate: form,
          issaved: isSaved,
          editingindex: editingIndex,
          dltdata: dltData,
        };
      },
    };
  });

  //表格组件
  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  //月份变化
  const handleMonthChange = txt => {
    let time = new moment();
    if (txt === 'last') {
      //上
      time = monthData.subtract(1, 'month');
    } else if (txt === 'next') {
      //下
      time = monthData.add(1, 'month');
    } else if (txt === 'current') {
      //当前
      time = stillLastMonth ? moment().subtract(1, 'month') : moment();
    } else {
      return;
    }
    setMonthData(time);
    setTableLoading(true);
    // console.log('lklkl;', time);
    queryTableData(
      Number(time.startOf('month').format('YYYYMMDD')),
      Number(time.endOf('month').format('YYYYMMDD')),
      currentXmid,
      [...orgArr],
    );
  };

  //月份下拉框数据变化
  const handleDateChange = (d, ds) => {
    setMonthData(d);
    setTableLoading(true);
    // queryTableData(
    //   Number(d.startOf('month').format('YYYYMMDD')),
    //   Number(d.endOf('month').format('YYYYMMDD')),
    //   currentXmid,
    //   [...orgArr],
    // );
  };

  //修改
  const handleEdit = () => {
    setEditing(true);
    if (tableData.data.length > 0) setEditingIndex(tableData.data[0]?.id);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditingIndex(-1);
    setTableData(p => [...originData]);
    setEdited(false);
    setDltData([]);
  };

  return (
    <>
      <div className="table-box" style={{ height: 'calc(100% - 76px)', marginTop: 0 }}>
        <div className="table-console">
          <div className="console-date"></div>
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
          <div className="console-btn-submit">
            {editing ? (
              <>
                <span style={{ fontSize: '12px', fontFamily: 'PingFangSC-Regular,PingFang SC' }}>
                  （点击指定行进行编辑）
                </span>
                <Button onClick={handleEditCancel} style={{ marginRight: '8px' }}>
                  取消
                </Button>
                <Popconfirm title="确定要保存吗？" onConfirm={handleSubmit} disabled={!edited}>
                  <Button disabled={!edited}>保存</Button>
                </Popconfirm>
              </>
            ) : (
              <Button onClick={handleEdit}>修改</Button>
            )}
            <Popconfirm title="确定要导出吗?" onConfirm={handleExport}>
              <Button className="ss" style={{ marginLeft: '8px' }}>
                导出
              </Button>
            </Popconfirm>
          </div>
        </div>
        <div className="table-content">
          <Table
            onRow={record => {
              return {
                onClick: () => {
                  if (editing) {
                    setEditingIndex(record.id);
                  }
                },
              };
            }}
            loading={tableLoading}
            columns={columns}
            components={components}
            F
            rowKey={record => record.id}
            rowClassName={() => 'editable-row'}
            dataSource={tableData.data}
            scroll={
              tableData.data?.length > (document.body.clientHeight - 222) / (editing ? 59 : 40)
                ? {
                    y: document.body.clientHeight - 222,
                    x: 1900,
                  }
                : { y: false, x: 1900 }
            }
            pagination={false}
            // bordered
          />
        </div>
      </div>
    </>
  );
};
export default Form.create()(TableBox);
