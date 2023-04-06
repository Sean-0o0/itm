import React, { useEffect, useState } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryProjectListInfo } from '../../../services/pmsServices';
import { message } from 'antd';

export default function ProjectInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [curPage, setCurPage] = useState(1); //当前页号
  const [pageSize, setPageSize] = useState(10); //每页条数
  const { params = {} } = props;
  useEffect(() => {
    getTableData({ projectManager: params.prjManager });
    return () => {};
  }, [params.prjManager]);

  const getTableData = ({ current = 1, pageSize = 10, projectManager = -1 }) => {
    setTableLoading(true);
    QueryProjectListInfo({
      projectManager,
      current,
      pageSize,
      paging: 1,
      sort: 'string',
      total: -1,
      // cxlx: 'ALL'
    })
      .then(res => {
        if (res?.success) {
          setTableData(p => [...JSON.parse(res.record)]);
          setTableLoading(false);
        }
        // console.log("🚀 ~ file: index.js ~ line 29 ~ getTableData ~ res", JSON.parse(res.record))
      })
      .catch(e => {
        // console.error('getTableData', e);
        setTableLoading(false);
      });
  };
  return (
    <div className="project-info-box">
      <TopConsole
        dictionary={props.dictionary}
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        projectManager={params?.prjManager}
      />
      <InfoTable tableData={tableData} tableLoading={tableLoading} getTableData={getTableData} projectManager={params?.prjManager}/>
    </div>
  );
}
