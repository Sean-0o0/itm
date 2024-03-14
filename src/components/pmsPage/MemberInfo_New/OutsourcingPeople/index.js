import React, { useEffect, useState, useRef, useContext } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryOutsourceMemberList, QuerySupplierList, QueryUserRole } from '../../../../services/pmsServices';
import { message } from 'antd';

import { MemberInfoContext } from '../index'

/**
 * 1.外包人员
 * @param {*} props 
 * @returns 
 */
const OutsourcingPeople = (props) => {

  const { params = {}, dictionary = {}, LOGIN_USER_INFO } = useContext(MemberInfoContext)

  const [tableData, setTableData] = useState([]); //表格数据-项目列表

  const [tableLoading, setTableLoading] = useState(false); //表格加载状态

  const [total, setTotal] = useState(0); //数据总数

  const [curPage, setCurPage] = useState(1); //当前页码

  const [curPageSize, setCurPageSize] = useState(20); //每页数量

  const { GYSLX } = dictionary;

  const topConsoleRef = useRef(null);

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
            pageSize,
            paging: 1,
            sort: "",
            total: -1,
            cxlx: queryType,
            js: zyrole === "暂无" ? role : zyrole,
            zzjg: String(LOGIN_USER_INFO.org)
          }
          // console.log("params.xmid", params.xmid)
          if (String(params.xmid) !== "" || params.xmid !== "undefined") {
            param.xmmc = Number(params.xmid);
          }
          QueryOutsourceMemberList({ ...param })
            .then(res => {
              const { code, result, totalrows } = res
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
    <div className="MemberInfo_supplier-info-box"
    >
      <TopConsole
        xmid={params.xmid}
        dictionary={dictionary}
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        setTotal={setTotal}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        ref={topConsoleRef}
        curPage={curPage}
        curPageSize={curPageSize}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        total={total}
        curPage={curPage}
        curPageSize={curPageSize}
        GYSLX={GYSLX}
        handleSearch={topConsoleRef?.current?.handleSearch}
      />
    </div>
  );
}

export default OutsourcingPeople