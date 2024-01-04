import React, {useEffect, useState, useRef} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {
  QueryProjectDynamics,
  QueryProjectListInfo,
  QueryProjectStatistics,
  QueryProjectStatisticsList
} from '../../../services/pmsServices';
import {message} from 'antd';
import YjbmAllTable from "./infoTable/yjbmAllTable";
import EjbmAllTable from "./infoTable/ejbmAllTable";
import moment from 'moment';

export default function ProjectMemberStatisticsInfo(props) {
  const [activeKey, setActiveKey] = useState('YJBM_ALL');
  const [activeKeyFlag, setActiveKeyFlag] = useState(false);
  const [tableData, setTableData] = useState([]); //全部
  const [total, setTotal] = useState(0); //全部
  const [tabsData, setTabsData] = useState([]); //TAB
  const [tableDataLD, setTableDataLD] = useState([]); //一级部门领导
  const [totalLD, setTotalLD] = useState(0); //
  const [tableDataBM, setTableDataBM] = useState([]); //一级部门下的二级部门
  const [totalBM, setTotalBM] = useState(0); //
  const [loading, setLoading] = useState(true); //表格数据-项目列表
  const [bmid, setBMID] = useState('-1');
  const {handleRadioChange, isRouter = false, defaultYear = moment().year()} = props;

  useEffect(() => {
    getTableData(activeKey, defaultYear);
    return () => {
    };
  }, [defaultYear]);

  const tabsKeyCallback = (key) => {
    setActiveKeyFlag(true)
    setActiveKey(key);
    setLoading(true);
    console.log("keykeykeykeykey", key)
    if (key === "YJBM_ALL") {
      getTableData(key);
    } else {
      setBMID(key)
      getTableDataBM("YJBM_LD", key);
      getTableDataBM("YJBM_BM", key);
    }
  }

  const getTableData = (queryType, year) => {
    setLoading(true);
    // YJBM_ALL|全部一级部门（部门id和人员id都不用传）;
    // YJBM_LD|查询对应一级部门下的部门领导数据（传一级部门的id）;
    // YJBM_BM|查询对应一级部门下的二级部门数据（传一级部门的id）;
    // EJBM_ALL|查询对应二级部门下人员的数据（传二级部门的id）;
    // RY|查询对应人员id的数据（传人员的id）;
    // BM|查询对应部门的数据（部门的id）
    const payload = {
      "current": 1,
      // "memberId": 0,
      // "orgID": -1,
      "pageSize": 10,
      "paging": 1,
      "queryType": queryType,
      "sort": '',
      "total": -1,
      year: year??defaultYear,
    }
    QueryProjectStatistics({
      ...payload
    }).then(res => {
      const {
        code = 0,
        result,
        totalrows = 0,
      } = res
      if (code > 0) {
        setTableData([...JSON.parse(result)])
        if (queryType === 'YJBM_ALL') {
          setTabsData([...JSON.parse(result)])
        }
        setTotal(totalrows)
        setLoading(false);
      } else {
        message.error(note)
        setLoading(false);
      }
    }).catch(err => {
      message.error("查询项目统计失败")
      setLoading(false);
    })
  }

  const getTableDataBM = (queryType, id = '-1', year) => {
    setLoading(true);
    // YJBM_ALL|全部一级部门（部门id和人员id都不用传）;
    // YJBM_LD|查询对应一级部门下的部门领导数据（传一级部门的id）;
    // YJBM_BM|查询对应一级部门下的二级部门数据（传一级部门的id）;
    // EJBM_ALL|查询对应二级部门下人员的数据（传二级部门的id）;
    // RY|查询对应人员id的数据（传人员的id）;
    // BM|查询对应部门的数据（部门的id）
    //DRY|查询对应多个人员的数据；格式为英文括号，里面多个id用逗号隔开，(11169,15508) DBM时传
    //DBM|查询对应多个部门的数据 格式为英文括号，格式为英文括号，里面多个id用逗号隔开，(115148,12488) DRY时传
    const payload = {
      "current": 1,
      // "memberId": 0,
      "orgID": id,
      "pageSize": 10,
      "paging": 1,
      "queryType": queryType,
      "sort": '',
      "total": -1,
      year: year??defaultYear,
    }
    QueryProjectStatistics({
      ...payload
    }).then(res => {
      const {
        code = 0,
        result,
        totalrows = 0,
      } = res
      if (code > 0) {
        if (queryType === 'YJBM_LD') {
          setTableDataLD([...JSON.parse(result)])
          setTotalLD(totalrows)
        }
        if (queryType === 'YJBM_BM') {
          setTableDataBM([...JSON.parse(result)])
          setTotalBM(totalrows)
        }
        setLoading(false);
      } else {
        message.error(note)
        setLoading(false);
      }
    }).catch(err => {
      message.error("查询项目统计失败")
      setLoading(false);
    })
  }

  return (
    <div className="project-member-statistics-info-box">
      <TopConsole isRouter={isRouter} tabsData={tabsData} handleRadioChange={handleRadioChange}
                  tabsKeyCallback={tabsKeyCallback}
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}/>
      {
        activeKey === 'YJBM_ALL' ?
          //一级部门
          <YjbmAllTable
            loading={loading}
            tableData={tableData}
            total={total}
            tabsKeyCallback={tabsKeyCallback}
            getTableData={getTableData}
            defaultYear={defaultYear}
          /> : <EjbmAllTable
            // 二级部门
            setActiveKeyFlag={setActiveKeyFlag}
            activeKeyFlag={activeKeyFlag}
            bmid={bmid}
            loading={loading}
            tableDataLD={tableDataLD}
            totalLD={totalLD}
            tableDataBM={tableDataBM}
            totalBM={totalBM}
            getTableDataBM={getTableDataBM}
            defaultYear={defaultYear}
          />
      }
    </div>
  );
}
