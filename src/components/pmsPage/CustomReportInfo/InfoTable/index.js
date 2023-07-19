import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Switch, Popconfirm } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import OprtModal from './NewModal/index';
import OprtEditModal from './EditModal/index';
// import OprtModal from './OprtModal';
import { ConfigureCustomReport, QueryCustomReportContent } from '../../../../services/pmsServices';
import EditCusRepTable from './OprtModal/EditCusRepTable';

export default function InfoTable(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    tableLoading,
    tableData = {
      data: [], //表格数据
      current, //当前页码
      pageSize, //每页条数
      total: 0, //数据总数
    },
    filterData = {},
    BGLX = [],
    ZDYBGMB = [],
    isAdministrator,
  } = dataProps;
  const { getBasicData, setTableLoading, setTableData, setFilterData } = funcProps;
  const [newRptVisible, setNewRptVisible] = useState(false); //新增报告显隐
  const [editRptVisible, setEditRptVisible] = useState(false); //编辑报告显隐
  const [switchLoading, setSwitchLoading] = useState(false); //禁用调接口加载状态
  const [bgmb, setBgmb] = useState([]); //编辑时查出来的报告模版
  const [bgdata, setBgdata] = useState([]); //编辑时查出来的报告数据
  const [bgInfo, setBgInfo] = useState({ ID: '', BGMC: '' }); //当前编辑的报告基本信息
  const [title, setTitle] = useState(''); //当前编辑的报告基本信息
  const location = useLocation();

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

  //填写状态
  const handleSwitch = (id, checked) => {
    setTableLoading(true);
    ConfigureCustomReport({
      // dataCount: 0,
      // fieldCount: 0,
      // fieldInfo: 'string',
      operateType: 'UPDATEZT',
      // presetData: 'string',
      reportId: Number(id),
      reportName: checked ? 'OPEN' : 'CLOSE',
      // reportType: 'string',
    })
      .then(res => {
        if (res?.success) {
          getBasicData(filterData.value);
          message.success('操作成功', 1);
        }
      })
      .catch(e => {
        console.error('🚀填写状态', e);
        message.error('操作失败', 1);
        setTableLoading(false);
      });
  };

  //删除
  const handleDelete = id => {
    setTableLoading(true);
    ConfigureCustomReport({
      operateType: 'DELETE',
      reportId: Number(id),
    })
      .then(res => {
        if (res?.success) {
          getBasicData();
          setFilterData(p => ({ ...p, value: undefined }));
          setTableData(p => ({
            ...p,
            current: 1,
            pageSize: 20,
          }));
          message.success('操作成功', 1);
        }
      })
      .catch(e => {
        console.error('🚀删除', e);
        message.error('操作失败', 1);
        setTableLoading(false);
      });
  };

  //列配置
  const columns = [
    {
      title: '报告名称',
      dataIndex: 'BGMC',
      width: '26%',
      key: 'BGMC',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/CustomReportDetail/${EncryptBase64(
                  JSON.stringify({
                    bgid: row.ID,
                    bgmc: txt,
                    txzt: row.ZT === '1',
                    routes: [{ name: '自定义报告', pathname: location.pathname }],
                  }),
                )}`,
              }}
              className="table-link-strong"
            >
              {txt}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'CJR',
      width: '8%',
      key: 'CJR',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/StaffDetail/${EncryptBase64(
                JSON.stringify({ ryid: row.CJRID }),
              )}`,
              state: {
                routes: [{ name: '自定义报告', pathname: location.pathname }],
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
      title: '最近更新时间',
      dataIndex: 'XGSJ',
      width: '14%',
      key: 'XGSJ',
      ellipsis: true,
      render: txt => (txt && moment(txt).format('YYYY-MM-DD HH:mm:ss')) || '',
    },
    {
      title: '创建日期',
      dataIndex: 'CJRQ',
      width: '10%',
      key: 'CJRQ',
      ellipsis: true,
      render: txt => (txt && moment(txt).format('YYYY-MM-DD')) || '',
    },
    {
      title: '填写状态',
      dataIndex: 'ZT',
      width: '10%',
      align: 'center',
      key: 'ZT',
      ellipsis: true,
      render: (txt, row) => (
        <div className="table-switch-desc">
          <Switch
            // loading={switchLoading}
            defaultChecked={txt === '1'}
            // checkedChildren="开启填写"
            // unCheckedChildren="关闭填写"
            onChange={checked => handleSwitch(row.ID, checked)}
            disabled={!isAdministrator}
          />
          {/* {txt === '1' ? <span>开启填写</span> : <span>关闭填写</span>} */}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: isAdministrator ? '10%' : 0,
      // width: '10%',
      align: 'center',
      key: 'OPRT',
      ellipsis: true,
      render: (txt, row) => (
        <Fragment>
          <a style={{ color: '#3361ff' }} onClick={() => handleEditCusRep(row)}>
            修改
          </a>
          <Popconfirm title={`确定删除吗?`} onConfirm={() => handleDelete(row.ID)}>
            <a style={{ color: '#3361ff', marginLeft: 6 }}>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const handleEditCusRep = row => {
    // console.log("idid",row.ID)
    setTitle('编辑报告');
    setBgInfo(row);
    queryCustomReportContent(row.ID)
      .then()
      .finally(r => {
        setEditRptVisible(true);
      });
  };

  //获取基础数据
  const queryCustomReportContent = async (id = undefined) => {
    QueryCustomReportContent({
      current: 1,
      pageSize: 20,
      paging: -1,
      queryType: 'NR',
      reportID: id,
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          //表格数据
          const nrxx = JSON.parse(res.nrxx);
          //表头数据
          const zdxx = JSON.parse(res.zdxx);
          // const mb = []
          // zdxx.map((item,index) =>{
          //   const num = Number(index) + 1
          //   mb.push({
          //     key: num,
          //     ID: num,
          //     ['ZDMC' + num]: item.ZDMC,
          //     ['ZDLX' + num]: item.ZDLX,
          //   })
          // })
          // console.log("zdxxzdxx",zdxx)
          setBgmb([...zdxx]);
          setBgdata([...nrxx]);
          // console.log('🚀 ~ QueryCustomReportContent ~ res', JSON.parse(res.nrxx));
        }
      })
      .catch(e => {
        console.error('🚀表格数据', e);
        message.error('表格数据获取失败', 1);
      });
  };

  return (
    <div className="info-table">
      <OprtModal
        title={title}
        getBasicData={getBasicData}
        setBgInfo={setBgInfo}
        bgInfo={bgInfo}
        bgmb={bgmb}
        bgdata={bgdata}
        ZDYBGMB={ZDYBGMB}
        basicInfo={tableData.data}
        visible={newRptVisible}
        setVisible={setNewRptVisible}
        BGLX={BGLX}
      />
      <OprtEditModal
        title={title}
        getBasicData={getBasicData}
        setBgInfo={setBgInfo}
        bgInfo={bgInfo}
        bgmb={bgmb}
        bgdata={bgdata}
        ZDYBGMB={ZDYBGMB}
        basicInfo={tableData.data}
        visible={editRptVisible}
        setVisible={setEditRptVisible}
        BGLX={BGLX}
      />
      {isAdministrator && (
        <div className="btn-add-prj-box">
          <Button
            type="primary"
            className="btn-add-prj"
            onClick={() => {
              setBgInfo({ ID: '' });
              setTitle('新增报告');
              setNewRptVisible(true);
            }}
          >
            新增
          </Button>
        </div>
      )}
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
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
  );
}
