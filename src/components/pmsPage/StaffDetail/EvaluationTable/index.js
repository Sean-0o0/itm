import React, { useEffect, useState, useRef, useCallback } from 'react';
import { message, Popover, Table, Tooltip, Spin } from 'antd';
import { QueryEmployeeAppraiseList, } from '../../../../services/pmsServices';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import * as Lodash from 'lodash'

/**
 * 人员评价列表表格
 */
const EvaluationTable = (props) => {

  const { userBasicInfo, curTab, ryid: curStaffID } = props

  const [routes, setRoutes] = useState([{ name: '人员详情', pathname: location.pathname }]); //路由

  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: -1,
    loading: false,
    info: [],
  }); //右侧表格数据

  const [detailData, setDetailData] = useState({
    data: [],
    current: 1,
    pageSize: 5,
    loading: false,
    visible: false,
    curPrjId: -1,
  }); //打分详情浮窗表格数据

  const handleDFXQClick = useCallback((memberId, projectId) => {
    setDetailData(p => ({ ...p, visible: true, curPrjId: projectId }));
    getDetailData({ memberId, projectId });
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
          // console.log('🚀 ~ getTableData', finalData, data2);
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

  //表配置
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

  useEffect(() => {
    if (curTab === 'evaluationSituation') {
      getTableData(Number(curStaffID));
    }
  }, [curTab]);

  useEffect(() => {
    if (curStaffID !== -1 && curTab === 'evaluationSituation') {
      getTableData(Number(curStaffID));
    }
  }, [curStaffID]);


  return (
    <Spin
      spinning={tableData.loading}
      tip=""
      wrapperClassName="mutual-evaluation-situation-spin-wrapper"
    >
      <div className="StaffDetail___EvaluationTable">
        <div className="project-info-table-box">
          <Table
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
      </div>
    </Spin>
  )
}


export default EvaluationTable






