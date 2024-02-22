import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QuerySupplierList } from '../../../services/pmsServices';
import { setCommentRange } from 'typescript';
import { message } from 'antd';

export default function SupplierInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [gysData, setGysData] = useState([]); //供应商下拉框数据
  const [lxrData, setLxrData] = useState([]); //联系人下拉框数据
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {}, dictionary = {} } = props;
  const { supplierId = -2 } = params;
  const { GYSLX } = dictionary;
  const topConsoleRef = useRef(null);
  const [filterData, setFilterData] = useState({}); //点查询后的顶部筛选数据
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //用于查询后清空排序状态

  useEffect(() => {
    if (supplierId === -2) {
      //无参数
      getTableData({});
      topConsoleRef?.current?.handleReset();
      setFilterData({});
      setSortInfo({ sort: undefined, columnKey: '' });
    }
    return () => {};
  }, [props]);

  //获取初始表格数据、下拉框数据
  const getTableData = ({ current = 1, pageSize = 20, queryType = 'ALL', sort = 'ID ASC' }) => {
    setTableLoading(true);
    QuerySupplierList({
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
      queryType,
    })
      .then(res => {
        if (res?.success) {
          // setTableData(p => [...JSON.parse(res.record)]);
          let liaisonArr = [...JSON.parse(res.liaisonRecord)];
          let supplierArr = [...JSON.parse(res.supplierRecord)];
          let tableArr = [...supplierArr];
          tableArr.forEach(x => {
            let arr = liaisonArr.filter(y => y.GYSID === x.ID);
            x.LXRINFO = [...arr];
          });
          setTableData(p => tableArr);
          setTotal(res.totalrows);
          // console.log('🚀 ~ file: index.js:52 ~ getTableData ~ tableArr:', tableArr);
          setTableLoading(false);
        }
      })
      .catch(e => {
        message.error('表格数据查询失败', 1);
        console.error('getTableData', e);
        setTableLoading(false);
      });
    QuerySupplierList({
      current,
      pageSize,
      paging: -1,
      sort,
      total: -1,
      queryType,
    })
      .then(res => {
        if (res?.success) {
          // setTableData(p => [...JSON.parse(res.record)]);
          let liaisonArr = [...JSON.parse(res.liaisonRecord)];
          let supplierArr = [...JSON.parse(res.supplierRecord)];
          setGysData(p => supplierArr);
          setLxrData(p => liaisonArr);
        }
      })
      .catch(e => {
        message.error('下拉框数据查询失败', 1);
        setTableLoading(false);
      });
  };

  return (
    <div className="supplier-info-box">
      <TopConsole
        dictionary={dictionary}
        gysData={gysData}
        lxrData={lxrData}
        gyslxData={GYSLX}
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        projectManager={params?.supplierId}
        setTotal={setTotal}
        ref={topConsoleRef}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        curPage={curPage}
        curPageSize={curPageSize}
        setFilterData={setFilterData}
        setSortInfo={setSortInfo}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        projectManager={params?.supplierId}
        total={total}
        handleSearch={(v = {}) => topConsoleRef?.current?.handleSearch({ ...filterData, ...v })}
        curPage={curPage}
        curPageSize={curPageSize}
        GYSLX={GYSLX}
        setFilterData={setFilterData}
        sortInfo={sortInfo}
        setSortInfo={setSortInfo}
      />
    </div>
  );
}
