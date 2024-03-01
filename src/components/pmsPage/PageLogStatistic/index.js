import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import TopFilter from './TopFilter';
import TableBox from './TableBox';
import { QueryOperateStatistics } from '../../../services/pmsServices';
import TreeUtils from '../../../utils/treeUtils';
import { setParentSelectableFalse } from '../../../utils/pmsPublicUtils';
import { FetchQueryOrganizationInfo } from '../../../services/projectManage';

export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(function PageLogStatistic(props) {
  const { dictionary = {}, userBasicInfo = {} } = props;
  const { RZCZLX = [] } = dictionary;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    sort: '',
    total: 0,
  }); //表格数据
  const [filterData, setFilterData] = useState({
    dateRange: [moment().startOf('month'), moment().endOf('month')],
    startTime: Number(
      moment()
        .startOf('month')
        .format('YYYYMMDD'),
    ),
    endTime: Number(
      moment()
        .endOf('month')
        .format('YYYYMMDD'),
    ),
  }); //顶部筛选栏数据
  const [searchData, setSearchData] = useState({}); //点过查询后的筛选栏数据
  const [orgData, setOrgData] = useState([]); //部门下拉框数据
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  });
  useEffect(() => {
    getTableData({
      startTime: Number(
        moment()
          .startOf('month')
          .format('YYYYMMDD'),
      ),
      endTime: Number(
        moment()
          .endOf('month')
          .format('YYYYMMDD'),
      ),
    });
    getOrgData();
    return () => {
      setSortInfo({
        sort: undefined,
        columnKey: '',
      });
    };
  }, []);
  //查询
  const getTableData = (
    {
      current = 1,
      pageSize = 20,
      sort = '',
      startTime,
      endTime,
      operateType,
      operator,
      orgID,
      pageName,
    },
    setSearchData = () => {},
  ) => {
    setIsSpinning(true);
    QueryOperateStatistics({
      startTime,
      endTime,
      operateType,
      operator,
      orgID,
      pageName,
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
    })
      .then(res => {
        if (res.success) {
          console.log('🚀 ~ connect ~ res:', res);
          const data = JSON.parse(res.result);
          setTableData({
            data,
            current,
            pageSize,
            sort,
            total: res.totalrows,
            fwcs: JSON.parse(res.totalResult)[0].ZJ,
          });
          setSearchData({
            dateRange: [
              startTime === undefined ? moment(String(startTime)) : null,
              endTime === undefined ? moment(String(endTime)) : null,
            ],
            startTime,
            endTime,
            operateType,
            operator,
            orgID,
            pageName,
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('表格数据', e);
        message.error('查询失败', 2);
        setIsSpinning(false);
      });
  };

  //获取部门数据
  const getOrgData = () => {
    setIsSpinning(true);
    FetchQueryOrganizationInfo({
      type: 'XXJS',
    })
      .then(res => {
        if (res?.success) {
          let data = TreeUtils.toTreeData(res.record, {
            keyName: 'orgId',
            pKeyName: 'orgFid',
            titleName: 'orgName',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0].children[0].children;
          data.selectable = false;
          data.forEach(node => setParentSelectableFalse(node));
          setOrgData([...data]);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        message.error('部门信息查询失败', 1);
        console.error('FetchQueryOrganizationInfo', e);
        setIsSpinning(false);
      });
  };

  return (
    <div className="page-log-statistic-box">
      <Spin
        spinning={isSpinning}
        tip="加载中"
        wrapperClassName="page-log-statistic-box-spin-wrapper"
      >
        <TopFilter
          orgData={orgData}
          RZCZLX={RZCZLX}
          handleSearch={v => {
            getTableData({ ...v }, setSearchData);
            setSortInfo({
              sort: undefined,
              columnKey: '',
            });
          }}
          filterData={filterData}
          setFilterData={setFilterData}
        />
        <TableBox
          tableData={tableData}
          filterData={filterData}
          userBasicInfo={userBasicInfo}
          getTableData={(v = {}) => getTableData({ ...v, ...searchData })}
          sortInfo={sortInfo}
          setSortInfo={setSortInfo}
        />
      </Spin>
    </div>
  );
});
