import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryOutsourceCostList, QueryUserRole } from '../../../services/pmsServices';
import { message } from 'antd';
import { set } from 'store';
import moment from 'moment';

function getUUID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

export default function DemandInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {}, dictionary = {} } = props;
  const { WBRYGW } = dictionary;
  const { xmid = -2 } = params;
  const [subTableData, setSubTableData] = useState({}); //子表格数据
  const [isFinish, setIsFinish] = useState(false); //
  const topConsoleRef = useRef(null);
  const quarterData = [
    {
      title: moment().year() + '年第1季度',
      range: [moment(moment().year() + '01'), moment(moment().year() + '03')],
    },
    {
      title: moment().year() + '年第2季度',
      range: [moment(moment().year() + '04'), moment(moment().year() + '06')],
    },
    {
      title: moment().year() + '年第3季度',
      range: [moment(moment().year() + '07'), moment(moment().year() + '09')],
    },
    {
      title: moment().year() + '年第4季度',
      range: [moment(moment().year() + '10'), moment(moment().year() + '12')],
    },
  ]; //季度数据

  useEffect(() => {
    if (xmid === -2) {
      //无参数
      getTableData();
      topConsoleRef?.current?.handleReset();
    } else {
      getTableData();
      topConsoleRef?.current?.handleReset();
    }
    return () => {};
  }, [xmid]);

  //获取表格数据
  const getTableData = (current = 1, pageSize = 20) => {
    setTableLoading(true);
    LOGIN_USER_ID !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_ID),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole } = res;
            QueryOutsourceCostList({
              current,
              cxlx: 'XM',
              pageSize,
              paging: 1,
              sort: '',
              total: -1,
              js: zyrole === '外包项目对接人' ? zyrole : role,
              // xmid: 0,
              // gysid: 0,
              // jssj: 0,
              // kssj: 0,
            })
              .then(res => {
                if (res?.success) {
                  let data = JSON.parse(res.xmxx);
                  // console.log('🚀 ~ file: index.js:50 ~ getTableData ~ res:', data);
                  // data = data.map(x => ({ ...x, ID: getUUID() }));
                  setTableData(p => data);
                  setTotal(res.totalrows);
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
          message.error('用户角色信息查询失败', 1);
        });
  };

  const getSubTableData = (
    xmid = undefined,
    gysid = undefined,
    jssj = undefined,
    kssj = undefined,
  ) => {
    LOGIN_USER_ID !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_ID),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole } = res;
            QueryOutsourceCostList({
              current: 1,
              cxlx: 'XQ',
              pageSize: 10,
              paging: -1,
              sort: '',
              total: -1,
              xmid,
              gysid,
              jssj,
              kssj,
              js: zyrole === '外包项目对接人' ? zyrole : role,
            })
              .then(res => {
                if (res?.success) {
                  const data = JSON.parse(res.xqxx);
                  // console.log('🚀 ~ file: index.js:332 ~ onExpand ~ data:', data);
                  setSubTableData(p => {
                    return {
                      ...p,
                      [xmid]: data,
                    };
                  });
                  setIsFinish(true);
                }
              })
              .catch(e => {
                message.error('子表格数据查询失败', 1);
                setTableLoading(false);
              });
          }
        })
        .catch(e => {
          message.error('用户角色信息查询失败', 1);
        });
  };

  return (
    <div className="demand-info-box">
      <TopConsole
        dictionary={dictionary}
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        setTotal={setTotal}
        ref={topConsoleRef}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        curPage={curPage}
        curPageSize={curPageSize}
        xmid={xmid}
        quarterData={quarterData}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        total={total}
        handleSearch={topConsoleRef?.current?.handleSearch}
        curPage={curPage}
        curPageSize={curPageSize}
        isFinish={isFinish}
        subTableData={subTableData}
        getSubTableData={getSubTableData}
        setSubTableData={setSubTableData}
        xmid={xmid}
        WBRYGW={WBRYGW}
        setTableData={setTableData}
        quarterData={quarterData}
      />
    </div>
  );
}
