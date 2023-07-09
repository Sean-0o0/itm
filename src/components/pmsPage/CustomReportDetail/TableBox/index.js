import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Table, message, Modal, Popconfirm, Form, DatePicker, Select, Icon } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import { QueryUserInfo, EditCustomReport } from '../../../../services/pmsServices';
import moment from 'moment';
import * as XLSX from 'xlsx';

const { MonthPicker } = DatePicker;

const TableBox = props => {
  const { form, dataProps = {}, funcProps = {} } = props;
  const {
    bgmc,
    bgid,
    tableData = {},
    columnsData,
    tableLoading,
    edited,
    monthData,
    isAdministrator,
  } = dataProps;
  const { setEdited, setTableData, setTableLoading, setMonthData, getData } = funcProps;
  const [isSaved, setIsSaved] = useState(false);
  const [editing, setEditing] = useState(false); //编辑状态
  const [editingIndex, setEditingIndex] = useState(-1); //编辑
  const [editData, setEditData] = useState([]); //编辑数据
  const [dltData, setDltData] = useState([]); //删除行id


  //表格跨行合并
  const getRowSpanCount = (data, key, target, bool = false) => {
    //当合并项为可编辑时，最后传true
    if (!Array.isArray(data)) return 1;
    data = data.map(_ => _[key + (bool ? _.ID : '')]); // 只取出筛选项
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

  //表格数据保存
  const handleTableSave = row => {
    const newData = [...tableData.data];
    const index = newData.findIndex(item => row.ID === item.ID); //🚀 定一个ID
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row data
      ...row, //new row data
    });

    let newEdit = [...editData];
    let index2 = newEdit.findIndex(item => row.ID === item.ID); //🚀 定一个ID
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
    setTableData(p => ({
      ...p,
      data: [...newData],
    }));
  };

  //提交保存
  const handleSubmit = () => {
    form.validateFields(err => {
      if (!err) {
        setTableLoading(true);
        //过滤删除的数据
        let editDataDelFilter = editData.filter(
          x => dltData.findIndex(item => x.ID === item.ID) === -1,
        );
        console.log(
          '🚀 ~ file: index.js:130 ~ handleSubmit ~ tableData.customColumns:',
          tableData.customColumns,
        );
        const notNullStr = v => {
          if (['', ' ', undefined, null].includes(v)) return 'undefined';
          return v;
        };
        let submitTable = [];
        editDataDelFilter.forEach(obj => {
          const restoredObj = { ID: obj.ID };
          for (const key in obj) {
            if (key !== 'ID' && tableData.customColumns.includes(key.replace(obj.ID, ''))) {
              const originalKey = key.replace(obj.ID, '');
              if (originalKey === 'TXR') {
                restoredObj[originalKey] = notNullStr(obj['TXRID' + obj.ID]);
              } else if (originalKey === 'GLXM') {
                restoredObj[originalKey] = notNullStr(obj['GLXMID' + obj.ID]);
              } else {
                restoredObj[originalKey] = notNullStr(obj[key]);
              }
            }
          }
          submitTable.push(restoredObj);
        });
        console.log('submitTable', submitTable);
        let updateParams = {
          fieldCount: tableData.customColumns.length - 5,
          infoCount: submitTable.length,
          operateType: 'UPDATE',
          reportId: Number(bgid),
          reportInfo: JSON.stringify(submitTable),
        };
        console.log('🚀 ~ updateParams:', updateParams);

        if (dltData.length !== 0) {
          let deleteTable = [];
          dltData.forEach(obj => {
            const restoredObj = { ID: obj.ID };
            for (const key in obj) {
              if (key !== 'ID' && tableData.customColumns.includes(key.replace(obj.ID, ''))) {
                const originalKey = key.replace(obj.ID, '');
                if (originalKey === 'TXR') {
                  restoredObj[originalKey] = notNullStr(obj['TXRID' + obj.ID]);
                } else if (originalKey === 'GLXM') {
                  restoredObj[originalKey] = notNullStr(obj['GLXMID' + obj.ID]);
                } else {
                  restoredObj[originalKey] = notNullStr(obj[key]);
                }
              }
            }
            deleteTable.push(restoredObj);
          });
          let deledtParams = {
            fieldCount: tableData.customColumns.length - 5,
            infoCount: deleteTable.length,
            operateType: 'DELETE',
            reportId: Number(bgid),
            reportInfo: JSON.stringify(deleteTable),
          };
          console.log('🚀 ~ deledtParams:', deledtParams);
          EditCustomReport({ ...deledtParams })
            .then(res => {
              if (res?.code === 1) {
                if (submitTable.length !== 0) {
                  EditCustomReport({ ...updateParams })
                    .then(res => {
                      if (res?.code === 1) {
                        getData(Number(bgid), Number(monthData.format('YYYYMM')));
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
                  getData(Number(bgid), Number(monthData.format('YYYYMM')));
                  setIsSaved(true);
                  setEditing(false);
                  setEditingIndex(-1);
                  setDltData([]);
                  setTableLoading(false);
                  message.success('保存成功', 1);
                }
              }
            })
            .catch(e => {
              message.error('操作失败', 1);
              setTableLoading(false);
            });
        } else {
          EditCustomReport({ ...updateParams })
            .then(res => {
              if (res?.code === 1) {
                getData(Number(bgid), Number(monthData.format('YYYYMM')));
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
        }
      }
    });
  };

  //行删除、取消删除
  const handleDelete = row => {
    if (dltData.findIndex(item => row.ID === item.ID) === -1) {
      setDltData(p => [...p, row]);
      setEdited(true);
    }
  };
  const handleDeleteCancel = row => {
    setDltData(p => [...p.filter(x => x.ID !== row.ID)]);
  };

  //导出
  const handleExport = () => {
    try {
      let dataIndexArr = tableColumns().map(item => item.dataIndex);
      let finalArr = [];
      tableData.data.forEach(obj => {
        let temp = {};
        dataIndexArr.forEach(dataIndex => {
          let title = tableColumns().find(item => item.dataIndex === dataIndex)?.title;
          temp[title] = obj[dataIndex + obj.ID];
          delete obj[dataIndex];
        });
        finalArr.push(temp);
      });
      exportExcelFile(finalArr, 'Sheet1', bgmc + '.xlsx');
    } catch (error) {
      console.error('🚀 ~ 导出失败:', error);
      message.error('导出失败', 1);
    }
  };

  /**
   * 导出 excel 文件
   * @param array JSON 数组
   * @param sheetName 第一张表名
   * @param fileName 文件名
   */
  const exportExcelFile = (array = [], sheetName = 'Sheet1', fileName = 'example.xlsx') => {
    console.log('🚀 ~ file: index.js:274 ~ exportExcelFile ~ array:', array, XLSX.utils);
    const jsonWorkSheet = XLSX.utils.json_to_sheet(array);
    const workBook = {
      SheetNames: [sheetName],
      Sheets: {
        [sheetName]: jsonWorkSheet,
      },
    };
    return XLSX.writeFile(workBook, fileName);
  };

  //列配置 - 排列顺序 - 分类字段（合并） - 关联项目 - 上月字段 - 本月填写字段 - 固定字段 - 填写人
  const tableColumns = () => {
    // console.log(
    //   '@@@',
    //   tableData.tableWidth,
    //   document.body.clientWidth,
    // );
    let arr = [
      ...columnsData.map(x => {
        if (x.ZDLX === '1')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: x.ZDMC?.length * 20,
            fixed: true,
            ellipsis: true,
            borderLeft: true, //左边框
            render: (value, row, index) => {
              const obj = {
                children: value,
                props: {},
              };
              obj.props.rowSpan = getRowSpanCount(tableData.data, x.QZZD, index, true);
              return obj;
            },
          };
        if (x.QZZD === 'GLXM')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: 200,
            fixed: true,
            ellipsis: true,
            borderLeft: true, //左边框
            render: (txt, row) => {
              if (row['GXZT' + row.ID] === '2')
                return (
                  <div className="update-col">
                    <span>{txt}</span>
                    <div className="update-tag">已更新</div>
                  </div>
                );
              return txt;
            },
          };
        if (x.QZZD === 'TXR')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width:
              tableData.tableWidth < document.body.clientWidth - 296
                ? undefined
                : x.ZDMC?.length * 35,
            ellipsis: true,
          };
        if (x.ZDLX === '2')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: 300,
            // fixed: true,
            editable: true,
            ellipsis: true,
          };
        return {
          title: x.ZDMC,
          dataIndex: x.QZZD,
          key: x.QZZD,
          width: x.ZDMC?.length * 35,
          // fixed: true,
          ellipsis: true,
        };
      }),
    ];
    if (editing) {
      return arr.concat({
        title: '操作',
        dataIndex: 'OPRT',
        key: 'OPRT',
        align: 'center',
        width: 80,
        fixed: 'right',
        borderLeft: true, //左边框
        render: (txt, row, index) => {
          return (
            <div>
              {dltData.findIndex(x => x.ID === row.ID) !== -1 ? (
                <a style={{ color: '#3361ff' }} onClick={() => handleDeleteCancel(row)}>
                  撤销删除
                </a>
              ) : (
                <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(row)}>
                  <a style={{ color: '#3361ff' }}>删除</a>
                </Popconfirm>
              )}
            </div>
          );
        },
      });
    }
    return arr;
  };

  const columns = tableColumns().map(col => {
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
          borderleft: col.borderLeft || false,
          isadministrator: isAdministrator,
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
    getData(Number(bgid), Number(time.format('YYYYMM')));
  };

  //月份下拉框数据变化
  const handleDateChange = (d, ds) => {
    setMonthData(d);
    getData(Number(bgid), Number(d.format('YYYYMM')));
  };

  //修改
  const handleEdit = () => {
    setEditing(true);
    if (tableData.data.length > 0) setEditingIndex(tableData.data[0]?.ID);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditingIndex(-1);
    setTableData(p => ({
      ...p,
      data: p.origin,
    }));
    setEdited(false);
    setIsSaved(true);
    setDltData([]);
  };

  return (
    <>
      <div className="table-box" style={{ height: 'calc(100vh - 123px)', marginTop: 0 }}>
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
            <Popconfirm title="确定要完结吗?" onConfirm={() => {}}>
              <Button className="ss" style={{ marginLeft: '8px' }}>
                完结
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
                    setEditingIndex(record.ID);
                  }
                },
              };
            }}
            // loading={tableLoading}
            columns={columns}
            components={components}
            rowKey={'ID'}
            rowClassName={() => 'editable-row'}
            dataSource={tableData.data}
            scroll={{ y: 'auto', x: 'auto' }}
            pagination={false}
            // bordered
          />
        </div>
      </div>
    </>
  );
};
export default Form.create()(TableBox);
