import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, message, Modal, Popconfirm, Form, DatePicker, Select, Icon } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import {
  OperateSZHZBWeekly,
  CreateOperateHyperLink,
  QueryUserInfo,
  OperateHjgWeeklyReport,
} from '../../../../services/pmsServices';
import moment from 'moment';
import config from '../../../../utils/config';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
const { WeekPicker } = DatePicker;
const { Option } = Select;
const { api } = config;
const {
  pmsServices: { hJGWeeklyReportExcel },
} = api;
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem('user')).id);

const TableBox = props => {
  const {
    form,
    tableData,
    dateRange,
    setTableData,
    tableLoading,
    setTableLoading,
    edited,
    setEdited,
    getCurrentWeek,
    currentXmid,
    queryTableData,
    monthData,
    projectData,
    setCurrentXmid,
    setDateRange,
    originData,
  } = props;
  const [isSaved, setIsSaved] = useState(false);
  const [summaryModalUrl, setSummaryModalUrl] = useState('');
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [authIdData, setAuthIdData] = useState([]); //权限用户id
  const [toLeft, setToLeft] = useState(false); //是否允许左滚
  const [toRight, setToRight] = useState(true);
  const [managerData, setManagerData] = useState([]); //负责人下拉框数据
  const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
  const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');
  const [open, setOpen] = useState(false); //项目选择
  const [editing, setEditing] = useState(false); //编辑状态
  const [editingIndex, setEditingIndex] = useState(-1); //编辑
  const [editData, setEditData] = useState([]); //编辑数据
  const [dltData, setDltData] = useState([]); //删除行id

  useEffect(() => {
    setTableLoading(true);
    //获取允许操作用户id
    // getAuthIdData();
    //左右滚动
    // const tableNode = document.querySelector('.weekly-report-summary .ant-table .ant-table-body');
    // tableNode.addEventListener('scroll', e => {
    //   // console.log(Math.floor(tableNode.scrollWidth - tableNode.clientWidth));
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

  //获取允许操作用户id
  const getAuthIdData = () => {
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
        console.error('getAutnIdData查询失败', 1);
      });
  };
  //表格数据存储
  const handleTableSave = row => {
    const newData = [...tableData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    const keys = Object.keys(row);
    // console.log("🚀 ~ file: index.js ~ line 78 ~ handleTableSave ~ keys", keys)
    //去空格
    const getKeyId = keyStr => keyStr + row.id;
    const newRow = {
      // id: row.id,
      // gzmk: row.gzmk,
      // txr: row.txr,
      // [getKeyId('bznr')]: row[getKeyId('bznr')]?.trim(),
      // [getKeyId('xzjh')]: row[getKeyId('xzjh')]?.trim(),
      // [getKeyId('bbh')]: row[getKeyId('bbh')]?.trim(),
      // [getKeyId('jhsxrq')]: row[getKeyId('jhsxrq')]?.trim(),
      // [getKeyId('dqzt')]: row[getKeyId('dqzt')],
      // [getKeyId('dqjd')]: row[getKeyId('dqjd')]?.trim(),
      // [getKeyId('zysjsm')]: row[getKeyId('zysjsm')]?.trim(),
      ...row,
    };
    newData.splice(index, 1, {
      ...item, //old row data
      ...newRow, //new row data
    });
    let newEdit = [...editData];
    let index2 = newEdit.findIndex(item => row.id === item.id);
    if (index2 === -1) {
      newEdit.push(row);
    } else {
      newEdit.splice(index2, 1, {
        ...newEdit[index2], //old row data
        ...newRow, //new row data
      });
    }
    setEditData(p => [...newEdit]);
    setEdited(true);
    // console.log('TableData', newData);
    setTableData(preState => [...newData]);
  };
  //保存按钮
  const handleSubmit = () => {
    setTableLoading(true);
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
          // let rowspan = getRowSpanCount(tableData, 'gzmk', index);
          let getKeyStr = key => key + item.id;
          // if (rowspan === 0) {
          //   if (index >= 1) {
          //     let arr = tableData[index - 1];
          //     console.log(arr);
          //     item[getKeyStr('bznr')] = arr['bznr' + arr.id];
          //     item[getKeyStr('xzjh')] = arr['xzjh' + arr.id];
          //   }
          // }
          const getCurS = txt => {
            switch (txt) {
              case '低风险':
                return '1';
              case '中风险':
                return '2';
              case '高风险':
                return '3';
              case '进度正常':
                return '4';
              case '延期':
                return '5';
            }
          };
          return {
            V_ID: String(item.id),
            V_GZMK: String(item.gzmk),
            V_TXR: String(item.txr),
            V_BZNR: String(item[getKeyStr('bznr')]).trim(),
            V_XZJH: String(item[getKeyStr('xzjh')]).trim(),
            V_BBH: String(item[getKeyStr('bbh')]).trim(),
            V_JHSXRQ: ['', ' ', null, undefined].includes(item[getKeyStr('jhsxrq')])
              ? '-1'
              : moment(item[getKeyStr('jhsxrq')]).format('YYYYMMDD'),
            V_DQZT: String(getCurS(item[getKeyStr('dqzt')])).trim(),
            V_DQJD: String(item[getKeyStr('dqjd')]).trim(),
            V_ZYSJSM: String(item[getKeyStr('zysjsm')]).trim(),
          };
        });
        submitTable.push({});
        let deleteIdArr = dltData.map(x => {
          return {
            V_ID: x,
          };
        });
        deleteIdArr.push({});
        if (dltData.length === 0) {
          console.log('submitTable', submitTable);
          let submitData = {
            czr: 0,
            jsoninfo: JSON.stringify(submitTable),
            infocount: submitTable.length - 1,
            type: 'UPDATE',
          };
          OperateHjgWeeklyReport({ ...submitData })
            .then(res => {
              if (res?.code === 1) {
                queryTableData(
                  Number(dateRange[0].format('YYYYMMDD')),
                  Number(dateRange[1].format('YYYYMMDD')),
                  Number(currentXmid),
                );
                setIsSaved(true);
                setEditing(false);
                setEditingIndex(-1);
                setDltData([]);
                message.success('保存成功', 1);
                setTableLoading(false);
              }
            })
            .catch(e => {
              console.error('操作失败', 1);
              setTableLoading(false);
            });
          console.log('submitData', submitData);
        } else {
          OperateHjgWeeklyReport({
            jsoninfo: JSON.stringify(deleteIdArr),
            infocount: dltData.length,
            type: 'DELETE',
          })
            .then(res => {
              if (res.success) {
                console.log('submitTable', submitTable);
                let submitData = {
                  czr: 0,
                  jsoninfo: JSON.stringify(submitTable),
                  infocount: submitTable.length - 1,
                  type: 'UPDATE',
                };
                OperateHjgWeeklyReport({ ...submitData }).then(res => {
                  if (res?.code === 1) {
                    queryTableData(
                      Number(dateRange[0].format('YYYYMMDD')),
                      Number(dateRange[1].format('YYYYMMDD')),
                      Number(currentXmid),
                    );
                    setIsSaved(true);
                    setEditing(false);
                    setEditingIndex(-1);
                    setDltData([]);
                    message.success('保存成功', 1);
                    setTableLoading(false);
                  } else {
                    message.error('保存失败', 1);
                  }
                });
                console.log('submitData', submitData);
              }
            })
            .catch(e => {
              console.error('handleDelete操作失败', 1);
              setTableLoading(false);
            });
        }
      }
    });
  };
  //退回
  const handleSendBack = id => {
    let sendBackData = {
      jsoninfo: JSON.stringify([
        {
          V_ID: String(id),
        },
        {},
      ]),
      infocount: 1,
      type: 'BACK',
    };
    OperateHjgWeeklyReport({ ...sendBackData })
      .then(res => {
        if (res.success) {
          queryTableData(
            Number(dateRange[0].format('YYYYMMDD')),
            Number(dateRange[1].format('YYYYMMDD')),
            Number(currentXmid),
          );
          message.success('操作成功', 1);
        }
      })
      .catch(e => {
        console.error('handleSendBack操作失败', 1);
      });
  };
  //删除
  const handleDelete = id => {
    let deleteData = {
      jsoninfo: JSON.stringify([
        {
          V_ID: String(id),
        },
        {},
      ]),
      infocount: 1,
      type: 'DELETE',
    };
    OperateHjgWeeklyReport({ ...deleteData })
      .then(res => {
        if (res.success) {
          queryTableData(
            Number(dateRange[0].format('YYYYMMDD')),
            Number(dateRange[1].format('YYYYMMDD')),
            Number(currentXmid),
          );
          message.success('操作成功', 1);
        }
      })
      .catch(e => {
        console.error('handleDelete操作失败', 1);
      });
  };
  //跳过本周
  const handleSkipCurWeek = () => {
    Modal.confirm({
      // title: '跳过本周',
      className: 'skip-current-week',
      content: '确定要跳过本周吗？',
      onOk: () => {
        let curWeek = getCurrentWeek(new Date());
        let skipCurWeekData = {
          jsoninfo: JSON.stringify([
            {
              V_KSSJ: curWeek[0].format('YYYYMMDD'),
              V_JSSJ: curWeek[1].format('YYYYMMDD'),
            },
            {},
          ]),
          infocount: 1,
          type: 'SKIP',
        };
        OperateHjgWeeklyReport({ ...skipCurWeekData })
          .then(res => {
            if (res.success) {
              message.success('操作成功', 1);
              queryTableData(
                Number(dateRange[0].format('YYYYMMDD')),
                Number(dateRange[1].format('YYYYMMDD')),
                Number(currentXmid),
              );
            }
          })
          .catch(e => {
            message.error('操作失败', 1);
          });
      },
    });
  };
  //导出
  const handleExport = () => {
    let params = new URLSearchParams();
    params.append('startTime', Number(dateRange[0].format('YYYYMMDD')));
    params.append('endTime', Number(dateRange[1].format('YYYYMMDD')));
    params.append('xmmc', Number(currentXmid));
    fetch(hJGWeeklyReportExcel, {
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
        let fileName = `汇金谷零售业务周报(${new moment().format('YYYYMMDD')}).xlsx`;
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        message.success('请求成功，正在导出中', 1);
      })
      .catch(e => {
        console.error('汇金谷零售业务周报导出失败', 1);
      });
  };
  //左右滚动
  const handleTableScroll = direction => {
    const tableNode = document.querySelector('.weekly-report-summary .ant-table .ant-table-body');
    if (direction === 'left') {
      tableNode.scrollLeft = 0;
    }
    if (direction === 'right') {
      tableNode.scrollLeft = Math.floor(tableNode.scrollWidth - tableNode.clientWidth);
    }
    // console.log("🚀 ~ file: index.js ~ line 210 ~ handleTableScroll ~ tableNode", tableNode, tableNode.scrollLeft, tableNode.scrollWidth, tableNode.clientWidth)
  };
  //上周、下周、当前周
  const handleWeekChange = txt => {
    let startDayStamp = dateRange[0].valueOf();
    let endDaystamp = Number(dateRange[1].endOf('day').format('x'));
    const oneDayStamp = 86400000; //ms
    let newStart = null,
      newEnd = null;
    if (txt === 'last') {
      //上周
      newStart = startDayStamp - oneDayStamp * 7;
      newEnd = endDaystamp - oneDayStamp * 7;
    } else if (txt === 'next') {
      //下周
      newStart = startDayStamp + oneDayStamp * 7;
      newEnd = endDaystamp + oneDayStamp * 7;
    } else if (txt === 'current') {
      //当前周
      let curWeekRange = getCurrentWeek(new Date());
      newStart = curWeekRange[0];
      newEnd = curWeekRange[1];
    } else {
      return;
    }
    setEdited(false);
    setDateRange(pre => [...[moment(newStart), moment(newEnd)]]);
    setTableLoading(true);
    queryTableData(
      Number(moment(newStart).format('YYYYMMDD')),
      Number(moment(newEnd).format('YYYYMMDD')),
      currentXmid,
    );
  };
  //顶部时间选择后
  const handleDateChange = (d, ds) => {
    let timeStamp = d.valueOf();
    let currentDay = d.day();
    let monday = 0,
      sunday = 0;
    if (currentDay !== 0) {
      monday = new Date(timeStamp - (currentDay - 1) * 60 * 60 * 24 * 1000);
      sunday = new Date(timeStamp + (7 - currentDay) * 60 * 60 * 24 * 1000);
    } else {
      monday = new Date(timeStamp - (7 - 1) * 60 * 60 * 24 * 1000);
      sunday = new Date(timeStamp + (7 - 7) * 60 * 60 * 24 * 1000);
    }
    let currentWeek = [moment(monday), moment(sunday)];
    setEdited(false);
    setDateRange(pre => [...currentWeek]);
    setTableLoading(true);
    queryTableData(
      Number(currentWeek[0].format('YYYYMMDD')),
      Number(currentWeek[1].format('YYYYMMDD')),
      currentXmid,
    );
  };
  //顶部项目选择后
  const handleProjectChange = value => {
    if (value) {
      setCurrentXmid(Number(value));
      queryTableData(
        Number(dateRange[0].format('YYYYMMDD')),
        Number(dateRange[1].format('YYYYMMDD')),
        Number(value),
      );
    } else {
      queryTableData(
        Number(dateRange[0].format('YYYYMMDD')),
        Number(dateRange[1].format('YYYYMMDD')),
        -1,
      );
    }
    setTableLoading(true);
    setEdited(false);
  };

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
  //表格 - 列配置
  const tableColumns = [
    {
      title: '工作模块',
      dataIndex: 'gzmk',
      key: 'gzmk',
      width: 180,
      fixed: 'left',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'gzmk', index);
        return obj;
      },
    },
    {
      title: '本周重点工作',
      dataIndex: 'bznr',
      key: 'bznr',
      width: 240,
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'gzmk', index);
        return obj;
      },
      editable: true,
    },
    {
      title: '下周工作安排',
      dataIndex: 'xzjh',
      key: 'xzjh',
      width: 240,
      ellipsis: true,
      editable: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'gzmk', index);
        return obj;
      },
    },
    {
      title: '版本号',
      dataIndex: 'bbh',
      key: 'bbh',
      // fixed: 'left',
      width: 170,
      ellipsis: true,
      editable: true,
    },
    {
      title: '计划上线日期',
      dataIndex: 'jhsxrq',
      key: 'jhsxrq',
      width: 140,
      ellipsis: true,
      editable: true,
    },
    {
      title: '进度状态',
      dataIndex: 'dqzt',
      key: 'dqzt',
      width: 130,
      ellipsis: true,
      editable: true,
    },
    {
      title: '当前进度',
      dataIndex: 'dqjd',
      key: 'dqjd',
      width: 100,
      ellipsis: true,
      editable: true,
    },
    {
      title: '填报人',
      dataIndex: 'txr',
      key: 'txr',
      width: 130,
      ellipsis: true,
      render: value => value.join('、'),
    },
    {
      title: '重要事项说明',
      dataIndex: 'zysjsm',
      key: 'zysjsm',
      // width: 300,
      ellipsis: true,
      editable: true,
    },
    {
      title: editing ? '操作' : '',
      dataIndex: 'operation',
      key: 'operation',
      width: editing ? 80 : 0,
      fixed: editing ? 'right' : false,
      render: (text, row, index) => {
        if (editing)
          return (
            <div>
              {dltData.includes(row.id) ? (
                <a
                  style={{ color: '#3361ff' }}
                  onClick={() => setDltData(p => [...dltData.filter(x => x !== row.id)])}
                >
                  撤销删除
                </a>
              ) : (
                <Popconfirm
                  title="确定要删除吗?"
                  onConfirm={() => {
                    if (!dltData.includes(row.id)) {
                      setDltData(p => [...p, row.id]);
                    }
                  }}
                >
                  <a style={{ color: '#3361ff' }}>删除</a>
                </Popconfirm>
              )}
            </div>
          );
        return '';
      },
    },
  ];
  //表格 - 列配置
  const columns = tableColumns.map(col => {
    // if (!col.editable) {
    //   return col;
    // }
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
          issaved: isSaved,
          managerdata: managerData,
          editingindex: editingIndex,
          editdata: editData,
          dltdata: dltData,
        };
      },
    };
  });
  //表格 - 组件
  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };
  //汇总弹窗参数配置
  const summaryModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '手动汇总',
    width: '40%',
    height: '60rem',
    style: { top: '5%' },
    visible: summaryModalVisible,
    footer: null,
  };
  //查看弹窗参数配置
  const lcbqkModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '详细信息',
    width: '60%',
    height: '102rem',
    style: { top: '5%' },
    visible: lcbqkModalVisible,
    footer: null,
  };
  //获取查看弹窗URL
  const getLcbqkModalUrl = id => {
    const params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_XSZHZBZBHZ',
      operateName: 'V_XSZHZBHZ_VIEW',
      parameter: [
        {
          name: 'CKZBID',
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
  //获取汇总弹窗URL
  const handleSummary = () => {
    const params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_XSZHZBHZ',
      operateName: 'V_XSZHZBHZ_SUMMIT',
      parameter: [
        // {
        //     "name": "ZBID",
        //     "value": String(id)
        // },
      ],
      userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
    };
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          setSummaryModalUrl(url);
          setSummaryModalVisible(true);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //修改
  const handleEdit = () => {
    setEditing(true);
    if (tableData.length > 0) setEditingIndex(tableData[0]?.id);
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
      {summaryModalVisible && (
        <BridgeModel
          modalProps={summaryModalProps}
          onSucess={() => {
            queryTableData(
              Number(monthData.startOf('month').format('YYYYMMDD')),
              Number(monthData.endOf('month').format('YYYYMMDD')),
              Number(currentXmid),
            );
            setSummaryModalVisible(false);
            message.success('汇总成功', 1);
          }}
          onCancel={() => setSummaryModalVisible(false)}
          src={summaryModalUrl}
        />
      )}
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
          <Button onClick={handleWeekChange.bind(this, 'current')} style={{ marginRight: '16px' }}>
            本周
          </Button>
          <div className="month-slt-btn">
            <Button disabled={tableLoading} onClick={handleWeekChange.bind(this, 'last')}>
              <Icon type="left" />
            </Button>
            <Button disabled={tableLoading} onClick={handleWeekChange.bind(this, 'next')}>
              <Icon type="right" />
            </Button>
          </div>
          <WeekPicker
            value={dateRange[1]}
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
            allowClear
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
            {/* <Button style={{ marginRight: '8px'}} onClick={handleSummary}>手动汇总</Button> */}
            {editing ? (
              <>
                <span>（点击指定行进行编辑）</span>
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
              <Button className="ss" style={{ margin: '0 8px' }}>
                导出
              </Button>
            </Popconfirm>
            <Button onClick={handleSkipCurWeek}>跳过本周</Button>
          </div>
        </div>
        <div className="table-content">
          <Table
            onRow={record => {
              return {
                onClick: () => {
                  if (editing) {
                    // 编辑态的数据需要处理;
                    // let arr = tableData.map((item, index) => {
                    //   if (item.id === record.id)
                    //     return {
                    //       ...item,
                    //       ['manager' + item.id]: item.fzrid,
                    //       ['orgName' + item.id]:
                    //         orgArr.filter(z => z.orgId === item['orgName' + item.id])[0]?.orgName ||
                    //         '',
                    //     };
                    //   return fzrTableData[index];
                    // });
                    // setTableData(p => [...arr]);
                    setEditingIndex(record.id);
                  }
                },
              };
            }}
            loading={tableLoading}
            columns={columns}
            components={components}
            rowKey={record => record.id}
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
