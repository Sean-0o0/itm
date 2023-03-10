import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message } from 'antd';
import InfoDetail from '../infoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import { EncryptBase64 } from '../../../Common/Encrypt';

export default function InfoTable(props) {
  const [sortedInfo, setSortedInfo] = useState({}); //金额排序
  const [modalVisible, setModalVisible] = useState(false); //项目详情弹窗显示
  const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示
  const { tableData, tableLoading } = props; //表格数据

  useEffect(() => {
    return () => {};
  }, []);

  //获取标签数据
  const getTagData = tag => {
    let arr = [];
    if (tag !== '' && tag !== null && tag !== undefined) {
      if (tag.includes(',')) {
        arr = tag.split(',');
      } else {
        arr.push(tag);
      }
    }
    return arr;
  };
  const handleModalOpen = v => {
    setModalVisible(true);
  };
  const handleTableChange = (v, c) => {
    console.log('handleTableChange', v, c);
    return;
  };
  const fileAddModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    title: '新建项目',
    width: '70%',
    height: '120rem',
    style: { top: '2rem' },
    visible: true,
    footer: null,
  };
  const openVisible = () => {
    setFileAddVisible(true);
  };
  const closeFileAddModal = () => {
    setFileAddVisible(false);
  };
  const src_fileAdd = `/#/single/pms/SaveProject/${EncryptBase64(
    JSON.stringify({ xmid: -1, type: true }),
  )}`;

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      // width: 200,
      width: '15%',
      key: 'projectName',
      ellipsis: true,
      render: (text, row, index) => {
        // if (row.projectStatus !== '草稿')
        //   return (
        //     <a
        //       style={{ color: '#3361ff' }}
        //       onClick={() => {
        //         // handleModalOpen();
                // message.info('功能开发中，暂时无法使用', 1);
        //       }}
        //     >
        //       {text}
        //     </a>
        //   );
        return <span>{text}</span>;
      },
    },
    {
      title: '项目经理',
      dataIndex: 'projectManager',
      // width: 90,
      width: '7%',
      key: 'projectManager',
      ellipsis: true,
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
            {getTagData(text).length !== 0 && (
              <>
                {getTagData(text)
                  ?.slice(0, 2)
                  .map((x, i) => (
                    <div key={i} className="tag-item">
                      {x}
                    </div>
                  ))}
                {getTagData(text)?.length > 2 && (
                  <Popover
                    overlayClassName="tag-more-popover"
                    content={
                      <div className="tag-more">
                        {getTagData(text)
                          ?.slice(2)
                          .map((x, i) => (
                            <div key={i} className="tag-item">
                              {x}
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
            hideOnSinglePage: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条数据`,
          }}
          // bordered
        />
      </div>
    </div>
  );
}
