import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router';
import {Divider, message, Pagination, Progress, Spin, Table, Tag} from "antd";
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
  } = props; //表格数据
  const location = useLocation();

  const columns = [
    {
      title: '时间',
      dataIndex: 'SJ',
      key: 'SJ',
      width: 60,
    },
    {
      title: '当前进度',
      dataIndex: 'DQJD',
      key: 'DQJD',
      width: 220,
    },
    {
      title: '当前状态',
      dataIndex: 'DQZT',
      key: 'DQZT',
      width: 104,
    },
    {
      title: '重要事项说明',
      dataIndex: 'ZYSXSM',
      key: 'ZYSXSM',
    },
    {
      title: '本周工作内容',
      dataIndex: 'BZGZNR',
      key: 'BZGZNR',
    },
    {
      title: '下周工作安排',
      dataIndex: 'XZGZAP',
      key: 'XZGZAP',
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: (text, record) => (
        <span>
        <a style={{color: '#3361ff', cursor: 'pointer'}} onClick={() => {
          setRecord(record)
          if (record.SJ === '本周') {
            setCycle(record.XMZQ)
          } else if (record.SJ === '上周') {
            setCycle('-1')
          }
          setEditPrjVisible(true)
        }}>修改</a>
      </span>
      ),
    },
  ];

  // const trackingData = [{
  //   XMID: 1,
  //   XMMC: "项目1",
  //   XMJL: "张三",
  //   XMJLID: 1,
  //   XMZQ: 2,
  //   tableInfo:[{
  //     key: '1',
  //     SJ: '本周',
  //     DQJD: <span className="prj-progress-info"><Progress strokeColor="#3361FF" percent={90} size="small" status="active" />90%</span>,
  //     DQZT: '低风险',
  //     ZYSXSM: '-',
  //     BZGZNR: '1.按照交易所要求紧急开发可转债适当性功能； 2.按照苹果公司应用市场要求开发用户注销功能；',
  //     XZGZAP: '1.可转债适当性及用户注销功能测试； 2.条件单版本测试； 3.整理汇金谷交易模块需求；',
  //   },
  //     {
  //       key: '2',
  //       SJ: '上周',
  //       DQJD: <span className="prj-progress-info"><Progress strokeColor="#909399" percent={50} size="small"/>50%</span>,
  //       DQZT: '进度正常',
  //       ZYSXSM: '条件单版本一直在延期，一方面由于交易所和应用市场突发事件较多，另一方面目前开发商效率较慢',
  //       BZGZNR: '1.按照交易所要求紧急开发可转债适当性功能； 2.按照苹果公司应用市场要求开发用户注销功能；',
  //       XZGZAP: '1.可转债适当性及用户注销功能测试； 2.条件单版本测试； 3.整理汇金谷交易模块需求；',
  //     }]
  // },{
  //   XMID: 2,
  //   XMMC: "项目2",
  //   XMJL: "李四",
  //   XMJLID: 2,
  //   XMZQ: 15,
  //   tableInfo:[{
  //     key: '1',
  //     SJ: '本周',
  //     DQJD: <span className="prj-progress-info"><Progress strokeColor="#3361FF" percent={90} size="small" status="active" />90%</span>,
  //     DQZT: '低风险',
  //     ZYSXSM: '-',
  //     BZGZNR: '1.按照交易所要求紧急开发可转债适当性功能； 2.按照苹果公司应用市场要求开发用户注销功能；',
  //     XZGZAP: '1.可转债适当性及用户注销功能测试； 2.条件单版本测试； 3.整理汇金谷交易模块需求；',
  //   },
  //     {
  //       key: '2',
  //       SJ: '上周',
  //       DQJD: <span className="prj-progress-info"><Progress strokeColor="#909399" percent={50} size="small"/>50%</span>,
  //       DQZT: '进度正常',
  //       ZYSXSM: '条件单版本一直在延期，一方面由于交易所和应用市场突发事件较多，另一方面目前开发商效率较慢',
  //       BZGZNR: '1.按照交易所要求紧急开发可转债适当性功能； 2.按照苹果公司应用市场要求开发用户注销功能；',
  //       XZGZAP: '1.可转债适当性及用户注销功能测试； 2.条件单版本测试； 3.整理汇金谷交易模块需求；',
  //     }]
  // }];

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
          console.log("trackingDataNew", trackingData)
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
              <Table columns={columns} dataSource={item.tableInfo} pagination={false}/>
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
