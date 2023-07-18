import React, {useEffect, useState, useRef} from 'react';
import {Button, Icon, message, Popconfirm, Rate, Select, Tabs, Tooltip} from 'antd';
import styles from "../../../Common/TagSelect/index.less";
import {FetchQueryCustomReportList, ProjectCollect} from "../../../../services/pmsServices";
import {Link} from "react-router-dom";
import {useLocation} from "react-router";
import {EncryptBase64} from "../../../Common/Encrypt";

const {TabPane} = Tabs;

export default function AnalyzeRepsCard(props) {
  const [showExtendsWD, setShowExtendsWD] = useState(false);
  const [totalWD, setWDTotal] = useState(0);//分析报表数据总条数
  const [cusRepDataWD, setCusRepDataWD] = useState([]);//分析报表数据
  const [isLoading, setIsLoading] = useState(false); //加载状态
  const {} = props;
  const location = useLocation();

  useEffect(() => {
    //获取分析报表数据
    getCusRepData("WD", 3);
    return () => {
    };
  }, []);


  //获取报表数据
  const getCusRepData = (cxlx, pageSize, flag = true, col = '') => {
    col === '' && setIsLoading(true);
    const payload = {
      current: 1,
      //SC|收藏的报表;WD|我的报表;GX|共享报表;CJ|我创建的报表;CJR|查询创建人;KJBB|可见报表
      cxlx,
      pageSize,
      paging: 1,
      sort: "",
      total: -1
    }
    FetchQueryCustomReportList({...payload})
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryOwnerMessage ~ res', res.record);
          if (cxlx === "WD") {
            setCusRepDataWD(p => [...JSON.parse(res.result)]);
            setWDTotal(res.totalrows);
            col === '' && setIsLoading(false);
            setShowExtendsWD(!flag)
          }
        }
      })
      .catch(e => {
        col === '' && setIsLoading(false);
        setShowExtendsWD(!flag)
        message.error('报表信息查询失败', 1);
      });
  };

  const handleExtendsWD = (flag) => {
    if (!flag) {
      getCusRepData("WD", 99999, flag);
    } else {
      getCusRepData("WD", 3, flag);
    }
  }

  const handleProjectCollect = (e, flag, id) => {
    e.stopPropagation();// 阻止事件冒泡
    let payload = {}
    let info = ""
    if (flag) {
      info = "收藏报表成功！"
      payload.operateType = 'SCBB'
    } else {
      info = "取消收藏报表成功！"
      payload.operateType = 'QXBB'
    }
    payload.projectId = id;
    ProjectCollect({...payload})
      .then(res => {
        if (res?.success) {
          if (showExtendsWD) {
            getCusRepData("WD", 99999, true, "collection");
          } else {
            getCusRepData("WD", 3, true, "collection");
          }
          message.success(info)
        }
      })
      .catch(e => {
        message.error(flag ? '收藏报表失败!' : '取消收藏报表失败!', 1);
      });
  }

  const linkTo = {
    pathname: `/pms/manage/CustomReports`,
    state: {
      routes: [{name: '个人工作台', pathname: location.pathname}],
    },
  };

  const toDetail = (i) => {
    console.log("bbid", i)
    window.location.href = `/#/pms/manage/CustomRptInfo/${EncryptBase64(
      JSON.stringify({
        routes: [{name: '个人工作台', pathname: location.pathname}],
        bbid: i.BBID,
        bbmc: i.BBMC,
      }),
    )}`
  }

  return (
    <div className="custom-reports-box-homePage">
      {
        cusRepDataWD.length > 0 && <div className="rep-infos">
          <div className="rep-infos-title">
            <div className="rep-infos-left">分析报表</div>
            <Link to={linkTo} style={{display: 'contents'}}>
              <div className="rep-infos-right">全部 <i className="iconfont icon-right"/></div>
            </Link>
          </div>
          <div className="rep-infos-box">
            {
              cusRepDataWD.map(i => {
                return <div className="rep-infos-content" onClick={() => toDetail(i)}>
                  <div className="rep-infos-content-box">
                    <div className="rep-infos-name">
                      <i className="rep-infos-icon iconfont icon-report"/>
                      <div className="rep-infos-bbmc"><Tooltip placement="topLeft" title={i.BBMC}>{i.BBMC}</Tooltip>
                      </div>
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
              })
            }
            {totalWD > 3 &&
            (showExtendsWD ? (
              <div className="rep-infos-foot" onClick={() => handleExtendsWD(true)}>
                收起
                <i className="iconfont icon-up"/>
              </div>
            ) : (
              <div className="rep-infos-foot" onClick={() => handleExtendsWD(false)}>
                展开
                {isLoading ? <Icon type="loading"/> : <i className="iconfont icon-down"/>}
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
}
