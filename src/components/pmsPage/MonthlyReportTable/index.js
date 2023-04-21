import React, { useState, useEffect } from 'react';
import TableBox from './TableBox';
import {
  FetchQueryOwnerProjectList,
  QueryUserInfo,
  QueryMonthlyList,
} from '../../../services/pmsServices';
import moment from 'moment';
import { setTextRange } from 'typescript';

export default function MonthlyReportTable() {
  const [monthData, setMonthData] = useState(new moment());
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [currentXmid, setCurrentXmid] = useState(-1);
  const [edited, setEdited] = useState(false);
  const [txrData, setTxrData] = useState([]);
  const [originData, setOriginData] = useState([]); //编辑前table数据
  const [txrTableData, setTxrTableData] = useState([]); //表格数据，里边是填写人文本

  useEffect(() => {
    // queryProjectData();
    getTxrData();
  }, []);

  //填写人下拉框数据
  const getTxrData = () => {
    QueryUserInfo({
      type: '信息技术事业部',
    }).then(res => {
      if (res.success) {
        setTxrData(p => [...res.record]);
        queryTableData(monthData.format('YYYYMM'), currentXmid, [...res.record]);
      }
    });
  };
  //项目下拉框数据
  const queryProjectData = () => {
    FetchQueryOwnerProjectList({
      paging: -1,
      total: -1,
      sort: '',
      cxlx: 'ALL',
    }).then(res => {
      if (res.code === 1) {
        setProjectData(p => [...res.record]);
      }
    });
  };
  //表格数据
  const queryTableData = (yf, xmid, txrData) => {
    QueryMonthlyList({
      month: Number(yf),
      xmmc: Number(xmid),
    }).then(res => {
      if (res.code === 1) {
        console.log('🚀 ~ file: index.js ~ line 55 ~ queryTableData ~ res', res);
        const newArr = res.record.map(item => {
          // const getStatus = (num) => {
          //     switch (num) {
          //         case '1':
          //             return '填写中';
          //         case '2':
          //             return '已提交';
          //         case '3':
          //             return '被退回'
          //     }
          // };
          let arr = item.txr?.trim() === '' ? [] : item.txr?.trim()?.split(';');
          let txrArr = arr?.map(item => {
            return txrData?.filter(x => String(x?.id) === String(item))[0]?.name;
          });
          return {
            id: item.id,
            zdgz: item.zdgz,
            rwfl: item.rwfl,
            xmmc: item.xmmc,
            zmk: item.zmk,
            yf: item.yf,
            zt: item.zt,
            ['bywcqk' + item.id]: item.bywcqk?.trim(),
            ['xygzjh' + item.id]: item.xygzjh?.trim(),
            ['ldyj' + item.id]: item.ldyj?.trim(),
            ['txr' + item.id]: [...txrArr],
            txrid: [...arr],
          };
        });
        setTableData(preState => [...newArr]);
        setOriginData(preState => [...newArr]);
        setTxrTableData(preState => [...newArr]);
        setTableLoading(false);
      }
    });
    setTableLoading(false);
  };
  //表格跨行合并
  const getRowSpanCount = (data, key, target) => {
    if (!Array.isArray(data)) return 1;
    data = data.map(_ => _[key]); // 只取出筛选项
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
  return (
    <div className="monthly-report-detail">
      <TableBox
        tableData={tableData}
        queryTableData={queryTableData}
        setTableData={setTableData}
        tableLoading={tableLoading}
        setTableLoading={setTableLoading}
        monthData={monthData}
        currentXmid={currentXmid}
        getRowSpanCount={getRowSpanCount}
        edited={edited}
        setEdited={setEdited}
        txrData={txrData}
        projectData={projectData}
        setCurrentXmid={setCurrentXmid}
        setMonthData={setMonthData}
        originData={originData}
        txrTableData={txrTableData}
        setTxrTableData={setTxrTableData}
      ></TableBox>
    </div>
  );
}
