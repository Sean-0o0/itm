import React, { useEffect, useState, useRef, Fragment, useLayoutEffect } from 'react';
import { Button, message, Pagination, Spin, Table, Tooltip } from 'antd';
import { CreateOperateHyperLink, QueryLeadApprovalFlow } from '../../../services/pmsServices';
import BridgeModel from '../../Common/BasicModal/BridgeModel';
import Bridge from 'livebos-bridge';
import { debounce } from 'lodash';

const { events } = Bridge.constants;

let LOGIN_USER_NAME = JSON.parse(sessionStorage.getItem('user')).loginName;

// 信委会议案上会审批
export default function XwhExamine(props) {
  const {} = props;
  const iframeRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [tableData, setTableData] = useState({
    current: 1,
    pageSize: 20,
    data: [],
    total: 0,
    selectedRowKeys: [],
    curLink: undefined,
    curRowKey: -1,
  });
  const [lbModal, setLbModal] = useState({
    visible: false,
    url: '',
  }); //审批通过弹窗
  const lbModalProps = {
    isAllWindow: 1,
    width: 700,
    height: 300,
    title: '审批通过',
    style: { top: 60 },
    visible: lbModal.visible,
    footer: null,
  };

  useEffect(() => {
    getTableData();
    return () => {};
  }, []);

  useLayoutEffect(() => {
    iframeRef.current.onload = () => {
      connect();
    };
    return () => {};
  }, []);

  const connect = () => {
    const bridge = new Bridge(iframeRef.current.contentWindow);
    bridge.onReady(() => {
      bridge.on(events.SESSION_TIME_OUT, () => {
        // window.location.href = '/#/login';
      });
      bridge.on(events.OPERATE_CALLBACK, data => {
        const {
          callback: { closeFlag, refreshPage },
          success,
        } = data;
        if (refreshPage === true || success === true) {
          getTableData();
        }
      });
    });
  };

  //获取信委会待领导审批流程数据
  const getTableData = debounce(() => {
    setIsSpinning(true);
    QueryLeadApprovalFlow({
      current: 1,
      pageSize: 10,
      paging: 1,
      queryType: 'XWH',
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.result) || [];
          // console.log('🚀 ~ QueryLeadApprovalFlow ~ res', JSON.parse(res.result));
          setTableData(p => ({
            ...p,
            data,
            pageSize: data.length || 0, //暂时不分页
            total: data.length || 0,
            curLink: data[0]?.URL,
            curRowKey: data[0]?.ID,
          }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀信委会待领导审批流程数据', e);
        message.error('信委会待领导审批流程数据获取失败', 1);
        setIsSpinning(false);
      });
  }, 500);

  const getLbLink = (selectedRowKeys = []) => {
    const params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_XWHYALC_LDSP',
      operateName: 'V_XWHYALC_LDSP_PLSPTG',
      parameter: [
        {
          name: 'XZLC',
          value: selectedRowKeys.join(';'),
        },
      ],
      userId: String(LOGIN_USER_NAME),
    };
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { url } = ret;
      setLbModal({ url, visible: true });
    });
  };

  //列配置
  const columns = [
    {
      title: '流程名称',
      dataIndex: 'BT',
      key: 'BT',
      width: '60%',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span className="tooltip-default">{txt}</span>
        </Tooltip>
      ),
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   key: 'operation',
    //   width: '40%',
    //   render: (txt, row) => (
    //     <span className="more-opr-link-btn" onClick={() => handleRowClick(row)}>
    //       更多操作
    //     </span>
    //   ),
    // },
  ];

  const rowSelection = {
    selectedRowKeys: tableData.selectedRowKeys,
    onChange: selectedRowKeys => setTableData(p => ({ ...p, selectedRowKeys })),
  };

  //已选择、清空
  const footerRow = () => {
    return (
      <div className="footer-row">
        <div className="slted-num">
          已选择<span>{tableData.selectedRowKeys?.length || 0}</span>项
        </div>
        {tableData.selectedRowKeys?.length > 0 && (
          <span className="clear-all" onClick={handleSltAllCancel}>
            清空
          </span>
        )}
      </div>
    );
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current = 1, pageSize = 20 } = pagination;
    setTableData(p => ({
      ...p,
      current,
      pageSize,
    }));
    return;
  };

  //点击行
  const handleRowClick = (row = {}) => {
    setTableData(p => ({ ...p, curLink: row.URL, curRowKey: row.ID }));
  };

  //全部选中
  const handleSltAll = () => {
    setTableData(p => ({ ...p, selectedRowKeys: p.data.map(x => x.ID) }));
  };

  //取消选中
  const handleSltAllCancel = () => {
    setTableData(p => ({ ...p, selectedRowKeys: [] }));
  };

  //审批通过
  const handleApproval = () => {
    if (tableData.selectedRowKeys?.length === 0) {
      message.warn('请选择要审批的流程！', 1);
    } else {
      getLbLink(tableData.selectedRowKeys);
    }
  };

  return (
    <div className="xwh-examine-box">
      {/*审批通过弹窗*/}
      {lbModal.visible && (
        <BridgeModel
          modalProps={lbModalProps}
          onSucess={() => {
            getTableData();
            message.success('操作成功', 1);
            setLbModal(p => ({
              ...p,
              visible: false,
            }));
          }}
          onCancel={() =>
            setLbModal(p => ({
              ...p,
              visible: false,
            }))
          }
          src={lbModal.url}
        />
      )}
      <Spin
        spinning={isSpinning}
        size="large"
        tip="加载中"
        wrapperClassName="xwh-examine-box-spinning"
      >
        <div className="left-box">
          {tableData.data?.length > 0 && (
            <Fragment>
              <Button type="primary" className="slt-all" onClick={handleSltAll}>
                全选
              </Button>
              <Button type="primary" className="batch-opr-btn" onClick={handleApproval}>
                审批通过
              </Button>
            </Fragment>
          )}
          <Table
            onRow={record => {
              return {
                onClick: event => {
                  handleRowClick(record);
                }, // 点击行
              };
            }}
            showHeader={false}
            rowSelection={rowSelection}
            columns={columns}
            rowKey={'ID'}
            rowClassName={row => (row.ID === tableData.curRowKey ? 'current-row-bg' : '')}
            dataSource={tableData.data}
            onChange={handleTableChange}
            // pagination={false}
            pagination={{
              current: tableData.current,
              pageSize: tableData.pageSize,
              defaultCurrent: 1,
              showSizeChanger: false,
              // hideOnSinglePage: true,
              showQuickJumper: false,
              showTotal: t => footerRow(),
              total: tableData.total,
            }}
            scroll={{ y: 'calc(100vh - 239px)' }}
            // bordered
          />
        </div>
        <div className="right-box">
          <iframe
            src={tableData.curLink}
            width="100%"
            height="100%"
            frameborder="0"
            allowfullscreen
            ref={iframeRef}
          ></iframe>
        </div>
      </Spin>
    </div>
  );
}
