import React, { useEffect, useCallback, useState } from 'react';
import { Button, Dropdown, Menu, message, Popover, Table, Tooltip } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { CreateOperateHyperLink } from '../../../../services/pmsServices';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

export default function TableBox(props) {
  const {
    tableData = {},
    filterData = {},
    getTableData,
    userBasicInfo = {},
    sortInfo = {},
    setSortInfo,
    initiateXmid = -1,
    setIsModalShow
  } = props;
  const [lbModal, setLbModal] = useState({
    visibleState: 'xmlxsq',
    zbh: false,
    xwh: false,
    xmlxsq: false,
    lcxq: false,
    url: '',
    title: '',
  }); //lb弹窗

  const location = useLocation();

  useEffect(() => {
    return () => { };
  }, [JSON.stringify(tableData.data)]);

  //表配置
  const columns = [
    {
      title: '年份',
      dataIndex: 'BGRQ',
      width: '7%',
      key: 'BGRQ',
      ellipsis: true,
      render: txt => (txt ? moment(String(txt)).year() : ''),
    },
    {
      title: '流程类型',
      dataIndex: 'LCLX',
      width: '10%',
      key: 'LCLX',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '流程标题',
      dataIndex: 'BT',
      width: '30%',
      key: 'BT',
      ellipsis: true,
      render: (txt, row) => (
        <Tooltip title={txt} placement="topLeft">
          <a
            className="table-link-strong"
            style={{ color: '#3361ff' }}
            onClick={() => openLCXQModal(row)}
          >
            {txt}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '拟稿人',
      dataIndex: 'NGRMC',
      width: '8%',
      key: 'NGRMC',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.NGR,
              }),
            )}`,
            state: {
              routes: [{ name: '迭代统一流程', pathname: location.pathname }],
            },
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '项目金额(元)',
      dataIndex: 'XMYSJE',
      width: '12%',
      key: 'XMYSJE',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'XMYSJE' ? sortInfo.order : undefined,
    },
    {
      title: '请示报告内容',
      dataIndex: 'QSBGNR',
      key: 'QSBGNR',
      ellipsis: true,
      render: txt =>
        txt !== undefined ? (
          <Popover
            content={popoverContent(txt)}
            title={null}
            trigger="hover"
            overlayClassName="ite-process-initiate-box-table-popover-qsbgnr"
          >
            <a style={{ color: '#3361ff', cursor: 'default' }}>查看详情</a>
          </Popover>
        ) : null,
    },
  ];

  //请示报告内容
  const popoverContent = txt => (
    <div className="content-box" dangerouslySetInnerHTML={{ __html: txt }}></div>
  );

  //表格操作后更新数据
  const handleTableChange = (pagination = {}, _, sorter = {}) => {
    const { current = 1, pageSize = 20 } = pagination;
    setSortInfo(sorter);
    if (sorter.order !== undefined) {
      getTableData({
        current,
        pageSize,
        sort: sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
        ...filterData,
        year: filterData.year?.year(),
      });
    } else {
      getTableData({
        current,
        pageSize,
        ...filterData,
        year: filterData.year?.year(),
      });
    }
    return;
  };

  //发起流程
  const dropDownMenu = (
    <Menu>
      <Menu.Item onClick={() => openLbModal('信委会议案流程', 'xwh')}>信委会议案流程发起</Menu.Item>
      <Menu.Item onClick={() => openLbModal('总办会流程', 'zbh')}>总办会流程发起</Menu.Item>
      {/* <Menu.Item onClick={() => openLbModal('项目立项申请流程', 'xmlxsq')}>
        项目立项申请流程发起
      </Menu.Item> */}
      <Menu.Item onClick={() => setIsModalShow({ projectApprovalApplicate: true })}>
        项目立项申请流程发起
      </Menu.Item>
    </Menu>
  );

  //流程发起弹窗配置
  const lbModalProps = visibleState => ({
    isAllWindow: 1,
    title: lbModal.title,
    width:
      lbModal.title === '信委会议案流程发起' || lbModal.title === '流程详情' ? '1000px' : '864px',
    height: '680px',
    style: { top: '10px' },
    visible: lbModal[visibleState],
    footer: null,
  });

  //开启弹窗
  const openLbModal = (title, visibleState) => {
    //Livebos弹窗参数
    const getParams = (objName, oprName, data) => {
      let Loginname = userBasicInfo.userid;
      return {
        attribute: 0,
        authFlag: 0,
        objectName: objName,
        operateName: oprName,
        parameter: data,
        userId: Loginname,
      };
    };

    //获取Livebos弹窗链接
    const getLink = (params, title, visibleState) => {
      CreateOperateHyperLink(params)
        .then((ret = {}) => {
          const { code, message, url } = ret;
          if (code === 1) {
            setLbModal(p => ({
              ...p,
              url,
              visibleState,
              title: title + '发起',
              [visibleState]: true,
            }));
          }
        })
        .catch(error => {
          message.error('livebos链接创建失败', 1);
          console.error(!error.success ? error.message : error.note);
        });
    };

    //initiateXmid开发1077，测试10329，生产10734
    //立项申请流程发起
    let params = getParams('TLC_LCFQ', 'TLC_LCFQ_LXSQLCFQ', [
      {
        name: 'GLXM',
        value: initiateXmid,
      },
    ]);
    if (title === '总办会流程') {
      params = getParams('TLC_LCFQ', 'TLC_LCFQ_HYYA', [
        {
          name: 'GLXM',
          value: initiateXmid,
        },
      ]);
    }
    if (title === '信委会议案流程') {
      params = getParams('LC_XWHYALC', 'LC_XWHYALC_TAFQ', [
        {
          name: 'XMMC',
          value: initiateXmid,
        },
      ]);
    }
    getLink(params, title, visibleState);
  };

  //打开lb流程详情弹窗
  const openLCXQModal = (row = {}) => {
    const obj = JSON.parse(row.URL || '{}');
    console.log('🚀 ~ openLCXQModal ~ obj:', obj);
    if (obj.INSTID !== undefined) {
      //信委会
      setLbModal(p => ({
        ...p,
        url: `/livebos/ShowWorkflow?wfid=${obj.INSTID}&stepId=3&PopupWin=true&HideCancelBtn=true`,
        lcxq: true,
        visibleState: 'lcxq',
        title: '流程详情',
      }));
    } else {
      window.open(obj.url);
    }
  };

  return (
    <div className="table-box">
      {/*流程发起/详情弹窗*/}
      {lbModal[lbModal.visibleState] && (
        <BridgeModel
          modalProps={lbModalProps(lbModal.visibleState)}
          onSucess={() => {
            getTableData({}, () => {
              setLbModal(p => ({ ...p, [lbModal.visibleState]: false }));
              message.success('发起成功', 1);
            });
          }}
          onCancel={() => setLbModal(p => ({ ...p, [lbModal.visibleState]: false }))}
          src={lbModal.url}
        />
      )}
      <div className="btn-row">
        <Dropdown
          overlay={dropDownMenu}
          overlayClassName="tc-btn-more-content-dropdown"
          trigger={['click']}
        >
          <Button className="antd-primary-btn-diy">发起流程</Button>
        </Dropdown>
      </div>
      <div className="table-wrapper">
        <Table
          // loading={tableData.loading}
          rowKey={'ID'}
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
        />
      </div>
    </div>
  );
}
