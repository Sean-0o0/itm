import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip } from 'antd';
import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

export default function InfoTable(props) {
  const [sortedInfo, setSortedInfo] = useState({}); //金额排序
  const [modalVisible, setModalVisible] = useState(false); //项目详情弹窗显示
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const { tableData, tableLoading, getTableData, projectManager = -1 } = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)

  //lb弹窗配置
  const src_fileAdd = `/#/single/pms/SaveProject/${EncryptBase64(
    JSON.stringify({ xmid: -1, type: true }),
  )}`;
  const fileAddModalProps = {
    isAllWindow: 1,
    title: '新建项目',
    width: '1000px',
    height: '780px',
    style: {top: '10px'},
    visible: true,
    footer: null,
  };

  useEffect(() => {
    window.addEventListener('message', handleIframePostMessage);
    return () => {
      window.removeEventListener('message', handleIframePostMessage);
    };
  }, []);

  //监听新建项目弹窗状态-按钮
  const handleIframePostMessage = event => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      closeFileAddModal();
      getPrjInfo(userRole); //刷新数据
      // message.success('保存成功');
    }
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
  const handleTableChange = obj => {
    // console.log('handleTableChange', obj);
    const { current = 1, pageSize = 10 } = obj;
    getTableData({ current, pageSize, projectManager });
    return;
  };

  const openVisible = () => {
    setFileAddVisible(true);
  };
  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };

  //列配置
  const columns = [
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
                className="prj-info-table-link-strong"
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
              className="prj-info-table-link-strong"
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
      // width: 90,
      width: '7%',
      key: 'projectType',
      ellipsis: true,
    },
    {
      title: '关联预算',
      dataIndex: 'budgetProject',
      // width: 160,
      width: '18%',
      key: 'budgetProject',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目金额(元)',
      dataIndex: 'projectBudget',
      // width: 120,
      width: '12%',
      align: 'right',
      key: 'projectBudget',
      ellipsis: true,
      sorter: (a, b) => Number(a.projectBudget) - Number(b.projectBudget),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '应用部门',
      dataIndex: 'orgs',
      // width: 150,
      width: '15%',
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
      // width: 205,
      width: '18%',
      key: 'projectLabel',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <div className="prj-tags">
            {getTagData(text, row.projectLabelId).length !== 0 && (
              <>
                {getTagData(text, row.projectLabelId)
                  ?.slice(0, 2)
                  .map(x => (
                    <div key={x.id} className="tag-item">
                      <Link
                        style={{ color: '#3361ff' }}
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
                        className="prj-info-table-link-strong"
                      >
                        {x.name}
                      </Link>
                    </div>
                  ))}
                {getTagData(text, row.projectLabelId)?.length > 2 && (
                  <Popover
                    overlayClassName="tag-more-popover"
                    content={
                      <div className="tag-more">
                        {getTagData(text, row.projectLabelId)
                          ?.slice(2)
                          .map(x => (
                            <div key={x.id} className="tag-item">
                              <Link
                                style={{ color: '#3361ff' }}
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
                                className="prj-info-table-link-strong"
                              >
                                {x.name}
                              </Link>
                            </div>
                          ))}
                      </div>
                    }
                    title={null}
                  >
                    <div className="tag-item">...</div>
                  </Popover>
                )}
              </>
            )}
          </div>
        );
      },
    },
    {
      title: '项目状态',
      dataIndex: 'projectStatus',
      key: 'projectStatus',
      // width: 100,
      ellipsis: true,
    },
  ];

  return (
    <div className="info-table">
      {fileAddVisible && (
        <BridgeModel
          isSpining="customize"
          modalProps={fileAddModalProps}
          onSucess={() => {
            closeFileAddModal();
            message.success('保存成功', 1);
          }}
          onCancel={closeFileAddModal}
          src={src_fileAdd}
        />
      )}
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
          // scroll={{ y: 500 }}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '40'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: total => `共 ${tableData.length} 条数据`,
          }}
          // bordered
        />
      </div>
    </div>
  );
}
