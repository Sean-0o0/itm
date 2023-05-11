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
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem('user')).id);

const TableBox = props => {
  const {
    form,
    tableData,
    dateRange,
    setTableData,
    tableLoading,
    setTableLoading,
    groupData,
    edited,
    setEdited,
    getCurrentWeek,
    currentXmid,
    queryTableData,
    monthData,
    projectData,
    setCurrentXmid,
    setMonthData,
    originData,
    setOriginData,
    orgData,
    orgArr,
    fzrTableData,
    setFzrTableData,
    managerData,
    stillLastMonth,
  } = props;
  const [isSaved, setIsSaved] = useState(false);
  const [summaryModalUrl, setSummaryModalUrl] = useState('');
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [authIdData, setAuthIdData] = useState([]); //权限用户id
  const [toLeft, setToLeft] = useState(false); //是否允许左滚
  const [toRight, setToRight] = useState(true);
  const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
  const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');
  const [editing, setEditing] = useState(false); //编辑状态
  const [editingIndex, setEditingIndex] = useState(-1); //编辑
  const [editData, setEditData] = useState([]); //编辑数据
  const [dltData, setDltData] = useState([]); //删除行id

  let timer = null;
  // const downloadRef = useRef(null);

  useEffect(() => {
    setTableLoading(true);
    // getAutnIdData();
    // const tableNode = document.querySelector('.weekly-report-detail .ant-table .ant-table-body');
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
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    console.log('mmm', monthData);
    return () => {};
  }, [JSON.stringify(monthData)]);

  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
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
    const newData = [...tableData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    const keys = Object.keys(row);
    // console.log("🚀 ~ file: index.js ~ line 78 ~ handleTableSave ~ keys", keys)
    //去空格
    const newRow = {
      // id: row.id,
      // module: row.module,
      // sysBuilding: row.sysBuilding,
      // [keys[3]]: row[keys[3]],
      // [keys[4]]: row[keys[4]].trim(),
      // [keys[5]]: row[keys[5]],
      // [keys[6]]: row[keys[6]].trim(),
      // [keys[7]]: row[keys[7]].trim(),
      // [keys[8]]: row[keys[8]].trim(),
      // [keys[9]]: row[keys[9]].trim(),
      // [keys[10]]: row[keys[10]].trim(),
      // [keys[11]]: row[keys[11]].trim(),
      // [keys[12]]: row[keys[12]].trim(),
      ...row,
    };
    newData.splice(index, 1, {
      ...item, //old row data
      ...newRow, //new row data
    });
    // console.log('🚀 ~ file: index.js:173 ~ handleTableSave ~ newData:', newData);
    // let fzrTableArr = newData.map(x => {
    //   let fzrArr = x['manager' + x.id].map(y => managerData.filter(z => z.id === y)[0]?.name || '');
    //   // let bmTxt = orgArr.filter(z => z.orgId === x['orgName' + x.id])[0]?.orgName || '';
    //   if (x.id === row.id)
    //     return {
    //       ...x,
    //       ['manager' + x.id]: fzrArr,
    //       // ['orgName' + x.id]: bmTxt,
    //     };
    //   return x;
    // });

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

    // setFzrTableData(p => [...fzrTableArr]);
    // console.log('🚀 ~ file: index.js:202 ~ handleTableSave ~ [...fzrTableArr]:', [...fzrTableArr]);
    setEditData(p => [...newEdit]);
    // console.log('🚀 ~ file: index.js:167 ~ handleTableSave ~ [...newEdit]:', [...newEdit]);
    setEdited(true);
    // console.log('TableData', newData);
    setTableData(preState => [...newData]);
  };

  const handleSubmit = () => {
    form.validateFields(err => {
      if (!err) {
        setTableLoading(true);
        let editDataDelFilter = [];
        editData.forEach(x => {
          if (!dltData.includes(x.id)) {
            editDataDelFilter.push(x);
          }
        });
        let submitTable = editDataDelFilter.map(item => {
          const getCurP = txt => {
            switch (txt) {
              case '规划中':
                return '1';
              case '进行中':
                return '2';
              case '已完成':
                return '3';
              default:
                return -1;
            }
          };
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
              default:
                return -1;
            }
          };
          // const txtToId = txtArr => {
          //   let idArr = [];
          //   idArr = txtArr.map(txt => {
          //     return managerData.filter(x => x.name === txt)[0]?.id;
          //   });
          //   return idArr;
          // };
          const notNullStr = v => {
            if (['', ' ', undefined].includes(v)) return null;
            return v;
          };
          const notNullNum = v => {
            if (['', ' ', undefined].includes(v)) return -1;
            return v;
          };
          return {
            V_ID: String(item.id),
            V_FZR: item['manager' + item.id].join(';'),
            V_NDGH: String(notNullStr(item['annualPlan' + item.id])),
            V_WCSJ: String(
              ['', ' ', undefined, null].includes(item['cplTime' + item.id])
                ? -1
                : moment(item['cplTime' + item.id]).format('YYYYMM'),
            ),
            V_DQJZ: String(getCurP(item['curProgress' + item.id])),
            V_DQJD: String(notNullStr(item['curRate' + item.id])),
            V_DQZT: String(getCurS(item['curStatus' + item.id])),
            V_FXSM: String(notNullStr(item['riskDesc' + item.id])),
            V_ZBRS: String(notNullNum(item['peopleNumber' + item.id])),
            V_SYBM: String(notNullNum(item['orgName' + item.id])),
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
          console.log('🚀 ~ file: index.js:186 ~ handleSubmit ~ submitData:', submitData);
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
    OperateSZHZBWeekly({ ...sendBackData })
      .then(res => {
        if (res.success) {
          queryTableData(
            Number(monthData.startOf('month').format('YYYYMMDD')),
            Number(monthData.endOf('month').format('YYYYMMDD')),
            Number(currentXmid),
            [...orgArr],
          );
          message.success('操作成功', 1);
        }
      })
      .catch(e => {
        message.error('操作失败', 1);
      });
  };
  const handleDelete = id => {
    if (!dltData.includes(id)) {
      setDltData(p => [...p, id]);
      setEdited(true);
    }
  };
  const handleSkipCurWeek = () => {
    Modal.confirm({
      // title: '跳过本周',
      className: 'skip-current-week',
      content: '确定要跳过本周吗？',
      onOk: () => {
        let curWeek = getCurrentWeek(new Date());
        let skipCurWeekData = {
          json: JSON.stringify([
            {
              V_KSSJ: curWeek[0].format('YYYYMMDD'),
              V_JSSJ: curWeek[1].format('YYYYMMDD'),
            },
            {},
          ]),
          count: 1,
          type: 'SKIP',
        };
        OperateSZHZBWeekly({ ...skipCurWeekData })
          .then(res => {
            if (res.success) {
              message.success('操作成功', 1);
              queryTableData(
                Number(dateRange[0].format('YYYYMMDD')),
                Number(dateRange[1].format('YYYYMMDD')),
                Number(currentXmid),
                [...orgArr],
              );
            }
          })
          .catch(e => {
            message.error('操作失败', 1);
          });
      },
    });
  };
  const handleExport = () => {
    let params = new URLSearchParams();
    params.append('startTime', Number(monthData.startOf('month').format('YYYYMMDD')));
    params.append('endTime', Number(monthData.endOf('month').format('YYYYMMDD')));
    params.append('xmmc', Number(currentXmid));
    fetch(digitalSpecialClassWeeklyReportExcel, {
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
      });
  };
  const handleTableScroll = direction => {
    const tableNode = document.querySelector('.weekly-report-detail .ant-table .ant-table-body');
    if (direction === 'left') {
      tableNode.scrollLeft = 0;
    }
    if (direction === 'right') {
      tableNode.scrollLeft = Math.floor(tableNode.scrollWidth - tableNode.clientWidth);
    }
    // console.log("🚀 ~ file: index.js ~ line 210 ~ handleTableScroll ~ tableNode", tableNode, tableNode.scrollLeft, tableNode.scrollWidth, tableNode.clientWidth)
  };
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
  const handleDeleteCancel = id => {
    setDltData(p => [...dltData.filter(x => x !== id)]);
  };
  const tableColumns = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      fixed: true,
      ellipsis: true,
      // render: (value, row, index) => {
      //   const obj = {
      //     children: value,
      //     props: {},
      //   };
      //   if ((index > 0 && row.module !== tableData[index - 1].module) || index === 0) {
      //     obj.props.rowSpan = groupData[value]?.length;
      //   } else {
      //     obj.props.rowSpan = 0;
      //   }
      //   return obj;
      // },
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = getRowSpanCount(tableData, 'module', index);
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
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          key: col.key,
          formdecorate: form,
          issaved: isSaved,
          managerdata: managerData,
          orgdata: orgData,
          orgarr: orgArr,
          editingindex: editingIndex,
          dltdata: dltData,
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
  const summaryModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '手动汇总',
    width: '600px',
    height: '400px',
    style: { top: '60px' },
    visible: summaryModalVisible,
    footer: null,
  };
  const lcbqkModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '详细信息',
    width: '800px',
    height: '600px',
    style: { top: '60px' },
    visible: lcbqkModalVisible,
    footer: null,
  };
  const getLcbqkModalUrl = id => {
    const params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_XSZHZBHZ',
      operateName: 'V_XSZHZBHZ_VIEW_copy',
      parameter: [
        {
          name: 'ZBID',
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
  const [open, setOpen] = useState(false);

  const handleWeekChange = txt => {
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
  const handleDateChange = (d, ds) => {
    setMonthData(d);
    setTableLoading(true);
    queryTableData(
      Number(d.startOf('month').format('YYYYMMDD')),
      Number(d.endOf('month').format('YYYYMMDD')),
      currentXmid,
      [...orgArr],
    );
  };
  const handleProjectChange = value => {
    if (value) {
      setCurrentXmid(Number(value));
      queryTableData(
        Number(monthData.startOf('month').format('YYYYMMDD')),
        Number(monthData.endOf('month').format('YYYYMMDD')),
        Number(value),
        [...orgArr],
      );
    } else {
      setCurrentXmid(-1);
      queryTableData(
        Number(monthData.startOf('month').format('YYYYMMDD')),
        Number(monthData.endOf('month').format('YYYYMMDD')),
        -1,
        [...orgArr],
      );
    }
    setTableLoading(true);
    setEdited(false);
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
              [...orgArr],
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
          <div className="console-date"></div>
          <Button onClick={handleWeekChange.bind(this, 'current')} style={{ marginRight: '16px' }}>
            本月
          </Button>
          <div className="month-slt-btn">
            <Button disabled={tableLoading} onClick={handleWeekChange.bind(this, 'last')}>
              <Icon type="left" />
            </Button>
            <Button disabled={tableLoading} onClick={handleWeekChange.bind(this, 'next')}>
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
                <Popconfirm title="确定要保存吗？" onConfirm={handleSubmit}>
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
            rowKey={record => record.id}
            rowClassName={() => 'editable-row'}
            dataSource={tableData}
            scroll={
              tableData?.length > (document.body.clientHeight - 278) / (editing ? 59 : 40)
                ? {
                    y: document.body.clientHeight - 278,
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
