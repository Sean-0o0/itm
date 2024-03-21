import React, { useEffect, useState, useRef, useCallback } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { Breadcrumb, message } from 'antd';
import {
  QueryProjectDynamicSection,
  QueryProjectDynamics,
} from '../../../../../services/pmsServices';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'dva';
import { debounce } from 'lodash';

const { Item } = Breadcrumb;

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(function ProjectStatisticsInfo(props) {
  const {
    cxlx = '',
    routes = [],
    defaultYear = moment().year(),
    roleData = [],
    dictionary = {},
  } = props;
  const { XMJZ = [] } = dictionary;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: 0,
  }); //表格数据-项目列表
  const [filterData, setFilterData] = useState([]);
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //用于查询后清空排序状态
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [curStage, setCurStage] = useState(undefined); //当前tab项目阶段
  const tabsData = XMJZ.filter(x => !['7', '10'].includes(x.ibm)); //项目阶段数据（设备采购、包件信息录入不查）

  useEffect(() => {
    if (cxlx !== '') {
      console.log("🚀 ~ useEffect ~ cxlx:", cxlx)
      setCurStage(cxlx);
      setFilterData({});
      handleSearch({ stage: cxlx, startYear: defaultYear, endYear: defaultYear });
      setSortInfo({
        sort: undefined,
        columnKey: '',
      });
    }
    return () => {};
  }, [cxlx, defaultYear, JSON.stringify(roleData)]);

  //获取表格数据
  const handleSearch = ({
    current = 1,
    pageSize = 20,
    stage = curStage,
    projectManager,
    projectName,
    startYear = defaultYear,
    endYear = defaultYear,
    sort = '',
  }) => {
    setTableLoading(true);
    QueryProjectDynamicSection({
      stage,
      projectManager: projectManager === '' ? undefined : projectManager,
      projectName: projectName === '' ? undefined : projectName,
      startYear,
      endYear,
      role: roleData.role,
      queryType: 'DETAIL',
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
    })
      .then(res => {
        if (res.success) {
          let result = JSON.parse(res.result);
          setTableData({
            data: result,
            current,
            pageSize,
            total: res.totalrows,
          });
          setTableLoading(false);
        }
      })
      .catch(e => {
        message.error('表格数据获取失败');
        setTableLoading(false);
        console.error('表格数据获取失败', e);
      });
  };

  const handleSearchDebounce = useCallback(debounce(handleSearch, 800), [
    curStage,
    JSON.stringify(roleData),
  ]);

  return (
    <div className="project-statistics-info-box prj-dynamic-state-info-box">
      <Breadcrumb separator=">" style={{ margin: '16px 24px 0 24px' }}>
        {routes?.map((item, index) => {
          const { name = item, pathname = '' } = item;
          const historyRoutes = routes.slice(0, index + 1);
          return (
            <Item key={index}>
              {index === routes.length - 1 ? (
                <>{name}</>
              ) : (
                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>
              )}
            </Item>
          );
        })}
      </Breadcrumb>
      <TopConsole
        filterData={filterData}
        setFilterData={setFilterData}
        handleSearch={handleSearchDebounce}
      />
      <InfoTable
        routes={routes}
        tableData={tableData}
        tableLoading={tableLoading}
        handleSearch={handleSearch}
        tabsData={tabsData}
        setCurStage={setCurStage}
        curStage={curStage}
        setSortInfo={setSortInfo}
        sortInfo={sortInfo}
        filterData={filterData}
        setFilterData={setFilterData}
      />
    </div>
  );
});
