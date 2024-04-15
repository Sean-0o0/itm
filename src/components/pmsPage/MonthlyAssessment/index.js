import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {
  QueryMonthlyAssessment,
  QueryUserRole,
} from '../../../services/pmsServices';
import { message } from 'antd';

export default function MonthlyAssessment(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {}, dictionary = {} } = props;
  const {} = dictionary;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const topConsoleRef = useRef(null);
  const [filterData, setFilterData] = useState({}); //点查询后的顶部筛选数据
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //用于查询后清空排序状态

  useEffect(() => {
    //无参数
    getTableData({});
  }, [params]);

  //获取表格数据
  const getTableData = ({ current = 1, pageSize = 20, queryType = 'ALL', sort = 'ID ASC' }) => {
    setTableLoading(true);
    //获取用户角色
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '', zyrole = '' } = res;
          const param = {
            current,
            cxlx: queryType,
            js: zyrole === '暂无' ? role : zyrole,
            pageSize,
            paging: 1,
            sort: '',
            total: -1,
          };
          QueryMonthlyAssessment({ ...param })
            .then(res => {
              const { code, result, totalrows } = res;
              if (code > 0) {
                setTableData(p => [...JSON.parse(result)]);
                setTotal(totalrows);
                // console.log('🚀 ~ file: index.js:52 ~ getTableData ~ tableArr:', tableArr);
                setTableLoading(false);
              }
            })
            .catch(e => {
              message.error('表格数据查询失败', 1);
              console.error('getTableData', e);
              setTableLoading(false);
            });
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryUserRole', e);
      });
  };

  return (
    <div className="supplier-info-box">
      <TopConsole
        dictionary={dictionary}
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        setTotal={setTotal}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        ref={topConsoleRef}
        setFilterData={setFilterData}
        setSortInfo={setSortInfo}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        total={total}
        curPage={curPage}
        curPageSize={curPageSize}
        handleSearch={(v = {}) => topConsoleRef?.current?.handleSearch({ ...filterData, ...v })}
        sortInfo={sortInfo}
        setSortInfo={setSortInfo}
      />
    </div>
  );
}
