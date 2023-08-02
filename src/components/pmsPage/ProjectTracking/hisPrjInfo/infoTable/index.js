import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router';
import {Pagination, Progress, Table, Tooltip} from "antd";
import moment from "moment";

export default function InfoTable(props) {
  const {
    total,
    tableData,
    tableLoading,
    params,
    callBackParams,
  } = props; //表格数据
  const location = useLocation();
  console.log('🚀 ~ tableData:', tableData);


  const columns = [
    {
      title: '项目周期',
      dataIndex: 'XMZQ',
      key: 'XMZQ',
      align: 'left',
      width: 88,
      render: text => (
        <span>第{text}周</span>
      ),
    },
    {
      title: '时间',
      dataIndex: 'SJ',
      key: 'SJ',
      align: 'left',
      width: 108,
      render: (text, row) => (
        <span>{moment(row.KSSJ, "YYYY-MM-DD").format("YYYY-MM-DD")}至<br/>{moment(row.JSSJ, "YYYY-MM-DD").format("YYYY-MM-DD")}</span>
      ),
    },
    {
      title: '当前进度',
      dataIndex: 'DQJD',
      key: 'DQJD',
      align: 'left',
      width: 170,
      render(text, record, index) {
        // console.log("recordrecord",record)
        return (
          <div
            style={{display: 'flex'}}
            className={record.SJ === '本周' ? (record.DQZT === '高风险' || record.DQZT === '延期' || record.DQZT === '中风险' ? 'prj-tracking-infos-detail-row2-lev1' : 'prj-tracking-infos-detail-row2-lev2') : 'prj-tracking-infos-detail-row2-lev3'}>
            <Progress strokeColor="#3361FF" percent={record.DQJD?.replace('%', '')} size="small"
                      status="active"/>
          </div>
        )
      }
    },
    {
      title: '当前状态',
      dataIndex: 'DQZT',
      key: 'DQZT',
      align: 'left',
      width: 104,
      render(text, record, index) {
        // console.log("recordrecord",record)
        return (
          <span style={{display: 'flex'}}>{record.DQZT === '进度正常' ?
            <div className='prj-status-icon-lv1'><i className="iconfont icon-hourglass"/></div> : (
              record.DQZT === '高风险' ?
                <div className='prj-status-icon-lv2'><i className="iconfont icon-alarm"/></div> : (
                  record.DQZT === '中风险' ?
                    <div className='prj-status-icon-lv3'><i className="iconfont icon-alarm"/></div> : (
                      record.DQZT === '低风险' ?
                        <div className='prj-status-icon-lv4'><i className="iconfont icon-alarm"/></div> : (
                          record.DQZT === '延期' ?
                            <div className='prj-status-icon-lv5'><i className="iconfont icon-delay"/></div> : (
                              record.DQZT === '已完成' &&
                              <div className='prj-status-icon-lv6'><i className="iconfont circle-check"/></div>
                            )
                        )
                    )
                )
            )
          }&nbsp;&nbsp;{text}</span>
        )
      }
    },
    {
      title: '重要事项说明',
      dataIndex: 'ZYSXSM',
      key: 'ZYSXSM',
      align: 'left',
      width: 192,
      render: (text, record) => (
        <span>
          {text && text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text || ''}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text || ''}
        </span>
      )
    },
    {
      title: '本周工作内容',
      dataIndex: 'BZGZNR',
      key: 'BZGZNR',
      align: 'left',
      width: 252,
      render: (text, record) => (
        <span>
          {text && text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text || ''}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text || ''}
        </span>
      )
    },
    {
      title: '下周工作安排',
      dataIndex: 'XZGZAP',
      key: 'XZGZAP',
      align: 'left',
      width: 252,
      render: (text, record) => (
        <span>
          {text && text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text || ''}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text || ''}
        </span>
      )
    },
  ];

  //表格操作后更新数据
  const handleTableChange = (current, pageSize) => {
    console.log('handleTableChange', current, pageSize);
    callBackParams({...params, current, pageSize});
  };

  return (
    <div className="info-table">
      <Table loading={tableLoading} columns={columns} rowKey={'XMID'} onChange={handleTableChange}
             dataSource={tableData} pagination={false}/>
      <div className='page-individual'>
        {(total !== -1 && total !== 0) && <Pagination
          onChange={handleTableChange}
          onShowSizeChange={handleTableChange}
          pageSize={params.pageSize}
          current={params.current}
          total={total}
          pageSizeOptions={['5', '10', '20', '100']}
          showSizeChanger={true}
          // hideOnSinglePage={true}
          showQuickJumper={true}
          showTotal={total => `共 ${total} 条数据`}
        />}

      </div>
    </div>
  );
}
