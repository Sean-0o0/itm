import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip} from 'antd';
import {EncryptBase64} from '../../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';

export default function InfoTable(props) {
  const [sortedInfo, setSortedInfo] = useState({}); //金额排序
  const [modalVisible, setModalVisible] = useState(false); //项目详情弹窗显示
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const {tableData, tableLoading, getTableData, projectManager = -1, total} = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)

  //lb弹窗配置
  const src_fileAdd = `/#/single/pms/SaveProject/${EncryptBase64(
    JSON.stringify({xmid: -1, type: true}),
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
    const {current = 1, pageSize = 10} = obj;
    getTableData({current, pageSize, projectManager});
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
      title: '需求',
      dataIndex: 'projectName',
      // width: 200,
      width: '20%',
      key: 'projectName',
      // ellipsis: true,
    },
    {
      title: '发起人',
      dataIndex: 'projectName',
      // width: 200,
      width: '10%',
      key: 'projectName',
      // ellipsis: true,
    },
    {
      title: '发起日期',
      dataIndex: 'projectName',
      // width: 200,
      width: '10%',
      key: 'projectName',
      // ellipsis: true,
    },
    {
      title: '请示报告内容',
      dataIndex: 'projectName',
      // width: 200,
      width: '10%',
      key: 'projectName',
      // ellipsis: true,
    },
    {
      title: '关联系统设备采购合同流程',
      dataIndex: 'projectLabel',
      // width: 205,
      width: '30%',
      key: 'projectLabel',
      // ellipsis: true,
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
                        style={{color: '#3361ff'}}
                        to={{
                          pathname: `/pms/manage/labelDetail/${EncryptBase64(
                            JSON.stringify({
                              bqid: x.id,
                            }),
                          )}`,
                          state: {
                            routes: [{name: '项目列表', pathname: location.pathname}],
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
                                style={{color: '#3361ff'}}
                                to={{
                                  pathname: `/pms/manage/labelDetail/${EncryptBase64(
                                    JSON.stringify({
                                      bqid: x.id,
                                    }),
                                  )}`,
                                  state: {
                                    routes: [{name: '项目列表', pathname: location.pathname}],
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
      title: '状态',
      dataIndex: 'projectStatus',
      key: 'projectStatus',
      width: '10%',
      // width: 100,
      // ellipsis: true,
    },
  ];

  return (
    <div className="info-table">
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
            showTotal: t => `共 ${total} 条数据`,
            total: total,
          }}
          // bordered
        />
      </div>
    </div>
  );
}
