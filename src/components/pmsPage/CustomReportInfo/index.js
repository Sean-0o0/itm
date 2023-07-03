import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QuerySupplierList } from '../../../services/pmsServices';
import { message } from 'antd';

export default function CustomReportInfo(props) {
  const [tableData, setTableData] = useState({
    data: [],
    current: 1, //当前页码
    pageSize: 20, //每页条数
    total: 0, //数据总数
  }); //表格数据
  const [filterData, setFilterData] = useState({
    data: [
      { NAME: '报告1', ID: 1 },
      { NAME: '报告2', ID: 2 },
      { NAME: '报告3', ID: 3 },
    ],
    value: undefined,
  }); //报告名称下拉框数据
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const { dictionary = {} } = props;
  const {} = dictionary;

  //获取表格数据
  const getTableData = ({ current = 1, pageSize = 20, queryType = 'ALL', sort = 'ID ASC' }) => {
    setTableLoading(true);

    //
    setTableData({
      data: [], //表格数据
      current, //当前页码
      pageSize, //每页条数
      total: 0, //数据总数
    });
    getFilterData();
  };

  //获取报告名称下拉框数据
  const getFilterData = () => {
    setFilterData({
      data: [],
      value: undefined,
    });
  };

  return (
    <div className="supplier-info-box">
      <TopConsole
        dataProps={{
          filterData,
        }}
        funcProps={{
          setFilterData,
          getTableData,
        }}
      />
      <InfoTable
        dataProps={{
          tableData,
          tableLoading,
        }}
        funcProps={{
          setFilterData,
          getTableData,
        }}
      />
    </div>
  );
}
