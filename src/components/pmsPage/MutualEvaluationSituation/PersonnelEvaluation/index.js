import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react';
import { Drawer, Divider, Empty, Input, message, Popover, Table, Tabs, Tooltip, Tree } from 'antd';
import moment from 'moment';
import tableInfoImg from '../../../../assets/MutualEvaluation/staff-evaluation-table-info.png';
import cyxmsImg from '../../../../assets/MutualEvaluation/icon_cyxms.png';
import pjImg from '../../../../assets/MutualEvaluation/icon_pj.png';
import {
  QueryEmployeeAppraiseList,
  QueryMemberRevaluationByORG,
} from '../../../../services/pmsServices';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import * as Lodash from 'lodash';
import TopFilter from '../../MutualEvaluation/TopFilter';

export default function PersonnelEvaluation(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { routes = [], userBasicInfo = {}, staffData = [] } = dataProps;
  const { setIsSpinning, handleStaffData } = funcProps;
  const [treeData, setTreeData] = useState([]); //左侧树型数据
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: -1,
    loading: false,
  }); //右侧表格数据
  const [activeKey, setActiveKey] = useState(''); //顶部高亮tab
  const [curOrgID, setCurOrgID] = useState(-1); //选中的人员ID //当前选中部门
  const [expandKeys, setExpandKeys] = useState(['11167', '357', '11168', '15681']); //展开id
  const [searchInput, setSearchInput] = useState(undefined); //
  const [detailData, setDetailData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    loading: false,
    visible: false,
    curPrjId: -1,
  }); //打分详情浮窗表格数据
  const [drawerData, setDrawerData] = useState({
    visible: false,
    data: [],
    current: 1,
    pageSize: 20,
    total: -1,
    loading: false,
    info: {},
    curStaffID: -1,
  }); //评价详情抽屉
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //用于重置列排序 - 切换部门后
  const [filterData, setFilterData] = useState({
    year: moment(),
  });

  const filterConfig = [
    {
      label: '年份',
      componentType: 'date-picker-year',
      valueField: 'year',
      valueType: 'number',
      allowClear: false,
    },
    { label: '人员名称', componentType: 'input', valueField: 'memberName', valueType: 'string' },
  ];

  useEffect(() => {
    if (staffData.length > 0) {
      setTreeData(JSON.parse(JSON.stringify(staffData)));
      // console.log('🚀 ~ useEffect ~ staffData:', staffData);
      setCurOrgID(staffData[0].value);
      getOrgTableData({ orgId: staffData[0].value, year: moment().year() }); //根据部门查询表格数据
    }
    return () => {};
  }, [JSON.stringify(staffData)]);

  useEffect(() => {
    return () => {
      setSortInfo({
        sort: undefined,
        columnKey: '',
      });
    };
  }, [curOrgID]);

  //获取评价详情表格数据
  const getTableData = useCallback(
    (memberId, current = 1, pageSize = 20, sort = '', year = moment().year()) => {
      setDrawerData(p => ({
        ...p,
        loading: true,
      }));
      QueryEmployeeAppraiseList({
        queryType: 'RYXQ',
        userType: 'LD',
        memberId,
        year,
        paging: 1,
        current,
        pageSize,
        sort,
        total: -1,
      })
        .then(res => {
          if (res?.success) {
            const data = JSON.parse(res.xqmxResult || '[]');
            const data2 = JSON.parse(res.xqglResult || '[]');
            const info = data2.length > 0 ? data2[0] : {};
            const finalData = data.reduce((result, item) => {
              const existingItem = result.find(i => i.XMID === item.XMID);
              if (existingItem) {
                existingItem.GW += `、${item.GW}`;
              } else {
                result.push(item);
              }
              return result;
            }, []);
            console.log('🚀 ~ getTableData', finalData, data2);
            setDrawerData(p => ({
              ...p,
              data: finalData,
              current,
              pageSize,
              loading: false,
              info,
              total: res.totalrows,
              curStaffID: memberId,
            }));
          }
        })
        .catch(e => {
          console.error('🚀评价详情数据', e);
          message.error('评价详情数据', 1);
          setDrawerData(p => ({
            ...p,
            loading: false,
          }));
        });
    },
    [],
  );

  //根据部门查询表格数据
  const getOrgTableData = ({
    orgId = -1,
    current = 1,
    pageSize = 20,
    sort = '',
    year = moment().year(),
    memberName,
  }) => {
    setTableData(p => ({
      ...p,
      loading: true,
    }));
    QueryMemberRevaluationByORG({
      queryType: 'BMRY',
      orgId,
      memberName,
      year,
      paging: 1,
      current,
      pageSize,
      sort,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.result || '[]');
          // console.log('🚀 ~ getOrgTableData ~ data:', data);
          setTableData({
            data,
            current,
            pageSize,
            loading: false,
            total: res.totalrows,
          });
        }
      })
      .catch(e => {
        console.error('🚀评价详情数据', e);
        message.error('评价详情数据', 1);
        setTableData(p => ({
          ...p,
          loading: false,
        }));
      });
  };

  const renderTreeNodes = useCallback(
    (data = []) =>
      data.map(item => {
        if (item.children?.length > 0) {
          return (
            <Tree.TreeNode
              title={item.title}
              key={item.value}
              // selectable={item.selectable === false ? false : true}
              icon={<i className="iconfont icon-company" style={{ fontSize: 14 }} />}
            >
              {renderTreeNodes(item.children)}
            </Tree.TreeNode>
          );
        }
        return (
          <Tree.TreeNode
            key={item.value}
            {...item}
            // selectable={item.selectable === false ? false : true}
            icon={<i className="iconfont icon-company" style={{ fontSize: 14 }} />}
          />
        );
      }),
    [],
  );

  const onTreeSelcet = useCallback(
    (keyArr, e) => {
      if (keyArr.length > 0 && e.selected) {
        setCurOrgID(keyArr[0]);
        getOrgTableData({ orgId: keyArr[0], ...filterData, year: filterData.year?.year() }); //根据部门查询表格数据
      }
    },
    [JSON.stringify(filterData)],
  );

  //右侧表配置
  const columns = [
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '10%',
      key: 'RYMC',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.RYID,
              }),
            )}`,
            state: {
              routes,
            },
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '承担角色',
      dataIndex: 'GW',
      // width: '20%',
      key: 'GW',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '参与项目数',
      dataIndex: 'CYXM',
      width: '15%',
      key: 'CYXM',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'CYXM' ? sortInfo.order : undefined, //排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false
    },
    {
      title: '评价项目数',
      dataIndex: 'PJXM',
      width: '15%',
      key: 'PJXM',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'PJXM' ? sortInfo.order : undefined, //排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false
    },
    {
      title: '评价平均分',
      dataIndex: 'PJF',
      width: '15%',
      key: 'PJF',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'PJF' ? sortInfo.order : undefined, //排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false
    },
    {
      title: '评价详情',
      dataIndex: 'PJXQ',
      width: '10%',
      key: 'PJXQ',
      ellipsis: true,
      render: (txt, row) => (
        <a style={{ color: '#3361ff' }} onClick={() => handlePJXQClick(Number(row.RYID))}>
          查看详情
        </a>
      ),
    },
  ];

  //抽屉表格Columns
  const drawerColumns = [
    {
      title: '年份',
      dataIndex: 'XMNF',
      width: '10%',
      key: 'XMNF',
      ellipsis: true,
      sorter: true,
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      width: '25%',
      key: 'XMMC',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/projectDetail/${EncryptBase64(
              JSON.stringify({
                xmid: row.XMID,
              }),
            )}`,
            state: {
              routes,
            },
          }}
          onClick={() => {
            setDrawerData(p => ({ ...p, visible: false }));
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '项目角色',
      dataIndex: 'GW',
      // width: '30%',
      key: 'GW',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '分数',
      dataIndex: 'FS',
      width: '15%',
      key: 'FS',
      ellipsis: true,
      sorter: true,
    },
    {
      title: '打分详情',
      dataIndex: 'DFXQ',
      width: '15%',
      key: 'DFXQ',
      align: 'center',
      ellipsis: true,
      render: (txt, row) => (
        <Popover
          trigger="click"
          title={null}
          placement="bottom"
          content={getPopoverContent(detailData)}
          overlayClassName="unplanned-demand-content-popover"
          visible={Number(row.XMID) === detailData.curPrjId ? detailData.visible : false}
          onVisibleChange={v =>
            setDetailData(p => ({
              ...p,
              visible: v,
            }))
          }
        >
          <a
            style={{ color: '#3361ff' }}
            onClick={() => handleDFXQClick(Number(drawerData.curStaffID), Number(row.XMID))}
          >
            查看详情
          </a>
        </Popover>
      ),
    },
  ];

  const handlePJXQClick = useCallback(
    memberId => {
      setDrawerData(p => ({
        ...p,
        visible: true,
      }));
      getTableData(memberId, 1, 20, '', filterData.year?.year());
    },
    [JSON.stringify(filterData)],
  );

  const handleDFXQClick = useCallback((memberId, projectId) => {
    setDetailData(p => ({
      ...p,
      visible: true,
      curPrjId: projectId,
    }));
    getDetailData({ memberId, projectId });
  }, []);

  const getPopoverContent = ({ data = [], current = 1, pageSize = 20, loading = false }) => {
    const columns = [
      {
        title: '打分人员',
        dataIndex: 'DFR',
        width: 88,
        key: 'DFR',
        ellipsis: true,
        render: (txt, row) => (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.DFRID,
                }),
              )}`,
              state: {
                routes,
              },
            }}
            onClick={() => {
              setDrawerData(p => ({ ...p, visible: false }));
            }}
            className="table-link-strong"
          >
            {txt}
          </Link>
        ),
      },
      {
        title: '分数',
        dataIndex: 'FS',
        width: 88,
        key: 'FS',
        ellipsis: true,
      },
    ];
    return (
      <div className="table-box">
        <Table
          loading={loading}
          columns={columns}
          rowKey={'id'}
          dataSource={data}
          size="middle"
          pagination={false}
          // pagination={{
          //   current,
          //   pageSize: 10,
          //   // pageSizeOptions: ['10', '20', '20', '40'],
          //   showSizeChanger: false,
          //   hideOnSinglePage: false,
          //   showQuickJumper: false,
          //   // showTotal: t => `共 ${data.length} 条数据`,
          //   // total: data.length,
          // }}
        />
      </div>
    );
  };

  //获取打分详情数据
  const getDetailData = useCallback(({ memberId, projectId }) => {
    setDetailData(p => ({
      ...p,
      loading: true,
    }));
    QueryEmployeeAppraiseList({
      queryType: 'DFXQ',
      userType: 'LD',
      memberId,
      projectId,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xqmxResult || '[]') || [];
          setDetailData(p => ({
            ...p,
            data,
            current: 1,
            pageSize: 20,
            loading: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀打分详情数据', e);
        message.error('打分详情数据获取失败', 1);
        setDetailData(p => ({
          ...p,
          loading: false,
        }));
      });
  }, []);

  //表格操作后更新数据
  const handleTableChange = useCallback(
    (pagination = {}, filter, sorter) => {
      const { current = 1, pageSize = 20 } = pagination;
      setSortInfo(sorter);
      if (sorter.order !== undefined) {
        getOrgTableData({
          orgId: Number(curOrgID),
          current,
          pageSize,
          sort: sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
          ...filterData,
          year: filterData.year?.year(),
        });
      } else {
        getOrgTableData({
          orgId: Number(curOrgID),
          current,
          pageSize,
          ...filterData,
          year: filterData.year?.year(),
        });
      }

      return;
    },
    [curOrgID, JSON.stringify(filterData)],
  );

  //抽屉表格操作后更新数据
  const handleDrawerTableChange = useCallback(
    (pagination = {}, filter, sorter) => {
      const { current = 1, pageSize = 20 } = pagination;
      if (sorter.order !== undefined) {
        getTableData(
          Number(drawerData.curStaffID),
          current,
          pageSize,
          sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
          filterData.year?.year(),
        );
      } else {
        getTableData(Number(drawerData.curStaffID), current, pageSize, '', filterData.year?.year());
      }
      return;
    },
    [drawerData.curStaffID, JSON.stringify(filterData)],
  );

  const onExpand = useCallback(expandedKeys => {
    // console.log('🚀 ~ onExpand ~ expandedKeys:', expandedKeys);
    setExpandKeys(expandedKeys);
  }, []);

  return (
    <div className="personnel-evaluation-box content-box">
      <Drawer
        title="评价详情"
        width={950}
        onClose={() =>
          setDrawerData(p => ({
            visible: false,
            data: [],
            info: {},
            curStaffID: -1,
          }))
        }
        visible={drawerData.visible}
        className="budget-payment-drawer"
        maskClosable={true}
        zIndex={101}
        destroyOnClose={true}
        maskStyle={{
          backgroundColor: 'rgb(0 0 0 / 30%)',
        }}
      >
        <div className="evaluation-table">
          <div className="table-info">
            <img className="table-info-img" src={tableInfoImg} alt="left-img" />
            <div className="info-middle">
              <div className="name-row">
                <Link
                  style={{
                    color: '#3361ff',
                  }}
                  to={{
                    pathname: `/pms/manage/StaffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: drawerData.curStaffID,
                      }),
                    )}`,
                    state: {
                      routes,
                    },
                  }}
                  onClick={() => {
                    setDrawerData(p => ({ ...p, visible: false }));
                  }}
                  className="staff-name"
                >
                  {drawerData.info.RYMC}
                </Link>
                <span className="work-days">
                  已加入浙商证券
                  {drawerData.info.RZTS || '--'}天
                </span>
              </div>
              <div className="org-row">
                部门：
                <span>{drawerData.info.BM || '暂无'}</span>
              </div>
              <div className="position-phone-row">
                <div className="position-row">
                  岗位：
                  <span>{drawerData.info.GW || '暂无'}</span>
                </div>
                <Divider
                  type="vertical"
                  style={{
                    color: '#909399',
                    margin: '0px 8px',
                  }}
                />
                <div className="phone-row">
                  电话：
                  <span>{drawerData.info.SJ || '暂无'}</span>
                </div>
              </div>
            </div>
            <div className="info-item" key={'参与项目数量'}>
              <img className="info-item-img" src={cyxmsImg} alt="img" />
              <div className="item-right">
                <div className="label-txt">参与项目数量</div>
                <div className="value-num">{drawerData.info.CYXMSL || '暂无'}</div>
              </div>
            </div>
            <div className="info-item" key={'评价平均分'}>
              <img className="info-item-img" src={pjImg} alt="img" />
              <div className="item-right">
                <div className="label-txt">评价平均分</div>
                <div className="value-num">{drawerData.info.PJF || '暂无'}</div>
              </div>
            </div>
          </div>
          <div className="table-box">
            <Table
              columns={drawerColumns}
              rowKey={row => `${drawerData.curStaffID}-${row.XMID}`}
              dataSource={drawerData.data}
              onChange={handleDrawerTableChange}
              loading={drawerData.loading}
              pagination={{
                current: drawerData.current,
                pageSize: drawerData.pageSize,
                defaultCurrent: 1,
                pageSizeOptions: ['20', '40', '50', '100'],
                showSizeChanger: true,
                hideOnSinglePage: false,
                showTotal: t => `共 ${drawerData.total} 条数据`,
                total: drawerData.total,
              }}
              bordered //记得注释
            />
          </div>
        </div>
      </Drawer>
      <TopFilter
        handleSearch={(arg = {}) => getOrgTableData({ orgId: curOrgID, ...arg })}
        config={filterConfig}
        filterData={filterData}
        setFilterData={setFilterData}
        resetFunc={() => {
          setFilterData({ year: moment() });
        }}
      />
      <div className="content-box">
        <div className="left-box">
          <div className="tree-box">
            <Tree
              showIcon
              selectedKeys={[curOrgID]}
              onSelect={onTreeSelcet}
              // defaultExpandedKeys={['11167', '357', '11168', '15681']}
              expandedKeys={[...expandKeys]}
              onExpand={onExpand}
            >
              {renderTreeNodes(treeData)}
            </Tree>
          </div>
        </div>
        <div className="right-box">
          {curOrgID === -1 ? (
            <Empty
              description="选择部门后查看数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: 'auto 0' }}
            />
          ) : (
            <Fragment>
              <div className="table-box">
                <Table
                  loading={tableData.loading}
                  rowKey={row => `${curOrgID}-${row.RYID}`}
                  columns={columns}
                  dataSource={tableData.data}
                  onChange={handleTableChange}
                  pagination={{
                    current: tableData.current,
                    pageSize: tableData.pageSize,
                    defaultCurrent: 1,
                    pageSizeOptions: ['20', '40', '50', '100'],
                    showSizeChanger: true,
                    hideOnSinglePage: false,
                    showTotal: t => `共 ${tableData.total} 条数据`,
                    total: tableData.total,
                  }}
                  // pagination={false}
                />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
