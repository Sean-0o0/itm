import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { Button, Table, message, Popconfirm, Form, DatePicker, Icon } from 'antd';
import { EditCustomReport } from '../../../../services/pmsServices';
import moment from 'moment';
import HandleAddModal from '../HandleAddModal';
import config from '../../../../utils/config';
import axios from 'axios';
const { api } = config;
const {
  pmsServices: { exportCustomReportToExcel },
} = api;

const TableBox = props => {
  const { form, dataProps = {}, funcProps = {} } = props;
  const {
    bgmc,
    bgid,
    tableData = {},
    columnsData = [],
    tableLoading,
    monthData,
    activeKey,
    roleData = {},
    userBasicInfo = {},
  } = dataProps;
  const isGLY = roleData.zyrole === '自定义报告管理员';
  const { setTableLoading, setMonthData, getData } = funcProps;
  const [addModalData, setAddModalData] = useState({
    visible: false,
    data: {},
    dataArr: [],
  }); //新增行弹窗
  //编辑分类用的取值字段
  const EDIT_FIELD = columnsData.find(x => x.ZDMC === '建设任务')?.QZZD;
  const isBGHZR =
    ((JSON.parse(roleData.testRole || '{}')?.ALLROLE ?? '') + (roleData.role ?? '')).includes('报告汇总人');

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

  //提交
  const handleSubmit = () => {
    form.validateFields(err => {
      if (!err) {
        setTableLoading(true);
        let params = {
          fieldCount: 2,
          infoCount: 1,
          operateType: 'SUBMIT',
          reportId: Number(bgid),
          reportInfo: JSON.stringify([
            { YF: String(monthData.format('YYYYMM')), BM: String(userBasicInfo.orgid) },
          ]),
        };
        EditCustomReport({ ...params })
          .then(res => {
            if (res?.code === 1) {
              getData(Number(bgid), Number(monthData.format('YYYYMM')), activeKey);
              setTableLoading(false);
              message.success('提交成功', 1);
            }
          })
          .catch(e => {
            message.error('操作失败', 1);
            setTableLoading(false);
          });
      }
    });
  };

  //导出
  const handleExport = () => {
    axios({
      method: 'POST',
      url: exportCustomReportToExcel,
      responseType: 'blob',
      data: {
        current: 1,
        pageSize: 20,
        paging: -1,
        queryType: activeKey + 'DC',
        reportID: Number(bgid),
        sort: '',
        total: -1,
        month: Number(monthData.format('YYYYMM')),
      },
    })
      .then(res => {
        const href = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.download = bgmc + '.xlsx';
        a.href = href;
        a.click();
      })
      .catch(error => {
        console.error('🚀 ~ 导出失败:', error);
        message.error('导出失败', 1);
      });
  };

  const handleValue = v => {
    return ['-1', '', ' ', 'undefined', null].includes(v) ? '' : v;
  };

  //列配置 - 排列顺序 - 分类字段（合并） - 关联项目 - 填写人 - 上月字段 - 本月填写字段 - 固定字段
  const tableColumns = () => {
    let arr = [
      ...columnsData.map(x => {
        if (x.ZDLX === '1')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: x.ZDMC === '四大技术提升工程' ? 120 : x.ZDMC?.length * 20,
            // fixed: true,
            ellipsis: false,
            borderLeft: true, //左边框
            render: (value, row, index) => {
              const obj = {
                children: value,
                props: {},
              };
              obj.props.rowSpan = getRowSpanCount(tableData.data, x.QZZD, index, false);
              return obj;
            },
          };
        if (x.QZZD === 'GLXM')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: 140,
            ellipsis: false,
            borderLeft: true, //左边框
            render: (txt, row) => handleValue(txt),
          };
        if (x.QZZD === 'TXR')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: 70,
            ellipsis: false,
            render: txt => handleValue(txt),
          };
        if (x.ZDMC.includes('上月工作'))
          return {
            title: x.ZDMC + `（${monthData.month()}月）`,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: 180,
            ellipsis: false,
            render: txt => handleValue(txt),
          };
        if (x.ZDMC.includes('当月工作'))
          return {
            title: x.ZDMC + `（${monthData.month() + 1}月）`,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: 180,
            ellipsis: false,
            render: txt => handleValue(txt),
          };
        if (x.ZDLX === '2')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: 80,
            // fixed: true,
            // editable: true,
            ellipsis: false,
            render: txt => handleValue(txt),
          };
        if (x.QZZD === 'JD')
          return {
            title: x.ZDMC,
            dataIndex: x.QZZD,
            key: x.QZZD,
            width: tableData.tableWidth < document.body.clientWidth - 296 ? undefined : 80,
            ellipsis: false,
            render: txt => handleValue(txt),
          };
        return {
          title: x.ZDMC,
          dataIndex: x.QZZD,
          key: x.QZZD,
          width: x.ZDMC?.length * 25,
          // fixed: true,
          ellipsis: false,
          render: txt => handleValue(txt),
        };
      }),
    ];
    //部门月报才有编辑
    if (activeKey === 'BMYB') {
      arr.push({
        title: '操作',
        dataIndex: 'OPRT',
        key: 'OPRT',
        align: 'center',
        width: 60,
        borderLeft: true, //左边框
        render: (txt, row, index) => {
          const obj = {
            children: txt,
            props: {},
          };
          obj.children = (
            <a
              style={{ color: '#3361ff', marginRight: 6 }}
              onClick={() => {
                let dataArr =
                  tableData.data?.filter(
                    x =>
                      x.TXR !== 'undefined' &&
                      x.TXRID !== '-1' &&
                      (isBGHZR
                        ? x[EDIT_FIELD] === row[EDIT_FIELD] //bghzr点击编辑时查看所有数据
                        : x[EDIT_FIELD] === row[EDIT_FIELD] && //普通人员点击编辑时仅展示自己的数据
                          String(x.TXRID) === String(userBasicInfo.id)),
                  ) || [];
                setAddModalData({
                  visible: true,
                  data: { ...row, fieldCount: tableData.customColumns.length - 5 },
                  dataArr: dataArr,
                });
              }}
            >
              编辑
            </a>
          );
          obj.props.rowSpan = getRowSpanCount(
            tableData.data,
            // columnsData.find(x => x.ZDLX === '1')?.QZZD,  //先暂时写死下边这个
            EDIT_FIELD,
            index,
            false,
          );
          return obj;
        },
      });
    }
    return arr;
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
      time = moment();
    } else {
      return;
    }
    setMonthData(time);
    getData(Number(bgid), Number(time.format('YYYYMM')), activeKey);
  };

  //月份下拉框数据变化
  const handleDateChange = (d, ds) => {
    setMonthData(d);
    getData(Number(bgid), Number(d.format('YYYYMM')), activeKey);
  };

  const getColumnWidth = (x = {}) => {
    if (x.QZZD === 'TXR') return isBGHZR ? 120 : 80;
    // else if (x.QZZD === 'GLXM') return isBGHZR ? 260 : 180;
    else if (x.QZZD === 'GLXM') return 260;
    else if (x.ZDMC.includes('系统项目')) return 160;
    else return undefined;
  };

  const tableColumnsForModal = columnsData
    .filter(x => x.ZDLX !== '1')
    .map(x => {
      if (x.ZDMC.includes('上月工作'))
        return {
          title: x.ZDMC + `（${monthData.month()}月）`,
          dataIndex: x.QZZD,
          key: x.QZZD,
          width: getColumnWidth(x),
          editable: true,
          ellipsis: true,
        };
      if (x.ZDMC.includes('当月工作'))
        return {
          title: x.ZDMC + `（${monthData.month() + 1}月）`,
          dataIndex: x.QZZD,
          key: x.QZZD,
          width: getColumnWidth(x),
          editable: true,
          ellipsis: true,
        };
      return {
        title: x.ZDMC,
        dataIndex: x.QZZD,
        key: x.QZZD,
        width: getColumnWidth(x),
        editable: true,
        ellipsis: true,
      };
    });

  return (
    <>
      <div className="table-box">
        <div className="table-console">
          <span className="table-title">{bgmc}</span>
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
          <DatePicker.MonthPicker
            allowClear={false}
            value={monthData}
            onChange={handleDateChange}
            style={{ margin: '0 10px', width: '110px', marginRight: 'auto' }}
          />
          <div className="console-btn-submit">
            <Button
              onClick={() => getData(Number(bgid), Number(monthData.format('YYYYMM')), activeKey)}
            >
              刷新
            </Button>
            {isBGHZR && activeKey === 'BMYB' && tableData.data.length > 0 && (
              <Popconfirm title="确定要提交吗？" onConfirm={handleSubmit}>
                <Button type="primary" style={{ marginLeft: '8px' }}>
                  提交
                </Button>
              </Popconfirm>
            )}
            {isGLY && activeKey === 'YBHZ' && tableData.data.length > 0 && (
              <Fragment>
                <Popconfirm title="确定要导出吗?" onConfirm={handleExport}>
                  <Button style={{ marginLeft: '8px' }}>导出</Button>
                </Popconfirm>
              </Fragment>
            )}
          </div>
        </div>
        <div className="table-content">
          <Table
            columns={tableColumns()}
            rowKey={'ID'}
            dataSource={tableData.data}
            pagination={false}
            bordered
          />
        </div>
        <HandleAddModal
          visible={addModalData.visible}
          setVisible={v => setAddModalData(p => ({ ...p, visible: v }))}
          tableColumns={tableColumnsForModal}
          data={addModalData.data}
          topData={columnsData
            .filter(x => x.ZDLX === '1')
            .map(x => ({ title: x.ZDMC, dataIndex: x.QZZD }))}
          dataArr={addModalData.dataArr}
          refresh={() => getData(Number(bgid), Number(monthData.format('YYYYMM')), activeKey)}
        />
      </div>
    </>
  );
};
export default Form.create()(TableBox);
