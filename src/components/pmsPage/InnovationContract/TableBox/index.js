import React, { useState, useEffect, Fragment } from 'react';
import { Button, Table, Form, Tooltip, Select, TreeSelect, message, Popover, Modal } from 'antd';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { EditIPRInfo, TransferXCContract } from '../../../../services/pmsServices';
import { useHistory } from 'react-router';
import TransferModal from './TransferModal';
import TopConsole from '../TopConsole';

const { Option } = Select;

const TableBox = props => {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    tableData = {},
    filterData = {},
    activeKey,
    dictionary = {},
    sltData = {},
    filterFold,
    userBasicInfo = {},
    roleTxt = '',
    searchData = {},
  } = dataProps;
  const {
    setFilterData = () => {},
    queryTableData = () => {},
    setIsSpinning = () => {},
    setFilterFold = () => {},
    setSearchData = () => {},
  } = funcProps;
  const {
    xc_deal_flag = [], //处理状态
    xc_sys = [], //系统类型
    xc_cont_type = [], //合同类型
  } = dictionary;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //行选择
  const location = useLocation();
  const [transferData, setTransferData] = useState({
    visible: false,
    curRowId: -1,
  }); //转办人
  const history = useHistory();

  //跳转员工详情
  const getStaffNode = (name, id, routes) => {
    let nameArr = name?.split(',') || [];
    let idArr = id?.split(',') || [];
    return (
      <Tooltip title={nameArr.join('、')} placement="topLeft">
        {nameArr.map((x, i) => (
          <Link
            style={{ color: '#3361ff', display: 'inline' }}
            key={idArr[i]}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: idArr[i],
                }),
              )}`,
              state: {
                routes,
              },
            }}
            className="table-link-strong"
          >
            {x + (i === nameArr.length - 1 || nameArr.length === 1 ? '' : '、')}
          </Link>
        ))}
      </Tooltip>
    );
  };

  //列配置
  const columns = [
    {
      title: '合同编号',
      dataIndex: 'HTBH',
      key: 'HTBH',
      // width: 150,
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '合同名称',
      dataIndex: 'HTMC',
      key: 'HTMC',
      width: 160,
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '关联项目',
      dataIndex: 'XMMC',
      key: 'XMMC',
      ellipsis: true,
      width: 160,
      render: (txt, row) => (
        <div title={txt}>
          <Tooltip title={txt} placement="topLeft">
            <Link
              className="table-link-strong"
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: row.GLXM,
                  }),
                )}`,
                state: {
                  routes: [{ name: '合同列表', pathname: location.pathname }],
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
      title: '合同乙方',
      dataIndex: 'HTYF',
      key: 'HTYF',
      ellipsis: true,
      width: 150,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '总金额(元)',
      dataIndex: 'ZJE',
      align: 'right',
      key: 'ZJE',
      ellipsis: true,
      width: 110,
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: txt => (txt ? <span>{getAmountFormat(txt)}</span> : 0),
    },
    {
      title: '签订日期',
      dataIndex: 'QDRQ',
      key: 'QDRQ',
      width: 110,
      ellipsis: true,
      render: txt => (txt ? moment(String(txt)).format('YYYY-MM-DD') : ''),
    },
    {
      title: '系统类型',
      dataIndex: 'XTLX',
      key: 'XTLX',
      width: 110,
      ellipsis: true,
      render: txt => getNote(xc_sys, txt),
    },
    {
      title: '合同类型',
      dataIndex: 'HTLX',
      key: 'HTLX',
      width: 80,
      ellipsis: true,
      render: txt => getNote(xc_cont_type, txt),
    },
    {
      title: '是否信创',
      dataIndex: 'SFXC',
      key: 'SFXC',
      width: 80,
      ellipsis: true,
      render: txt =>
        getNote(
          [
            { note: '是', ibm: '1' },
            { note: '否', ibm: '2' },
          ],
          txt,
        ),
    },
    {
      title: '经办人',
      dataIndex: 'JBR',
      width: 80,
      key: 'JBR',
      ellipsis: true,
      render: (txt, row) => {
        return txt ? (
          getStaffNode(txt, row.JBRID, [{ name: '合同列表', pathname: location.pathname }])
        ) : (
          <Tooltip title={'未匹配到人员'} placement="topLeft">
            <span style={{ cursor: 'default' }}>{'未匹配到人员'}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '处理状态',
      dataIndex: 'CLZT',
      key: 'CLZT',
      width: 80,
      ellipsis: true,
      fixed: 'right',
      render: txt => getNote(xc_deal_flag, txt),
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: 120,
      align: 'center',
      key: 'OPRT',
      ellipsis: true,
      fixed: 'right',
      render: (txt, row) =>
        String(row.JBRID) === String(userBasicInfo.id) || roleTxt.includes('信创管理员') ? (
          //登录人为经办人时可编辑转办
          //管理员可转办
          //不是经办人但是管理员，且处理状态为已处理时可编辑
          <div className="opr-column">
            {(String(row.JBRID) === String(userBasicInfo.id) ||
              (roleTxt.includes('信创管理员') && String(row.CLZT) === '2')) && (
              <span onClick={() => handleEdit(row)}>编辑</span>
            )}
            <span onClick={() => setTransferData({ visible: true, curRowId: row.HTID })}>转办</span>
          </div>
        ) : (
          <div className="opr-column">
            <span onClick={() => handleView(row)}>查看</span>
          </div>
        ),
    },
  ];

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //获取字典note
  const getNote = (data = [], ibm) =>
    ibm !== undefined ? data.find(x => x.ibm === String(ibm))?.note || '' : '';

  //转办浮窗
  const transferContent = ID => {
    const onChange = (v, nodeArr) => {
      setTransferData(p => ({ ...p, value: v, name: nodeArr, turnRed: v === undefined }));
    };
    const onCancel = () => {
      setTransferData(p => ({ ...p, value: undefined, turnRed: false, visible: false }));
    };
    const onConfirm = () => {
      if (transferData.value !== undefined) {
        Modal.confirm({
          title: '提示：',
          content: `确定转办给${transferData.name.join('、')}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            TransferXCContract({
              newTrustee: Number(transferData.value),
              contractId: ID,
            })
              .then(res => {
                if (res?.success) {
                  message.success('操作成功', 1);
                  setIsSpinning(false);
                  onCancel();
                }
              })
              .catch(e => {
                console.error('🚀转办', e);
                message.error('操作失败', 1);
                setIsSpinning(false);
              });
          },
        });
      } else {
        setTransferData(p => ({ ...p, turnRed: true }));
      }
    };
    return (
      <div className="share-box">
        <Form.Item
          className="selector"
          label="转办人"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          required
          help={transferData.turnRed ? '转办人不能为空' : null}
          validateStatus={transferData.turnRed ? 'error' : 'success'}
        >
          <TreeSelect
            style={{ width: '100%' }}
            treeDefaultExpandedKeys={['357', '11168']}
            showSearch
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            dropdownClassName="newproject-treeselect"
            allowClear
            value={transferData.value}
            treeNodeFilterProp="title"
            showCheckedStrategy="SHOW_CHILD"
            onChange={onChange}
            treeData={sltData.jbr}
          />
        </Form.Item>
        <div className="footer-btn">
          <Button className="btn-cancel" onClick={onCancel}>
            取消
          </Button>
          <Button className="btn-submit" type="primary" onClick={onConfirm}>
            确定
          </Button>
        </div>
      </div>
    );
  };

  //编辑
  const handleEdit = (row = {}) => {
    if (row.HTID !== undefined) {
      history.push({
        pathname:
          '/pms/manage/InnovationContractEdit/' +
          EncryptBase64(
            JSON.stringify({
              id: row.HTID,
              routes: [{ name: '合同列表', pathname: location.pathname }],
              timeStamp: new Date().getTime(),
            }),
          ),
      });
    }
  };

  //查看
  const handleView = (row = {}) => {
    if (row.HTID !== undefined) {
      history.push({
        pathname:
          '/pms/manage/InnovationContractView/' +
          EncryptBase64(
            JSON.stringify({
              id: row.HTID,
              routes: [{ name: '合同列表', pathname: location.pathname }],
              timeStamp: new Date().getTime(),
            }),
          ),
      });
    }
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current = 1, pageSize = 20 } = pagination;
    if (sorter.order !== undefined) {
      queryTableData({
        current,
        pageSize,
        sort: sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
        ...searchData,
      });
    } else {
      queryTableData({
        current,
        pageSize,
        ...searchData,
      });
    }
    return;
  };

  return (
    <>
      <div className="table-box">
        <TransferModal
          visible={transferData.visible}
          setVisible={v => setTransferData(p => ({ ...p, visible: v }))}
          treeData={sltData.jbr}
          contractId={transferData.curRowId}
          refresh={() =>
            queryTableData({
              ...searchData,
              current: tableData.current,
              pageSize: tableData.pageSize,
              sort: tableData.sort,
            })
          }
        />
        <TopConsole
          dataProps={{ filterData, sltData, dictionary, filterFold }}
          funcProps={{ setFilterData, queryTableData, setFilterFold, setSearchData }}
        />
        <div className="project-info-table-box">
          <Table
            columns={columns}
            rowKey={'HTID'}
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
            // bordered
            scroll={{
              x: 1410,
              y:
                window.innerWidth < 1440
                  ? filterFold
                    ? 'calc(100vh - 335px)'
                    : 'calc(100vh - 433px)'
                  : filterFold
                  ? 'calc(100vh - 318px)'
                  : 'calc(100vh - 416px)',
            }}
          />
        </div>
      </div>
    </>
  );
};
export default TableBox;
