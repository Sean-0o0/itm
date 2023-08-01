import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router';
import {Divider, message, Pagination, Progress, Spin, Table, Tag, Tooltip} from "antd";
import {QueryProjectTracking} from "../../../../services/pmsServices";
import ProjectTracking from "../index";
import PollResultModel from "../../HardwareItems/PollResultModel";
import hisPrjInfo from "../hisPrjInfo";
import HisPrjInfo from "../hisPrjInfo";
import {EncryptBase64} from "../../../Common/Encrypt";
import {Link} from "react-router-dom";
import moment from 'moment';
import EditPrjTracking from "../editPrjTracking";

export default function InfoTable(props) {
  const [xmid, setXmid] = useState(0);
  const [record, setRecord] = useState(0);
  const [cycle, setCycle] = useState('');
  const [editPrjVisible, setEditPrjVisible] = useState(false);
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  const [hisPrjInfoModalVisible, setHisPrjInfoModalVisible] = useState(false);
  const {
    isSpinning,
    setIsSpinning,
    params,
    callBackParams,
    total,
    trackingData,
    setTrackingData,
    getTableData,
    prjRepManage,//报告管理员
  } = props; //表格数据
  const location = useLocation();

  const columns = [
    {
      title: '时间',
      dataIndex: 'SJ',
      key: 'SJ',
      align: 'left',
      width: 60,
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
            className={record.SJ === '本周' ? (record.DQZT === '高风险' || record.DQZT === '延期' ? 'prj-tracking-infos-detail-row2-lev1' : 'prj-tracking-infos-detail-row2-lev2') : 'prj-tracking-infos-detail-row2-lev2'}>
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
      onCell: () => {
        return {
          style: {
            maxWidth: 192,
          }
        };
      },
      render: (text, record) => (
        <span>
          {text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text}
        </span>
      )
    },
    {
      title: '本周工作内容',
      dataIndex: 'BZGZNR',
      key: 'BZGZNR',
      align: 'left',
      onCell: () => {
        return {
          style: {
            maxWidth: 252,
          }
        };
      },
      render: (text, record) => (
        <span>
          {text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text}
        </span>
      )
    },
    {
      title: '下周工作安排',
      dataIndex: 'XZGZAP',
      key: 'XZGZAP',
      align: 'left',
      onCell: () => {
        return {
          style: {
            maxWidth: 252,
          }
        };
      },
      render: (text, record) => (
        <span>
          {text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text}
        </span>
      )
    },
  ];

  const columnsopr = [
    {
      title: '时间',
      dataIndex: 'SJ',
      key: 'SJ',
      align: 'left',
      width: 60,
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
            className={record.SJ === '本周' ? (record.DQZT === '高风险' || record.DQZT === '延期' ? 'prj-tracking-infos-detail-row2-lev1' : 'prj-tracking-infos-detail-row2-lev2') : 'prj-tracking-infos-detail-row2-lev2'}>
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
      onCell: () => {
        return {
          style: {
            maxWidth: 192,
          }
        };
      },
      render: (text, record) => (
        <span>
          {text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text}
        </span>
      )
    },
    {
      title: '本周工作内容',
      dataIndex: 'BZGZNR',
      key: 'BZGZNR',
      align: 'left',
      onCell: () => {
        return {
          style: {
            maxWidth: 252,
          }
        };
      },
      render: (text, record) => (
        <span>
          {text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text}
        </span>
      )
    },
    {
      title: '下周工作安排',
      dataIndex: 'XZGZAP',
      key: 'XZGZAP',
      align: 'left',
      onCell: () => {
        return {
          style: {
            maxWidth: 252,
          }
        };
      },
      render: (text, record) => (
        <span>
          {text.length > 60 ? (
            <span>{text.slice(0, 60) + '...'}<Tooltip overlayClassName="prjTrackingTip" placement='topLeft'
                                                      title={text}><span
              style={{cursor: "pointer", color: '#3361ff'}}>详情</span></Tooltip></span>) : text}
        </span>
      )
    }, {
      title: '操作',
      key: 'action',
      align: 'left',
      width: 60,
      render: (text, record) => (
        <span>
        <a style={{color: '#3361ff', cursor: 'pointer'}} onClick={() => {
          console.log("recordrecord", record)
          setRecord(record)
          setCycle(record.XMZQ)
          setEditPrjVisible(true)
        }}>修改</a>
      </span>
      ),
    }
  ];

  const changeExtends = async (val) => {
    setIsSpinning(true);
    //本周和上周数据
    await getDetailData(val, val.XMZQ)
  }

  //项目内表格数据-本周/上周
  const getDetailData = (val, XMZQ) => {
    // 上周一到这周末
    let start = moment().week(moment().week()).startOf('week').format('YYYYMMDD');
    let end = moment().week(moment().week()).endOf('week').format('YYYYMMDD');
    let weekOfday = parseInt(moment().format('d'))
    let laststart = moment().subtract(weekOfday + 6, 'days').format('YYYYMMDD')
    let lastend = moment().subtract(weekOfday, 'days').format('YYYYMMDD')
    console.log("start", start)
    console.log("end", end)
    console.log("laststart", laststart)
    console.log("lastend", lastend)
    QueryProjectTracking({
      current: 1,
      // cycle: XMZQ,
      endTime: end,
      pageSize: 5,
      paging: 1,
      projectId: val.XMID,
      queryType: "GZZB",
      sort: "",
      startTime: laststart,
      total: -1
    })
      .then(res => {
        if (res?.success) {
          const track = JSON.parse(res.result)
          console.log("track", track)
          let thisweek = track.filter(item => item.XMZQ === XMZQ)
          let lastweek = track.filter(item => item.XMZQ !== XMZQ)
          trackingData.map(item => {
            if (thisweek.length > 0 && val.XMID === item.XMID && !item.extends) {
              thisweek[0].SJ = "本周";
              item.tableInfo.push(thisweek[0]);
            }
            if (lastweek.length > 0 && val.XMID === item.XMID && !item.extends) {
              lastweek[0].SJ = "上周";
              item.tableInfo.push(lastweek[0]);
            } else if (val.XMID === item.XMID && item.extends) {
              item.tableInfo = [];
            }
            if (val.XMID === item.XMID) {
              item.extends = !item.extends;
            }
          })
          setTrackingData([...trackingData])
          setIsSpinning(false)
          console.log("trackingDataNew222", trackingData)
        }
      })
      .catch(e => {
        setIsSpinning(false)
        message.error('接口信息获取失败', e);
      });
  };

  const toHisPrjInfoModal = (xmid) => {
    setXmid(xmid);
    setHisPrjInfoModalVisible(true)
  }

  const closeHisPrjInfoModal = () => {
    setHisPrjInfoModalVisible(false)
  }

  //表格操作后更新数据
  const handleTableChange = (current, pageSize) => {
    console.log('handleTableChange', current, pageSize);
    callBackParams({...params, current, pageSize})
    getTableData({...params, current, pageSize})
  };

  return (
    <Spin spinning={isSpinning} tip="加载中" size="small">
      {/*编辑项目跟踪信息弹窗*/}
      {editPrjVisible && <EditPrjTracking
        record={record}
        cycle={cycle}
        params={params}
        getTableData={getTableData}
        contractSigningVisible={editPrjVisible}
        closeContractModal={() => setEditPrjVisible(false)}
        onSuccess={() => this.onSuccess("合同签署")}
      />}
      {
        trackingData?.length > 0 && trackingData?.map((item, index) => {
          return <div className="info-table">
            {/*项目名称*/}
            <div className="prj-basic-info">
              <div className="prj-name"><i onClick={() => changeExtends(item)}
                                           className={item.extends ? 'iconfont icon-fill-down head-icon' : 'iconfont icon-fill-right head-icon'}/>
                <Link
                  style={{paddingLeft: '8px', color: '#3361ff'}}
                  to={{
                    pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                      JSON.stringify({
                        xmid: item.XMID,
                      }),
                    )}`,
                    state: {
                      routes: [{name: '项目跟踪', pathname: location.pathname}],
                    },
                  }}
                  className="table-link-strong"
                >
                  {item.XMMC}
                </Link>
              </div>
              <div className="prj-manage">
                <span className="title">项目经理：</span>
                <span className="label">{item.XMJL}</span>
              </div>
              <div className="prj-week">
                <span className="title">周期：</span>
                <span className="label">第{item.XMZQ}周</span>
              </div>
            </div>
            {/*表格内容*/}
            <div className="prj-table-info" style={{display: item.extends ? '' : 'none'}}>
              <Table
                columns={String(item.XMJLID) === String(LOGIN_USER_INFO.id) || prjRepManage === '自定义报告管理员' ? columnsopr : columns}
                dataSource={item.tableInfo} pagination={false}/>
            </div>
            {/*底部数据*/}
            <div className="prj-his-info" style={{display: item.extends ? '' : 'none'}}>
              <a className="title" onClick={() => toHisPrjInfoModal(item.XMID)}>历史概况</a>
              <a className="his-icon" onClick={() => toHisPrjInfoModal(item.XMID)}><i className="iconfont icon-right"/></a>
            </div>
          </div>
        })
      }
      {hisPrjInfoModalVisible && (
        <HisPrjInfo xmid={xmid} closeModal={closeHisPrjInfoModal} visible={hisPrjInfoModalVisible}/>
      )
      }
      <div className='page-individual-prjTracking' style={{margin: '24px', backgroundColor: '#f7f8fa'}}>
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
    </Spin>
  );
}
