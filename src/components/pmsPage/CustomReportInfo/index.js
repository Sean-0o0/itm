import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryCustomReportContent, QuerySupplierList } from '../../../services/pmsServices';
import { message } from 'antd';

export default function CustomReportInfo(props) {
  const [tableData, setTableData] = useState({
    origin: [],
    data: [],
    current: 1, //当前页码 -- 该页面采用伪分页
    pageSize: 20, //每页条数
    total: 0, //数据总数
  }); //表格数据
  const [filterData, setFilterData] = useState({
    data: [],
    value: undefined,
  }); //报告名称下拉框数据
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const { dictionary = {} } = props;
  const {BGLX} = dictionary;

  useEffect(() => {
    getBasicData();
    return () => {};
  }, []);

  //获取基础数据
  const getBasicData = (id = undefined) => {
    setTableLoading(true);
    QueryCustomReportContent({
      current: 1,
      pageSize: 20,
      paging: -1,
      queryType: 'BG',
      // reportID: 0,
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ QueryCustomReportContent ~ res', JSON.parse(res.nrxx));
          setTableData(p => ({
            ...p,
            origin: JSON.parse(res.nrxx), //表格数据, 搜索不影响
            data: JSON.parse(res.nrxx), //表格数据
            total: JSON.parse(res.nrxx).length, //数据总数
          }));
          //获取报告名称下拉框数据
          setFilterData(p=>({
            ...p,
            data: JSON.parse(res.nrxx),
          }));
          getTableData(id);
          setTableLoading(false);
        }
      })
      .catch(e => {
        console.error('🚀表格数据', e);
        message.error('表格数据获取失败', 1);
        setTableLoading(false);
      });
  };

  //查询获取表格数据
  const getTableData = (id = undefined) => {
    if (id !== undefined) {
      const result = [...tableData.origin].filter(x => id===x.ID);
      setTableData(p => ({
        ...p,
        data: result, //表格数据
        total: result.length, //数据总数
      }));
    } else {
      setTableData(p => ({
        ...p,
        data: [...p.origin], //表格数据
        total: p.origin.length, //数据总数
      }));
    }
    
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
          filterData,
          BGLX,
        }}
        funcProps={{
          getTableData,
          setTableLoading,
          getBasicData,
          setTableData,
        }}
      />
    </div>
  );
}
