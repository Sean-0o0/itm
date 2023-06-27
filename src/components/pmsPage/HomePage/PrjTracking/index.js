import React, {useEffect, useState, useRef} from 'react';
import {Button, Divider, Empty, Icon, message, Popover, Progress, Rate, Select, Spin, Tabs, Tooltip} from 'antd';
import styles from "../../../Common/TagSelect/index.less";
import {FetchQueryCustomReportList, ProjectCollect, QueryProjectTracking} from "../../../../services/pmsServices";
import {Link} from "react-router-dom";
import {useLocation} from "react-router";
import {EncryptBase64} from "../../../Common/Encrypt";

const {TabPane} = Tabs;

export default function PrjTracking(props) {
  const [filterResName, setFilterResName] = useState("全部");
  const [filterVisible, setFilterVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showExtends, setShowExtends] = useState(false);
  const [params, setParams] = useState({
    current: 1,
    pageSize: 9,
    org: '',
    projectId: '',
    projectManager: '',
    projectType: ''
  }); //表格数据-项目列表
  const [trackingData, setTrackingData] = useState([{tableInfo: []}]);
  const [trackingDetail, setTrackingDetail] = useState({});
  const [total, setTotal] = useState(0);
  const {
    dictionary
  } = props;
  const {XMGZSX, XMJDZT} = dictionary; //字典
  const location = useLocation();

  useEffect(() => {
    getTableData(params);
    return () => {
    };
  }, [XMGZSX, XMJDZT]);

  //项目数据
  const getTableData = (params) => {
    setIsSpinning(true);
    const payload = {
      current: params.current,
      // cycle: 0,
      // endTime: 0,
      // org: 0,
      pageSize: params.pageSize,
      paging: 1,
      // projectId: 0,
      // projectManager: 0,
      // projectType: 0,
      queryType: "XM",
      sort: "",
      // startTime: 0,
      total: -1
    }
    if (params.org !== '') {
      payload.org = params.org;
    }
    if (params.projectId !== '') {
      payload.projectId = params.projectId;
    }
    if (params.projectManager !== '') {
      payload.projectManager = params.projectManager;
    }
    if (params.projectType !== '') {
      payload.projectType = params.projectType;
    }
    QueryProjectTracking({...payload})
      .then(res => {
        if (res?.success) {
          setIsSpinning(false)
          const track = JSON.parse(res.result)
          setTrackingData(track)
          setTotal(res.totalrows)
        }
      })
      .catch(e => {
        setIsSpinning(false)
        message.error('接口信息获取失败', 1);
      });
  };

  //项目内表格数据-本周/上周
  const getDetailData = (xmid) => {
    setIsSpinning(true);
    QueryProjectTracking({
      current: 1,
      cycle: 1,
      // endTime: 0,
      // org: 0,
      pageSize: 5,
      paging: 1,
      projectId: xmid,
      // projectManager: 0,
      // projectType: 0,
      queryType: "GZZB",
      sort: "",
      // startTime: 0,
      total: -1
    })
      .then(res => {
        if (res?.success) {
          const track = JSON.parse(res.result)
          setTrackingDetail({...track[0]})
          setIsSpinning(false);
        }
      })
      .catch(e => {
        setIsSpinning(false)
        message.error('接口信息获取失败', e);
      });
  };


  const handleExtends = (flag) => {
    if (!flag) {
      getTableData({...params, pageSize: 99999});
    } else {
      getTableData({...params, pageSize: 9});
    }
    setShowExtends(!flag)
  }

  const handleProjectCollect = (flag, id) => {
    let payload = {}
    if (flag) {
      payload.operateType = 'SCXM'
    } else {
      payload.operateType = 'QXXM'
    }
    payload.projectId = id;
    ProjectCollect({...payload})
      .then(res => {
        if (res?.success) {
          if (showExtends) {
            getTableData({...params, pageSize: 99999});
          } else {
            getTableData({...params, pageSize: 9});
          }
        }
      })
      .catch(e => {
        message.error(flag ? '收藏报表失败!' : '取消收藏报表失败!', 1);
      });
  }

  //待办块
  const getPrjDetail = () => {
    return (
      <div>
        {trackingDetail && <Spin className='prj-detail-spin' spinning={isSpinning}>
          <div className="prj-detail-bzgz">
            <div className="prj-detail-bzgz-title">本周工作内容:</div>
            {
              trackingDetail.BZGZNR ? <div className="prj-detail-bzgz-content">{trackingDetail.BZGZNR}</div> : <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{width: '100%'}}/>
            }
          </div>
          <div className="prj-detail-xzgz">
            <div className="prj-detail-xzgz-title">下周工作计划:</div>
            {
              trackingDetail.XZGZAP ? <div className="prj-detail-xzgz-content">{trackingDetail.XZGZAP}</div> : <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{width: '100%'}}/>
            }
          </div>
          <Divider/>
          <div className="prj-detail-sxsm">
            <div className="prj-detail-sxsm-title">重要事项说明:</div>
            {
              trackingDetail.ZYSXSM ? <div className="prj-detail-sxsm-content">{trackingDetail.ZYSXSM}</div> : <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{width: '100%'}}/>
            }
          </div>
        </Spin>
        }
      </div>
    );
  };

  const getFilterDetail = (data) => {
    return (
      <div>
        {data && data.map(x => (
          <div onClick={() => {
            setFilterVisible(false)
            setFilterResName(x.note)
            setParams({...params, projectType: Number(x.ibm)})
            getTableData({...params, projectType: Number(x.ibm)});
          }} id={x.ibm} className="filter-box">
            {x.note}
          </div>
        ))}
      </div>
    );
  }

  const handleVisibleChange = visible => {
    setFilterVisible(visible)
  };


  const linkTo = {
    pathname: `/pms/manage/ProjectTracking`,
    state: {
      routes: [{name: '个人工作台', pathname: location.pathname}],
    },
  };

  console.log("XMJDZT", XMJDZT)
  console.log("trackingData", trackingData)

  return (
    <div className="prj-tracking-box-homePage">
      {
        trackingData.length > 0 && <div className="prj-tracking-infos">
          <div className="prj-tracking-infos-title">
            <div className="prj-tracking-infos-left">
              项目跟踪
              <div className="prj-tracking-infos-left-select">
                <Popover
                  title={null}
                  placement="bottom"
                  trigger="click"
                  visible={filterVisible}
                  onVisibleChange={handleVisibleChange}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  autoAdjustOverflow={true}
                  content={getFilterDetail(XMGZSX)}
                  overlayClassName="prj-tracking-filter-popover"
                >
                  <i className="iconfont icon-filter"/>
                  <div className="left-select-res">筛选：{filterResName}</div>
                </Popover>
              </div>
            </div>
            <Link to={linkTo} style={{display: 'contents'}}>
              <div className="prj-tracking-infos-right">全部 <i className="iconfont icon-right"/></div>
            </Link>
          </div>
          <div className="prj-tracking-infos-box">
            {
              trackingData.map(i => {
                return <div className="prj-tracking-infos-content">
                  <div className="prj-tracking-infos-content-box">
                    <div
                      className={i.DQZT === "进度正常" ? "prj-tracking-infos-name level-2" : "prj-tracking-infos-name level-1"}>
                      {/*<i className="prj-tracking-infos-icon iconfont icon-report"/>*/}
                      <div className="prj-tracking-infos-left-flex">
                        <div className="prj-tracking-infos-left">
                          <Tooltip title={i.XMMC}>
                            {i.XMMC}
                          </Tooltip>
                        </div>
                      </div>
                      <div className="prj-tracking-infos-week">
                        <i onClick={() => handleProjectCollect(i.SFSC === 0, i.XMID)}
                           className={i.SFSC === 0 ? "prj-tracking-infos-icon2 iconfont icon-star" : "prj-tracking-infos-icon2 iconfont icon-fill-star"}/>
                        Week{i.XMZQ}
                      </div>
                    </div>
                    {
                      <div className="prj-tracking-infos-detail">
                        <div className="prj-tracking-infos-detail-row1">
                          <div className="prj-tracking-infos-detail-row1-name">项目概况
                            <Popover
                              title={null}
                              placement="rightTop"
                              trigger="click"
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              autoAdjustOverflow={true}
                              content={getPrjDetail(i.XMID)}
                              overlayClassName="prj-tracking-detail-popover"
                            ><i onClick={() => getDetailData(i.XMID)} className="iconfont icon-detail"/>
                            </Popover>
                          </div>
                          <div
                            className="prj-tracking-infos-detail-row1-percent">{i.SZJD && i.SZJD > 0 ? <>{i.SZJD}%</> : '0%'}
                            {i.BZJD && <><i className="iconfont icon-rise"/>{i.BZJD}%</>}
                          </div>
                        </div>
                        {/*延期项目*/}
                        {
                          <div className="prj-tracking-infos-detail-row2-lev1">
                            <Progress strokeColor="#3361FF" percent={i.BZJD} successPercent={i.SZJD} size="small"
                                      status="active"/>
                          </div>
                        }
                        {/*正常项目*/}
                        {/*{*/}
                        {/*  i.BZZT && i.BZZT == '1' || i.BZZT == '4' && <div className="prj-tracking-infos-detail-row2-lev2">*/}
                        {/*    <Progress strokeColor="#3361FF" percent={60} successPercent={50} size="small" status="active" />*/}
                        {/*  </div>*/}
                        {/*}*/}
                        {/*低风险项目*/}
                        {/*{*/}
                        {/*  i.BZZT && i.BZZT == '6' && <div className="prj-tracking-infos-detail-row2-lev3">*/}
                        {/*    <Progress strokeColor="#3361FF" percent={60} successPercent={50} size="small" status="active" />*/}
                        {/*  </div>*/}
                        {/*}*/}
                        <div className="prj-tracking-infos-detail-row3">
                          <div
                            className="prj-tracking-infos-detail-row3-risk">{i.SZZT && i.SZZT > 0 ? <>{XMJDZT.filter(item => item.ibm == i.SZZT)[0]?.note}</> : '暂无状态'}</div>
                          {i.BZZT && <><i className="iconfont icon-rise"/>
                            <div
                              className="prj-tracking-infos-detail-row3-risk">{XMJDZT.filter(item => item.ibm == i.BZZT)[0]?.note}</div>
                          </>}
                        </div>
                      </div>
                    }
                  </div>
                </div>
              })
            }
            {
              total > 9 && (
                <div className='prj-tracking-infos-foot' onClick={() => handleExtends(showExtends)}>
                  {showExtends ? '收起' : '展开'} <Icon type={showExtends ? 'up' : 'down'}/>
                </div>
              )
            }
          </div>
        </div>
      }
    </div>
  );
}
