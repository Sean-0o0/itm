import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Spin, Table } from 'antd';
import moment from 'moment';
import TopFilter from './TopFilter';
import TableBox from './TableBox';
import { QueryUnifiedProjectInitProcess } from '../../../services/pmsServices';
import { connect } from 'dva';
import ProjectApprovalApplicate from './ProjectApprovalApplicate'


export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(function IteProcessInitiate(props) {
  const { dictionary = {}, userBasicInfo = {} } = props;
  const { LCLX = [] } = dictionary;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    sort: '',
    total: 0,
  }); //表格数据
  const [filterData, setFilterData] = useState({}); //顶部筛选栏数据
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  });
  const [initiateXmid, setInitiateXmid] = useState(-1); //发起用的项目ID

  const [isModalShow, setIsModalShow] = useState({
    projectApprovalApplicate: false, //项目立项申请
  })

  const [projectCode, setProjectCode] = useState('')

  useEffect(() => {
    getTableData({});
    return () => {
      setSortInfo({
        sort: undefined,
        columnKey: '',
      });
    };
  }, []);

  const filterConfig = [
    {
      label: '年份',
      componentType: 'date-picker-year',
      valueField: 'year',
      valueType: 'number',
    },
    { label: '流程标题', componentType: 'input', valueField: 'title', valueType: 'string' },
  ];

  //查询
  const getTableData = (
    { current = 1, pageSize = 20, sort = '', title, year },
    successCallback = () => { },
  ) => {
    setIsSpinning(true);
    QueryUnifiedProjectInitProcess({
      current,
      pageSize,
      paging: 1,
      queryType: 'ALL',
      sort,
      title,
      total: -1,
      year,
    })
      .then(res => {
        if (res.success) {
          const data = JSON.parse(res.result);
          // console.log('xxxxxxx数据xxxxxxxx', res, data)
          setTableData({
            data,
            current,
            pageSize,
            sort,
            total: res.totalrows,
          });
          setInitiateXmid(res.projectId);
          setProjectCode(res.projectCode);
          successCallback();
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('表格数据', e);
        message.error('查询失败', 2);
        setIsSpinning(false);
      });
  };

  return (
    <div className="ite-process-initiate-box">
      <Spin
        spinning={isSpinning}
        tip="加载中"
        wrapperClassName="ite-process-initiate-box-spin-wrapper"
      >
        <TopFilter
          handleSearch={v => {
            getTableData({ ...v });
            setSortInfo({
              sort: undefined,
              columnKey: '',
            });
          }}
          config={filterConfig}
          filterData={filterData}
          setFilterData={setFilterData}
          showBtns={false}
        />
        <TableBox
          tableData={tableData}
          filterData={filterData}
          userBasicInfo={userBasicInfo}
          getTableData={getTableData}
          sortInfo={sortInfo}
          setIsModalShow={setIsModalShow}
          setSortInfo={setSortInfo}
          initiateXmid={initiateXmid}
        />

        {/* 项目立项申请——弹窗 */}
        {isModalShow.projectApprovalApplicate && (
          <ProjectApprovalApplicate
            visible={isModalShow.projectApprovalApplicate}
            setVisible={val => setIsModalShow({ projectApprovalApplicate: val })}
            xmbh={projectCode}
            currentXmid={Number(initiateXmid)}
            getTableData={getTableData}
            tableData={tableData}
          />
        )}

      </Spin>
    </div>
  );
});
