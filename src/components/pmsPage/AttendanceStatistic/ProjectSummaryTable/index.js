import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, message, Select, Table, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import axios from 'axios';
import config from '../../../../utils/config';
import handleExport from '../TableBox/exportUtils';
import { textOverflowSlice } from '../../../../utils/_selfDefinedMethod/index.js'

const { api } = config;
const {
  pmsServices: { attendanceStatisticExportExcel },
} = api;

const ProjectSummaryTable = props => {
  const { dataProps = {}, funcProps = {}, authorities = {} } = props;
  const { tableData = [], filterData = {}, activeKey } = dataProps;
  const location = useLocation();
  const routes = [{ name: '考勤统计', pathname: location.pathname }];
  const { setFilterData = () => { }, queryProjectManHourSummary = () => { } } = funcProps;
  const [columns, setColumns] = useState([
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      width: 150,
      key: 'XMMC',
      ellipsis: true,
      render: (txt, row, index) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: row.XMID,
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
              className="table-link-strong"
            >
              {txt}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      width: 150,
      key: 'XMJL',
      align: 'center',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.XMJLID,
              }),
            )}`,
            state: {
              routes,
            },
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '填报部门',
      dataIndex: 'TBBMMC',
      key: 'TBBMMC',
      width: 150,
      ellipsis: true,
      align: 'center',
      render: (txt, row) => (
        <div>{textOverflowSlice(txt, 8)}</div>
      ),
    },
    {
      title: '是否抵税扣除',
      dataIndex: 'SFDSKC',
      key: 'SFDSKC',
      width: 110,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '1月',
      dataIndex: 'MONTH_1',
      key: 'MONTH_1',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '2月',
      dataIndex: 'MONTH_2',
      key: 'MONTH_2',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '3月',
      dataIndex: 'MONTH_3',
      key: 'MONTH_3',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '4月',
      dataIndex: 'MONTH_4',
      key: 'MONTH_4',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '5月',
      dataIndex: 'MONTH_5',
      key: 'MONTH_5',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '6月',
      dataIndex: 'MONTH_6',
      key: 'MONTH_6',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '7月',
      dataIndex: 'MONTH_7',
      key: 'MONTH_7',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '8月',
      dataIndex: 'MONTH_8',
      key: 'MONTH_8',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '9月',
      dataIndex: 'MONTH_9',
      key: 'MONTH_9',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '10月',
      dataIndex: 'MONTH_10',
      key: 'MONTH_10',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '11月',
      dataIndex: 'MONTH_11',
      key: 'MONTH_11',
      width: 80,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '12月',
      dataIndex: 'MONTH_12',
      key: 'MONTH_12',
      width: 80,
      ellipsis: true,
      align: 'center',
    }
  ]); //列配置
  const [exportModalVisible, setExportModalVisible] = useState(false); //导出弹窗显隐


  useEffect(() => {
  }, [activeKey, filterData.month, location.pathname, routes, tableData.length]);

  const handleYearChange = d => {
    setFilterData(p => ({ ...p, year: d, yearOpen: false }));
    queryProjectManHourSummary({ ...filterData, year: d.year() });
  };

  const handleExcelxport = () => {
    // setExportModalVisible(true);
    const dataList = [];
    dataList.push(tableData)
    const sheetNames = [];
    sheetNames.push(String(filterData.year.year()));
    const columnList = [];
    columnList.push(columns);
    handleExport({
      list: dataList,
      headList: columnList,
      sheetNames,
      sheetName: `项目汇总（${filterData.year.year()}）`,
    });
  };
  return (
    <>
      <div className="table-box">
        <ExportModal
          visible={exportModalVisible}
          setVisible={setExportModalVisible}
          columns={columns}
        />
        <div className="filter-row">
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
          <Button className="btn-search" type="primary" onClick={handleExcelxport}>
            导出
          </Button>
        </div>

        <div className="project-info-table-box">
          <div style={{color: '#999999', paddingBottom: '16px' }}>
            人力成本单位: 人天
          </div>
          <Table
            columns={columns}
            rowKey={'XMID'}
            dataSource={tableData}
            pagination={false}
            bordered //记得注释
          />
        </div>
      </div>
    </>
  );
};
export default Form.create()(ProjectSummaryTable);
