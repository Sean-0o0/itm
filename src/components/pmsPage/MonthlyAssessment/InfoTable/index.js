import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip, Popconfirm} from 'antd';
// import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import InfoOprtModal from '../../SupplierDetail/TopConsole/InfoOprtModal/index.js';
import moment from "moment";
import {CreateOperateHyperLink} from "../../../../services/pmsServices";

export default function InfoTable(props) {
  const [operateVisible, setOperateVisible] = useState(false);
  const [operateUrl, setOperateUrl] = useState('');
  const [title, setTitle] = useState('');
  const {
    tableData,
    getTableData,
    tableLoading,
    total = 0,
    handleSearch,
    curPage,
    curPageSize,
  } = props; //表格数据
  const location = useLocation();

  useEffect(() => {
    return () => {
    };
  }, [tableData]);


  //表格操作后更新数据
  const handleTableChange = (pagination) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const {current = 1, pageSize = 20} = pagination;
    handleSearch(current, pageSize);
  };

  const getOperateUrl = (id, operateName) => {
    if (operateName === "V_YDKH_ADD") {
      setTitle("新增月度考核信息")
    }
    if (operateName === "V_YDKH_MOD") {
      setTitle("修改月度考核信息")
    }
    if (operateName === "V_YDKH_DELETE") {
      setTitle("删除月度考核信息")
    }
    let params = {
      attribute: 0,
      authFlag: 0,
      objectName: 'V_YDKH',
      operateName: operateName,
      parameter: [
        {
          name: 'YDKH',
          value: id,
        },
      ],
      userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
    };
    if (id === '') {
      params = {
        attribute: 0,
        authFlag: 0,
        objectName: 'V_YDKH',
        operateName: operateName,
        parameter: [],
        userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
      };
    }
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const {code, message, url} = ret;
        if (code === 1) {
          setOperateUrl(url);
          // if (operateName !== "V_YDKH_DELETE") {
            setOperateVisible(true);
          // }

        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //列配置
  const columns = [
    {
      title: '月份',
      dataIndex: 'YF',
      width: '10%',
      // align: 'right',
      key: 'YF',
      ellipsis: true,
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{moment(text, "YYYY-MM").format("YYYY-MM") || '-'}</span>,
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      width: '20%',
      key: 'XMMC',
      ellipsis: true,
      render: (text, row, index) => {
        const {XMID = ''} = row;
        return <div title={text}>
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{color: '#3361ff'}}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: XMID,
                  }),
                )}`,
                state: {
                  routes: [{name: '月度考核', pathname: location.pathname}],
                },
              }}
              className="table-link-strong"
            >
              {text || '-'}
            </Link>
          </Tooltip>
        </div>
      }
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '12%',
      key: 'RYMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{color: '#3361ff'}}
              to={{
                pathname: `/pms/manage/MemberDetail/${EncryptBase64(
                  JSON.stringify({ryid: row.RYID}),
                )}`,
                state: {
                  routes: [{name: '月度考核', pathname: location.pathname}],
                },
              }}
              className="table-link-strong"
            >
              {text || '-'}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '评分',
      dataIndex: 'PF',
      width: '6%',
      key: 'PF',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text || '-'}</span>,
    },
    {
      title: '综合评价',
      dataIndex: 'ZHPJ',
      width: '12%',
      key: 'ZHPJ',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text || '-'}</span>,
    },
    {
      title: '附件',
      dataIndex: 'FJ',
      width: '18%',
      key: 'FJ',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: (text, row) => <span style={{marginRight: 20}}>
        <a style={{color: '#3361FF'}}
           href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=FJ&PopupWin=false&Table=TWBRY_YDKH&operate=Download&Type=View&ID=${row.FJID}&fileid=0`}>
        {text}</a></span>,
    },
    {
      title: '日期',
      dataIndex: 'RQ',
      width: '12%',
      key: 'RQ',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{moment(text, "YYYY-MM-DD").format("YYYY-MM-DD") || '-'}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: (text, record) => (
        <span>
        <a onClick={() => getOperateUrl(record.FJID, "V_YDKH_MOD")}>修改</a>
          {/*  <Popconfirm*/}
          {/*    title="确定删除？"*/}
          {/*    onConfirm={() => {*/}
          {/*      window.location.href = operateUrl*/}
          {/*    }}*/}
          {/*    onCancel={() => {*/}

          {/*    }}*/}
          {/*    okText="确认"*/}
          {/*    cancelText="取消"*/}
          {/*  >*/}
          {/*<a onClick={() => getOperateUrl(record.FJID, "V_YDKH_DELETE")}>&nbsp;&nbsp;删除</a>*/}
          {/*  </Popconfirm>*/}
          <a onClick={() => getOperateUrl(record.FJID, "V_YDKH_DELETE")}>&nbsp;&nbsp;删除</a>
      </span>
      ),
    },
  ];

  const operateModalProps = {
    isAllWindow: 1,
    // defaultFullScreen: true,
    width: '860px',
    height: '420px',
    title,
    style: {top: '40px'},
    visible: operateVisible,
    footer: null,
  };

  return (
    <div className="info-table">
      {
        operateVisible &&
        <BridgeModel
          modalProps={operateModalProps}
          onSucess={() => {
            message.info("操作成功！")
            setOperateVisible(false)
            handleSearch(curPage, curPageSize);
          }}
          onCancel={() => {
            setOperateVisible(false)
            handleSearch(curPage, curPageSize);
          }}
          src={operateUrl}
        />
      }
      <div className="btn-add-prj-box">
        <Button type="primary" className="btn-add-prj" onClick={() => getOperateUrl('', "V_YDKH_ADD")}>
          新增
        </Button>
      </div>
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'RYID'}
          dataSource={tableData}
          onChange={handleTableChange}
          // scroll={{ y: 500 }}
          pagination={{
            current: curPage,
            pageSize: curPageSize,
            defaultCurrent: 1,
            defaultPageSize: 5,
            // pageSizeOptions: ['20', '40', '50', '100'],
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
