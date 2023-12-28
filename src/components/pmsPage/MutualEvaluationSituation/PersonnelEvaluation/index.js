import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react';
import { Button, Divider, Empty, Input, message, Popover, Table, Tabs, Tooltip, Tree } from 'antd';
import moment from 'moment';
import tableInfoImg from '../../../../assets/MutualEvaluation/staff-evaluation-table-info.png';
import cyxmsImg from '../../../../assets/MutualEvaluation/icon_cyxms.png';
import pjImg from '../../../../assets/MutualEvaluation/icon_pj.png';
import { QueryEmployeeAppraiseList } from '../../../../services/pmsServices';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { debounce } from 'lodash';

export default function PersonnelEvaluation(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { routes = [], userBasicInfo = {}, staffData = [], originStaffData = {} } = dataProps;
  const { setIsSpinning, handleStaffData } = funcProps;
  const [treeData, setTreeData] = useState([]); //左侧树型数据
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: -1,
    loading: false,
    info: [],
  }); //右侧表格数据
  const [activeKey, setActiveKey] = useState(''); //顶部高亮tab
  const [curStaffID, setCurStaffID] = useState(-1); //选中的人员ID
  const [expandKeys, setExpandKeys] = useState([]); //展开id
  const [searchInput, setSearchInput] = useState(undefined); //
  const [detailData, setDetailData] = useState({
    data: [],
    current: 1,
    pageSize: 5,
    loading: false,
    visible: false,
    curPrjId: -1,
  }); //打分详情浮窗表格数据

  useEffect(() => {
    if (staffData.length > 0) {
      setActiveKey(staffData[0].value);
      setTreeData(JSON.parse(JSON.stringify(staffData[0].children || [])));
    }
    return () => {};
  }, [JSON.stringify(staffData)]);

  useEffect(() => {
    if (curStaffID !== -1) getTableData(Number(curStaffID));
    return () => {};
  }, [curStaffID]);

  //获取右侧表格数据
  const getTableData = useCallback((memberId, current = 1, pageSize = 20, sort = '') => {
    setTableData(p => ({ ...p, loading: true }));
    QueryEmployeeAppraiseList({
      queryType: 'RYXQ',
      userType: 'LD',
      memberId,
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
          setTableData({
            data: finalData,
            current,
            pageSize,
            loading: false,
            info,
            total: res.totalrows,
          });
        }
      })
      .catch(e => {
        console.error('🚀右侧表格数据', e);
        message.error('右侧表格数据', 1);
        setTableData(p => ({ ...p, loading: false }));
      });
  }, []);

  const handleTabsChange = useCallback(
    key => {
      setActiveKey(key);
      setTreeData(staffData.find(x => x.value === key)?.children || []);
      // onSearch(searchInput);
      setSearchInput(undefined);
      setExpandKeys([]);
    },
    [searchInput, JSON.stringify(staffData)],
  );

  const renderTreeNodes = useCallback(
    (data = []) =>
      data.map(item => {
        if (item.children?.length > 0) {
          return (
            <Tree.TreeNode
              title={item.title}
              key={item.value}
              selectable={item.selectable === false ? false : true}
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
            selectable={item.selectable === false ? false : true}
            icon={<i className="iconfont icon-user" style={{ fontSize: 14 }} />}
          />
        );
      }),
    [],
  );

  const onTreeSelcet = useCallback((keyArr, e) => {
    // console.log('🚀 ~ onTreeSelcet ~ keyArr, e:', keyArr, e);
    if (keyArr.length > 0) {
      setCurStaffID(keyArr[0]);
    }
  }, []);

  //右侧表配置
  const columns = [
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
      width: '20%',
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
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '项目角色',
      dataIndex: 'GW',
      width: '30%',
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
      sorter: true,
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
          visible={Number(row.XMID) === detailData.curPrjId ? detailData.visible : false}
          onVisibleChange={v => setDetailData(p => ({ ...p, visible: v }))}
        >
          <a
            style={{ color: '#3361ff' }}
            onClick={() => handleDFXQClick(Number(curStaffID), Number(row.XMID))}
          >
            查看详情
          </a>
        </Popover>
      ),
    },
  ];

  const handleDFXQClick = useCallback((memberId, projectId) => {
    setDetailData(p => ({ ...p, visible: true, curPrjId: projectId }));
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

  //表格操作后更新数据
  const handleTableChange = useCallback(
    (pagination = {}, filter, sorter) => {
      const { current = 1, pageSize = 20 } = pagination;
      if (sorter.order !== undefined) {
        getTableData(
          Number(curStaffID),
          current,
          pageSize,
          sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
        );
      } else {
        getTableData(Number(curStaffID), current, pageSize);
      }

      return;
    },
    [curStaffID],
  );

  //模糊搜索
  const onSearch = useCallback(
    value => {
      const recursionHandler = (val = [], arr = [], getExp = false) => {
        let newarr = [];
        let expandArr = [];
        arr.forEach(item => {
          if (item.children && item.children.length) {
            let children = recursionHandler(val, item.children);
            let expandArrChildren = recursionHandler(val, item.children, true);
            // console.log(
            //   '🚀 ~ file: index.js:273 ~ recursionHandler ~ expandArrChildren:',
            //   expandArrChildren,
            // );
            let obj = {
              ...item,
              children,
            };
            if (children && children.length) {
              newarr.push(obj);
              expandArr.push(obj.value);
            }
            if (expandArrChildren && expandArrChildren.length) {
              expandArr = expandArr.concat(expandArrChildren);
            }
          } else {
            if (item.title.includes(val)) {
              newarr.push(item);
            }
          }
        });
        if (getExp) return expandArr;
        return newarr;
      };
      const finalData = recursionHandler(
        value,
        staffData.find(x => x.value === activeKey)?.children,
      );
      const expandArr = recursionHandler(
        value,
        staffData.find(x => x.value === activeKey)?.children,
        true,
      );
      // console.log(
      //   '🚀 ~ file: index.js:288 ~ PersonnelEvaluation ~ finalData:',
      //   finalData,
      //   expandArr,
      // );
      setTreeData(finalData);
      setSearchInput(value);
      if (value) {
        setExpandKeys(expandArr);
      } else {
        setExpandKeys([]);
      }
    },
    [JSON.stringify(staffData), activeKey],
  );

  const onExpand = useCallback(expandedKeys => {
    setExpandKeys(expandedKeys);
  }, []);

  return (
    <div className="personnel-evaluation-box content-box">
      <Tabs
        activeKey={activeKey}
        onChange={handleTabsChange}
        size={'large'}
        type="card"
        tabPosition="left"
      >
        {staffData.map(x => (
          <Tabs.TabPane tab={x.title} key={x.value}></Tabs.TabPane>
        ))}
      </Tabs>
      <div className="content-box">
        <div className="left-box">
          <Input.Search
            placeholder="请输入人员名称"
            // onSearch={value => console.log(value)}
            value={searchInput}
            onChange={e => {
              e.persist();
              const { value } = e.target || {};
              onSearch(value);
            }}
            style={{ width: 152, marginBottom: 12 }}
          />
          <div className="tree-box">
            <Tree showIcon onSelect={onTreeSelcet} expandedKeys={expandKeys} onExpand={onExpand}>
              {renderTreeNodes(treeData)}
            </Tree>
          </div>
        </div>
        <div className="right-box">
          {curStaffID === -1 ? (
            <Empty
              description="选择人员后查看数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: 'auto 0' }}
            />
          ) : (
            <Fragment>
              <div className="table-info">
                <img className="table-info-img" src={tableInfoImg} alt="left-img" />
                <div className="info-middle">
                  <div className="name-row">
                    <Link
                      style={{ color: '#3361ff' }}
                      to={{
                        pathname: `/pms/manage/StaffDetail/${EncryptBase64(
                          JSON.stringify({
                            ryid: curStaffID,
                          }),
                        )}`,
                        state: {
                          routes,
                        },
                      }}
                      className="staff-name"
                    >
                      {tableData.info.RYMC}
                    </Link>
                    <span className="work-days">已加入浙商证券{tableData.info.RZTS || '--'}天</span>
                  </div>
                  <div className="org-row">
                    部门：<span>{tableData.info.BM || '暂无'}</span>
                  </div>
                  <div className="position-phone-row">
                    <div className="position-row">
                      岗位：<span>{tableData.info.GW || '暂无'}</span>
                    </div>
                    <Divider type="vertical" style={{ color: '#909399', margin: '0px 8px' }} />
                    <div className="phone-row">
                      电话：<span>{tableData.info.SJ || '暂无'}</span>
                    </div>
                  </div>
                </div>
                <div className="info-item" key={'参与项目数量'}>
                  <img className="info-item-img" src={cyxmsImg} alt="img" />
                  <div className="item-right">
                    <div className="label-txt">参与项目数量</div>
                    <div className="value-num">{tableData.info.CYXMSL || '暂无'}</div>
                  </div>
                </div>
                <div className="info-item" key={'评价平均分'}>
                  <img className="info-item-img" src={pjImg} alt="img" />
                  <div className="item-right">
                    <div className="label-txt">评价平均分</div>
                    <div className="value-num">{tableData.info.PJF || '暂无'}</div>
                  </div>
                </div>
              </div>
              <div className="table-box">
                <Table
                  loading={tableData.loading}
                  rowKey={row => `${curStaffID}-${row.XMID}`}
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
