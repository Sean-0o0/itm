import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Modal } from 'antd';
import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import PrjTypeModal from '../../HomePage/ShortcutCard/PrjTypeModal';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';

export default function InfoTable(props) {
  const [modalVisible, setModalVisible] = useState(false); //项目详情弹窗显示
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [visible, setVisible] = useState(false); //类型弹窗显隐
  const {
    tableData,
    tableLoading,
    getTableData,
    // projectManager = -1,
    queryType = 'ALL',
    total,
    handleSearch,
    handleReset,
    curPage,
    curPageSize,
    sortInfo = {},
    setSortInfo,
  } = props; //表格数据
  const location = useLocation();

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //获取项目标签数据
  const getTagData = (tag, idtxt) => {
    // console.log("🚀 ~ file: index.js:52 ~ getTagData ~ tag, idtxt:", tag, idtxt)
    let arr = [];
    let arr2 = [];
    if (
      tag !== '' &&
      tag !== null &&
      tag !== undefined &&
      idtxt !== '' &&
      idtxt !== null &&
      idtxt !== undefined
    ) {
      if (tag.includes(',')) {
        arr = tag.split(',');
        arr2 = idtxt.split(',');
      } else {
        arr.push(tag);
        arr2.push(idtxt);
      }
    }
    let arr3 = arr.map((x, i) => {
      return {
        name: x,
        id: arr2[i],
      };
    });
    // console.log('🚀 ~ file: index.js ~ line 73 ~ arr3 ~ arr3 ', arr3, arr, arr2);
    return arr3;
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log('    yaer,    yaer,', year)
    const { current = 1, pageSize = 20 } = pagination;
    setSortInfo(sorter);
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        handleSearch({
          current,
          pageSize,
          queryType,
          sort: 'YSJE ASC,ID DESC',
        });
      } else {
        handleSearch({
          current,
          pageSize,
          queryType,
          sort: 'YSJE DESC,ID DESC',
        });
      }
    } else {
      handleSearch({ current, pageSize, queryType });
    }
    return;
  };

  const openVisible = () => {
    setVisible(true);
  };
  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };
  //新建项目成功后，刷新数据 重置查询条件
  const handleFileAddSuccess = () => {
    closeFileAddModal();
    handleReset();
    getTableData({}); //刷新数据
  };

  const getTagClassName = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return 'yellow-tag';
    else if (tagTxt.includes('集合')) return 'purple-tag';
    else if (tagTxt.includes('专班')) return 'red-tag';
    else return '';
  };
  const getTagTxtColor = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return '#F1A740';
    else if (tagTxt.includes('集合')) return '#F0978C';
    else if (tagTxt.includes('专班')) return '#757CF7';
    else return '#3361ff';
  };

  //列配置
  const columns = [
    {
      title: '年份',
      dataIndex: 'year',
      width: '5%',
      key: 'year',
      ellipsis: true,
      render: text => <span style={{ cursor: 'default' }}>{text}</span>,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      // width: 200,
      width: '15%',
      key: 'projectName',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.projectStatus !== '草稿')
          return (
            <Tooltip title={text} placement="topLeft">
              <Link
                style={{ color: '#3361ff' }}
                to={{
                  pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                    JSON.stringify({
                      xmid: row.projectId,
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
          );
        return (
          <Tooltip title={text} placement="topLeft">
            <span style={{ cursor: 'default' }}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'projectManager',
      // width: 90,
      width: '7%',
      key: 'projectManager',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.projectStatus !== '草稿')
          return (
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/staffDetail/${EncryptBase64(
                  JSON.stringify({
                    ryid: row.projectManagerId,
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
          );
        return <span>{text}</span>;
      },
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
      width: '11%',
      key: 'projectType',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '关联预算',
      dataIndex: 'budgetProject',
      // width: '15%',
      key: 'budgetProject',
      ellipsis: true,
      render: (text, record) => (
        <Tooltip title={text} placement="topLeft">
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/BudgetDetail/${EncryptBase64(
                JSON.stringify({
                  fromKey: record.budgetProjectType,
                  budgetID: record.budgetProjectId,
                  routes: [{ name: '项目列表', pathname: location.pathname }],
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
          {/* <span style={{ cursor: 'default' }}>{text}</span> */}
        </Tooltip>
      ),
    },
    {
      title: '项目金额(元)',
      dataIndex: 'projectBudget',
      width: '12%',
      align: 'right',
      key: 'projectBudget',
      ellipsis: true,
      sortOrder: sortInfo.columnKey === 'projectBudget' ? sortInfo.order : undefined,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => (
        <span style={{ marginRight: 20 }}>{text === '-1' ? '***' : getAmountFormat(text)}</span>
      ),
    },
    {
      title: '应用部门',
      dataIndex: 'orgs',
      width: '14%',
      key: 'orgs',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目标签',
      dataIndex: 'projectLabel',
      width: '18%',
      key: 'projectLabel',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <div className="prj-tags">
            {getTagData(text, row.projectLabelId).length > 0 && (
              <>
                {getTagData(text, row.projectLabelId)
                  ?.slice(0, 1)
                  .map(x => (
                    <div key={x.id} className={'tag-item ' + getTagClassName(x.name)}>
                      <Link
                        style={{ color: getTagTxtColor(x.name) }}
                        to={{
                          pathname: `/pms/manage/labelDetail/${EncryptBase64(
                            JSON.stringify({
                              bqid: x.id,
                            }),
                          )}`,
                          state: {
                            routes: [{ name: '项目列表', pathname: location.pathname }],
                          },
                        }}
                        // className="table-link-strong"
                      >
                        {x.name}
                      </Link>
                    </div>
                  ))}
                {getTagData(text, row.projectLabelId)?.length > 1 && (
                  <Popover
                    overlayClassName="tag-more-popover"
                    content={
                      <div className="tag-more">
                        {getTagData(text, row.projectLabelId)
                          ?.slice(1)
                          .map(x => (
                            <div key={x.id} className={'tag-item ' + getTagClassName(x.name)}>
                              <Link
                                style={{ color: getTagTxtColor(x.name) }}
                                to={{
                                  pathname: `/pms/manage/labelDetail/${EncryptBase64(
                                    JSON.stringify({
                                      bqid: x.id,
                                    }),
                                  )}`,
                                  state: {
                                    routes: [{ name: '项目列表', pathname: location.pathname }],
                                  },
                                }}
                                // className="table-link-strong"
                              >
                                {x.name}
                              </Link>
                            </div>
                          ))}
                      </div>
                    }
                    title={null}
                  >
                    <div className="tag-item">
                      {getTagData(text, row.projectLabelId)?.length - 1}+
                    </div>
                  </Popover>
                )}
              </>
            )}
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'projectStatus',
      key: 'projectStatus',
      width: '7%',
      ellipsis: true,
    },
  ];

  return (
    <div className="info-table">
      {fileAddVisible && (
        <Modal
          wrapClassName="editMessage-modify xbjgEditStyle"
          width={'1000px'}
          // height={'700px'}
          maskClosable={false}
          zIndex={100}
          maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
          style={{ top: '10px' }}
          visible={fileAddVisible}
          okText="保存"
          bodyStyle={{
            padding: 0,
          }}
          onCancel={closeFileAddModal}
          title={
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3361FF',
                color: 'white',
                borderRadius: '8px 8px 0 0',
                fontSize: '16px',
              }}
            >
              <strong>新建项目</strong>
            </div>
          }
          footer={null}
        >
          <NewProjectModelV2
            closeModel={closeFileAddModal}
            successCallBack={handleFileAddSuccess}
            xmid={src_fileAdd.xmid}
            projectType={src_fileAdd.projectType}
          />
        </Modal>
      )}
      <PrjTypeModal
        visible={visible}
        setVisible={setVisible}
        setFileAddVisible={setFileAddVisible}
        setSrc_fileAdd={setSrc_fileAdd}
        refresh={() => {
          handleReset();
          getTableData({}); //刷新数据
        }}
      />
      <InfoDetail modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <div className="btn-add-prj-box">
        <Button type="primary" className="btn-add-prj" onClick={openVisible}>
          新建项目
        </Button>
      </div>
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'projectId'}
          dataSource={tableData}
          onChange={handleTableChange}
          pagination={{
            current: curPage,
            pageSize: curPageSize,
            defaultCurrent: 1,
            pageSizeOptions: ['20', '40', '50', '100'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${total} 条数据`,
            total: total,
          }}
          // bordered
        />
      </div>
    </div>
  );
}
