import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Form,
  message,
  Popconfirm,
  Tooltip,
  DatePicker,
  Select,
  TreeSelect,
  Drawer,
} from 'antd';
import {
  AttendanceStatisticExportExcel,
  QueryBudgetStatistics,
} from '../../../../services/pmsServices';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import handleExport from './exportUtils.js';
import axios from 'axios';
import config from '../../../../utils/config';
import ExportModal from './ExportModal';
const { api } = config;
const {
  pmsServices: { attendanceStatisticExportExcel },
} = api;

const { Option } = Select;
const { MonthPicker } = DatePicker;

const TableBox = props => {
  const { dataProps = {}, funcProps = {} } = props;
  const { tableData = [], filterData = {}, activeKey, summaryData = {} } = dataProps;
  console.log('🚀 ~ file: index.js:36 ~ TableBox ~ tableData:', tableData);
  const { setFilterData = () => {}, queryTableData = () => {} } = funcProps;
  const [columns, setColumns] = useState([]); //列配置
  const [exportModalVisible, setExportModalVisible] = useState(false); //导出弹窗显隐
  const location = useLocation();

  useEffect(() => {
    if (activeKey) {
      if (activeKey === 'KQTJ') {
        setColumns([
          {
            title: '序号',
            dataIndex: 'XH',
            key: 'XH',
            width: 50,
            align: 'center',
            fixed: 'left',
            ellipsis: true,
            render: (txt, row, index) => {
              if (index === tableData.length - 1) {
                return {
                  children: (
                    <div
                      style={{
                        fontSize: '14px',
                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                        fontWeight: 'bold',
                        color: '#606266',
                      }}
                    >
                      {row.NR}：
                    </div>
                  ),
                  props: {
                    colSpan: 2,
                  },
                };
              }
              return txt;
            },
          },
          {
            title: '姓名',
            dataIndex: 'RYMC',
            width: 100,
            key: 'RYMC',
            ellipsis: true,
            fixed: 'left',
            render: (txt, row, index) => {
              if (index === tableData.length - 1)
                return {
                  children: '',
                  props: {
                    colSpan: 0,
                  },
                };
              return (
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/staffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: row.RYID,
                      }),
                    )}`,
                    state: {
                      routes: [{ name: '考勤统计', pathname: location.pathname }],
                    },
                  }}
                  className="table-link-strong"
                >
                  {txt}
                </Link>
              );
            },
          },
          ...Array.from({ length: 12 }, (_, index) => index + 1).map(x => ({
            title: x + '月',
            dataIndex: 'YF' + x,
            key: 'YF' + x,
            width: 120,
            align: 'center',
            ellipsis: true,
            children: [
              {
                title: '天数',
                dataIndex: 'TS_' + x,
                key: 'TS_' + x,
                width: 60,
                align: 'center',
                ellipsis: true,
                render: (txt, row, index) => {
                  if (index === tableData.length - 1)
                    return {
                      children: row['YF_' + x],
                      props: {
                        colSpan: 2,
                      },
                    };
                  return txt;
                },
              },
              {
                title: '加班',
                dataIndex: 'JB_' + x,
                key: 'JB_' + x,
                width: 60,
                align: 'center',
                ellipsis: true,
                render: (txt, row, index) => {
                  if (index === tableData.length - 1)
                    return {
                      children: '',
                      props: {
                        colSpan: 0,
                      },
                    };
                  return txt;
                },
              },
            ],
          })),
          {
            title: '合计',
            dataIndex: 'HJ',
            key: 'HJ',
            width: 100,
            ellipsis: true,
            align: 'right',
            sorter: (a, b) => Number(a.HJ || 0) - Number(b.HJ || 0),
            sortDirections: ['descend', 'ascend'],
          },
        ]);
      } else {
        setColumns([
          {
            title: '序号',
            dataIndex: 'XH',
            key: 'XH',
            width: 50,
            ellipsis: true,
            align: 'center',
            fixed: 'left',
            render: (txt, row, index) => {
              if (index === tableData.length - 1) {
                return {
                  children: (
                    <div
                      style={{
                        fontSize: '14px',
                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                        fontWeight: 'bold',
                        color: '#606266',
                      }}
                    >
                      {row.NR}：
                    </div>
                  ),
                  props: {
                    colSpan: 2,
                  },
                };
              }
              return txt;
            },
          },
          {
            title: '姓名',
            dataIndex: 'RYMC',
            width: 100,
            key: 'RYMC',
            ellipsis: true,
            fixed: 'left',
            render: (txt, row, index) => {
              if (index === tableData.length - 1)
              return {
                children: '',
                props: {
                  colSpan: 0,
                },
              };
              return (
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/staffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: row.RYID,
                      }),
                    )}`,
                    state: {
                      routes: [{ name: '考勤统计', pathname: location.pathname }],
                    },
                  }}
                  className="table-link-strong"
                >
                  {txt}
                </Link>
              );
            },
          },
          ...getDate(filterData.month?.year(), filterData.month?.month()).map(x => ({
            title: x.date,
            dataIndex: 'DATE' + x.date,
            key: 'DATE' + x.date,
            width: 80,
            ellipsis: true,
            align: 'center',
            children: [
              {
                title: x.week,
                dataIndex: 'RQ_' + x.date,
                key: 'RQ_' + x.date,
                width: 80,
                align: 'center',
                ellipsis: true,
              },
            ],
          })),
          {
            title: '请假天数',
            dataIndex: 'QJTS',
            width: 100,
            align: 'right',
            key: 'QJTS',
            ellipsis: true,
            sorter: (a, b) => Number(a.QJTS || 0) - Number(b.QJTS || 0),
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: '出勤天数（不含加班）',
            dataIndex: 'CQTS',
            width: 180,
            align: 'right',
            key: 'CQTS',
            ellipsis: true,
            sorter: (a, b) => Number(a.CQTS || 0) - Number(b.CQTS || 0),
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: '加班天数',
            dataIndex: 'JBTS',
            width: 100,
            align: 'right',
            key: 'JBTS',
            ellipsis: true,
            sorter: (a, b) => Number(a.JBTS || 0) - Number(b.JBTS || 0),
            sortDirections: ['descend', 'ascend'],
          },
        ]);
      }
    }
    return () => {};
  }, [activeKey, JSON.stringify(filterData), JSON.stringify(tableData)]);

  const getDate = (year, month) => {
    //month，0表示1月
    const startDate = moment({ year, month, day: 1 });
    const endDate = moment(startDate).endOf('month');
    const result = [];

    while (startDate.isSameOrBefore(endDate)) {
      const date = startDate.date();
      const week = startDate.format('dddd').slice(-1);

      result.push({ date, week });

      startDate.add(1, 'day');
    }
    return result;
  };

  const tableFooter = (obj = {}) => {
    let columnArr = [
      {
        width: 150,
        key: 'NR',
        value: obj.NR + '：',
        align: 'center',
        style: {
          backgroundColor: '#f5f7fa',
          fontFamily: 'PingFangSC-Regular, PingFang SC',
          fontWeight: 'bold',
          color: '#606266',
          borderRight: '1px solid #e8e8e8',
          flexShrink: 0,
        },
      },
      ...Array.from({ length: 12 }, (_, index) => index + 1).map(x => ({
        width: 120,
        key: 'YF_' + x,
        value: obj['YF_' + x],
        align: 'right',
      })),
      {
        width: 100,
        key: 'HJ',
        align: 'right',
        value: obj.HJ,
      },
    ];
    if (activeKey === 'YDHZ') {
      columnArr = [
        {
          width: 150,
          key: 'NR',
          value: obj.NR + '：',
          align: 'center',
          style: {
            backgroundColor: '#f5f7fa',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 'bold',
            color: '#606266',
            borderRight: '1px solid #e8e8e8',
            flexShrink: 0,
          },
        },
        ...getDate(filterData.month?.year(), filterData.month?.month()).map(x => ({
          width: 80,
          key: 'RQ_' + x.date,
          value: obj['RQ_' + x.date],
          align: 'center',
        })),
        {
          width: 100,
          key: 'QJTS',
          align: 'right',
          value: obj.QJTS,
        },
        {
          width: 180,
          key: 'CQTS',
          align: 'right',
          value: obj.CQTS,
        },

        {
          width: 100,
          key: 'JBTS',
          align: 'right',
          value: obj.JBTS,
        },
      ];
    }
    return (
      <div
        className="budget-excute-table-footer"
        style={{
          width:
            activeKey === 'KQTJ'
              ? 1690
              : getDate(filterData.month?.year(), filterData.month?.month()).length * 80 + 530,
        }}
      >
        {columnArr.map(x => (
          <div
            key={x.key}
            style={{
              width: x.width,
              textAlign: x.align,
              ...(x.style ?? { borderRight: '1px solid #e8e8e8', flexShrink: 0 }),
            }}
          >
            {x.value}
          </div>
        ))}
      </div>
    );
  };

  const handlePrjChange = v => {
    setFilterData(p => ({ ...p, prjId: v }));
    queryTableData({
      queryType: activeKey,
      projectId: Number(v),
    });
  };

  const handleYearChange = d => {
    setFilterData(p => ({ ...p, year: d, yearOpen: false }));
    queryTableData({ queryType: activeKey, year: d.year() });
  };

  const handleMonthChange = d => {
    setFilterData(p => ({ ...p, month: d }));
    queryTableData({
      queryType: activeKey,
      month: Number(d.format('YYYYMM')),
    });
  };

  const handleExcelxport = () => {
    if (activeKey === 'KQTJ') {
      axios({
        method: 'POST',
        url: attendanceStatisticExportExcel,
        responseType: 'blob',
        data: {
          projectId: Number(filterData.prjId),
          year: filterData.year.year(),
        },
      })
        .then(res => {
          const href = URL.createObjectURL(res.data);
          const a = document.createElement('a');
          a.download = `考勤统计（${filterData.year.format('YYYY')}）.xlsx`;
          a.href = href;
          a.click();
        })
        .catch(err => {
          console.error('🚀导出数据', err);
          message.error('导出数据获取失败', 1);
        });
    } else {
      setExportModalVisible(true);
    }
  };

  return (
    <>
      <div className="table-box">
        <ExportModal
          visible={exportModalVisible}
          setVisible={setExportModalVisible}
          xmid={Number(filterData.prjId)}
          defaultDate={filterData.month}
          columns={[...columns.map(x => ({ ...x, title: String(x.title) }))]}
        />
        <div className="filter-row">
          <div className="console-item">
            <div className="item-label">项目名称</div>
            <Select
              className="item-selector"
              dropdownClassName={'item-selector-dropdown'}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              onChange={handlePrjChange}
              value={filterData.prjId}
              placeholder="请选择"
            >
              {filterData.prjSlt?.map((x, i) => (
                <Option key={x.XMID} value={Number(x.XMID)}>
                  {x.XMMC}
                </Option>
              ))}
            </Select>
          </div>
          {activeKey === 'KQTJ' ? (
            <div className="console-item">
              <div className="item-label">年份</div>
              <DatePicker
                mode="year"
                className="item-selector"
                value={filterData.year}
                open={filterData.yearOpen}
                placeholder="请选择年份"
                format="YYYY"
                allowClear={false}
                onOpenChange={v => setFilterData(p => ({ ...p, yearOpen: v }))}
                onPanelChange={handleYearChange}
              />
            </div>
          ) : (
            <div className="console-item">
              <div className="item-label">月份</div>
              <MonthPicker
                mode="month"
                className="item-selector"
                value={filterData.month}
                placeholder="请选择月份"
                allowClear={false}
                onChange={handleMonthChange}
                // onPanelChange={handleYearChange}
              />
            </div>
          )}
          <Button className="btn-search" type="primary" onClick={handleExcelxport}>
            导出
          </Button>
        </div>
        <div className="project-info-table-box">
          <Table
            columns={columns}
            rowKey={'RYID'}
            dataSource={tableData}
            pagination={false}
            bordered //记得注释
          />
          {/* {tableFooter(summaryData)} */}
        </div>
      </div>
    </>
  );
};
export default Form.create()(TableBox);
