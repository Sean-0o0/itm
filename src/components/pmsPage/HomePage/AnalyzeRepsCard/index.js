import React, {useEffect, useState, useRef} from 'react';
import {Button, Icon, message, Rate, Select, Tabs} from 'antd';
import styles from "../../../Common/TagSelect/index.less";
import {FetchQueryCustomReportList, ProjectCollect} from "../../../../services/pmsServices";
import {Link} from "react-router-dom";
import {useLocation} from "react-router";
import {EncryptBase64} from "../../../Common/Encrypt";

const {TabPane} = Tabs;

export default function AnalyzeRepsCard(props) {
  const [showExtendsWD, setShowExtendsWD] = useState(false);
  const {
    totalWD,
    cusRepDataWD,
    getCusRepData,
  } = props;
  const location = useLocation();

  useEffect(() => {
    return () => {
    };
  }, []);


  const handleExtendsWD = (flag) => {
    if (!flag) {
      getCusRepData("WD", 99999);
    } else {
      getCusRepData("WD", 3);
    }
    setShowExtendsWD(!flag)
  }

  const handleProjectCollect = (flag, id) => {
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
          if (showExtendsWD) {
            getCusRepData("WD", 99999);
          } else {
            getCusRepData("WD", 3);
          }
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

  const toDetail = (bbid) => {
    window.location.href = `/#/pms/manage/CustomRptInfo/${EncryptBase64(
      JSON.stringify({
        routes: [{name: '个人工作台', pathname: location.pathname}],
        bbid,
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
                return <div className="rep-infos-content" onClick={() => toDetail(i.BBID)}>
                  <div className="rep-infos-content-box">
                    <div className="rep-infos-name">
                      <i className="rep-infos-icon iconfont icon-report"/>
                      {i.BBMC}
                      <i onClick={() => handleProjectCollect(i.SFSC === 0, i.BBID)}
                         className={i.SFSC === 0 ? "rep-infos-icon2 iconfont icon-star" : "rep-infos-icon2 iconfont icon-fill-star"}/>
                    </div>
                    <div className="rep-infos-time">
                      {i.CJR}&nbsp;&nbsp;{i.CJSJ}创建
                    </div>
                  </div>
                </div>
              })
            }
            {
              totalWD > 3 && (
                <div className='rep-infos-foot' onClick={() => handleExtendsWD(showExtendsWD)}>
                  {showExtendsWD ? '收起' : '展开'} <Icon type={showExtendsWD ? 'up' : 'down'}/>
                </div>
              )
            }
          </div>
        </div>
      }
    </div>
  );
}
