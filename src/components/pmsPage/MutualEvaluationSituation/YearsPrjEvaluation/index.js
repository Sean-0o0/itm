import React, { useEffect, useState, useRef, Fragment, useCallback } from 'react';
import { Tooltip, message, Popover, Table, Empty } from 'antd';
import TopFilter from '../../MutualEvaluation/TopFilter';
import LeftPrjList from '../../MutualEvaluation/LeftPrjList';
import tableInfoImg from '../../../../assets/MutualEvaluation/years-prj-evaluation-table-info.png';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { QueryEmployeeAppraiseList, QueryUserRole } from '../../../../services/pmsServices';
import * as Lodash from 'lodash';

export default function YearsPrjEvaluation(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { routes = [], userBasicInfo = {}, orgData = [] } = dataProps;
  const { setIsSpinning } = funcProps;
  const [prjList, setPrjList] = useState([]); //左侧项目列表
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    loading: false,
  }); //右侧表格数据
  const [curPrj, setCurPrj] = useState({
    id: -1,
    name: '',
  }); //选中的项目
  const [detailData, setDetailData] = useState({
    data: [],
    current: 1,
    pageSize: 5,
    loading: false,
    visible: false,
    curMemberId: -1,
  }); //打分详情浮窗表格数据
  const [filterData, setFilterData] = useState({});

  const filterConfig = [
    {
      label: '项目名称',
      componentType: 'input',
      valueField: 'projectName',
      valueType: 'string',
    },
    {
      label: '年份',
      componentType: 'date-picker-year',
      valueField: 'year',
      valueType: 'number',
    },
    {
      label: '部门',
      componentType: 'tree-select',
      valueField: 'orgId',
      valueType: 'number',
      treeData: orgData,
    },
  ];

  //右侧表配置
  const columns = [
    {
      title: '人员名称',
      dataIndex: 'XMRY',
      width: '20%',
      key: 'XMRY',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.XMRYID,
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
      title: '项目角色',
      dataIndex: 'GW',
      width: '40%',
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
      width: '20%',
      key: 'FS',
      ellipsis: true,
      sorter: (a, b, order) => {
        if (Lodash.isEmpty(a.FS) || Lodash.isEmpty(b.FS)) return 1;
        return a.FS - b.FS;
      },
    },
    {
      title: '打分详情',
      dataIndex: 'DFXQ',
      width: '20%',
      key: 'DFXQ',
      ellipsis: true,
      render: (txt, row) => (
        <Popover
          trigger="click"
          title={null}
          placement="bottom"
          content={getPopoverContent(detailData)}
          overlayClassName="unplanned-demand-content-popover"
          visible={Number(row.XMRYID) === detailData.curMemberId ? detailData.visible : false}
          onVisibleChange={v => setDetailData(p => ({ ...p, visible: v }))}
        >
          <a
            style={{ color: '#3361ff' }}
            onClick={() => handleDFXQClick(Number(row.XMRYID), Number(curPrj.id))}
          >
            查看详情
          </a>
        </Popover>
      ),
    },
  ];

  const handleDFXQClick = useCallback((memberId, projectId) => {
    setDetailData(p => ({ ...p, visible: true, curMemberId: memberId }));
    getDetailData({ memberId, projectId });
  }, []);

  const getPopoverContent = ({ data = [], current = 1, pageSize = 5, loading = false }) => {
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
        //   pageSize: 5,
        //   // pageSizeOptions: ['5', '20', '20', '40'],
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

  useEffect(() => {
    getPrjList({});
    return () => { };
  }, []);

  useEffect(() => {
    if (curPrj.id !== -1) {
      getTableData(Number(curPrj.id));
    }
    return () => { };
  }, [curPrj.id]);

  //获取用户角色
  const getUserRole = useCallback(userId => {
    QueryUserRole({
      userId,
    })
      .then(res => {
        if (res?.code === 1) {
          const { testRole = '{}' } = res;
          // setShowSwitch(JSON.parse(testRole).ALLROLE?.includes('人员评价管理员'));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
        setIsSpinning(false);
      });
  }, []);

  //获取左侧项目列表
  const getPrjList = useCallback(({ projectName, orgId, year }) => {
    setIsSpinning(true);
    QueryEmployeeAppraiseList({
      queryType: 'XMGK',
      userType: 'LD',
      projectName,
      orgId,
      year,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.gkResult || '[]') || [];
          setPrjList(data);
          if (data.length > 0)
            // setCurPrj({
            //   id: data[0].XMID,
            //   name: data[0].XMMC,
            //   progress: data[0].XMJD,
            //   average: data[0].PJF,
            //   milestone: data[0].DQLCB,
            // });
            setCurPrj({
              id: -1,
              name: '',
            });
          else {
            setCurPrj({
              id: -1,
              name: '',
            });
            setTableData({ data: [], current: 1, pageSize: 20, loading: false });
          }
          getUserRole(userBasicInfo.id);
        }
      })
      .catch(e => {
        console.error('🚀左侧项目列表', e);
        message.error('左侧项目列表获取失败', 1);
        setIsSpinning(false);
      });
  }, []);

  //获取右侧表格数据
  const getTableData = useCallback(projectId => {
    setTableData(p => ({ ...p, loading: true }));
    QueryEmployeeAppraiseList({
      queryType: 'XMXQ',
      userType: 'LD',
      projectId,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xqmxResult || '[]') || [];
          const finalData = data.reduce((result, item) => {
            const existingItem = result.find(i => i.XMRYID === item.XMRYID);
            if (existingItem) {
              existingItem.GW += `、${item.GW}`;
            } else {
              result.push(item);
            }
            return result;
          }, []);
          setTableData({ data: finalData, current: 1, pageSize: 20, loading: false });
        }
      })
      .catch(e => {
        console.error('🚀右侧表格数据', e);
        message.error('右侧表格数据', 1);
        setTableData(p => ({ ...p, loading: false }));
      });
  }, []);

  //获取打分详情数据
  const getDetailData = useCallback(({ memberId, projectId }) => {
    setDetailData(p => ({ ...p, loading: true }));
    QueryEmployeeAppraiseList({
      queryType: 'DFXQ',
      userType: 'LD',
      memberId,
      projectId,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xqmxResult || '[]') || [];
          setDetailData(p => ({ ...p, data, current: 1, pageSize: 5, loading: false }));
        }
      })
      .catch(e => {
        console.error('🚀打分详情数据', e);
        message.error('打分详情数据获取失败', 1);
        setDetailData(p => ({ ...p, loading: false }));
      });
  }, []);

  //选中左侧项目
  const handlePrjItemClick = useCallback(
    (id, name, progress, average, milestone) => {
      setCurPrj({ id, name, progress, average, milestone });
    },
    [curPrj.id],
  );

  //表格操作后更新数据
  const handleTableChange = useCallback((pagination = {}) => {
    const { current = 1, pageSize = 20 } = pagination;
    setTableData(p => ({ ...p, current, pageSize }));
    return;
  }, []);

  return (
    <div className="years-prj-evaluation-box">
      <TopFilter
        handleSearch={getPrjList}
        config={filterConfig}
        filterData={filterData}
        setFilterData={setFilterData}
      />
      <div className="content-box">
        <div className="left-box">
          <LeftPrjList
            list={prjList}
            handlePrjItemClick={handlePrjItemClick}
            curPrjID={curPrj.id}
            height={'100%'}
            fromSituationPage={true}
            routes={routes}
          />
        </div>
        <div className="right-box">
          {curPrj.id === -1 ? (
            <Empty
              description="选择项目后查看数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: 'auto 0' }}
            />
          ) : (
            <Fragment>
              <div className="table-info">
                <img className="table-info-img" src={tableInfoImg} alt="left-img" />
                <div className="info-middle">
                  <div className="prj-name">
                    <Tooltip title={curPrj.name} placement="topLeft">
                      <Link
                        style={{ color: '#3361ff' }}
                        to={{
                          pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                            JSON.stringify({
                              xmid: curPrj.id,
                            }),
                          )}`,
                          state: {
                            routes,
                          },
                        }}
                        className="prj-name"
                      >
                        {curPrj.name}
                      </Link>
                    </Tooltip>
                  </div>
                  <div className="cur-mile-stone">
                    当前里程碑：
                    <Tooltip title={curPrj.milestone} placement="topLeft">
                      {curPrj.milestone || '暂无'}
                    </Tooltip>
                  </div>
                </div>
                <div className="info-item" key={'项目人员平均分'}>
                  项目人员平均分
                  <div className="info-num">{curPrj.average || '暂无'}</div>
                </div>
                <div className="info-item" key={'项目进度'}>
                  项目进度
                  <div className="info-num">{curPrj.progress}%</div>
                </div>
              </div>
              <div className="table-box">
                <Table
                  loading={tableData.loading}
                  rowKey={row => `${curPrj.id}-${row.XMRYID}`}
                  columns={columns}
                  dataSource={tableData.data}
                  onChange={handleTableChange}
                  // pagination={false}
                  pagination={{
                    current: tableData.current,
                    pageSize: tableData.pageSize,
                    defaultCurrent: 1,
                    pageSizeOptions: ['20', '40', '50', '100'],
                    showSizeChanger: true,
                    hideOnSinglePage: false,
                    showTotal: t => `共 ${tableData.data.length} 条数据`,
                    total: tableData.data.length,
                  }}
                />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
