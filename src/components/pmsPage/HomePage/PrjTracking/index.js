import React, { useEffect, useState } from 'react';
import { Empty, Icon, message, Popconfirm, Popover, Progress, Spin, Tooltip } from 'antd';
import { ProjectCollect, QueryProjectTracking } from '../../../../services/pmsServices';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { EncryptBase64 } from '../../../Common/Encrypt';

export default function PrjTracking(props) {
  const [filterResName, setFilterResName] = useState('查看全部');
  const [filterVisible, setFilterVisible] = useState(false);
  const [trackingDetail, setTrackingDetail] = useState({});
  const { dictionary, getTrackingData, stateProps = {} } = props;
  const {
    total,
    params,
    setParams,
    trackingData,
    isTrackingSpinning,
    setIsTrackingSpinning,
    showExtends,
    setShowExtends,
  } = stateProps;
  const { XMGZSX = [], XMJDZT = [] } = dictionary; //字典
  const location = useLocation();

  //项目内表格数据-本周/上周
  const getDetailData = (xmid, cycle) => {
    setIsTrackingSpinning(true);
    QueryProjectTracking({
      current: 1,
      cycle,
      // endTime: 0,
      // org: 0,
      pageSize: 5,
      paging: 1,
      projectId: xmid,
      // projectManager: 0,
      // projectType: 0,
      queryType: 'GZZB',
      sort: '',
      // startTime: 0,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          const track = JSON.parse(res.result);
          setTrackingDetail({ ...track[0] });
          setIsTrackingSpinning(false);
        }
      })
      .catch(e => {
        setIsTrackingSpinning(false);
        message.error('接口信息获取失败', e);
      });
  };

  const handleExtends = flag => {
    if (!flag) {
      getTrackingData({ ...params, pageSize: 99999 }, flag);
    } else {
      getTrackingData({ ...params, pageSize: 9 }, flag);
    }
  };

  const handleProjectCollect = (e, flag, id) => {
    e.preventDefault();
    let payload = {};
    if (flag) {
      payload.operateType = 'SCXM';
    } else {
      payload.operateType = 'QXXM';
    }
    payload.projectId = id;
    ProjectCollect({ ...payload })
      .then(res => {
        if (res?.success) {
          if (showExtends) {
            getTrackingData({ ...params, pageSize: 99999 });
          } else {
            getTrackingData({ ...params, pageSize: 9 });
          }
        }
      })
      .catch(e => {
        message.error(flag ? '收藏报表失败!' : '取消收藏报表失败!', 1);
      });
  };

  //待办块
  const getPrjDetail = () => {
    return (
      <div>
        {trackingDetail && (
          <Spin className="prj-detail-spin" spinning={isTrackingSpinning}>
            <div className="prj-detail-bzgz">
              <div className="title">本周工作内容:</div>
              {trackingDetail.BZGZNR ? (
                <div className="content">{trackingDetail.BZGZNR}</div>
              ) : (
                <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ width: '100%' }}
                />
              )}
            </div>
            <div className="prj-detail-xzgz">
              <div className="title">下周工作计划:</div>
              {trackingDetail.XZGZAP ? (
                <div className="content">{trackingDetail.XZGZAP}</div>
              ) : (
                <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ width: '100%' }}
                />
              )}
            </div>
            <div className="prj-detail-sxsm">
              <div className="title">重要事项说明:</div>
              {trackingDetail.ZYSXSM ? (
                <div className="content">{trackingDetail.ZYSXSM}</div>
              ) : (
                <Empty
                  description="暂无数据"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ width: '100%' }}
                />
              )}
            </div>
          </Spin>
        )}
      </div>
    );
  };

  const getFilterDetail = data => {
    return (
      <div>
        {data &&
          data.map(x => (
            <div
              onClick={() => {
                setShowExtends(false);
                setFilterVisible(false);
                setFilterResName(x.note);
                setParams({ ...params, projectType: Number(x.ibm) });
                getTrackingData({ ...params, projectType: Number(x.ibm) });
              }}
              id={x.ibm}
              key={x.ibm}
              className="filter-box"
            >
              {x.note}
            </div>
          ))}
      </div>
    );
  };

  const handleVisibleChange = visible => {
    setFilterVisible(visible);
  };

  const linkTo = {
    pathname: `/pms/manage/ProjectTracking`,
    state: {
      routes: [{ name: '个人工作台', pathname: location.pathname }],
    },
  };

  // console.log('XMJDZT', XMJDZT);
  // console.log('trackingData', trackingData);

  return (
    <div className="prj-tracking-box-homePage">
      {
        <div className="prj-tracking-infos">
          <div className="home-card-title-box">
            <div className="txt">
              项目跟踪
              <div className="prj-tracking-infos-left">
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
                    <i className="iconfont icon-filter" />
                    <div className="left-select-res">筛选：{filterResName}</div>
                  </Popover>
                </div>
              </div>
            </div>
            <Link to={linkTo} style={{ display: 'contents' }}>
              <span>
                查看全部 <i className="iconfont icon-right" />
              </span>
            </Link>
          </div>
          <div className="prj-tracking-infos-box">
            {trackingData?.length > 0 ? (
              trackingData?.map(i => {
                return (
                  <div className="prj-tracking-infos-content" key={i.XMID}>
                    <div className="prj-tracking-infos-content-box">
                      <Link
                        style={{ color: '#3361ff' }}
                        to={{
                          pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                            JSON.stringify({
                              xmid: i.XMID,
                            }),
                          )}`,
                          state: {
                            routes: [{ name: '个人工作台', pathname: location.pathname }],
                          },
                        }}
                        className="table-link-strong"
                      >
                        <div
                          className={
                            i.BZZT === 1 || i.BZZT === 2 || i.BZZT === 4
                              ? 'prj-tracking-infos-name level-1'
                              : 'prj-tracking-infos-name level-2'
                          }
                        >
                          {/*<i className="prj-tracking-infos-icon iconfont icon-report"/>*/}
                          <div className="prj-tracking-infos-left-flex">
                            <div className="prj-tracking-infos-left">
                              <Tooltip title={i.XMMC}>{i.XMMC}</Tooltip>
                            </div>
                            <Popconfirm
                              title={i.SFSC === 0 ? '确定收藏？' : '确定取消收藏？'}
                              onConfirm={e => handleProjectCollect(e, i.SFSC === 0, i.XMID)}
                              onCancel={e => {
                                e.stopPropagation();
                              }}
                              okText="确认"
                              cancelText="取消"
                            >
                              <i
                                onClick={e => {
                                  e.stopPropagation();
                                }}
                                className={
                                  i.SFSC === 0
                                    ? 'prj-tracking-infos-icon2 iconfont icon-star'
                                    : 'prj-tracking-infos-icon2 iconfont icon-fill-star'
                                }
                              />
                            </Popconfirm>
                          </div>
                          <div className="prj-tracking-infos-week">Week&nbsp;{i.XMZQ}</div>
                        </div>
                        {
                          <div className="prj-tracking-infos-detail">
                            <div className="prj-tracking-infos-detail-row1">
                              <div className="prj-tracking-infos-detail-row1-name">
                                项目概况
                                <Popover
                                  title={null}
                                  placement="rightTop"
                                  trigger="hover"
                                  getPopupContainer={triggerNode => triggerNode.parentNode}
                                  autoAdjustOverflow={true}
                                  content={getPrjDetail(i.XMID, i.XMZQ)}
                                  overlayClassName="prj-tracking-detail-popover"
                                >
                                  <i
                                    onMouseEnter={() => getDetailData(i.XMID)}
                                    className="iconfont icon-detail"
                                  />
                                </Popover>
                              </div>
                              <div className="prj-tracking-infos-detail-row1-percent">
                                {i.SZJD >= 0 && (
                                  <>
                                    {i.SZJD}%<i className="iconfont icon-rise" />
                                  </>
                                )}
                                {i.BZJD >= 0 && (
                                  <span
                                    className={
                                      i.BZZT === 1 || i.BZZT === 2 || i.BZZT === 4
                                        ? 'font-color-lv1'
                                        : 'font-color-lv2'
                                    }
                                  >
                                    {i.BZJD}%
                                  </span>
                                )}
                              </div>
                            </div>
                            {
                              <div
                                className={
                                  i.BZZT === 1 || i.BZZT === 2 || i.BZZT === 4
                                    ? 'prj-tracking-infos-detail-row2-lev1'
                                    : 'prj-tracking-infos-detail-row2-lev2'
                                }
                              >
                                <Progress
                                  strokeColor="#3361FF"
                                  percent={i.BZJD}
                                  successPercent={i.SZJD}
                                  size="small"
                                  status="active"
                                  showInfo={false}
                                />
                              </div>
                            }
                            <div className="prj-tracking-infos-detail-row3">
                              {/*icon-reloadtime 延期 - rgba(255,47,49,0.1) #FF2F31  */}
                              {/*circle-check 已完成 - rgba(51,97,255,0.1) #3361ff  */}
                              {/*innovation -e7da 高风险 - rgba(255,47,49,0.1) #FF2F31  */}
                              {/*circle-check 中风险 - rgba(249,168,18,0.1) #F9A812  */}
                              {/*circle-check 低风险 - rgba(5,190,254,0.1) #05BEFE  */}
                              <div
                                className="prj-tracking-infos-detail-row3-risk"
                                style={{ alignItems: 'center', display: 'flex' }}
                              >
                                {i.SZZT === 5 ? (
                                  <div className="prj-status-icon-lv1">
                                    <i className="iconfont icon-hourglass" />
                                  </div>
                                ) : i.SZZT === 1 ? (
                                  <div className="prj-status-icon-lv2">
                                    <i className="iconfont icon-alarm" />
                                  </div>
                                ) : i.SZZT === 2 ? (
                                  <div className="prj-status-icon-lv3">
                                    <i className="iconfont icon-alarm" />
                                  </div>
                                ) : i.SZZT === 3 ? (
                                  <div className="prj-status-icon-lv4">
                                    <i className="iconfont icon-alarm" />
                                  </div>
                                ) : i.SZZT === 4 ? (
                                  <div className="prj-status-icon-lv5">
                                    <i className="iconfont icon-delay" />
                                  </div>
                                ) : (
                                  i.SZZT === 6 && (
                                    <div className="prj-status-icon-lv6">
                                      <i className="iconfont circle-check" />
                                    </div>
                                  )
                                )}
                                {i.SZZT && i.SZZT > 0 && (
                                  <>
                                    &nbsp;{XMJDZT.filter(item => item.ibm == i.SZZT)[0]?.note}
                                    <i className="iconfont icon-rise" />
                                  </>
                                )}
                              </div>
                              {i.BZZT && (
                                <>
                                  <div
                                    className="prj-tracking-infos-detail-row3-risk"
                                    style={{ alignItems: 'center', display: 'flex' }}
                                  >
                                    {i.BZZT === 5 ? (
                                      <div className="prj-status-icon-lv1">
                                        <i className="iconfont icon-hourglass" />
                                      </div>
                                    ) : i.BZZT === 1 ? (
                                      <div className="prj-status-icon-lv2">
                                        <i className="iconfont icon-alarm" />
                                      </div>
                                    ) : i.BZZT === 2 ? (
                                      <div className="prj-status-icon-lv3">
                                        <i className="iconfont icon-alarm" />
                                      </div>
                                    ) : i.BZZT === 3 ? (
                                      <div className="prj-status-icon-lv4">
                                        <i className="iconfont icon-alarm" />
                                      </div>
                                    ) : i.BZZT === 4 ? (
                                      <div className="prj-status-icon-lv5">
                                        <i className="iconfont icon-delay" />
                                      </div>
                                    ) : (
                                      i.BZZT === 6 && (
                                        <div className="prj-status-icon-lv6">
                                          <i className="iconfont circle-check" />
                                        </div>
                                      )
                                    )}
                                    &nbsp;{XMJDZT.filter(item => item.ibm == i.BZZT)[0]?.note}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        }
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ width: '100%' }}
              />
            )}
            {total.tracking > 9 &&
              (showExtends ? (
                <div className="prj-tracking-infos-foot" onClick={() => handleExtends(true)}>
                  收起
                  <i className="iconfont icon-up" />
                </div>
              ) : (
                <div className="prj-tracking-infos-foot" onClick={() => handleExtends(false)}>
                  展开
                  {isTrackingSpinning ? (
                    <Icon type="loading" />
                  ) : (
                    <i className="iconfont icon-down" />
                  )}
                </div>
              ))}
          </div>
        </div>
      }
    </div>
  );
}
