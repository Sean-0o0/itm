import React, {useEffect, useState, useRef} from 'react';
import {Button, Empty, Icon, message, Popconfirm, Rate, Select, Tabs, Tooltip} from 'antd';
import styles from "../../../Common/TagSelect/index.less";
import {FetchQueryCustomReportList, ProjectCollect} from "../../../../services/pmsServices";
import {useLocation} from "react-router";
import {EncryptBase64} from "../../../Common/Encrypt";
import {Link} from "react-router-dom";

const {TabPane} = Tabs;

export default function RepInfos(props) {
  const [showExtendsSC, setShowExtendsSC] = useState(false);
  const [showExtendsCJ, setShowExtendsCJ] = useState(false);
  const [showExtendsGX, setShowExtendsGX] = useState(false);
  const [bbmc, setBbmc] = useState(false);
  const [cjr, setCjr] = useState(false);
  const location = useLocation();
  const {
    cusRepDataSC = [],
    totalSC = 0,
    cusRepDataCJ = [],
    totalCJ = 0,
    cusRepDataGX = [],
    totalGX = 0,
    tabsKey = 1,
    params = {},
    paramsCallback,
    getCusRepData,
    cusRepDataCJR,
    cusRepDataKJBB,
    totalCJR,
    totalKJBB,
  } = props;

  useEffect(() => {
    return () => {
    };
  }, []);

  const handleBbmcChange = (key) => {
    setBbmc(key);
    paramsCallback({...params, bbmc: key})
  }

  const handleCjrChange = (key) => {
    setCjr(key);
    paramsCallback({...params, cjr: key})
  }

  //重置按钮
  const handleReset = () => {
    setBbmc(undefined);
    setCjr(undefined);
    paramsCallback({bbmc: '', cjr: ''})
  };

  const handleExtendsSC = (flag) => {
    if (!flag) {
      getCusRepData("SC", 99999);
    } else {
      getCusRepData("SC", 12);
    }
    setShowExtendsSC(!flag)
  }

  const handleExtendsCJ = (flag) => {
    if (!flag) {
      getCusRepData("CJ", 99999);
    } else {
      getCusRepData("CJ", 12);
    }
    setShowExtendsCJ(!flag)
  }

  const handleExtendsGX = (flag) => {
    if (!flag) {
      getCusRepData("GX", 99999);
    } else {
      getCusRepData("GX", 28);
    }
    setShowExtendsGX(!flag)
  }

  const handleProjectCollect = (e, flag, id) => {
    e.stopPropagation();// 阻止事件冒泡
    let payload = {}
    if (flag) {
      payload.operateType = 'SCBB'
    } else {
      payload.operateType = 'QXBB'
    }
    payload.projectId = id;
    ProjectCollect({...payload})
      .then(res => {
        if (res?.success) {
          if (showExtendsGX) {
            getCusRepData("GX", 99999);
          } else {
            getCusRepData("GX", 28);
          }
          if (showExtendsCJ) {
            getCusRepData("CJ", 99999);
          } else {
            getCusRepData("CJ", 12);
          }
          if (showExtendsSC) {
            getCusRepData("SC", 99999);
          } else {
            getCusRepData("SC", 12);
          }
        }
      })
      .catch(e => {
        message.error(flag ? '收藏报表失败!' : '取消收藏报表失败!', 1);
      });
  }

  const toDetail = (i) => {
    console.log("bbid", i)
    window.location.href = `/#/pms/manage/CustomRptInfo/${EncryptBase64(
      JSON.stringify({
        routes: [{name: '自定义报表', pathname: location.pathname}],
        bbid: i.BBID,
        bbmc: i.BBMC,
      }),
    )}`
  }

  const linkTo = {
    pathname: `/pms/manage/CustomRptManagement`,
    state: {
      routes: [{name: '自定义报表', pathname: location.pathname}],
    },
  };

  return (
    <>
      {
        tabsKey === 1 && <div className="rep-infos">
          <div className="rep-infos-title">
            我收藏的
          </div>
          <div className="rep-infos-box">
            {
              cusRepDataSC.length > 0 ? cusRepDataSC.map(i => {
                return <div className="rep-infos-content" onClick={() => toDetail(i)}>
                  <div className="rep-infos-content-box">
                    <div className="rep-infos-name">
                      <i className="rep-infos-icon iconfont icon-report"/>
                      <div className="rep-infos-bbmc"><Tooltip title={i.BBMC}>{i.BBMC}</Tooltip></div>
                      <Popconfirm
                        title={i.SFSC === 0 ? "确定收藏？" : "确定取消收藏？"}
                        onConfirm={(e) => handleProjectCollect(e, i.SFSC === 0, i.BBID)}
                        onCancel={(e) => {
                          e.stopPropagation()
                        }}
                        okText="确认"
                        cancelText="取消"
                      >
                        <i onClick={(e) => {
                          e.stopPropagation()
                        }}
                           className={i.SFSC === 0 ? "rep-infos-icon2 iconfont icon-star" : "rep-infos-icon2 iconfont icon-fill-star"}/>
                      </Popconfirm>
                    </div>
                    <div className="rep-infos-time">
                      {i.CJR}&nbsp;&nbsp;{i.CJSJ}创建
                    </div>
                  </div>
                </div>
              }) : <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{width: '100%'}}
              />
            }
            {
              totalSC > 12 && (
                <div className='rep-infos-foot' onClick={() => handleExtendsSC(showExtendsSC)}>
                  {showExtendsSC ? '收起' : '展开'} <Icon type={showExtendsSC ? 'up' : 'down'}/>
                </div>
              )
            }
          </div>
        </div>
      }
      {
        tabsKey === 1 && <div className="rep-infos">
          <div className="rep-infos-title-oper">
            <div className="oper-title">我创建的</div>
            <Link to={linkTo} className="oper-link">
              <div className="oper-link-to"><i className="oper-icon iconfont icon-system"/>报表管理</div>
            </Link>
          </div>
          <div className="rep-infos-box">
            {
              cusRepDataCJ.length > 0 ? cusRepDataCJ.map(i => {
                return <div className="rep-infos-content" onClick={() => toDetail(i)}>
                  <div className="rep-infos-content-box">
                    <div className="rep-infos-name">
                      <i className="rep-infos-icon iconfont icon-report"/>
                      <div className="rep-infos-bbmc"><Tooltip title={i.BBMC}>{i.BBMC}</Tooltip></div>
                      <Popconfirm
                        title={i.SFSC === 0 ? "确定收藏？" : "确定取消收藏？"}
                        onConfirm={(e) => handleProjectCollect(e, i.SFSC === 0, i.BBID)}
                        onCancel={(e) => {
                          e.stopPropagation()
                        }}
                        okText="确认"
                        cancelText="取消"
                      >
                        <i onClick={(e) => {
                          e.stopPropagation()
                        }}
                           className={i.SFSC === 0 ? "rep-infos-icon2 iconfont icon-star" : "rep-infos-icon2 iconfont icon-fill-star"}/>
                      </Popconfirm>
                    </div>
                    <div className="rep-infos-time">
                      {i.CJR}&nbsp;&nbsp;{i.CJSJ}创建
                    </div>
                  </div>
                </div>
              }) : <Empty
                description="暂无数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{width: '100%'}}
              />
            }
            {
              totalCJ > 12 && (
                <div className='rep-infos-foot' onClick={() => handleExtendsCJ(showExtendsCJ)}>
                  {showExtendsCJ ? '收起' : '展开'} <Icon type={showExtendsCJ ? 'up' : 'down'}/>
                </div>
              )
            }
          </div>
        </div>
      }
      {
        tabsKey === 2 && <div className="rep-infos-GX">
          <div className="top-console">
            <div className="item-box">
              <div className="console-item">
                <div className="item-label">报表名称</div>
                <Select
                  className="item-selector"
                  dropdownClassName={'item-selector-dropdown'}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  allowClear
                  onChange={handleBbmcChange}
                  value={bbmc}
                  placeholder="请选择"
                >
                  {cusRepDataKJBB.map((x, i) => (
                    <Option key={x.BBID} value={x.BBID}>
                      {x.BBMC}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="console-item">
                <div className="item-label">创建人</div>
                <Select
                  className="item-selector"
                  dropdownClassName={'item-selector-dropdown'}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  allowClear
                  onChange={handleCjrChange}
                  value={cjr}
                  placeholder="请选择"
                >
                  {cusRepDataCJR.map((x, i) => (
                    <Option key={x.CJRID} value={x.CJRID}>
                      {x.CJR}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="item-btn">
                <Button
                  className="btn-search"
                  type="primary"
                  onClick={() => getCusRepData("GX", 28)}
                >
                  查询
                </Button>
                <Button className="btn-reset"
                        onClick={handleReset}
                >
                  重置
                </Button>
              </div>
            </div>
          </div>
          {
            <div className="rep-infos">
              <div className="rep-infos-box">
                {
                  cusRepDataGX.length > 0 ? cusRepDataGX.map(i => {
                    return <div className="rep-infos-content" onClick={() => toDetail(i)}>
                      <div className="rep-infos-content-box">
                        <div className="rep-infos-name">
                          <i className="rep-infos-icon iconfont icon-report"/>
                          <div className="rep-infos-bbmc"><Tooltip title={i.BBMC}>{i.BBMC}</Tooltip></div>
                          <Popconfirm
                            title={i.SFSC === 0 ? "确定收藏？" : "确定取消收藏？"}
                            onConfirm={(e) => handleProjectCollect(e, i.SFSC === 0, i.BBID)}
                            onCancel={(e) => {
                              e.stopPropagation()
                            }}
                            okText="确认"
                            cancelText="取消"
                          >
                            <i onClick={(e) => {
                              e.stopPropagation()
                            }}
                               className={i.SFSC === 0 ? "rep-infos-icon2 iconfont icon-star" : "rep-infos-icon2 iconfont icon-fill-star"}/>
                          </Popconfirm>
                        </div>
                        <div className="rep-infos-time">
                          {i.CJR}&nbsp;&nbsp;{i.CJSJ}创建
                        </div>
                      </div>
                    </div>
                  }) : <Empty
                    description="暂无数据"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{width: '100%'}}
                  />
                }
                {
                  totalGX > 28 && (
                    <div className='rep-infos-foot' onClick={() => handleExtendsGX(showExtendsGX)}>
                      {showExtendsGX ? '收起' : '展开'} <Icon type={showExtendsGX ? 'up' : 'down'}/>
                    </div>
                  )
                }
              </div>
            </div>
          }
        </div>
      }
    </>
  );
}
