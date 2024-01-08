import React, { useState, useEffect, Fragment } from 'react';
import { Button, Table, Form, Tooltip, Select, Input, Popconfirm, Row, message } from 'antd';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import FileDownload from '../FileDownload';
import OprModal from '../OprModal';
import { EditIPRInfo } from '../../../../services/pmsServices';

const { Option } = Select;


const TableBox = props => {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    tableData = {},
    filterData = {},
    activeKey,
    spinningData,
    ZSCQDQZT = [],
    FMZLDQZT = [],
    QYBZDQZT = [],
    ZLLX = [],
    CYXZ = [],
    isGLY,
    HYBZLX = [],
  } = dataProps;
  const {
    setFilterData = () => { },
    queryTableData = () => { },
    setSpinningData = () => { },
    allowEdit,
  } = funcProps;
  const [modalData, setModalData] = useState({
    visible: false, //显隐
    oprType: 'ADD',
    rowData: undefined,
  }); //操作弹窗
  const location = useLocation();

  /** 列宽，软件著作权有“软件用途和技术特点”，返回不同列宽 */
  const widthMap = (tabKey) => {
    if (tabKey === 'RJZZ') {
      return new Map([
        ['关联项目', '12%'],

        ['软件名称', '12%'],
        ['版本号', '7%'],
        ['软件用途和技术特点', '13%'],

        ['附件', '5%'],
        ['联系人', '5%'],
        ['当前状态', '6%'],
        ['证书号', '7%'],
        ['登记时间', '8%'],
        ['修改时间', '8%'],
        ['操作', '7%'],
      ])
    }
    else {
      return new Map([
        ['关联项目', ''],

        ['专利名称', ''],
        ['专利类型', '10%'],

        ['标准名称', ''],
        ['参与类型', '8%'],
        ['标准类型', '8%'],

        ['附件', '7%'],
        ['联系人', '7%'],
        ['当前状态', '7%'],
        ['证书号', '10%'],
        ['登记时间', '10%'],
        ['修改时间', '10%'],
        ['操作', '10%'],
      ])
    }

  }

  //列配置
  const columns = (key = 'RJZZ') => {
    let header = [];
    let glxm = {
      title: '关联项目',
      dataIndex: 'GLXM',
      key: 'GLXM',
      width: widthMap(key).get('关联项目'),
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
                  routes: [{ name: '知识产权列表', pathname: location.pathname }],
                },
              }}
            >
              {txt}
            </Link>
          </Tooltip>
        </div>
      ),
    };
    if (key === 'RJZZ') {
      header = [
        {
          title: '软件名称',
          dataIndex: 'RJMC',
          key: 'RJMC',
          width: widthMap(key).get('软件名称'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        glxm,
        {
          title: '版本号',
          dataIndex: 'BBH',
          key: 'BBH',
          width: widthMap(key).get('版本号'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
      ];
    } else if (key === 'FMZL') {
      header = [
        {
          title: '专利名称',
          dataIndex: 'ZLMC',
          key: 'ZLMC',
          width: widthMap(key).get('专利名称'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        glxm,
        {
          title: '专利类型',
          dataIndex: 'ZLLX',
          key: 'ZLLX',
          width: widthMap(key).get('专利类型'),
          ellipsis: true,
          render: txt => getNote(ZLLX, txt),
        },
      ];
    } else if (key === 'HYBZ') {
      header = [
        {
          title: '标准名称',
          dataIndex: 'HYBZ',
          key: 'HYBZ',
          width: widthMap(key).get('标准名称'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        glxm,
        {
          title: '参与类型',
          dataIndex: 'CYLX',
          key: 'CYLX',
          width: widthMap(key).get('参与类型'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={getNote(CYXZ, txt)} placement="topLeft">
              <span style={{ cursor: 'default' }}>{getNote(CYXZ, txt)}</span>
            </Tooltip>
          ),
        },
        {
          title: '标准类型',
          dataIndex: 'HYBZLX',
          key: 'HYBZLX',
          width: widthMap(key).get('标准类型'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={getNote(HYBZLX, txt)} placement="topLeft">
              <span style={{ cursor: 'default' }}>{getNote(HYBZLX, txt)}</span>
            </Tooltip>
          ),
        },
      ];
    } else {
      header = [
        {
          title: '标准名称',
          dataIndex: 'QYBZ',
          key: 'QYBZ',
          width: widthMap(key).get('标准名称'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        },
        glxm,
      ];
    }
    return [
      ...header,
      {
        title: '附件',
        dataIndex: 'FJ',
        key: 'FJ',
        width: widthMap(key).get('附件'),
        ellipsis: true,
        render: (txt, row) => (
          <FileDownload
            fileStr={txt}
            params={{
              objectName: 'TXMXX_ZSCQ',
              columnName: 'FJ',
              id: row.ID,
            }}
          />
        ),
      },
      {
        title: '联系人',
        dataIndex: 'LXR',
        width: widthMap(key).get('联系人'),
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
                  routes: [{ name: '知识产权列表', pathname: location.pathname }],
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
        title: '当前状态',
        dataIndex: 'DQZT',
        key: 'DQZT',
        width: widthMap(key).get('当前状态'),
        ellipsis: true,
        render: txt => getNote(getDQZT(activeKey), txt),
      },
      {
        title: '证书号',
        dataIndex: 'ZSH',
        key: 'ZSH',
        width: widthMap(key).get('证书号'),
        ellipsis: true,
        render: txt => (
          <Tooltip title={txt} placement="topLeft">
            <span style={{ cursor: 'default' }}>{txt}</span>
          </Tooltip>
        ),
      },
      {
        title: '登记时间',
        dataIndex: 'DJSJ',
        key: 'DJSJ',
        width: widthMap(key).get('登记时间'),
        ellipsis: true,
        render: txt => moment(String(txt)).format('YYYY-MM-DD'),
      },
      ...(key === 'RJZZ' ?
        [{
          title: '软件用途和技术特点',
          dataIndex: 'RJYTHJSTD',
          key: 'RJYTHJSTD',
          width: widthMap(key).get('软件用途和技术特点'),
          ellipsis: true,
          render: txt => (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          ),
        }]
        : []
      ),
      {
        title: '修改时间',
        dataIndex: 'XGSJ',
        key: 'XGSJ',
        width: widthMap(key).get('修改时间'),
        ellipsis: true,
        render: txt => moment(String(txt)).format('YYYY-MM-DD'),
      },
      {
        title: '操作',
        dataIndex: 'OPRT',
        width: widthMap(key).get('操作'),
        align: 'center',
        key: 'OPRT',
        ellipsis: true,
        render: (txt, row) =>
          allowEdit(row.LXRID) ? (
            <div className="opr-column">
              <span onClick={() => handleEdit(row)}>修改</span>
              <Popconfirm title={`确定删除吗?`} onConfirm={() => handleDelete(row)}>
                <span>删除</span>
              </Popconfirm>
            </div>
          ) : (
            ''
          ),
      },
    ];
  };

  //获取字典note
  const getNote = (data = [], ibm) =>
    ibm !== undefined ? data.find(x => x.ibm === String(ibm))?.note || '' : '';

  //删除
  const handleDelete = row => {
    setSpinningData(p => ({
      ...p,
      spinning: true,
    }));
    function getCQLX(type = 'RJZZ') {
      switch (type) {
        case 'FMZL':
          return 2;
        case 'HYBZ':
          return 3;
        case 'QYBZ':
          return 4;
        default:
          return 1;
      }
    }
    const params = {
      id: Number(row.ID),
      operateType: 'DELETE',
      type: getCQLX(activeKey),
      projectId: row.GLXMID,
      file: '[]',
      state: row.DQZT,
    };
    EditIPRInfo(params)
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

  //修改
  const handleEdit = row => {
    function getName(type = 'RJZZ', row = {}) {
      switch (type) {
        case 'FMZL':
          return row.ZLMC;
        case 'HYBZ':
          return row.HYBZ;
        case 'QYBZ':
          return row.QYBZ;
        default:
          return row.RJMC;
      }
    }
    function turnString(value) {
      if (value === undefined) return undefined;
      return String(value);
    }
    let rowData = {
      ...row,
      DQZT: turnString(row.DQZT),
      LXRID: turnString(row.LXRID),
      GLXMID: turnString(row.GLXMID),
      ZLLX: turnString(row.ZLLX),
      CYXZ: turnString(row.CYLX),
      HYBZLX: turnString(row.HYBZLX),
      NAME: getName(activeKey, row),
      FJ: row.FJ,
    };
    console.log('🚀 ~ file: index.js:252 ~ handleEdit ~ rowData:', rowData);
    setModalData({
      visible: true,
      oprType: 'UPDATE',
      rowData,
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
  const getInputName = (key = 'RJZZ') => {
    if (key === 'RJZZ') {
      return '软件名称';
    } else if (key === 'FMZL') {
      return '专利名称';
    } else {
      return '标准名称';
    }
  };

  //新建
  const handleAddRow = () => {
    setModalData({
      visible: true,
      oprType: 'ADD',
      rowData: undefined,
    });
  };

  //当前状态
  const getDQZT = (key = 'RJZZ') => {
    if (key === 'QYBZ') {
      return QYBZDQZT;
    } else if (key === 'FMZL') {
      return FMZLDQZT;
    } else {
      return ZSCQDQZT;
    }
  };

  //弹窗操作后刷新数据
  const handleModalRefresh = () => {
    queryTableData({
      current: tableData.current,
      pageSize: tableData.pageSize,
      sort: tableData.sort,
      ...filterData,
    });
    setModalData({
      visible: false, //显隐
      oprType: 'ADD',
      rowData: undefined,
    });
  };

  return (
    <>
      <div className="table-box">
        {
          modalData.visible &&
          <OprModal
            visible={modalData.visible}
            setVisible={v => setModalData(p => ({ ...p, visible: v }))}
            oprType={modalData.oprType}
            type={activeKey}
            rowData={modalData.rowData}
            refresh={handleModalRefresh}
            isGLY={isGLY}
          />
        }

        <div className="filter-row">
          <div className="console-item">
            <div className="item-label">{getInputName(activeKey)}</div>
            <div className="item-selector">
              <Input
                value={filterData.propertyName}
                onChange={v => {
                  v.persist();
                  if (v.target.value === '') {
                    setFilterData(p => ({ ...p, propertyName: undefined }));
                  } else {
                    setFilterData(p => ({ ...p, propertyName: v.target.value }));
                  }
                }}
                placeholder={'请输入' + getInputName(activeKey)}
                allowClear
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="console-item">
            <div className="item-label">当前状态</div>
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
              placeholder="请选择当前状态"
            >
              {getDQZT(activeKey).map((x, i) => (
                <Option key={x.ibm} value={Number(x.ibm)}>
                  {x.note}
                </Option>
              ))}
            </Select>
          </div>

          <div className="console-item">
            <div className="item-label">联系人</div>
            <div className="item-selector">
              <Input
                value={filterData.contact}
                onChange={v => {
                  v.persist();
                  if (v.target.value === '') {
                    setFilterData(p => ({ ...p, contact: undefined }));
                  } else {
                    setFilterData(p => ({ ...p, contact: v.target.value }));
                  }
                }}
                placeholder={'请输入联系人'}
                allowClear
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <Button
            className="btn-search"
            type="primary"
            onClick={() =>
              queryTableData({
                ...filterData,
              })
            }
          >
            查询
          </Button>
          <Button className="btn-reset" onClick={() => handleReset()}>
            重置
          </Button>
        </div>
        <div className="export-row">
          <Button type="primary" onClick={handleAddRow}>
            新建
          </Button>
        </div>


        <div className="project-info-table-box">
          <Table
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
        </div>
      </div>
    </>
  );
};
export default Form.create()(TableBox);
