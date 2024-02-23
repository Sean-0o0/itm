import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Table,
  Form,
  Tooltip,
  Select,
  Input,
  Popconfirm,
  Spin,
  Popover,
  message,
} from 'antd';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { OperateAwardAndHonor, QueryAwardAndHonorList } from '../../../../services/pmsServices';
import FileDownload from '../../IntelProperty/FileDownload';
import OprModal from '../OprModal';
const { Option } = Select;

const TableBox = props => {
  const { dataProps = {}, funcProps = {} } = props;

  const {
    tableData = {},
    filterData = {},
    activeKey,
    spinningData,
    JXJB = [],
    HJQK = [],
    KTZT = [],
    isGLY,
    expandedRowKeys,
    subTableData,
  } = dataProps;

  const {
    setFilterData = () => { },
    queryTableData = () => { },
    setSpinningData = () => { },
    setTableData = () => { },
    allowEdit,
    setExpandedRowKeys,
    setSubTableData,
    getSubTableData,
  } = funcProps;

  const [modalData, setModalData] = useState({
    visible: false, //显隐
    oprType: 'ADD',
    rowData: undefined,
    isSB: false, //是否申报
    fromPrjDetail: false, //入口是否在项目详情
    parentRow: undefined, //申报行的父行数据{}
  }); //操作弹窗

  const location = useLocation();

  //列配置
  const columns = (key = 'KJJX') => {
    if (key === 'KJJX') {
      return [
        {
          title: '奖项名称',
          dataIndex: 'JXMC',
          key: 'JXMC',
          width: '23%', //有子表格时必须每列表明宽度
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        {
          title: '发起单位',
          dataIndex: 'FQDW',
          key: 'FQDW',
          width: '24%',
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        {
          title: '奖项级别',
          dataIndex: 'JXJB',
          key: 'JXJB',
          width: '7%',
          ellipsis: true,
          render: txt => getNote(JXJB, txt),
        },
        {
          title: '参考资料',
          dataIndex: 'CKZL',
          key: 'CKZL',
          width: '7%',
          ellipsis: true,
          render: (txt, row) => (
            <FileDownload
              fileStr={txt}
              params={{
                objectName: 'TXMXX_HJRY',
                columnName: 'CKZL',
                id: row.ID,
              }}
            />
          ),
        },
        {
          title: '获奖情况',
          dataIndex: 'HJQK',
          key: 'HJQK',
          width: '7%',
          ellipsis: true,
          render: txt => getNote(HJQK, txt),
        },
        {
          title: '申报截止日期',
          dataIndex: 'SBJZRQ',
          key: 'SBJZRQ',
          width: '10%',
          ellipsis: true,
          render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
        },
        {
          title: '申报项目数',
          dataIndex: 'SBXMS',
          key: 'SBXMS',
          width: '10%',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'OPRT',
          width: '12%',
          align: 'center',
          key: 'OPRT',
          ellipsis: true,
          render: (txt, row) => (
            <div className="opr-column">
              {(moment().isSameOrBefore(moment(String(row.SBJZRQ)), 'day') || isGLY) && (
                <span onClick={() => handleAddSbRow(row)}>申报</span>
              )}
              {allowEdit(row.LXRID) && <span onClick={() => handleEdit(row)}>修改</span>}
              {allowEdit(row.LXRID) && (
                <Popconfirm title={`确定删除吗?`} onConfirm={() => handleDelete(row)}>
                  <span>删除</span>
                </Popconfirm>
              )}
            </div>
          ),
        },
      ];
    }
    else if (key === 'KJRY') {    // 科技荣誉
      return [
        {
          title: '荣誉名称',
          dataIndex: 'RYMC',
          key: 'RYMC',
          width: '17%', //有子表格时必须每列表明宽度
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        {
          title: '颁发单位',
          dataIndex: 'BFDW',
          key: 'BFDW',
          width: '17%',
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        {
          title: '关联项目名称',
          dataIndex: 'GLXMMC',
          width: '17%',
          key: 'GLXMMC',
          ellipsis: true,
          render: (text, row, index) => {
            return (
              <Tooltip title={text} placement="topLeft">
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                      JSON.stringify({
                        xmid: row.GLXMID,
                      }),
                    )}`,
                    state: {
                      routes: [{ name: '项目列表', pathname: location.pathname }],
                    },
                  }}
                  className="table-link-strong"
                >
                  {text}
                </Link>
              </Tooltip>
            )
          },
        },
        {
          title: '联系人',
          dataIndex: 'LXR',
          key: 'LXR',
          width: '11%',
          ellipsis: true,
        },
        {
          title: '参考资料',
          dataIndex: 'FJ',  // 虽然中文名字叫 参考资料  但是  命名要根据下面 axios 的  params.columnName
          key: 'FJ',
          width: '7%',
          ellipsis: true,
          render: (txt, row) => {
            return <FileDownload
              fileStr={txt}
              params={{
                objectName: 'TXMXX_HJRY_SBXQ',  //找后端要
                columnName: 'FJ',               //找后端要
                id: row.ID,
              }}
            />
          },
        },
        {
          title: '获奖日期',
          dataIndex: 'HJSJ',
          key: 'HJSJ',
          width: '8%',
          ellipsis: true,
          render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
        },
        {
          title: '修改时间',
          dataIndex: 'XGSJ',
          key: 'XGSJ',
          width: '8%',
          ellipsis: true,
          render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
        },
        {
          title: '操作',
          dataIndex: 'OPRT',
          width: '10%',
          align: 'center',
          key: 'OPRT',
          ellipsis: true,                   //科技荣誉
          render: (txt, row) => (
            <div className="opr-column">
              {allowEdit(row.LXRID) && <span onClick={() => handleEdit(row)}>修改</span>}
              {allowEdit(row.LXRID) && (
                <Popconfirm title={`确定删除吗?`} onConfirm={() => handleDelete(row)}>
                  <span>删除</span>
                </Popconfirm>
              )}
            </div>
          ),
        },
      ]
    }
    else if (key === 'YJKT') {
      return [
        {
          title: '课题名称',
          dataIndex: 'KTMC',
          key: 'KTMC',
          width: '23%', //有子表格时必须每列表明宽度
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        {
          title: '发起单位',
          dataIndex: 'FQDW',
          key: 'FQDW',
          width: '31%',
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        {
          title: '参考资料',
          dataIndex: 'CKZL',
          key: 'CKZL',
          width: '7%',
          ellipsis: true,
          render: (txt, row) => (
            <FileDownload
              fileStr={txt}
              params={{
                objectName: 'TXMXX_HJRY',
                columnName: 'CKZL',
                id: row.ID,
              }}
            />
          ),
        },
        {
          title: '课题状态',
          dataIndex: 'HJQK',
          key: 'HJQK',
          width: '7%',
          ellipsis: true,
          render: txt => getNote(KTZT, txt),
        },
        {
          title: '申报截止日期',
          dataIndex: 'SBJZRQ',
          key: 'SBJZRQ',
          width: '10%',
          ellipsis: true,
          render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
        },
        {
          title: '申报项目数',
          dataIndex: 'SBXMS',
          key: 'SBXMS',
          width: '10%',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'OPRT',
          width: '10%',
          align: 'center',
          key: 'OPRT',
          ellipsis: true,
          render: (txt, row) => (
            <div className="opr-column">
              {(moment().isSameOrBefore(moment(String(row.SBJZRQ)), 'day') || isGLY) && (
                <span onClick={() => handleAddSbRow(row)}>申报</span>
              )}
              {allowEdit(row.LXRID) && <span onClick={() => handleEdit(row)}>修改</span>}
              {allowEdit(row.LXRID) && (
                <Popconfirm title={`确定删除吗?`} onConfirm={() => handleDelete(row)}>
                  <span>删除</span>
                </Popconfirm>
              )}
            </div>
          ),
        },
      ];
    }
  };

  //获取字典note
  const getNote = (data = [], ibm) =>
    ibm !== undefined ? data.find(x => x.ibm === String(ibm))?.note || '' : '';

  const expandedRowRender = record => {
    //嵌套子表格，每个宽度都要设
    const columns = [
      {
        title: '序号',
        dataIndex: 'XH',
        key: 'XH',
        width: '6%',
        align: 'center',
        ellipsis: true,
        render: (t, r, i) => i + 1,
      },
      {
        title: '申报项目',
        dataIndex: 'SBXM',
        key: 'SBXM',
        width: '17%',
        ellipsis: true,
        render: txt => (
          <Tooltip title={txt} placement="topLeft">
            <span style={{ cursor: 'default' }}>{txt}</span>
          </Tooltip>
        ),
      },
      {
        title: '关联项目',
        dataIndex: 'GLXMMC',
        key: 'GLXMMC',
        width: '17%',
        ellipsis: true,
        render: (txt, row) => (
          <div title={txt}>
            <Tooltip title={txt} placement="topLeft">
              <Link
                className="table-link-strong"
                style={{ color: '#3361ff' }}
                to={{
                  pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                    JSON.stringify({
                      xmid: row.GLXMID,
                    }),
                  )}`,
                  state: {
                    routes: [{ name: '获奖荣誉列表', pathname: location.pathname }],
                  },
                }}
              >
                {txt}
              </Link>
            </Tooltip>
          </div>
        ),
      },
      {
        title: '联系人',
        dataIndex: 'LXR',
        width: '7%',
        key: 'LXR',
        ellipsis: true,
        render: (txt, row) => {
          return (
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/staffDetail/${EncryptBase64(
                  JSON.stringify({
                    ryid: row.LXRID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '获奖荣誉列表', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {txt}
            </Link>
          );
        },
      },
      {
        title: '附件',
        dataIndex: 'FJ',
        key: 'FJ',
        width: '7%',
        ellipsis: true,
        render: (txt, row) => (
          <FileDownload
            fileStr={txt}
            params={{
              objectName: 'TXMXX_HJRY_SBXQ',
              columnName: 'FJ',
              id: row.ID,
            }}
          />
        ),
      },
      {
        title: '申报说明',
        dataIndex: 'SBSM',
        key: 'SBSM',
        width: '7%',
        ellipsis: true,
        render: txt => (
          <div className="opr-column" style={{ justifyContent: 'flex-start' }}>
            <Popover
              placement="bottomLeft"
              overlayClassName="supplier-detail-basic-info-popover"
              content={<div className="content">{txt}</div>}
            >
              查看详情
            </Popover>
          </div>
        ),
      },
      activeKey === 'KJJX'
        ? {
          title: '获奖情况',
          dataIndex: 'HJQK',
          key: 'HJQK',
          width: '7%',
          ellipsis: true,
          render: txt => getNote(HJQK, txt),
        }
        : {
          title: '课题状态',
          dataIndex: 'KTZT',
          key: 'KTZT',
          width: '7%',
          ellipsis: true,
          render: txt => getNote(KTZT, txt),
        },
      activeKey === 'KJJX'
        ? {
          title: '获奖时间',
          dataIndex: 'HJSJ',
          key: 'HJSJ',
          width: '10%',
          ellipsis: true,
          render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
        }
        : {
          title: '结题时间',
          dataIndex: 'JTSJ',
          key: 'JTSJ',
          width: '10%',
          ellipsis: true,
          render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
        },
      {
        title: '修改时间',
        dataIndex: 'XGSJ',
        key: 'XGSJ',
        width: '10%',
        ellipsis: true,
        render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
      },
      {
        title: '操作',
        dataIndex: 'OPRT',
        width: '12%',
        align: 'center',
        key: 'OPRT',
        ellipsis: true,
        render: (txt, row) =>
          allowEdit(row.LXRID) ? (
            <div className="opr-column">
              <span onClick={() => handleSbEdit(row, { ...record })}>修改</span>
              <Popconfirm title={`确定删除吗?`} onConfirm={() => handleSbDelete(row, record.ID)}>
                <span>删除</span>
              </Popconfirm>
            </div>
          ) : (
            ''
          ),
      },
    ];

    if (record.loading) return <Spin style={{ width: '100%' }} />;
    return (
      <Table
        className="sub-table-demand-info"
        columns={columns}
        rowKey="ID"
        dataSource={subTableData[record.ID]}
        pagination={false}
        bordered
      />
    );
  };

  const onExpand = async (expanded, record) => {
    // console.log(expanded, record);
    if (expanded) {
      // 正在加载的行设置 loading 状态
      record.loading = true;
      if (!expandedRowKeys.includes(record.ID)) {
        setExpandedRowKeys(p => [...p, record.ID]);
      }
      // 查询获奖荣誉 子表
      let res = await QueryAwardAndHonorList({
        listId: Number(record.ID),
        tab: activeKey,
        current: 1,
        pageSize: 10,
        paging: -1,
        queryType: 'XQ',
        sort: '',
        total: -1,
      });
      const data = JSON.parse(res.result);
      console.log('🚀 ~ file: index.js:321 ~ onExpand ~ data:', data);
      setSubTableData(p => ({
        ...p,
        [record.ID]: data,
      }));
      let arr = [...tableData.data];
      arr.forEach(x => {
        if (x.ID === record.ID) x.loading = false;
      });
      setTableData(p => ({ ...p, data: arr }));
    } else {
      //收起时置空
      setSubTableData(p => {
        return {
          ...p,
          [record.ID]: [],
        };
      });
      setExpandedRowKeys(p => [...expandedRowKeys.filter(x => x !== record.ID)]);
      record.loading = false;
    }
  };

  //删除
  const handleDelete = row => {
    setSpinningData(p => ({
      ...p,
      spinning: true,
    }));
    function getHJLX(type = 'KJJX') {
      switch (type) {
        case 'YJKT':
          return 2;
        case 'KJRY':
          return 3;
        default:
          return 1;
      }
    }
    const params = {
      operateType: 'DELETE',
      awardType: getHJLX(activeKey),
      dataType: activeKey === 'KJRY' ? 'XQ' : 'LB',
      awardId: Number(row.ID),
      // state: row.DQZT,
      projectId: row.GLXMID,
      fileInfo: '[]',
    };
    if (activeKey === 'KJRY') {
      params.detailId = Number(row.ID)
    }
    OperateAwardAndHonor(params)
      .then(res => {
        if (res?.success) {
          queryTableData({
            current: tableData.current,
            pageSize: tableData.pageSize,
            sort: tableData.sort,
            ...filterData,
          });
          message.success('操作成功', 1);
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀知识产权', e);
        message.error('操作失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  //申报 - 删除
  const handleSbDelete = (row, parentRowID) => {
    setSpinningData(p => ({
      ...p,
      spinning: true,
    }));
    function getHJLX(type = 'KJJX') {
      switch (type) {
        case 'YJKT':
          return 2;
        default:
          return 1;
      }
    }
    const params = {
      operateType: 'DELETE',
      awardType: getHJLX(activeKey),
      dataType: 'XQ',
      detailId: Number(row.ID),
      // state: row.DQZT,
      projectId: row.GLXMID,
      fileInfo: '[]',
    };
    OperateAwardAndHonor(params)
      .then(res => {
        if (res?.success) {
          getSubTableData(parentRowID);
          queryTableData({
            current: tableData.current,
            pageSize: tableData.pageSize,
            sort: tableData.sort,
            ...filterData,
          });
          message.success('操作成功', 1);
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀知识产权', e);
        message.error('操作失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  //修改
  const handleEdit = row => {
    function turnString(value) {
      if (value === undefined) return undefined;
      return String(value);
    }
    let rowData = {
      ...row,
      HJQK: turnString(row.HJQK),
      JXJB: turnString(row.JXJB),
      SBJZRQ: turnString(row.SBJZRQ) ? moment(turnString(row.SBJZRQ)) : undefined,
      FJ: row.CKZL,
    };
    // console.log('🚀 ~ file: index.js:252 ~ handleEdit ~ rowData:', rowData);
    setModalData({
      visible: true,
      oprType: 'UPDATE',
      rowData,
      isSB: false,
      fromPrjDetail: false,
      parentRow: undefined,
    });
  };

  //申报
  const handleAddSbRow = row => {
    setModalData({
      visible: true,
      oprType: 'ADD',
      rowData: undefined,
      isSB: true,
      fromPrjDetail: false,
      parentRow: row,
    });
  };

  //申报 - 修改
  const handleSbEdit = (row = {}, parentRow = {}) => {
    function turnString(value) {
      if (value === undefined) return undefined;
      return String(value);
    }
    let rowData = {
      ...row,
      LXRID: turnString(row.LXRID),
      GLXMID: turnString(row.GLXMID),
      HJQK: turnString(row.HJQK),
      KTZT: turnString(row.KTZT),
      HJSJ: turnString(row.HJSJ) ? moment(turnString(row.HJSJ)) : undefined,
      JTSJ: turnString(row.JTSJ) ? moment(turnString(row.JTSJ)) : undefined,
      FJ: row.FJ,
    };
    // console.log('🚀 ~ file: index.js:252 ~ handleEdit ~ rowData:', rowData);
    setModalData({
      visible: true,
      oprType: 'UPDATE',
      rowData,
      isSB: true,
      fromPrjDetail: false,
      parentRow,
    });
  };

  //重置
  const handleReset = () => {
    setFilterData({});
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current = 1, pageSize = 20 } = pagination;
    if (sorter.order !== undefined) {
      queryTableData({
        current,
        pageSize,
        sort: sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
        ...filterData,
      });
    } else {
      queryTableData({
        current,
        pageSize,
        ...filterData,
      });
    }
    return;
  };

  //名称筛选
  const getInputName = (key = 'KJJX') => {
    if (key === 'KJJX') {
      return '奖项名称';
    } else {
      return '课题名称';
    }
  };

  //获奖情况和课题进度
  const getSlt = (key = 'KJJX', data = false) => {
    if (key === 'KJJX') {
      return data ? HJQK : '获奖情况';
    } else {
      return data ? KTZT : '课题状态';
    }
  };

  //新建
  const handleAddRow = () => {
    setModalData({
      visible: true,
      oprType: 'ADD',
      rowData: undefined,
      isSB: false,
      fromPrjDetail: false,
      parentRow: undefined,
    });
  };

  //弹窗操作后刷新数据
  const handleModalRefresh = () => {
    if (modalData.isSB) {
      getSubTableData(modalData.parentRow?.ID);
      queryTableData({
        current: tableData.current,
        pageSize: tableData.pageSize,
        sort: tableData.sort,
        ...filterData,
      });
    } else {
      queryTableData({
        current: tableData.current,
        pageSize: tableData.pageSize,
        sort: tableData.sort,
        ...filterData,
      });
    }
    setModalData({
      visible: false, //显隐
      oprType: 'ADD',
      rowData: undefined,
      isSB: false, //是否申报
      fromPrjDetail: false, //入口是否在项目详情
      parentRow: undefined,
    });
  };

  return (
    <>
      <div className="table-box">

        <OprModal
          setVisible={v => setModalData(p => ({ ...p, visible: v }))}
          type={activeKey}
          data={modalData}
          refresh={handleModalRefresh}
          isGLY={isGLY}
          tableData={tableData}
        />

        <div className="filter-row">

          {(activeKey === 'KJJX' || activeKey === 'YJKT') && (
            <div className="console-item">
              <div className="item-label">{getInputName(activeKey)}</div>
              <div className="item-selector">
                <Input
                  value={filterData.awardName}
                  onChange={v => {
                    v.persist();
                    if (v.target.value === '') {
                      setFilterData(p => ({ ...p, awardName: undefined }));
                    } else {
                      setFilterData(p => ({ ...p, awardName: v.target.value }));
                    }
                  }}
                  placeholder={'请输入' + getInputName(activeKey)}
                  allowClear
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {activeKey === 'KJJX' && (
            <div className="console-item">
              <div className="item-label">奖项级别</div>
              <Select
                className="item-selector"
                dropdownClassName={'item-selector-dropdown'}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showSearch
                allowClear
                onChange={v => setFilterData(p => ({ ...p, awardLevel: v }))}
                value={filterData.awardLevel}
                placeholder="请选择奖项级别"
              >
                {JXJB.map((x, i) => (
                  <Option key={x.ibm} value={Number(x.ibm)}>
                    {x.note}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {activeKey === 'KJRY' && (
            <>
              <div className="console-item">
                <div className="item-label">荣誉名称</div>
                <div className="item-selector">
                  <Input
                    value={filterData.awardName}
                    onChange={v => {
                      v.persist();
                      if (v.target.value === '') {
                        setFilterData(p => ({ ...p, awardName: undefined }));
                      } else {
                        setFilterData(p => ({ ...p, awardName: v.target.value }));
                      }
                    }}
                    placeholder='请输入荣誉名称'
                    allowClear
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="console-item">
                <div className="item-label">颁发单位</div>
                <div className="item-selector">
                  <Input
                    value={filterData.unit}
                    onChange={v => {
                      v.persist();
                      if (v.target.value === '') {
                        setFilterData(p => ({ ...p, unit: undefined }));
                      } else {
                        setFilterData(p => ({ ...p, unit: v.target.value }));
                      }
                    }}
                    placeholder='请输入颁发单位'
                    allowClear
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </>
          )}

          {(activeKey === 'KJJX' || activeKey === 'YJKT') && (
            <div className="console-item">
              <div className="item-label">发起单位</div>
              <div className="item-selector">
                <Input
                  value={filterData.unit}
                  onChange={v => {
                    v.persist();
                    if (v.target.value === '') {
                      setFilterData(p => ({ ...p, unit: undefined }));
                    } else {
                      setFilterData(p => ({ ...p, unit: v.target.value }));
                    }
                  }}
                  placeholder={'请输入发起单位'}
                  allowClear
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {(activeKey === 'KJJX' || activeKey === 'YJKT') && (
            <div className="console-item">
              <div className="item-label">{getSlt(activeKey)}</div>
              <Select
                className="item-selector"
                dropdownClassName={'item-selector-dropdown'}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showSearch
                allowClear
                onChange={v => setFilterData(p => ({ ...p, status: v }))}
                value={filterData.status}
                placeholder={'请选择' + getSlt(activeKey)}
              >
                {getSlt(activeKey, true).map((x, i) => (
                  <Option key={x.ibm} value={Number(x.ibm)}>
                    {x.note}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          <Button
            className="btn-search"
            type="primary"
            onClick={() => {
              queryTableData({
                ...filterData,
              });
              setExpandedRowKeys([]);
              setSubTableData([]);
            }}
          >
            查询
          </Button>

          <Button className="btn-reset" onClick={() => handleReset()}>
            重置
          </Button>
        </div>

        {isGLY && (
          <div className="export-row">
            <Button type="primary" onClick={handleAddRow}>
              新建
            </Button>
          </div>
        )}

        <div
          className="project-info-table-box"
          style={isGLY ? {} : { height: 'calc(100% - 81px)' }}
        >
          {activeKey === 'KJRY'
            ? <Table
              columns={columns(activeKey)}
              rowKey={'ID'}
              dataSource={tableData.data}
              onChange={handleTableChange}
              pagination={{
                current: tableData.current,
                pageSize: tableData.pageSize,
                defaultCurrent: 1,
                pageSizeOptions: ['20', '40', '50', '100'],
                showSizeChanger: true,
                hideOnSinglePage: false,
                showQuickJumper: true,
                showTotal: t => `共 ${tableData.total} 条数据`,
                total: tableData.total,
              }}
              bordered
            />
            : <Table
              columns={columns(activeKey)}
              rowKey={'ID'}
              dataSource={tableData.data}
              onChange={handleTableChange}
              expandedRowRender={expandedRowRender}
              expandedRowKeys={expandedRowKeys}
              onExpand={onExpand}
              pagination={{
                current: tableData.current,
                pageSize: tableData.pageSize,
                defaultCurrent: 1,
                pageSizeOptions: ['20', '40', '50', '100'],
                showSizeChanger: true,
                hideOnSinglePage: false,
                showQuickJumper: true,
                showTotal: t => `共 ${tableData.total} 条数据`,
                total: tableData.total,
              }}
              bordered
            />
          }

        </div>
      </div>
    </>
  );
};
export default Form.create()(TableBox);
